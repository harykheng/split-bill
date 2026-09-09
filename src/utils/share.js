import { formatRupiah } from './format'
import { computeExpenseTotal } from './settlement'

export function buildShareText(title, expenses, transactions) {
  const lines = []
  lines.push(`Ringkasan Split Bill${title.trim() ? `: ${title.trim()}` : ''}`)
  lines.push('')

  if (transactions.length === 0) {
    lines.push('Semua udah impas, gak ada yang perlu transfer.')
  } else {
    transactions.forEach((t) => {
      lines.push(`- ${t.fromName} bayar ke ${t.toName}: ${formatRupiah(t.amount)}`)
    })
  }

  const totalPengeluaran = expenses.reduce(
    (sum, e) => sum + computeExpenseTotal(e).total,
    0,
  )
  lines.push('')
  lines.push(`Total pengeluaran: ${formatRupiah(totalPengeluaran)}`)

  return lines.join('\n')
}
