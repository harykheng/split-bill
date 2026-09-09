import { computeBalances, simplifyDebts } from '../utils/settlement'
import { formatRupiah } from '../utils/format'

export default function Results({ participants, expenses }) {
  const hasData = participants.length > 0 && expenses.length > 0
  const balances = hasData ? computeBalances(participants, expenses) : []
  const transactions = hasData ? simplifyDebts(balances) : []
  const allSettled = hasData && transactions.length === 0

  return (
    <section className="border-2 border-brand rounded-lg overflow-hidden">
      <div className="bg-brand px-4 py-2.5">
        <h2 className="text-sm font-bold tracking-wide text-paper">Hasil Patungan</h2>
      </div>

      <div className="bg-brand/5 px-4 py-4">
        {!hasData ? (
          <p className="text-sm text-ink-soft">
            Tambahkan peserta dan pengeluaran dulu buat lihat hasil pembagiannya.
          </p>
        ) : (
          <>
            <ul className="space-y-1.5 mb-4">
              {balances.map((b) => {
                const isOwe = b.amount < -0.5
                const isReceive = b.amount > 0.5
                return (
                  <li key={b.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{b.name}</span>
                    <span
                      className={`font-mono mono-num font-semibold px-2 py-0.5 rounded ${
                        isOwe
                          ? 'text-owe bg-owe-bg'
                          : isReceive
                          ? 'text-receive bg-receive-bg'
                          : 'text-ink-soft'
                      }`}
                    >
                      {isOwe && '- '}
                      {isReceive && '+ '}
                      {formatRupiah(Math.abs(b.amount))}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="dashed-sep pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
                Transaksi penyelesaian
              </h3>
              {allSettled ? (
                <p className="text-sm text-ink">Semua udah impas, gak ada yang perlu transfer.</p>
              ) : (
                <ul className="space-y-2">
                  {transactions.map((t, i) => (
                    <li key={i} className="text-sm text-ink">
                      <span className="font-medium">{t.fromName}</span>
                      <span className="text-ink-soft"> bayar ke </span>
                      <span className="font-medium">{t.toName}</span>
                      <span className="block font-mono mono-num text-base font-bold text-brand">
                        {formatRupiah(t.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
