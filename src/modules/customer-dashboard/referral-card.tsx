import Link from 'next/link';
import { Gift } from 'lucide-react';

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
    <article className="detail-card detail-card-wide" id="indicacoes">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Indicacoes</p>
          <h2>Codigo e recompensas</h2>
        </div>
        <StatusBadge label={rewardStatus.label} tone={rewardStatus.tone} />
      </div>

      <p className="section-copy">{rewardStatus.description}</p>

      <div className="referral-summary-grid">
        <div className="stack-item">
          <span>Codigo</span>
          <strong>{referral.referralCode}</strong>
          <p className="code-block">{referral.referralLink}</p>
        </div>

        <div className="stack-item">
          <span>Email</span>
          <strong>{referral.emailVerified ? 'Verificado' : 'Pendente'}</strong>
          <p>{referral.emailVerified ? 'Pronto para qualificacao.' : 'Verifique para liberar o bonus.'}</p>
        </div>
      </div>

      <div className="referral-rules-grid">
        <div className="stack-item">
          <span>Deposito</span>
          <strong>{formatMoney(referral.rewardRules.minimumTopupAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Bonus indicado</span>
          <strong>{formatMoney(referral.rewardRules.referredBonusAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Seu bonus</span>
          <strong>{formatMoney(referral.rewardRules.referrerBonusAmount)}</strong>
        </div>
      </div>

      <div className="referral-summary-grid">
        <div className="stack-item">
          <span>Convidados</span>
          <strong>{formatNumber(referral.summary.invitedUsers)}</strong>
        </div>
        <div className="stack-item">
          <span>Convidados recompensados</span>
          <strong>{formatNumber(referral.summary.rewardedUsers)}</strong>
        </div>
        <div className="stack-item">
          <span>Total ganho</span>
          <strong>{formatMoney(referral.summary.earnedAmount)}</strong>
        </div>
      </div>

      {referral.ownReferralReward ? (
        <div className="stack-item">
          <span>Ultimo bonus</span>
          <strong>{formatMoney(referral.ownReferralReward.referredBonusAmount)}</strong>
          <p>
            {`Status ${referral.ownReferralReward.status}`}
            {referral.ownReferralReward.qualifyingAmount ? ` • Deposito ${formatMoney(referral.ownReferralReward.qualifyingAmount)}` : ''}
            {referral.ownReferralReward.processedAt ? ` • ${formatDateTime(referral.ownReferralReward.processedAt)}` : ''}
          </p>
        </div>
      ) : null}

      <div className="feedback-actions">
        <ReferralClientActions
          referralCode={referral.referralCode}
          referralLink={referral.referralLink}
          emailVerified={referral.emailVerified}
        />
      </div>

      {referral.rewardStatus === 'pending_first_qualifying_topup' ? (
        <div className="feedback-actions">
          <Link href="/app/payments" className="secondary-action">
            <Gift size={16} strokeWidth={2.15} aria-hidden="true" />
            Fazer deposito
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function getRewardStatusView(status: ReferralRewardStatus, minimumTopupAmount: { amount: string; currency: string }) {
  switch (status) {
    case 'pending_email_verification':
      return {
        label: 'Aguardando email',
        tone: 'warning' as const,
        description: 'Verifique o email para liberar o bonus.',
      };
    case 'pending_first_qualifying_topup':
      return {
        label: 'Aguardando deposito',
        tone: 'info' as const,
        description: `Faca um deposito confirmado de pelo menos ${formatMoney(minimumTopupAmount)}.`,
      };
    case 'rewarded':
      return {
        label: 'Bonus aplicado',
        tone: 'success' as const,
        description: 'O bonus ja entrou no saldo.',
      };
    case 'not_referred':
    default:
      return {
        label: 'Pronto para indicar',
        tone: 'info' as const,
        description: 'Seu codigo ja esta ativo.',
      };
  }
}
