import { render, screen } from '@testing-library/react';
import { TrixEditor } from "react-trix";
import "trix";
import App from './App';
import pdf from './models/pdf';

test('Load document button exists ', () => {
  render(<App />);

  expect(screen.getByDisplayValue(/Ladda dokument/i)).toBeInTheDocument();
});

test('New document button exists ', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#new')).toBeInTheDocument();
});

test('Document select exists ', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#docSelect')).toBeInTheDocument();
});

test('Create PDF button exists ', () => {
  const { container } = render(<App />);

  expect(container.querySelector('#createPDF')).toBeInTheDocument();
});
