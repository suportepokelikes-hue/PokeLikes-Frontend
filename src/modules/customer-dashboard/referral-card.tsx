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
          <h2>Programa de indicacao</h2>
        </div>
        <StatusBadge label={rewardStatus.label} tone={rewardStatus.tone} />
      </div>

      <p className="section-copy">{rewardStatus.description}</p>

      <div className="referral-summary-grid">
        <div className="stack-item">
          <span>Seu codigo</span>
          <strong>{referral.referralCode}</strong>
          <p className="code-block">{referral.referralLink}</p>
        </div>

        <div className="stack-item">
          <span>Email</span>
          <strong>{referral.emailVerified ? 'Verificado' : 'Pendente de verificacao'}</strong>
          <p>{referral.emailVerified ? 'Seu email ja esta liberado para qualificacao de bonus.' : 'Verifique o email para liberar etapas pendentes do programa.'}</p>
        </div>
      </div>

      <div className="referral-rules-grid">
        <div className="stack-item">
          <span>Deposito qualificado</span>
          <strong>{formatMoney(referral.rewardRules.minimumTopupAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Bonus do indicado</span>
          <strong>{formatMoney(referral.rewardRules.referredBonusAmount)}</strong>
        </div>
        <div className="stack-item">
          <span>Bonus de quem indica</span>
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
          <span>Sua ultima qualificacao</span>
          <strong>{formatMoney(referral.ownReferralReward.referredBonusAmount)}</strong>
          <p>
            Status {referral.ownReferralReward.status}
            {referral.ownReferralReward.qualifyingAmount
              ? `, deposito considerado ${formatMoney(referral.ownReferralReward.qualifyingAmount)}`
              : ''}
            {referral.ownReferralReward.processedAt
              ? `, processado em ${formatDateTime(referral.ownReferralReward.processedAt)}`
              : ''}
            .
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
            Fazer deposito qualificado
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
        description: 'Seu cadastro entrou no programa por indicacao. Verifique o email para liberar o bonus.',
      };
    case 'pending_first_qualifying_topup':
      return {
        label: 'Aguardando deposito',
        tone: 'info' as const,
        description: `Email verificado. Faca um primeiro deposito confirmado de pelo menos ${formatMoney(minimumTopupAmount)} para liberar o bonus.`,
      };
    case 'rewarded':
      return {
        label: 'Bonus aplicado',
        tone: 'success' as const,
        description: 'O bonus de indicacao ja foi aplicado no seu saldo.',
      };
    case 'not_referred':
    default:
      return {
        label: 'Pronto para indicar',
        tone: 'info' as const,
        description: 'Seu codigo ja esta ativo para convidar outras pessoas e acompanhar o programa.',
      };
  }
}
