export type Participant = {
  id: string
  name: string
}

export type Expense = {
  id: string
  description: string
  amount: number
  payerId: string
  participantIds: string[]
}

export type Activity = {
  id: string
  name: string
  participants: Participant[]
  expenses: Expense[]
  createdAt: string
  updatedAt: string
}

export type Transfer = {
  fromId: string
  toId: string
  amount: number
}

export type PersonSummary = {
  participantId: string
  name: string
  paid: number
  owed: number
  net: number
}
