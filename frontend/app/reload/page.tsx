import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function ReloadPage() {
  return (
    <InfoPage 
      title="Reload Your Balance"
      category="AmazonX Payment Products"
      content="Add funds to your AmazonX account quickly and securely. Maintain a digital balance for faster checkouts and easy budgeting of your shopping expenses."
      highlights={[
        "Instant Fund Transfers",
        "Secure Digital Wallet",
        "Auto-Reload Options",
        "Transaction History"
      ]}
    />
  );
}
