import React, { useState } from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { CgProfile } from "react-icons/cg";
import { Client } from "@/types/client";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import EditClientModal from "@/components/example/ModalExample/EditClientModal";
import { Agent } from "@/types/Agent";
import EditAgentModal from "@/components/example/ModalExample/EditAgentModal";
import { useRouter } from "next/navigation";
import deleteAgents from "@/components/tables/DataTables/Agents/deleteAgents";

export default function AgentCard({ agent , onEdit }: { agent: Agent , onEdit: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
    function toggleDropdown() {
      setIsOpen(!isOpen);
    }
  
    function closeDropdown() {
      setIsOpen(false);
    }

  const router = useRouter();
  const handleDelete = async (id : number) => {
    const success = await deleteAgents(String(id));
    if (success) {
      router.push("/agents"); // Redirect to agents list after deletion
      // Optionally, you can refresh the agent list or redirect
    }
    // Implement delete logic here
    console.log(`Deleting agent with ID: ${agent.id}`);
    // After deletion, you might want to refresh the agent list or redirect
  }
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        <div className="mb-5 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
          <CgProfile size={28} />
        </div>
        <CardTitle>
          {agent.name} 
          <Badge className="ml-4" size="md" color={agent.status === "ACTIVE" ? "primary" : "info"} variant="light">
            {agent.status.toLocaleLowerCase() === "active" ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <div className="absolute right-0 top-0 h-fit">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <EditAgentModal AgentDetails={agent} details={true} onAgentEdited={onEdit} />
              <DeleteModal
                itemId={String(agent.id)}
                heading="Delete Agent"
                description="Are you sure you want to delete this agent? This action cannot be undone."
                onDelete={() => { handleDelete(agent.id) }}
                details={true}
              />
            </Dropdown>
          </div>
        <div>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Email: <span className="ml-2 font-normal">{agent.email}</span></p>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Phone: <span className="ml-2 font-normal">{agent.phoneNumber}</span></p>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Role: <span className="ml-2 font-normal">{agent.role.toLocaleLowerCase()}</span></p>
        </div>
      </div>
    </div>
  );
}
