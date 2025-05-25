'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import AgentDetails from '@/components/agent/AgentDetails';

export default async function AgentDetailsPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;

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
