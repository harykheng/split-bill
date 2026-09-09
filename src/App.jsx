import { useMemo, useRef, useState } from 'react'
import Participants from './components/Participants.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import Results from './components/Results.jsx'
import { computeBalances, simplifyDebts } from './utils/settlement.js'
import { buildShareText } from './utils/share.js'

export default function App() {
  const [title, setTitle] = useState('')
  const [participants, setParticipants] = useState([])
  const [expenses, setExpenses] = useState([])
  const [editingExpenseId, setEditingExpenseId] = useState(null)

  const nextParticipantId = useRef(1)
  const nextExpenseId = useRef(1)

  const blockedIds = useMemo(() => {
    const ids = new Set()
    expenses.forEach((e) => {
      ids.add(e.payerId)
      e.splitIds.forEach((id) => ids.add(id))
    })
    return ids
  }, [expenses])

  const editingExpense = expenses.find((e) => e.id === editingExpenseId) ?? null

  function addParticipant(name) {
    const id = `p${nextParticipantId.current++}`
    setParticipants((prev) => [...prev, { id, name }])
  }

  function removeParticipant(id) {
    if (blockedIds.has(id)) return
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  function saveExpense(data) {
    if (data.id) {
      setExpenses((prev) => prev.map((e) => (e.id === data.id ? { ...data } : e)))
      setEditingExpenseId(null)
    } else {
      const id = `e${nextExpenseId.current++}`
      setExpenses((prev) => [...prev, { ...data, id }])
    }
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    if (editingExpenseId === id) setEditingExpenseId(null)
  }

  const balances = useMemo(
    () => (participants.length > 0 ? computeBalances(participants, expenses) : []),
    [participants, expenses],
  )
  const transactions = useMemo(() => simplifyDebts(balances), [balances])

  function handlePrint() {
    window.print()
  }

  function handleShare() {
    const text = buildShareText(title, expenses, transactions)
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const canShare = expenses.length > 0

  return (
    <div className="app-shell min-h-screen py-8 px-3 flex justify-center">
      <div className="receipt w-full max-w-[410px] px-5 pt-8 pb-10 space-y-6">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Nota Patungan
          </p>
          <h1 className="font-mono mono-num text-xl font-bold text-ink mt-0.5 break-words">
            {title.trim() || 'Split Bill'}
          </h1>
        </div>

        <div className="no-print">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul acara (misal: Trip Bali)"
            className="w-full text-center rounded-md border border-line bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="dashed-sep pt-5 no-print">
          <Participants
            participants={participants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            blockedIds={blockedIds}
          />
        </div>

        <div className="dashed-sep pt-5 no-print">
          <ExpenseForm
            participants={participants}
            editingExpense={editingExpense}
            onSave={saveExpense}
            onCancelEdit={() => setEditingExpenseId(null)}
          />
        </div>

        <div className="dashed-sep pt-5">
          <ExpenseList
            expenses={expenses}
            participants={participants}
            onEdit={(e) => setEditingExpenseId(e.id)}
            onDelete={deleteExpense}
          />
        </div>

        <div className="dashed-sep pt-5">
          <Results participants={participants} expenses={expenses} />
        </div>

        <div className="no-print flex gap-2 pt-1">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!canShare}
            className="flex-1 rounded-md bg-brand px-3 py-2.5 text-sm font-medium text-paper active:bg-brand-dark disabled:opacity-40"
          >
            Cetak ringkasan
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={!canShare}
            className="flex-1 rounded-md border border-brand px-3 py-2.5 text-sm font-medium text-brand active:bg-brand/10 disabled:opacity-40"
          >
            Share ke WhatsApp
          </button>
        </div>

        <p className="print-only text-center text-[10px] text-ink-soft pt-2">
          Dicetak {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
