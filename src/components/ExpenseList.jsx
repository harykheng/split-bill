import { computeExpenseTotal } from '../utils/settlement'
import { formatRupiah } from '../utils/format'

export default function ExpenseList({ expenses, participants, onEdit, onDelete }) {
  const nameOf = (id) => participants.find((p) => p.id === id)?.name ?? '(dihapus)'

  if (expenses.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-semibold tracking-wide text-ink mb-2">Daftar pengeluaran</h2>
        <p className="text-sm text-ink-soft no-print">Belum ada pengeluaran dicatat.</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-sm font-semibold tracking-wide text-ink mb-2">Daftar pengeluaran</h2>
      <ul className="space-y-3">
        {expenses.map((expense) => {
          const { subtotal, taxServiceAmount, total } = computeExpenseTotal(expense)
          const taxServicePercent = expense.taxPercent + expense.servicePercent
          const splitNames = expense.splitIds.map(nameOf).join(', ')

          return (
            <li key={expense.id} className="pb-3 border-b border-dotted border-line last:border-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-ink">{expense.description}</span>
                <span className="font-mono mono-num text-sm text-ink shrink-0">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              {taxServicePercent > 0 && (
                <div className="flex items-baseline justify-between gap-2 text-xs text-ink-soft">
                  <span>
                    pajak/service ({taxServicePercent % 1 === 0 ? taxServicePercent : taxServicePercent.toFixed(1)}%)
                  </span>
                  <span className="font-mono mono-num shrink-0">+{formatRupiah(taxServiceAmount)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-2 text-sm font-medium text-ink mt-0.5">
                <span>Total</span>
                <span className="font-mono mono-num shrink-0">{formatRupiah(total)}</span>
              </div>

              <div className="mt-1 text-xs text-ink-soft">
                <span>Dibayar {nameOf(expense.payerId)}</span>
                <span> · Dibagi ke {splitNames}</span>
              </div>

              <div className="no-print mt-1.5 flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="text-xs font-medium text-brand active:text-brand-dark"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(expense.id)}
                  className="text-xs font-medium text-owe active:text-owe/80"
                >
                  Hapus
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
