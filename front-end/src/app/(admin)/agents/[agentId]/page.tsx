'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import AgentDetails from '@/components/agent/AgentDetails';

// Correct way to type params in Next.js App Router
interface PageParams {
  agentId: string;
}

interface AgentDetailsPageProps {
  params: PageParams;
}

export default function AgentDetailsPage({ params }: AgentDetailsPageProps) {
  const { agentId } = params;

  const threeLayerItems = [
    { label: 'Home', href: '/' },
    { label: 'Agents', href: '/agents' },
    { label: agentId },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Agent Details
        </h2>
        <Breadcrumb items={threeLayerItems} variant="withIcon" />
      </div>

      <div>
        <AgentDetails agentId={agentId} />
      </div>
    </>
  );
}
