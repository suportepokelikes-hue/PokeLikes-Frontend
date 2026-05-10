import Link from 'next/link';

import { CustomerSectionCard } from '@/components/ui/customer-surfaces';
import type { ReferralSummaryResponse } from '@/lib/api/contracts';
import { formatMoney, formatNumber } from '@/lib/format';
import { ReferralClientActions } from './referral-client-actions';

type ReferralCardProps = {
  referral: ReferralSummaryResponse;
  detailsHref: string;
};

export function ReferralCard({ referral, detailsHref }: ReferralCardProps) {
  return (
    <CustomerSectionCard
      eyebrow="Indicacoes"
      title="Convide e ganhe"
      className="customer-referral-card"
    >
      <div className="customer-dashboard-inline-stats">
        <div>
          <span>Codigo</span>
          <strong>{referral.referralCode}</strong>
        </div>
        <div>
          <span>Convidados validos</span>
          <strong>{formatNumber(referral.summary.rewardedUsers)}</strong>
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
      </div>

      <div className="feedback-actions">
        <ReferralClientActions
          referralCode={referral.referralCode}
          referralLink={referral.referralLink}
          emailVerified={referral.emailVerified}
          showVerification={false}
        />

        <Link href={detailsHref} className="secondary-action">
          Saiba mais
        </Link>
      </div>
    </CustomerSectionCard>
  );
}
