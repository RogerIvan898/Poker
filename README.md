# React + TypeScript + Vite


## Структуры игроков

Статус игрока

```ts
type PlayerStatus =
  | "SEATED"     // Игрок занял место за столом, но еще не начал играть
  | "SIT_OUT"    // Игрок временно вышел из игры (пропускает раздачу)
  | "ACTIVE"     // Игрок активен и сейчас его ход
  | "FOLDED"     // Игрок сбросил карты и вышел из текущей раздачи
  | "ALL_IN"     // Игрок поставил все свои фишки
  | "BUSTED"     // Игрок потерял все фишки и выбыл из игры
  | "LEFT";      // Игрок покинул стол полностью
```

Ход игрока

```ts
interface PlayerAction {
  type: 'BET' | 'FOLD' | 'CALL' | 'CHECK' | 'RAISE';  // Тип действия игрока
  playerId: string;          // Id игрока
  amount?: number;           // Сумма ставки (опционально, только для BET/RAISE)
  serverSeq: number;         // Порядковый номер действия на сервере (для синхронизации)
  timestamp: number;         // Временная метка действия (в миллисекундах)
}
```

Структура игрока

```ts
interface Player {
  id: string;                // Id игрока
  name: string;              // Отображаемое имя
  stack: number;             // Количество фишек
  seat: number;              // Номер места за столом (0-8 для 9-местного стола)
  status: PlayerStatus;      // Текущий статус игрока
  hand?: [Card, Card]        // Карты игрока (только 2 карты, опционально - скрыты для других игроков)
};
```

## Карта

```ts
interface Card {
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
}
```

## Структуры игрового стола

Этапы игры

```ts
type Round =
  | 'PRE_FLOP'    // Префлоп - начальная стадия до общих карт
  | 'FLOP'        // Флоп - открываются первые 3 общие карты
  | 'TURN'        // Тёрн - открывается 4-я общая карта
  | 'RIVER'       // Ривер - открывается 5-я общая карта
  | 'SHOWDOWN'    // Вскрытие карт - определение победителя
  | 'IDLE';       // Ожидание - между раздачами
```

События сокетов

```ts
type GameEvent =
  | { type: "SNAPSHOT"; state: GameState }                       // Полный снимок состояния игры
  | { type: "PLAYER_BET"; playerId: string; amount: number; serverSeq?: number }     // Игрок сделал ставку
  | { type: "PLAYER_CHECK"; playerId: string; serverSeq: number }                    // Игрок сделал чек
  | { type: "PLAYER_FOLD"; playerId: string; serverSeq?: number }                    // Игрок сбросил карты
  | { type: "DEAL_PRIVATE"; playerId: string; cards: [Card, Card] }                  // Разданы карты игроку
  | { type: "DEAL_COMMUNITY"; cards: Card[]; serverSeq?: number }                    // Разданы общие карты
  | { type: "HAND_RESULT"; winners: string[]; serverSeq?: number }                   // Результаты раздачи
  | { type: "ERROR"; payload: any };                                                 // Ошибка в игре
```

Состояние игрового стола, которе получает каждый игрок при люом дейтсвии других игроков для синхронизации

```ts
export interface GameState {
  tableId: string | null;        // Id игрового стола
  players: Player[];             // Массив игроков за столом
  dealerId: string | null;       // Id дилера (игрок, который ходит последним, каждую раздачу меняетя)
  currentTurnId: string | null;  // Id игрока, чей сейчас ход
  round: Round;                  // Текущий этам игры
  community: Card[];             // Общие карты на столе
  pot: number;                   // Текущий размер банка (все ставки)
  serverSeq: number;             // Последовательный номер состояния (для синхронизации)
  actionHistory: PlayerAction[]; // История действий в текущей раздаче (смотреть структуры игроков)
  bigBlind: number;              // Размер большого блайнда
  currentBet: number;            // Текущая ставка для уравнивания
}
```
