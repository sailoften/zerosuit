export { formatMoney, txTitle };

const formatMoney = (amount) => {
    if (typeof amount !== 'number') {
        console.log(typeof amount);
        return '$0.00';
    }
    const amountAbs = Math.abs(amount);
    const fixedDecimal = (amountAbs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format flaot to String with 2 decimal points + commas
    const fancyFormatted = (amount > 0 ? '+' : '') + '$' + fixedDecimal; // Append + if amount is positive
    return fancyFormatted;
}

const txTitle = (item) => {
    switch(item.transactionType) {
      case 'Expense':
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
      case 'Transfer':
        return "Transfer: " + item.merchantName;
      default:
        if (item.merchantName) {
          return item.merchantName;
        } else if (item.memo && item.memo !== '') {
          return item.memo;
        } else {
          return 'Untitled Transaction'
        }
    }
  }