import { render, screen } from '@testing-library/react';
import App from './App';

test('Load document button exists ', () => {
  render(<App />);

  expect(screen.getByDisplayValue(/Ladda dokument/i)).toBeInTheDocument();
});

test('Save document button exists ', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#save')).toBeInTheDocument();
});

test('Document select exists ', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#docSelect')).toBeInTheDocument();
});