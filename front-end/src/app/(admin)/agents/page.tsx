"use client";

import AgentsDataTable from "@/components/tables/DataTables/Agents/AgentsDataTable";
import AddAgentModal from "@/components/example/ModalExample/AddAgentModal";
import { useState } from "react";

export default function AgentsPage() {
  // State to trigger a refresh of agent data
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to increment the refresh trigger, causing the data to reload
  const handleAgentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Agents
        </h2>
        <AddAgentModal onAgentAdded={handleAgentAdded} />
      </div>
      <AgentsDataTable refreshTrigger={refreshTrigger} />
    </>
  );
}