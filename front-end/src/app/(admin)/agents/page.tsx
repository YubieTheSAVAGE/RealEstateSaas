"use client";

import AgentsDataTable from "@/components/tables/DataTables/Agents/AgentsDataTable";
import AddAgentModal from "@/components/example/ModalExample/AddAgentModal";
import { useEffect, useState } from "react";
import getAgents from "@/components/tables/DataTables/Agents/getAgents";
import { FallingLines } from "react-loader-spinner";

export default function AgentsPage() {
  // State to trigger a refresh of agent data
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgents = async () => {
    setIsLoading(true);
    const data = await getAgents();
    setAgents(data);
    setIsLoading(false);
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
      {isLoading ? (
        <div className="flex mt-24 w-full items-center justify-center py-4">
            <FallingLines
                height="80"
                width="80"
                color="#4460FF"
                visible={isLoading}
            />
        </div>
      ) : (
          <AgentsDataTable agents={agents} onClientEdit={fetchAgents} />
      )}
    </>
  );
}