import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function PublishPage() {
  return (
    <InfoPage 
      title="Self-Publish with Us"
      category="Make Money with Us"
      content="Publish your books independently and reach readers worldwide. AmazonX Kindle Direct Publishing (KDP) makes it easy to get your stories into the hands of millions."
      highlights={[
        "Keep Control of Your Rights",
        "Set Your Own Prices",
        "Global Distribution",
        "Fast Self-Publishing Process"
      ]}
    />
  );
}
