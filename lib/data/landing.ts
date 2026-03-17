export const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time multiplayer',
    desc: 'Play against friends or get matched globally. Moves sync instantly with under 100ms latency via Ably.'
  },
  {
    icon: '🤖',
    title: 'Play vs computer',
    desc: 'Practice against Stockfish AI with adjustable difficulty — from complete beginner to grandmaster level.'
  },
  {
    icon: '📈',
    title: 'ELO rating system',
    desc: 'Every rated game affects your ELO. Track your progress over time with a detailed rating history chart.'
  },
  {
    icon: '🎬',
    title: 'Game replay',
    desc: "Replay any past game move by move. Review your decisions and learn from every match you've played."
  },
  {
    icon: '🏆',
    title: 'Global leaderboard',
    desc: 'Compete for the top spots on the global leaderboard and see where you rank among all players.'
  },
  {
    icon: '💬',
    title: 'In-game chat',
    desc: 'Chat with your opponent during the game. Good sportsmanship starts with a good luck message.'
  }
]

export const LEADERBOARD = [
  {
    rank: 1,
    name: 'MasterKing',
    country: 'Sri Lanka',
    elo: 2104,
    wr: '74%',
    initials: 'MK',
    bg: '#1c1000',
    color: '#fbbf24'
  },
  {
    rank: 2,
    name: 'QueenSlayer',
    country: 'India',
    elo: 2058,
    wr: '71%',
    initials: 'QS',
    bg: '#1a0e00',
    color: '#f59e0b'
  },
  {
    rank: 3,
    name: 'RookKiller',
    country: 'Germany',
    elo: 1987,
    wr: '68%',
    initials: 'RK',
    bg: '#1c1200',
    color: '#d97706'
  },
  {
    rank: 4,
    name: 'GrandKnight',
    country: 'UK',
    elo: 1942,
    wr: '65%',
    initials: 'GK',
    bg: '#161616',
    color: '#a8a29e'
  },
  {
    rank: 5,
    name: 'BlitzXpert',
    country: 'Brazil',
    elo: 1891,
    wr: '63%',
    initials: 'BX',
    bg: '#141414',
    color: '#78716c'
  }
]

export const STATS = [
  { num: '12,400+', label: 'Registered players' },
  { num: '340K+', label: 'Games played' },
  { num: '98.9%', label: 'Uptime reliability' },
  { num: '<100ms', label: 'Real-time latency' }
]

export const BOARD_PIECES = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '♟', '', '', ''],
  ['', '', '', '', '♙', '', '', ''],
  ['', '', '', '', '', '♘', '', ''],
  ['♙', '♙', '♙', '♙', '', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '', '♖']
]

export const isLight = (r: number, c: number) => (r + c) % 2 !== 0
export const isHighlight = (r: number, c: number) =>
  (r === 3 && c === 4) || (r === 4 && c === 4)
