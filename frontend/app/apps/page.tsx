import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function AppsPage() {
  return (
    <InfoPage 
      title="Apps on AmazonX"
      category="Make Money with Us"
      content="Publish your apps and reach millions of users on AmazonX devices and the web. Our platform provides the tools and reach you need to succeed in the competitive app marketplace."
      highlights={[
        "Cross-Device Distribution",
        "In-App Purchasing",
        "Developer Resources",
        "Promotional Opportunities"
      ]}
    />
  );
}
