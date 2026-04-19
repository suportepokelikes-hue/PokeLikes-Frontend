import Link from 'next/link';
import { Gift, MailCheck } from 'lucide-react';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import { StatusBadge } from '@/components/ui/status-badge';
import type { ReferralRewardStatus, ReferralSummaryResponse } from '@/lib/api/contracts';
import { formatDateTime, formatMoney, formatNumber } from '@/lib/format';
import { ReferralClientActions } from './referral-client-actions';

type ReferralCardProps = {
  referral: ReferralSummaryResponse;
};

export function ReferralCard({ referral }: ReferralCardProps) {
  const rewardStatus = getRewardStatusView(referral.rewardStatus, referral.rewardRules.minimumTopupAmount);

  return (
    <CustomerSectionCard
      eyebrow="Indicacoes"
      title="Codigo e recompensas"
      description={rewardStatus.description}
      meta={<StatusBadge label={rewardStatus.label} tone={rewardStatus.tone} />}
      className="customer-referral-card"
    >
      <div className="customer-dashboard-inline-stats">
        <div>
          <span>Codigo</span>
          <strong>{referral.referralCode}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{referral.emailVerified ? 'Verificado' : 'Pendente'}</strong>
        </div>
        <div>
          <span>Total ganho</span>
          <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
        </div>
      </div>

      <div className="referral-summary-grid">
        <div className="stack-item">
          <span>Link de convite</span>
          <p className="code-block">{referral.referralLink}</p>
        </div>

        <div className="stack-item">
          <span>Bonus por deposito</span>
          <strong>{formatMoney(referral.rewardRules.minimumTopupAmount)}</strong>
          <p>Valor minimo para liberar a recompensa.</p>
        </div>
      </div>

      <div className="referral-rules-grid">
        <div className="stack-item">
          <span>Bonus indicado</span>
          <strong>{formatMoney(referral.rewardRules.referredBonusAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Seu bonus</span>
          <strong>{formatMoney(referral.rewardRules.referrerBonusAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Convidados</span>
          <strong>{formatNumber(referral.summary.invitedUsers)}</strong>
        </div>
        <div className="stack-item">
          <span>Recompensados</span>
          <strong>{formatNumber(referral.summary.rewardedUsers)}</strong>
        </div>
      </div>

      {referral.ownReferralReward ? (
        <div className="stack-item customer-referral-reward-card">
          <span>Ultimo bonus</span>
          <strong>{formatMoney(referral.ownReferralReward.referredBonusAmount)}</strong>
          <p>
            {`Status ${referral.ownReferralReward.status}`}
            {referral.ownReferralReward.qualifyingAmount ? ` - Deposito ${formatMoney(referral.ownReferralReward.qualifyingAmount)}` : ''}
            {referral.ownReferralReward.processedAt ? ` - ${formatDateTime(referral.ownReferralReward.processedAt)}` : ''}
          </p>
        </div>
      ) : null}

      <div className="feedback-actions">
        <ReferralClientActions
          referralCode={referral.referralCode}
          referralLink={referral.referralLink}
          emailVerified={referral.emailVerified}
        />

        {!referral.emailVerified ? (
          <Link href="/app/profile" className="secondary-action">
            <MailCheck size={16} strokeWidth={2.15} aria-hidden="true" />
            Verificar email
          </Link>
        ) : null}

        {referral.rewardStatus === 'pending_first_qualifying_topup' ? (
          <Link href="/app/payments" className="secondary-action">
            <Gift size={16} strokeWidth={2.15} aria-hidden="true" />
            Fazer deposito
          </Link>
        ) : null}
      </div>
    </CustomerSectionCard>
  );
}

function getRewardStatusView(status: ReferralRewardStatus, minimumTopupAmount: { amount: string; currency: string }) {
  switch (status) {
    case 'pending_email_verification':
      return {
        label: 'Aguardando email',
        tone: 'warning' as const,
        description: 'Verifique o email para liberar o bonus do referral.',
      };
    case 'pending_first_qualifying_topup':
      return {
        label: 'Aguardando deposito',
        tone: 'info' as const,
        description: `Faca um deposito confirmado de pelo menos ${formatMoney(minimumTopupAmount)} para ativar a recompensa.`,
      };
    case 'rewarded':
      return {
        label: 'Bonus aplicado',
        tone: 'success' as const,
        description: 'O bonus ja entrou no saldo e seu codigo continua ativo.',
      };
    case 'not_referred':
    default:
      return {
        label: 'Pronto para indicar',
        tone: 'info' as const,
        description: 'Seu codigo ja pode ser compartilhado e acompanhado por aqui.',
      };
  }
}
