import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const mockSetAuth = jest.fn(); 
  render(<App setIsAuthenticated={mockSetAuth} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
