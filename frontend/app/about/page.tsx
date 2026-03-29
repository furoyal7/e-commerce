import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function AboutPage() {
  return (
    <InfoPage 
      title="About AmazonX"
      category="Get to Know Us"
      content="AmazonX is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking."
      highlights={[
        "Customer Obsession",
        "Invention & Innovation",
        "Operational Excellence",
        "Long-term Thinking"
      ]}
    />
  );
}
