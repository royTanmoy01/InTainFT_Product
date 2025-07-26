// Simple ML categorizer (stub)
export default function mlCategorize(types) {
  if (types.includes('restaurant')) return 'Food';
  if (types.includes('supermarket')) return 'Groceries';
  // ...add more ML logic here
  return 'Other';
}
