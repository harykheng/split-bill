export function formatRupiah(value) {
  const number = Math.round(Number(value) || 0)
  return 'Rp' + number.toLocaleString('id-ID')
}

export function formatNumberInput(value) {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('id-ID')
}

export function parseNumberInput(value) {
  const digits = String(value).replace(/\D/g, '')
  return digits ? Number(digits) : 0
}
