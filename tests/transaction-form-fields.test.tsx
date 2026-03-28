import test from 'node:test';
import assert from 'node:assert/strict';

import { renderToStaticMarkup } from 'react-dom/server';

import { TransactionField, TransactionTextarea } from '../src/modules/customer-transactions/transaction-form';

test('TransactionField renders number constraints and readOnly state', () => {
  const html = renderToStaticMarkup(
    <TransactionField
      label="Quantidade"
      name="quantity"
      type="number"
      placeholder="100"
      required
      min={50}
      max={5000}
      step={10}
      defaultValue={250}
      readOnly
    />,
  );

  assert.match(html, /Quantidade/);
  assert.match(html, /name="quantity"/);
  assert.match(html, /type="number"/);
  assert.match(html, /placeholder="100"/);
  assert.match(html, /required=""/);
  assert.match(html, /min="50"/);
  assert.match(html, /max="5000"/);
  assert.match(html, /step="10"/);
  assert.match(html, /value="250"/);
  assert.match(html, /readOnly=""/);
  assert.match(html, /transaction-input/);
});

test('TransactionTextarea renders label, name and placeholder', () => {
  const html = renderToStaticMarkup(
    <TransactionTextarea label="Comments" name="comments" placeholder="Um comentario por linha" />,
  );

  assert.match(html, /Comments/);
  assert.match(html, /name="comments"/);
  assert.match(html, /placeholder="Um comentario por linha"/);
  assert.match(html, /transaction-textarea/);
  assert.match(html, /rows="4"/);
});
