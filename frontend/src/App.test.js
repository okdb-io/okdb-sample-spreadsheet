import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app without crash', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Collaborative Work/i);
  expect(linkElement).toBeInTheDocument();
});
