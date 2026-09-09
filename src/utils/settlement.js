const EPSILON = 0.5

export function computeExpenseTotal(expense) {
  const subtotal = Number(expense.subtotal) || 0
  const taxPercent = Number(expense.taxPercent) || 0
  const servicePercent = Number(expense.servicePercent) || 0
  const taxServiceAmount = subtotal * ((taxPercent + servicePercent) / 100)
  return {
    subtotal,
    taxServiceAmount,
    total: subtotal + taxServiceAmount,
  }
}

export function computeBalances(participants, expenses) {
  const balance = {}
  participants.forEach((p) => {
    balance[p.id] = 0
  })

  expenses.forEach((expense) => {
    const { total } = computeExpenseTotal(expense)
    const splitIds = expense.splitIds.filter((id) => id in balance)
    if (expense.payerId in balance) {
      balance[expense.payerId] += total
    }
    if (splitIds.length > 0) {
      const share = total / splitIds.length
      splitIds.forEach((id) => {
        balance[id] -= share
      })
    }
  })

  return participants.map((p) => ({
    id: p.id,
    name: p.name,
    amount: balance[p.id] || 0,
  }))
}

export function simplifyDebts(balances) {
  const creditors = balances
    .filter((b) => b.amount > EPSILON)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.amount - a.amount)
  const debtors = balances
    .filter((b) => b.amount < -EPSILON)
    .map((b) => ({ ...b, amount: -b.amount }))
    .sort((a, b) => b.amount - a.amount)

  const transactions = []

  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0]
    const creditor = creditors[0]
    const amount = Math.min(debtor.amount, creditor.amount)

    if (amount > EPSILON) {
      transactions.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: Math.round(amount),
      })
    }

    debtor.amount -= amount
    creditor.amount -= amount

    if (debtor.amount <= EPSILON) debtors.shift()
    if (creditor.amount <= EPSILON) creditors.shift()
  }

  return transactions
}
