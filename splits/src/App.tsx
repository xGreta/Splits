import { FormEvent, useEffect, useState } from 'react'
import { getSavedLanguage, messages, saveLanguage } from './i18n'
import type { Language } from './i18n'
import type { Activity, Expense, Participant } from './types'
import {
  buildShareUrl,
  calculateSummary,
  calculateTransfers,
  clearShareParamFromUrl,
  createEmptyActivity,
  describeEqualSplit,
  formatCurrency,
  getExpenseShare,
  loadSavedActivity,
  makeId,
  readSharedActivityFromUrl,
  roundToCents,
  saveActivity,
  touchActivity,
  validateActivity,
  validateExpense,
} from './utils'

type ExpenseDraft = {
  id: string | null
  description: string
  amount: string
  payerId: string
  participantIds: string[]
}

const emptyExpenseDraft: ExpenseDraft = {
  id: null,
  description: '',
  amount: '',
  payerId: '',
  participantIds: [],
}

function makeExpenseDraft(participants: Participant[]): ExpenseDraft {
  return {
    ...emptyExpenseDraft,
    payerId: participants[0]?.id ?? '',
    participantIds: participants.map((participant) => participant.id),
  }
}

function App() {
  const [activity, setActivity] = useState<Activity>(() => readSharedActivityFromUrl() ?? loadSavedActivity() ?? createEmptyActivity())
  const [language, setLanguage] = useState<Language>(() => getSavedLanguage())
  const [newParticipantName, setNewParticipantName] = useState('')
  const [activityErrors, setActivityErrors] = useState<string[]>([])
  const [participantError, setParticipantError] = useState('')
  const [expenseDraft, setExpenseDraft] = useState<ExpenseDraft>(emptyExpenseDraft)
  const [expenseErrors, setExpenseErrors] = useState<Partial<Record<'description' | 'amount' | 'payerId' | 'participantIds', string>>>({})
  const [shareUrl, setShareUrl] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const copy = messages[language]

  useEffect(() => {
    saveActivity(activity)
    setActivityErrors(validateActivity(activity, language))
  }, [activity, language])

  useEffect(() => {
    saveLanguage(language)
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language])

  useEffect(() => {
    const validParticipantIds = new Set(activity.participants.map((participant) => participant.id))

    setExpenseDraft((current) => {
      const nextParticipantIds =
        current.participantIds.length > 0
          ? current.participantIds.filter((participantId) => validParticipantIds.has(participantId))
          : activity.participants.map((participant) => participant.id)
      const nextPayerId = validParticipantIds.has(current.payerId) ? current.payerId : activity.participants[0]?.id ?? ''

      if (
        nextPayerId === current.payerId &&
        nextParticipantIds.length === current.participantIds.length &&
        nextParticipantIds.every((participantId, index) => participantId === current.participantIds[index])
      ) {
        return current
      }

      return {
        ...current,
        payerId: nextPayerId,
        participantIds: nextParticipantIds,
      }
    })
  }, [activity.participants])

  useEffect(() => {
    if (readSharedActivityFromUrl()) {
      setShareMessage(copy.loadedFromShareLink)
      clearShareParamFromUrl()
    }
  }, [copy.loadedFromShareLink])

  const participantMap = new Map(
    activity.participants.map((participant) => [
      participant.id,
      participant.name || copy.unnamedParticipant,
    ]),
  )
  const summaries = calculateSummary(activity)
  const transfers = calculateTransfers(summaries)

  function updateActivity(next: Activity) {
    setActivity(touchActivity(next))
  }

  function handleActivityNameChange(value: string) {
    updateActivity({
      ...activity,
      name: value,
    })
  }

  function handleAddParticipant() {
    const trimmed = newParticipantName.trim()
    if (!trimmed) {
      setParticipantError(copy.participantNameRequired)
      return
    }

    updateActivity({
      ...activity,
      participants: [...activity.participants, { id: makeId('participant'), name: trimmed }],
    })
    setNewParticipantName('')
    setParticipantError('')
  }

  function handleParticipantRename(participantId: string, name: string) {
    updateActivity({
      ...activity,
      participants: activity.participants.map((participant) =>
        participant.id === participantId ? { ...participant, name } : participant,
      ),
    })
  }

  function handleRemoveParticipant(participantId: string) {
    const isUsed = activity.expenses.some(
      (expense) => expense.payerId === participantId || expense.participantIds.includes(participantId),
    )

    if (isUsed) {
      setParticipantError(copy.participantUsedError)
      return
    }

    updateActivity({
      ...activity,
      participants: activity.participants.filter((participant) => participant.id !== participantId),
    })
    setParticipantError('')
  }

  function handleExpenseToggleParticipant(participantId: string) {
    setExpenseDraft((current) => ({
      ...current,
      participantIds: current.participantIds.includes(participantId)
        ? current.participantIds.filter((id) => id !== participantId)
        : [...current.participantIds, participantId],
    }))
  }

  function resetExpenseDraft() {
    setExpenseDraft(makeExpenseDraft(activity.participants))
    setExpenseErrors({})
  }

  function handleSubmitExpense(event: FormEvent) {
    event.preventDefault()

    const amount = roundToCents(Number(expenseDraft.amount))
    const nextExpense: Expense = {
      id: expenseDraft.id ?? makeId('expense'),
      description: expenseDraft.description.trim(),
      amount,
      payerId: expenseDraft.payerId,
      participantIds: expenseDraft.participantIds,
    }

    const errors = validateExpense(nextExpense, activity, language)
    setExpenseErrors(errors)
    if (Object.keys(errors).length > 0) return

    const nextExpenses = expenseDraft.id
      ? activity.expenses.map((expense) => (expense.id === expenseDraft.id ? nextExpense : expense))
      : [...activity.expenses, nextExpense]

    updateActivity({
      ...activity,
      expenses: nextExpenses,
    })
    resetExpenseDraft()
  }

  function handleEditExpense(expense: Expense) {
    setExpenseDraft({
      id: expense.id,
      description: expense.description,
      amount: String(expense.amount),
      payerId: expense.payerId,
      participantIds: expense.participantIds,
    })
    setExpenseErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteExpense(expenseId: string) {
    updateActivity({
      ...activity,
      expenses: activity.expenses.filter((expense) => expense.id !== expenseId),
    })

    if (expenseDraft.id === expenseId) {
      resetExpenseDraft()
    }
  }

  async function handleGenerateShareLink() {
    const url = buildShareUrl(activity)
    setShareUrl(url)

    try {
      await navigator.clipboard.writeText(url)
      setShareMessage(copy.shareCopied)
    } catch {
      setShareMessage(copy.shareManualCopy)
    }
  }

  function handleStartOver() {
    const fresh = createEmptyActivity()
    setActivity(fresh)
    setNewParticipantName('')
    setParticipantError('')
    setShareUrl('')
    setShareMessage('')
    setExpenseErrors({})
    setExpenseDraft(emptyExpenseDraft)
    saveActivity(fresh)
  }

  const expenseSharePreview =
    expenseDraft.participantIds.length > 0 && Number(expenseDraft.amount) > 0
      ? getExpenseShare(Number(expenseDraft.amount), expenseDraft.participantIds.length)
      : 0

  return (
    <div className={`app-shell ${language === 'zh' ? 'lang-zh' : 'lang-en'}`}>
      <header className="hero">
        <div className="hero-main">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.heroTitle}</h1>
          <p className="hero-copy">{copy.heroCopy}</p>
          <div className="hero-topbar">
            <button
              className="icon-pill language-icon-button"
              type="button"
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              aria-label={copy.languageLabel}
              title={copy.languageLabel}
            >
              <span className="icon-pill-mark" aria-hidden="true">
                文/A
              </span>
            </button>
            <button className="small-secondary-button" onClick={handleStartOver} type="button">
              {copy.startOver}
            </button>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="panel panel-wide intro-panel">
          <div className="section-header">
            <h2>{copy.flowTitle}</h2>
          </div>
          <div className="flow-grid">
            <article className="flow-card">
              <h3>{copy.flowStepOneTitle}</h3>
              <p>{copy.flowStepOneCopy}</p>
            </article>
            <article className="flow-card">
              <h3>{copy.flowStepTwoTitle}</h3>
              <p>{copy.flowStepTwoCopy}</p>
            </article>
            <article className="flow-card">
              <h3>{copy.flowStepThreeTitle}</h3>
              <p>{copy.flowStepThreeCopy}</p>
            </article>
          </div>
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{copy.activitySetup}</h2>
            <span className="pill">{copy.participantsCount(activity.participants.length)}</span>
          </div>

          <label className="field">
            <span>{copy.activityName}</span>
            <input
              placeholder={copy.activityNamePlaceholder}
              value={activity.name}
              onChange={(event) => handleActivityNameChange(event.target.value)}
            />
          </label>

          {activityErrors.length > 0 && (
            <div className="notice error">
              {activityErrors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          <div className="participant-add-row">
            <label className="field field-grow">
              <span>{copy.addParticipant}</span>
              <input
                placeholder={copy.participantNamePlaceholder}
                value={newParticipantName}
                onChange={(event) => setNewParticipantName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddParticipant()
                  }
                }}
              />
            </label>
            <button className="primary-button" type="button" onClick={handleAddParticipant}>
              {copy.add}
            </button>
          </div>

          {participantError && <p className="inline-error">{participantError}</p>}

          <div className="participant-list">
            {activity.participants.length === 0 ? (
              <div className="empty-state">
                <h3>{copy.noParticipants}</h3>
                <p>{copy.noParticipantsCopy}</p>
              </div>
            ) : (
              <div className="table-shell">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{copy.participantTableName}</th>
                      <th>{copy.participantTableStatus}</th>
                      <th>{copy.participantTableActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.participants.map((participant) => (
                      <tr key={participant.id}>
                        <td>
                          <input
                            value={participant.name}
                            onChange={(event) => handleParticipantRename(participant.id, event.target.value)}
                            placeholder={copy.participantNamePlaceholder}
                          />
                        </td>
                        <td>
                          <span className="table-badge">{copy.participantStatusReady}</span>
                        </td>
                        <td>
                          <button className="ghost-button" type="button" onClick={() => handleRemoveParticipant(participant.id)}>
                            {copy.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{expenseDraft.id ? copy.editExpense : copy.addExpense}</h2>
            <span className="pill">{copy.expensesCount(activity.expenses.length)}</span>
          </div>

          <form className="expense-form" onSubmit={handleSubmitExpense}>
            <div className="form-grid">
              <label className="field">
                <span>{copy.description}</span>
                <input
                  placeholder={copy.descriptionPlaceholder}
                  value={expenseDraft.description}
                  onChange={(event) => setExpenseDraft((current) => ({ ...current, description: event.target.value }))}
                />
                {expenseErrors.description && <span className="inline-error">{expenseErrors.description}</span>}
              </label>

              <label className="field">
                <span>{copy.amount}</span>
                <input
                  inputMode="decimal"
                  min="0"
                  placeholder={copy.amountPlaceholder}
                  value={expenseDraft.amount}
                  onChange={(event) => setExpenseDraft((current) => ({ ...current, amount: event.target.value }))}
                />
                {expenseErrors.amount && <span className="inline-error">{expenseErrors.amount}</span>}
              </label>

              <label className="field">
                <span>{copy.payer}</span>
                <select
                  value={expenseDraft.payerId}
                  onChange={(event) => setExpenseDraft((current) => ({ ...current, payerId: event.target.value }))}
                  disabled={activity.participants.length === 0}
                >
                  <option value="">{copy.selectPayer}</option>
                  {activity.participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name || copy.unnamedParticipant}
                    </option>
                  ))}
                </select>
                {expenseErrors.payerId && <span className="inline-error">{expenseErrors.payerId}</span>}
              </label>
            </div>

            <fieldset className="checkbox-group">
              <legend>{copy.shareQuestion}</legend>
              {activity.participants.length === 0 ? (
                <p className="helper-text">{copy.addParticipantsFirst}</p>
              ) : (
                <div className="checkbox-grid">
                  {activity.participants.map((participant) => (
                    <label className="checkbox-row" key={participant.id}>
                      <input
                        type="checkbox"
                        checked={expenseDraft.participantIds.includes(participant.id)}
                        onChange={() => handleExpenseToggleParticipant(participant.id)}
                      />
                      <span>{participant.name || copy.unnamedParticipant}</span>
                    </label>
                  ))}
                </div>
              )}
              {expenseErrors.participantIds && <span className="inline-error">{expenseErrors.participantIds}</span>}
            </fieldset>

            <div className="preview-box">
              <strong>{copy.equalSharePreview}</strong>{' '}
              {expenseSharePreview > 0
                ? describeEqualSplit(Number(expenseDraft.amount), expenseDraft.participantIds.length, language)
                : copy.enterAmountAndParticipants}
            </div>

            <div className="form-actions">
              {expenseDraft.id && (
                <button className="secondary-button" type="button" onClick={resetExpenseDraft}>
                  {copy.cancelEdit}
                </button>
              )}
              <button className="primary-button" type="submit" disabled={activity.participants.length === 0}>
                {expenseDraft.id ? copy.saveChanges : copy.addExpense}
              </button>
            </div>
          </form>
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{copy.expenseReview}</h2>
            <span className="pill">{copy.totalWithAmount(formatCurrency(activity.expenses.reduce((sum, expense) => sum + expense.amount, 0)))}</span>
          </div>

          {activity.expenses.length === 0 ? (
            <div className="empty-state">
              <h3>{copy.noExpenses}</h3>
              <p>{copy.noExpensesCopy}</p>
            </div>
          ) : (
            <div className="table-shell">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{copy.expenseTableDescription}</th>
                    <th>{copy.expenseTableAmount}</th>
                    <th>{copy.expenseTablePayer}</th>
                    <th>{copy.expenseTableSharedBy}</th>
                    <th>{copy.expenseTableShare}</th>
                    <th>{copy.expenseTableActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.expenses.map((expense) => {
                    const payerName = participantMap.get(expense.payerId) ?? copy.unknownParticipant
                    const splitNames = expense.participantIds.map((participantId) => participantMap.get(participantId) ?? copy.unknownParticipant)
                    const shareDescription = describeEqualSplit(expense.amount, expense.participantIds.length, language)

                    return (
                      <tr key={expense.id}>
                        <td>{expense.description}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>{payerName}</td>
                        <td>{splitNames.join('、')}</td>
                        <td>{shareDescription}</td>
                        <td>
                          <div className="table-actions">
                            <button className="ghost-button" type="button" onClick={() => handleEditExpense(expense)}>
                              {copy.edit}
                            </button>
                            <button className="ghost-button danger" type="button" onClick={() => handleDeleteExpense(expense.id)}>
                              {copy.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{copy.summary}</h2>
            <span className="pill">{copy.paidVsOwed}</span>
          </div>

          {summaries.length === 0 ? (
            <div className="empty-state compact">
              <p>{copy.addParticipantsToSeeSummary}</p>
            </div>
          ) : (
            <div className="table-shell">
              <table className="data-table summary-table">
                <thead>
                  <tr>
                    <th>{copy.summaryTableParticipant}</th>
                    <th>{copy.summaryTablePaid}</th>
                    <th>{copy.summaryTableOwed}</th>
                    <th>{copy.summaryTableNet}</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((summary) => (
                    <tr key={summary.participantId}>
                      <td>{summary.name}</td>
                      <td>{formatCurrency(summary.paid)}</td>
                      <td>{formatCurrency(summary.owed)}</td>
                      <td>
                        <strong className={summary.net >= 0 ? 'positive' : 'negative'}>
                          {summary.net >= 0 ? '+' : ''}
                          {formatCurrency(summary.net)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{copy.finalSettlement}</h2>
            <span className="pill">{copy.suggestedTransfers}</span>
          </div>

          {transfers.length === 0 ? (
            <div className="empty-state compact">
              <p>{activity.expenses.length === 0 ? copy.addExpensesToCalculate : copy.alreadySettled}</p>
            </div>
          ) : (
            <div className="settlement-list">
              {transfers.map((transfer, index) => (
                <div className="settlement-row" key={`${transfer.fromId}-${transfer.toId}-${index}`}>
                  <strong>{participantMap.get(transfer.fromId) ?? copy.unknownParticipant}</strong>
                  <span>{copy.pays}</span>
                  <strong>{participantMap.get(transfer.toId) ?? copy.unknownParticipant}</strong>
                  <span>{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel panel-wide">
          <div className="section-header">
            <h2>{copy.importExportShare}</h2>
            <span className="pill">{copy.browserOnlySharing}</span>
          </div>

          <div className="action-grid share-actions">
            <button className="primary-button" type="button" onClick={handleGenerateShareLink}>
              {copy.generateShareLink}
            </button>
          </div>

          {shareMessage && <p className="helper-text">{shareMessage}</p>}

          {shareUrl && (
            <label className="field">
              <span>{copy.snapshotLink}</span>
              <textarea readOnly rows={3} value={shareUrl} />
            </label>
          )}

          <div className="notice">
            <p>{copy.autosaveNotice}</p>
            <p>{copy.snapshotNotice}</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
