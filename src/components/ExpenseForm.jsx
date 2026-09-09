import { useEffect, useState } from 'react'
import { formatNumberInput, parseNumberInput } from '../utils/format'

const emptyForm = {
  description: '',
  subtotalDisplay: '',
  taxPercent: '',
  servicePercent: '',
  payerId: '',
  splitIds: [],
}

export default function ExpenseForm({ participants, editingExpense, onSave, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editingExpense) {
      setForm({
        description: editingExpense.description,
        subtotalDisplay: formatNumberInput(editingExpense.subtotal),
        taxPercent: editingExpense.taxPercent === 0 ? '' : String(editingExpense.taxPercent),
        servicePercent:
          editingExpense.servicePercent === 0 ? '' : String(editingExpense.servicePercent),
        payerId: editingExpense.payerId,
        splitIds: editingExpense.splitIds,
      })
    } else {
      setForm({ ...emptyForm, splitIds: participants.map((p) => p.id) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingExpense])

  useEffect(() => {
    if (editingExpense) return
    setForm((f) => {
      const validIds = new Set(participants.map((p) => p.id))
      const keptSplit = f.splitIds.filter((id) => validIds.has(id))
      const knownIds = new Set(f.splitIds)
      const newIds = participants.filter((p) => !knownIds.has(p.id)).map((p) => p.id)
      const payerId = f.payerId && validIds.has(f.payerId) ? f.payerId : participants[0]?.id ?? ''
      return { ...f, payerId, splitIds: [...keptSplit, ...newIds] }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, editingExpense])

  function toggleSplit(id) {
    setForm((f) => {
      const has = f.splitIds.includes(id)
      return {
        ...f,
        splitIds: has ? f.splitIds.filter((x) => x !== id) : [...f.splitIds, id],
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subtotal = parseNumberInput(form.subtotalDisplay)
    if (!form.description.trim() || subtotal <= 0 || !form.payerId || form.splitIds.length === 0) {
      return
    }
    onSave({
      id: editingExpense ? editingExpense.id : undefined,
      description: form.description.trim(),
      subtotal,
      taxPercent: Number(form.taxPercent) || 0,
      servicePercent: Number(form.servicePercent) || 0,
      payerId: form.payerId,
      splitIds: form.splitIds,
    })
    setForm({ ...emptyForm, payerId: participants[0]?.id ?? '', splitIds: participants.map((p) => p.id) })
  }

  const disabled = participants.length === 0

  return (
    <section className="no-print">
      <h2 className="text-sm font-semibold tracking-wide text-ink mb-2">
        {editingExpense ? 'Edit pengeluaran' : 'Tambah pengeluaran'}
      </h2>

      {disabled ? (
        <p className="text-sm text-ink-soft">Tambah peserta dulu sebelum mencatat pengeluaran.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Deskripsi (misal: Makan malam)"
            className="w-full rounded-md border border-line bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-soft shrink-0">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.subtotalDisplay}
              onChange={(e) =>
                setForm((f) => ({ ...f, subtotalDisplay: formatNumberInput(e.target.value) }))
              }
              placeholder="Subtotal"
              className="flex-1 min-w-0 rounded-md border border-line bg-white/60 px-3 py-2 text-sm font-mono mono-num text-ink placeholder:text-ink-soft placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Pajak (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.taxPercent}
                onChange={(e) => setForm((f) => ({ ...f, taxPercent: e.target.value }))}
                placeholder="0"
                className="w-full rounded-md border border-line bg-white/60 px-3 py-2 text-sm font-mono mono-num text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-ink-soft">Service (%)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.servicePercent}
                onChange={(e) => setForm((f) => ({ ...f, servicePercent: e.target.value }))}
                placeholder="0"
                className="w-full rounded-md border border-line bg-white/60 px-3 py-2 text-sm font-mono mono-num text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">Yang bayar</span>
            <select
              value={form.payerId}
              onChange={(e) => setForm((f) => ({ ...f, payerId: e.target.value }))}
              className="w-full rounded-md border border-line bg-white/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1 block text-xs text-ink-soft">Dibagi ke</span>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => {
                const checked = form.splitIds.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm cursor-pointer ${
                      checked
                        ? 'border-brand bg-brand text-paper'
                        : 'border-line bg-white/60 text-ink'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSplit(p.id)}
                      className="hidden"
                    />
                    {p.name}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-md bg-brand px-3 py-2 text-sm font-medium text-paper active:bg-brand-dark"
            >
              {editingExpense ? 'Simpan perubahan' : 'Tambah pengeluaran'}
            </button>
            {editingExpense && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-md border border-line px-3 py-2 text-sm text-ink-soft active:bg-white/60"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
