import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
});
