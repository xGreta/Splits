import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { Language } from './i18n'
import { messages } from './i18n'
import type { Activity, Expense, PersonSummary, Transfer } from './types'

const STORAGE_KEY = 'splits-current-activity'
const SHARE_PARAM = 'activity'
const SHARE_HASH_PREFIX = 's='

type CompactShareExpense = [string, number, number, number[]]

type CompactSharePayload = {
  v: 1
  n: string
  p: string[]
  e: CompactShareExpense[]
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function roundToCents(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function createEmptyActivity(): Activity {
  const timestamp = nowIso()
  return {
    id: makeId('activity'),
    name: '',
    participants: [],
    expenses: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function touchActivity(activity: Activity): Activity {
  return {
    ...activity,
    updatedAt: nowIso(),
  }
}

export function validateActivity(activity: Activity, language: Language) {
  const copy = messages[language]
  const errors: string[] = []

  if (!activity.name.trim()) {
    errors.push(copy.activityNameRequired)
  }

  const namedParticipants = activity.participants.filter((participant) => participant.name.trim())
  if (namedParticipants.length === 0) {
    errors.push(copy.addAtLeastOneParticipant)
  }

  return errors
}

export function validateExpense(expense: Expense, activity: Activity, language: Language) {
  const copy = messages[language]
  const errors: Partial<Record<'description' | 'amount' | 'payerId' | 'participantIds', string>> = {}
  const participantIds = new Set(activity.participants.map((participant) => participant.id))

  if (!expense.description.trim()) {
    errors.description = copy.descriptionRequired
  }

  if (!Number.isFinite(expense.amount) || expense.amount <= 0) {
    errors.amount = copy.positiveAmountRequired
  }

  if (!expense.payerId || !participantIds.has(expense.payerId)) {
    errors.payerId = copy.validPayerRequired
  }

  if (expense.participantIds.length === 0) {
    errors.participantIds = copy.selectAtLeastOneParticipant
  } else if (expense.participantIds.some((id) => !participantIds.has(id))) {
    errors.participantIds = copy.invalidParticipantsSelected
  }

  return errors
}

export function getExpenseShare(amount: number, count: number) {
  if (count <= 0) return 0
  return roundToCents(amount / count)
}

export function describeEqualSplit(amount: number, count: number, language: Language) {
  const copy = messages[language]
  if (count <= 0) return copy.noParticipantsSelected

  const amountInCents = Math.round(amount * 100)
  const baseShareInCents = Math.floor(amountInCents / count)
  const remainder = amountInCents - baseShareInCents * count
  const baseShare = formatCurrency(baseShareInCents / 100)

  if (remainder === 0) {
    return `${baseShare} ${copy.each}`
  }

  const higherShare = formatCurrency((baseShareInCents + 1) / 100)
  return copy.splitRemainder(count - remainder, baseShare, remainder, higherShare)
}

export function calculateSummary(activity: Activity) {
  const paidById = new Map<string, number>()
  const owedById = new Map<string, number>()

  for (const participant of activity.participants) {
    paidById.set(participant.id, 0)
    owedById.set(participant.id, 0)
  }

  for (const expense of activity.expenses) {
    const shareCount = expense.participantIds.length
    if (shareCount === 0) continue

    const amountInCents = Math.round(expense.amount * 100)
    const baseShare = Math.floor(amountInCents / shareCount)
    const remainder = amountInCents - baseShare * shareCount

    paidById.set(expense.payerId, (paidById.get(expense.payerId) ?? 0) + amountInCents)

    expense.participantIds.forEach((participantId, index) => {
      const shareInCents = baseShare + (index < remainder ? 1 : 0)
      owedById.set(participantId, (owedById.get(participantId) ?? 0) + shareInCents)
    })
  }

  const summaries: PersonSummary[] = activity.participants.map((participant) => {
    const paid = (paidById.get(participant.id) ?? 0) / 100
    const owed = (owedById.get(participant.id) ?? 0) / 100
    const net = roundToCents(paid - owed)

    return {
      participantId: participant.id,
      name: participant.name || 'Unnamed participant',
      paid,
      owed,
      net,
    }
  })

  return summaries
}

export function calculateTransfers(summaries: PersonSummary[]) {
  const creditors = summaries
    .filter((summary) => summary.net > 0)
    .map((summary) => ({
      participantId: summary.participantId,
      amountInCents: Math.round(summary.net * 100),
    }))

  const debtors = summaries
    .filter((summary) => summary.net < 0)
    .map((summary) => ({
      participantId: summary.participantId,
      amountInCents: Math.round(Math.abs(summary.net) * 100),
    }))

  const transfers: Transfer[] = []
  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]
    const settledInCents = Math.min(creditor.amountInCents, debtor.amountInCents)

    if (settledInCents > 0) {
      transfers.push({
        fromId: debtor.participantId,
        toId: creditor.participantId,
        amount: settledInCents / 100,
      })
    }

    creditor.amountInCents -= settledInCents
    debtor.amountInCents -= settledInCents

    if (creditor.amountInCents === 0) creditorIndex += 1
    if (debtor.amountInCents === 0) debtorIndex += 1
  }

  return transfers
}

export function saveActivity(activity: Activity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activity))
}

export function loadSavedActivity() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return sanitizeActivity(JSON.parse(raw))
  } catch {
    return null
  }
}

