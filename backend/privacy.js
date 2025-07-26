// Privacy utility to mask sensitive fields
export default function maskSensitive(tx) {
  if (tx.email) tx.email = tx.email.replace(/(.{2}).+(@.+)/, '$1****$2');
  if (tx.payment_id) tx.payment_id = '****' + tx.payment_id.slice(-4);
  return tx;
}
