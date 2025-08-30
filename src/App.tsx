import { useRef, useState } from 'react'

import './App.css'
import {PokerTable} from './components/PokerTabe'
import type { Card } from './shared/types/card';
import PlayersLayer from './components/PlayersLayer';
import { TableProvider } from './Providers/table-context';

  const community: Card[] = [
    { rank: 'A', suit: 'spades' },
    { rank: '10', suit: 'hearts' },
    { rank: '7', suit: 'diamonds' },
    { rank: 'K', suit: 'clubs' },
    { rank: '3', suit: 'clubs' },
  ];

    const defaultPlayers = [
    { id: 1, name: 'You', stack: 1250, status: 'acting', isDealer: false },
    { id: 2, name: 'Anna', stack: 2400, status: 'fold', isDealer: false },
    { id: 3, name: 'Mark', stack: 3200, status: 'waiting', isDealer: false },
    { id: 4, name: 'Luca', stack: 680, status: 'waiting', isDealer: false },
    { id: 5, name: 'Serg', stack: 4100, status: 'waiting', isDealer: true },
    { id: 6, name: 'Priya', stack: 1750, status: 'waiting', isDealer: false },
    { id: 7, name: 'Kai', stack: 2100, status: 'fold', isDealer: false },
    { id: 8, name: 'Dealer', stack: 9999, status: 'waiting', isDealer: false },
  ];


function App() {
  const tableRef = useRef<HTMLElement>(null);

  return (
    <>
    <TableProvider>
        <PokerTable cards={community} />
        <PlayersLayer players={defaultPlayers} />
      </TableProvider>
    </>
  )
}

export default App
