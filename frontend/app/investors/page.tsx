import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function InvestorsPage() {
  return (
    <InfoPage 
      title="Investor Relations"
      category="Get to Know Us"
      content="Access AmazonX's financial information, including quarterly earnings results, annual reports, and SEC filings. We are committed to transparency and long-term value for our shareholders."
      highlights={[
        "Quarterly Results",
        "Annual Reports",
        "Stock Information",
        "Governance & Board"
      ]}
    />
  );
}
