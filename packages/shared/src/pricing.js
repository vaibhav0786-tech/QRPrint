export function calculateQuote({ pageCount, copies, rule }) {
  if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error('pageCount must be a positive integer');
  if (!Number.isInteger(copies) || copies < 1) throw new Error('copies must be a positive integer');
  if (!rule || !Number.isInteger(rule.currencyMinorUnit) || rule.currencyMinorUnit < 0) throw new Error('A valid merchant pricing rule is required');
  const printedPages = pageCount * copies;
  const totalMinor = rule.baseMinor + (printedPages * rule.perPageMinor) + (rule.bindingMinor || 0);
  return { currency: rule.currency, amountMinor: totalMinor, printedPages };
}
