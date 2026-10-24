import { SERVER_EVENTS } from 'entities/game/model/constants';
import type { ServerGameEvent } from 'entities/game/model/types';
import { PlayerAction, PlayerStatus } from 'entities/player/model/constants';
import type {
  PlayerActionType,
  PlayerStatusType,
} from 'entities/player/model/types';
import { VIEWER_ID } from 'entities/session/model';

import type { MockRoomConfig } from '../rooms';

import { createShuffledDeck } from './deck';
import { rankHand } from './rank';

const BOT_NAMES = ['Nova', 'Rex', 'Ivy', 'Lux'] as const;
const HERO_TURN_MS = 20_000;
const STEP_MS = 280;

interface Seat {
  id: string;
  name: string;
  seat: number;
  stack: number;
  hole: [string, string];
  committed: number;
  totalCommitted: number;
  folded: boolean;
  allIn: boolean;
  acted: boolean;
}

interface ChosenAction {
  action: PlayerActionType;
  amount?: number;
}

interface MockSocket {
  send: (data: string) => void;
}

const ACTION_NAMES = new Set<string>(Object.values(PlayerAction));

const isPlayerAction = (value: string): value is PlayerActionType =>
  ACTION_NAMES.has(value);

const readCommand = (data: unknown): ChosenAction | null => {
  let parsed: unknown = data;

  if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }

  const message = parsed as { type?: unknown; payload?: unknown };

  if (message.type !== 'CMD_PLAYER_ACTION') {
    return null;
  }

  if (typeof message.payload !== 'object' || message.payload === null) {
    return null;
  }

  const outer = message.payload as { payload?: unknown };
  const inner = outer.payload;

  if (typeof inner !== 'object' || inner === null) {
    return null;
  }

  const action = (inner as { action?: unknown }).action;
  const rawAmount = (inner as { amount?: unknown }).amount;
  const amount = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount);

  if (typeof action !== 'string' || !isPlayerAction(action)) {
    return null;
  }

  return {
    action,
    amount: Number.isFinite(amount) ? amount : undefined,
  };
};

export class PokerTable {
  private readonly seats: Seat[];

  private readonly smallBlind: number;

  private readonly bigBlind: number;

  private closed = false;

  private runId = 0;

  private button: number;

  private currentBet = 0;

  private toAct = 0;

  private deck: string[] = [];

  private board: string[] = [];

  private pendingHero: ((action: ChosenAction | null) => void) | null = null;

  private heroTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor(
    private readonly client: MockSocket,
    room: MockRoomConfig
  ) {
    this.smallBlind = room.smallBlind;
    this.bigBlind = room.bigBlind;

    const stack = room.bigBlind * 100;
    const bots = BOT_NAMES.slice(0, room.botCount);

    this.seats = [
      this.createSeat(VIEWER_ID, 'You', 0, stack),
      ...bots.map((name, index) =>
        this.createSeat(`bot-${index + 1}`, name, index + 1, stack)
      ),
    ];
    this.button = this.seats.length - 1;
  }

  start() {
    const runId = ++this.runId;
    void this.loop(runId);
  }

  dispose() {
    this.closed = true;
    this.runId += 1;
    this.clearHeroTimer();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.resolveHero(null);
  }

  handleMessage(data: unknown) {
    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      void data.text().then(text => {
        const action = readCommand(text);

        if (action) {
          this.resolveHero(action);
        }
      });
      return;
    }

    const action = readCommand(data);

    if (!action) {
      return;
    }

