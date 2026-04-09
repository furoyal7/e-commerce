'use client';

import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function Registry() {
  return (
    <InfoPage 
      category="Corporate Procurement"
      title="Gift Registry & Lists"
      content="Create and manage professional registries for corporate events, laboratory setups, or team deployments. Share your inventory requirements with partners and colleagues."
      highlights={[
        "Laboratory setup registries",
        "Corporate event equipment lists",
        "Shareable procurement links",
        "Specialized gift vouchers"
      ]}
    />
  );
}
