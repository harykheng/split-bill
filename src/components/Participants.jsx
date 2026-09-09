import { useState } from 'react'

export default function Participants({ participants, onAdd, onRemove, blockedIds }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <section className="no-print">
      <h2 className="text-sm font-semibold tracking-wide text-ink mb-2">
        Peserta
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama peserta"
          className="flex-1 min-w-0 rounded-md border border-line bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-brand px-3 py-2 text-sm font-medium text-paper active:bg-brand-dark"
        >
          Tambah
        </button>
      </form>

      {participants.length === 0 ? (
        <p className="text-sm text-ink-soft">Belum ada peserta. Tambahkan dulu, ya.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {participants.map((p) => {
            const isBlocked = blockedIds.has(p.id)
            return (
              <li
                key={p.id}
                className="flex items-center gap-1.5 rounded-full border border-line bg-white/60 pl-3 pr-1.5 py-1 text-sm text-ink"
              >
                <span>{p.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  disabled={isBlocked}
                  title={isBlocked ? 'Masih dipakai di pengeluaran' : 'Hapus peserta'}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-ink-soft hover:bg-owe-bg hover:text-owe disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