    this.resolveHero(action);
  }

  private createSeat(
    id: string,
    name: string,
    seat: number,
    stack: number
  ): Seat {
    return {
      id,
      name,
      seat,
      stack,
      hole: ['2h', '3h'],
      committed: 0,
      totalCommitted: 0,
      folded: false,
      allIn: false,
      acted: false,
    };
  }

  private async loop(runId: number) {
    while (!this.closed && runId === this.runId) {
      await this.playHand();

      if (this.closed || runId !== this.runId) {
        return;
      }

      await this.sleep(700);
    }
  }

  private async playHand() {
    this.button = this.nextIndex(this.button);
    this.deck = createShuffledDeck();
    this.board = [];

    this.seats.forEach(seat => {
      const playing = seat.stack > 0;

      seat.folded = !playing;
      seat.allIn = false;
      seat.acted = false;
      seat.committed = 0;
      seat.totalCommitted = 0;
      seat.hole = ['2h', '3h'];
    });

    const playing = this.seats.filter(seat => !seat.folded);

    if (playing.length < 2) {
      return;
    }

    playing.forEach(seat => {
      const [first, second] = [this.draw(), this.draw()];
      seat.hole = [first, second];
    });

    const { small, big } = this.blindSeats();
    this.postBlind(small, this.smallBlind);
    this.postBlind(big, this.bigBlind);
    this.currentBet = Math.max(small.committed, big.committed);

    this.seats.forEach(seat => {
      this.emit({
        type: SERVER_EVENTS.PLAYER_SEATED,
        payload: {
          seatIndex: seat.seat,
          player: {
            id: seat.id,
            name: seat.name,
            avatar: '',
            stack: seat.stack,
            status: seat.folded
              ? PlayerStatus.SITTING_OUT
              : seat.allIn
                ? PlayerStatus.ALL_IN
                : PlayerStatus.IN_GAME,
          },
        },
      });
    });

    const initialBets: Record<number, number> = {};

    this.seats.forEach(seat => {
      if (seat.committed > 0) {
        initialBets[seat.seat] = seat.committed;
      }
    });

    this.emit({
      type: SERVER_EVENTS.HAND_STARTED,
      payload: {
        community: [],
        dealerSeat: this.button,
        smallBlindSeat: small.seat,
        bigBlindSeat: big.seat,
        initialBets,
      },
    });

    const hero = this.seats.find(seat => seat.id === VIEWER_ID);

    if (hero && !hero.folded) {
      this.emit({
        type: SERVER_EVENTS.YOUR_CARDS,
        payload: { cards: hero.hole },
      });
    }

    await this.betting(this.nextIndex(big.seat));

    if (this.closed || this.contenders().length <= 1) {
      this.finish();
      return;
    }

    await this.dealStreet('FLOP', 3);
    await this.dealStreet('TURN', 1);
    await this.dealStreet('RIVER', 1);
    this.finish();
  }

  private async dealStreet(street: 'FLOP' | 'TURN' | 'RIVER', count: number) {
    const streetLength = street === 'FLOP' ? 3 : street === 'TURN' ? 4 : 5;

    if (
      this.closed ||
      this.contenders().length <= 1 ||
      this.board.length >= streetLength
    ) {
      return;
    }

    this.collectStreet();
    const missing = streetLength - this.board.length;
    const cards = Array.from({ length: Math.min(count, missing) }, () =>
      this.draw()
    );
    this.board.push(...cards);
    this.currentBet = 0;
    this.seats.forEach(seat => {
      seat.committed = 0;
      seat.acted = false;
    });

    this.emit({
      type: SERVER_EVENTS.BOARD_DEALT,
      payload: { street, cards },
    });

    await this.sleep(STEP_MS);
    await this.betting(this.nextIndex(this.button));
  }

  private async betting(firstSeat: number) {
    this.toAct = firstSeat;
    let skipped = 0;

    while (
      !this.closed &&
      this.contenders().length > 1 &&
      !this.streetSettled()
    ) {
      const seat = this.seats[this.toAct];

      if (!seat || seat.folded || seat.allIn) {
        const next = this.nextSeat(this.toAct);

        if (next === this.toAct || skipped > this.seats.length) {
          return;
        }

        this.toAct = next;
        skipped += 1;
        continue;
      }

      skipped = 0;

      this.emit({
        type: SERVER_EVENTS.TURN_CHANGED,
        payload: { activeSeat: seat.seat },
      });

      const action =
        seat.id === VIEWER_ID
          ? await this.waitForHero(seat)
          : await this.botAction(seat);

      if (this.closed || !action) {
        return;
      }

      this.applyAction(seat, action);
      this.toAct = this.nextSeat(seat.seat);
    }
  }

  private async waitForHero(seat: Seat): Promise<ChosenAction | null> {
    const need = Math.max(0, this.currentBet - seat.committed);
    const bankroll = seat.committed + seat.stack;
    const minTotal = Math.min(
      bankroll,
      seat.committed + this.minRaiseExtra(seat)
    );
    const canRaise = seat.stack > need && bankroll > minTotal;

    this.emit({
      type: SERVER_EVENTS.ALLOWED_ACTIONS,
      payload: {
        canCheck: need === 0,
        canCall: need > 0 && seat.stack > 0,
        canFold: true,
        callAmount: Math.min(need, seat.stack),
        minRaise: canRaise ? minTotal : 1,
        maxRaise: canRaise ? bankroll : 0,
      },
    });

    return new Promise(resolve => {
      this.pendingHero = resolve;
      this.clearHeroTimer();
      this.heroTimer = setTimeout(() => {
        this.heroTimer = null;
        this.resolveHero(
          need > 0
            ? { action: PlayerAction.FOLD }
            : { action: PlayerAction.CHECK }
        );
      }, HERO_TURN_MS);
    });
  }

  private async botAction(seat: Seat): Promise<ChosenAction | null> {
    await this.sleep(STEP_MS);

    if (this.closed) {
      return null;
    }

    const need = Math.max(0, this.currentBet - seat.committed);
    const roll = Math.random();

    if (need === 0) {
      if (roll > 0.78 && seat.stack >= this.bigBlind) {
        return {
          action: PlayerAction.BET,
          amount: seat.committed + this.bigBlind * (roll > 0.92 ? 3 : 1),
        };
      }

      return { action: PlayerAction.CHECK };
    }

    if (need > seat.stack * 0.65 && roll > 0.4) {
      return { action: PlayerAction.FOLD };
    }

    if (roll > 0.84 && seat.stack > need + this.bigBlind) {
      return {
        action: PlayerAction.RAISE,
        amount: seat.committed + need + this.bigBlind * 2,
      };
    }

    return { action: PlayerAction.CALL };
  }

  private applyAction(seat: Seat, chosen: ChosenAction) {
    if (chosen.action === PlayerAction.FOLD) {
      seat.folded = true;
      seat.acted = true;
      this.emitActed(seat, PlayerAction.FOLD, 0, PlayerStatus.FOLDED);
      return;
    }

    if (chosen.action === PlayerAction.CHECK) {
      seat.acted = true;
      this.emitActed(seat, PlayerAction.CHECK, 0, PlayerStatus.IN_GAME);
      return;
    }

    if (
      chosen.action === PlayerAction.CALL ||
      (chosen.action !== PlayerAction.BET &&
        chosen.action !== PlayerAction.RAISE &&
        this.currentBet > seat.committed)
    ) {
      const pay = Math.min(seat.stack, this.currentBet - seat.committed);
      this.takeChips(seat, pay);
      seat.acted = true;
      this.emitActed(
        seat,
        PlayerAction.CALL,
        pay,
        seat.allIn ? PlayerStatus.ALL_IN : PlayerStatus.IN_GAME
      );
      return;
    }

    const extra = this.chipsToCommit(seat, chosen.amount);
    const previousBet = this.currentBet;
    this.takeChips(seat, extra);

    if (seat.committed > previousBet) {
      this.currentBet = seat.committed;
      this.seats.forEach(other => {
        other.acted = other.seat === seat.seat;
      });
    } else {
      seat.acted = true;
    }

    this.emitActed(
      seat,
      chosen.action === PlayerAction.BET
        ? PlayerAction.BET
        : PlayerAction.RAISE,
      extra,
      seat.allIn ? PlayerStatus.ALL_IN : PlayerStatus.RAISE
    );
  }

  private takeChips(seat: Seat, amount: number) {
    const pay = Math.max(0, Math.min(seat.stack, amount));
    seat.stack -= pay;
    seat.committed += pay;
    seat.totalCommitted += pay;
    seat.allIn = seat.stack === 0;
  }

  private chipsToCommit(seat: Seat, requested: number | undefined) {
    const minExtra = this.minRaiseExtra(seat);
    const bankroll = seat.committed + seat.stack;

    if (requested == null || requested >= bankroll) {
      return seat.stack;
    }

    const target = Math.min(
      bankroll,
      Math.max(requested, seat.committed + minExtra)
    );

    return Math.min(seat.stack, Math.max(0, target - seat.committed));
  }

  private minRaiseExtra(seat: Seat) {
    if (this.currentBet === 0) {
      return Math.min(seat.stack, this.bigBlind);
    }

    return Math.min(
      seat.stack,
      this.currentBet - seat.committed + this.bigBlind
    );
  }

  private emitActed(
    seat: Seat,
    action: PlayerActionType,
    amount: number,
    status: PlayerStatusType
  ) {
    this.emit({
      type: SERVER_EVENTS.PLAYER_ACTED,
      payload: {
        seat: seat.seat,
        action,
        amount,
        stack: seat.stack,
        status,
      },
    });
  }

  private finish() {
    if (this.closed) {
      return;
    }

    const pot = this.seats.reduce((sum, seat) => sum + seat.totalCommitted, 0);
    this.collectStreet();

    const alive = this.contenders();
    const soleWinner = alive[0] ?? this.seats[0];

    if (!soleWinner) {
      return;
    }

    const winnerPayload =
      alive.length <= 1
        ? [
            {
              seatIndex: soleWinner.seat,
              amountWon: pot,
              combinationName: 'Uncontested',
            },
          ]
        : this.showdown(alive, pot);

    winnerPayload.forEach(winner => {
      const seat = this.seats.find(item => item.seat === winner.seatIndex);

      if (seat) {
        seat.stack += winner.amountWon;
      }
    });

    this.emit({
      type: SERVER_EVENTS.HAND_COMPLETED,
      payload: { winners: winnerPayload },
    });
  }

  private showdown(alive: Seat[], pot: number) {
    const ranked = alive.map(seat => ({
      seat,
      hand: rankHand([...seat.hole, ...this.board]),
    }));
    const best = Math.max(...ranked.map(item => item.hand.score));
    const winners = ranked.filter(item => item.hand.score === best);
    const share = Math.floor(pot / winners.length);
    let remainder = pot - share * winners.length;

    this.emit({
      type: SERVER_EVENTS.SHOWDOWN,
      payload: {
        revealedHands: Object.fromEntries(
          alive.map(seat => [seat.seat, [...seat.hole]])
        ),
      },
    });

    return winners.map(winner => {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;

      return {
        seatIndex: winner.seat.seat,
        amountWon: share + extra,
        combinationName: winner.hand.name,
      };
    });
  }

  private collectStreet() {
    const main = this.seats.reduce((sum, seat) => sum + seat.totalCommitted, 0);

    this.emit({
      type: SERVER_EVENTS.STREET_CONCLUDED,
      payload: { main, sidePots: [] },
    });
  }

  private contenders() {
    return this.seats.filter(seat => !seat.folded);
  }

  private streetSettled() {
    const pending = this.seats.filter(seat => !seat.folded && !seat.allIn);

    return pending.every(
      seat => seat.acted && seat.committed === this.currentBet
    );
  }

  private blindSeats() {
    if (this.seats.length === 2) {
      const small = this.seats[this.button];
      const big = this.seats[this.nextIndex(this.button)];

      if (!small || !big) {
        throw new Error('Table has no blinds');
      }

      return { small, big };
    }

    const small = this.seats[this.nextIndex(this.button)];
    const big = small ? this.seats[this.nextIndex(small.seat)] : undefined;

    if (!small || !big) {
      throw new Error('Table has no blinds');
    }

    return { small, big };
  }

  private postBlind(seat: Seat, amount: number) {
    this.takeChips(seat, Math.min(amount, seat.stack));
  }

  private nextIndex(from: number) {
    return (from + 1) % this.seats.length;
  }

  private nextSeat(from: number) {
    for (let step = 1; step <= this.seats.length; step += 1) {
      const index = (from + step) % this.seats.length;
      const seat = this.seats[index];

      if (seat && !seat.folded && !seat.allIn) {
        return index;
      }
    }

    return from;
  }

  private draw() {
    const card = this.deck.pop();

    if (!card) {
      throw new Error('Deck is empty');
    }

    return card;
  }

  private emit(event: ServerGameEvent) {
    if (this.closed) {
      return;
    }

    this.client.send(JSON.stringify(event));
  }

  private clearHeroTimer() {
    if (!this.heroTimer) {
      return;
    }

    clearTimeout(this.heroTimer);
    this.heroTimer = null;
  }

  private resolveHero(action: ChosenAction | null) {
    this.clearHeroTimer();
    const pending = this.pendingHero;
    this.pendingHero = null;
    pending?.(action);
  }

  private sleep(ms: number) {
    return new Promise<void>(resolve => {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        resolve();
      }, ms);
      this.timers.add(timer);
    });
  }
}
