import React, { useState } from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { CgProfile } from "react-icons/cg";
import { Client } from "@/types/client";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import EditClientModal from "@/components/example/ModalExample/EditClientModal";
import { useRouter } from "next/navigation";
import deleteClient from "@/components/tables/DataTables/Clients/deleteClient";

export default function ClientCard({ client, onRefresh }: { client: Client, onRefresh?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const router = useRouter();
  const handleDelete = async (id: string) => {
    const success: boolean = await deleteClient(id);
    if (success) {
      router.push("/clients");

    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        <div className="mb-5 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
          <CgProfile size={28} />
        </div>
        <CardTitle>
          {client.name} 
          <Badge className="ml-4" size="md" color={client.status === "CLIENT" ? "primary" : "info"} variant="light">
            {client.status.toLocaleLowerCase() === "client" ? "Client" : "Lead"}
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
              <EditClientModal clientData={client} details={true} onClientUpdated={onRefresh} />
              <DeleteModal
                itemId={String(client.id)}
                heading="Delete Client"
                description="Are you sure you want to delete this client? This action cannot be undone."
                onDelete={() => handleDelete(String(client.id))}
                details={true}
              />
            </Dropdown>
          </div>
        <div>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Email: <span className="ml-2 font-normal">{client.email}</span></p>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Phone: <span className="ml-2 font-normal">{client.phoneNumber}</span></p>
          <p className="text-md font-bold text-gray-500 dark:text-gray-400">Provenance: <span className="ml-2 font-normal">{client.provenance}</span></p>
        </div>
      </div>
    </div>
  );
}
