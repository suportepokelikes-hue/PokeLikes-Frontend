import test from 'node:test';
import assert from 'node:assert/strict';

import { getPaymentBrCodePreview, getPaymentQrImageSrc, getPaymentShortId, getPaymentStatusView } from '../src/modules/customer-dashboard/payment-view';

test('getPaymentStatusView maps backend statuses into customer-facing PIX states', () => {
  assert.deepEqual(getPaymentStatusView('pending'), {
    badgeLabel: 'Pendente',
    title: 'Aguardando pagamento',
    description: 'Use o QR code ou copie o codigo PIX. O status atualiza automaticamente enquanto estiver pendente.',
    tone: 'warning',
    autoRefresh: true,
  });

  assert.equal(getPaymentStatusView('confirmed').tone, 'success');
  assert.equal(getPaymentStatusView('expired').badgeLabel, 'Expirado');
  assert.equal(getPaymentStatusView('failed').badgeLabel, 'Falhou');
  assert.equal(getPaymentStatusView('cancelled').badgeLabel, 'Cancelado');
});

test('getPaymentQrImageSrc normalizes raw base64 into a usable image src', () => {
  assert.equal(getPaymentQrImageSrc(null), null);
  assert.equal(getPaymentQrImageSrc('data:image/png;base64,abc123'), 'data:image/png;base64,abc123');
  assert.equal(getPaymentQrImageSrc('abc123'), 'data:image/png;base64,abc123');
});

test('getPaymentShortId shortens long ids and preserves short ones', () => {
  assert.equal(getPaymentShortId('1234567890'), '1234567890');
  assert.equal(getPaymentShortId('pay_1234567890abcd'), 'pay_12...abcd');
});

test('getPaymentBrCodePreview shows only the first characters of long PIX codes', () => {
  assert.equal(getPaymentBrCodePreview(null), 'Codigo ainda indisponivel.');
  assert.equal(getPaymentBrCodePreview('  abc123  '), 'abc123');
  assert.equal(getPaymentBrCodePreview('00020126330014br.gov.bcb.pix0111customer-key520400005303986', 12), '000201263300...');
});
