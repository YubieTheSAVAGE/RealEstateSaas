import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import AgentDetails from '@/components/agent/AgentDetails';
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ agentId: string }> }): Promise<Metadata> {
  const { agentId } = await params;
  
  return {
    title: `Agent ${agentId} - Immo 360`,
    description: `Détails de l'agent ${agentId} - Gestion immobilière Immo 360`,
    icons: {
      icon: "./favicon.ico",
      shortcut: "./favicon.ico",
      apple: "./favicon.ico",
    },
  };
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;

  const threeLayerItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Agents', href: '/agents' },
    { label: agentId },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Détails de l'agent
        </h2>
        <Breadcrumb items={threeLayerItems} variant="withIcon" />
      </div>

      <div>
        <AgentDetails agentId={agentId} />
      </div>
    </>
  );
}
