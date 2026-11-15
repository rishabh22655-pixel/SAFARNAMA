import { DebtSettlement, Expense } from '../src/types';

export interface UserBalance {
  userId: string;
  userName: string;
  netBalance: number; // positive = is owed money, negative = owes money
}

export function computeMinimalSettlements(
  expenses: Expense[],
  memberNames: Record<string, string>
): DebtSettlement[] {
  const balances: Record<string, number> = {};

  // Initialize all known users
  for (const uid of Object.keys(memberNames)) {
    balances[uid] = 0;
  }

  // Calculate net balances from all expenses
  for (const exp of expenses) {
    const payerId = exp.paid_by;
    const totalAmount = exp.amount;

    if (balances[payerId] === undefined) {
      balances[payerId] = 0;
    }
    // Payer is credited the full amount they paid
    balances[payerId] += totalAmount;

    // Debtors are debited their share
    const shareKeys = Object.keys(exp.shares);
    if (exp.split_type === 'equal') {
      const perPerson = totalAmount / (shareKeys.length || 1);
      for (const uid of shareKeys) {
        if (balances[uid] === undefined) balances[uid] = 0;
        balances[uid] -= perPerson;
      }
    } else {
      // custom shares
      for (const [uid, shareAmount] of Object.entries(exp.shares)) {
        if (balances[uid] === undefined) balances[uid] = 0;
        balances[uid] -= shareAmount;
      }
    }
  }

  // Separate debtors and creditors
  interface Person {
    userId: string;
    userName: string;
    balance: number;
  }

  const debtors: Person[] = [];
  const creditors: Person[] = [];

  for (const [userId, rawBalance] of Object.entries(balances)) {
    const balance = Math.round(rawBalance * 100) / 100;
    const userName = memberNames[userId] || `Traveler ${userId.substring(0, 5)}`;
    if (balance < -0.01) {
      debtors.push({ userId, userName, balance: -balance }); // balance > 0 representing amount owed
    } else if (balance > 0.01) {
      creditors.push({ userId, userName, balance });
    }
  }

  // Sort: largest debtor first, largest creditor first
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const settlements: DebtSettlement[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = Math.min(debtor.balance, creditor.balance);
    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount > 0) {
      settlements.push({
        from_user_id: debtor.userId,
        from_name: debtor.userName,
        to_user_id: creditor.userId,
        to_name: creditor.userName,
        amount: roundedAmount,
      });
    }

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance < 0.01) {
      d++;
    }
    if (creditor.balance < 0.01) {
      c++;
    }
  }

  return settlements;
}
