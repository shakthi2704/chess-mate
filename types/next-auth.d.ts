import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:       string
      username: string
      elo:      number
    } & DefaultSession['user']
  }
}