export function encodeActivity(activity: Activity) {
  return compressToEncodedURIComponent(JSON.stringify(toCompactSharePayload(activity)))
}

export function decodeActivity(encoded: string) {
  try {
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const parsed = JSON.parse(json)

    if (isCompactSharePayload(parsed)) {
      return compactSharePayloadToActivity(parsed)
    }

    return sanitizeActivity(parsed)
  } catch {
    return null
  }
}

export function buildShareUrl(activity: Activity) {
  const url = new URL(window.location.href)
  url.searchParams.delete(SHARE_PARAM)
  url.hash = `${SHARE_HASH_PREFIX}${encodeActivity(activity)}`
  return url.toString()
}

export function readSharedActivityFromUrl() {
  const url = new URL(window.location.href)
  const hashValue = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash

  if (hashValue.startsWith(SHARE_HASH_PREFIX)) {
    return decodeActivity(hashValue.slice(SHARE_HASH_PREFIX.length))
  }

  const encoded = url.searchParams.get(SHARE_PARAM)
  if (!encoded) return null
  return decodeActivity(encoded)
}

export function clearShareParamFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete(SHARE_PARAM)
  url.hash = ''
  window.history.replaceState({}, '', url.toString())
}

export function downloadActivity(activity: Activity) {
  const blob = new Blob([JSON.stringify(activity, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = activity.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'splits-activity'

  anchor.href = url
  anchor.download = `${safeName}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function importActivity(file: File) {
  const text = await file.text()
  return sanitizeActivity(JSON.parse(text))
}

export function sanitizeActivity(input: unknown): Activity {
  const activity = input as Activity
  const participants = Array.isArray(activity?.participants)
    ? activity.participants
        .filter((participant) => participant && typeof participant.id === 'string')
        .map((participant) => ({
          id: participant.id,
          name: typeof participant.name === 'string' ? participant.name : '',
        }))
    : []

  const participantIds = new Set(participants.map((participant) => participant.id))
  const expenses = Array.isArray(activity?.expenses)
    ? activity.expenses
        .filter((expense) => expense && typeof expense.id === 'string')
        .map((expense) => ({
          id: expense.id,
          description: typeof expense.description === 'string' ? expense.description : '',
          amount: Number.isFinite(expense.amount) ? roundToCents(expense.amount) : 0,
          payerId: typeof expense.payerId === 'string' ? expense.payerId : '',
          participantIds: Array.isArray(expense.participantIds)
            ? expense.participantIds.filter((participantId) => typeof participantId === 'string' && participantIds.has(participantId))
            : [],
        }))
        .filter((expense) => participantIds.has(expense.payerId))
    : []

  return {
    id: typeof activity?.id === 'string' ? activity.id : makeId('activity'),
    name: typeof activity?.name === 'string' ? activity.name : '',
    participants,
    expenses,
    createdAt: typeof activity?.createdAt === 'string' ? activity.createdAt : nowIso(),
    updatedAt: typeof activity?.updatedAt === 'string' ? activity.updatedAt : nowIso(),
  }
}

function toCompactSharePayload(activity: Activity): CompactSharePayload {
  const participants = activity.participants.map((participant) => participant.name)
  const participantIndexById = new Map(activity.participants.map((participant, index) => [participant.id, index]))
  const expenses: CompactShareExpense[] = activity.expenses
    .map((expense) => {
      const payerIndex = participantIndexById.get(expense.payerId)
      if (payerIndex === undefined) return null

      const participantIndexes = expense.participantIds
        .map((participantId) => participantIndexById.get(participantId))
        .filter((index): index is number => index !== undefined)

      return [
        expense.description,
        Math.round(expense.amount * 100),
        payerIndex,
        participantIndexes,
      ]
    })
    .filter((expense): expense is CompactShareExpense => expense !== null)

  return {
    v: 1,
    n: activity.name,
    p: participants,
    e: expenses,
  }
}

function isCompactSharePayload(value: unknown): value is CompactSharePayload {
  const payload = value as CompactSharePayload
  return (
    typeof payload === 'object' &&
    payload !== null &&
    payload.v === 1 &&
    typeof payload.n === 'string' &&
    Array.isArray(payload.p) &&
    Array.isArray(payload.e)
  )
}

function compactSharePayloadToActivity(payload: CompactSharePayload): Activity {
  const timestamp = nowIso()
  const participants = payload.p.map((name) => ({
    id: makeId('participant'),
    name,
  }))
  const participantIds = participants.map((participant) => participant.id)

  const expenses: Expense[] = payload.e
    .map((expense) => {
      const [description, amountInCents, payerIndex, participantIndexes] = expense
      const payerId = participantIds[payerIndex]
      const selectedParticipantIds = participantIndexes
        .map((index) => participantIds[index])
        .filter((participantId): participantId is string => typeof participantId === 'string')

      if (
        typeof description !== 'string' ||
        !Number.isFinite(amountInCents) ||
        typeof payerId !== 'string' ||
        selectedParticipantIds.length === 0
      ) {
        return null
      }

      return {
        id: makeId('expense'),
        description,
        amount: roundToCents(amountInCents / 100),
        payerId,
        participantIds: selectedParticipantIds,
      }
    })
    .filter((expense): expense is Expense => expense !== null)

  return {
    id: makeId('activity'),
    name: payload.n,
    participants,
    expenses,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
