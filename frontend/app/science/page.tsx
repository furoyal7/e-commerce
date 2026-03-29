import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function SciencePage() {
  return (
    <InfoPage 
      title="AmazonX Science"
      category="Get to Know Us"
      content="At AmazonX, we're working on some of the world's most challenging scientific and technical problems. From machine learning and robotics to cloud computing and sustainability science, explore how our scientists are inventing the future."
      highlights={[
        "Machine Learning Research",
        "Robotics & Automation",
        "Sustainability Science",
        "Applied Mathematics"
      ]}
    />
  );
}
