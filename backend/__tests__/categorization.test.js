// Jest test for categorization
import { categorizeTransaction } from '../src/controllers/transactionController.js';
test('categorizes restaurant as Food', () => {
  expect(categorizeTransaction(['restaurant'])).toBe('Food');
});
test('categorizes supermarket as Groceries', () => {
  expect(categorizeTransaction(['supermarket'])).toBe('Groceries');
});
