"use client";

import AgentsDataTable from "@/components/tables/DataTables/Agents/AgentsDataTable";
import AddAgentModal from "@/components/example/ModalExample/AddAgentModal";
import { useEffect, useState } from "react";
import getAgents from "@/components/tables/DataTables/Agents/getAgents";

export default function AgentsPage() {
  // State to trigger a refresh of agent data
  const [agents, setAgents] = useState([]);
  const fetchAgents = async () => {
    const data = await getAgents();
    setAgents(data);
  }
  useEffect(() => {
    fetchAgents();
  }
  , []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Agents
        </h2>
        <AddAgentModal onAgentAdded={fetchAgents} />
      </div>
      <AgentsDataTable agents={agents} onClientEdit={fetchAgents} />
    </>
  );
}