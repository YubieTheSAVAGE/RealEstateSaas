import React, { useState } from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { CgProfile } from "react-icons/cg";
import { Client } from "@/types/client";
import Badge from "@/components/ui/badge/Badge";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DeleteModal from "@/components/example/ModalExample/DeleteModal";
import ClientNoteModal from "@/components/example/ModalExample/ClientNoteModal";

export default function ClientNoteCard({ clientNote }: { clientNote: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
    function toggleDropdown() {
      setIsOpen(!isOpen);
    }
  
    function closeDropdown() {
      setIsOpen(false);
    }
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        {/* <div className="mb-5 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
          <CgProfile size={28} />
        </div> */}
        <CardTitle>
          Note
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
              <ClientNoteModal clientNote={clientNote} />
            </Dropdown>
          </div>
          {!clientNote && (
            <CardDescription>
              No notes available
            </CardDescription>
          )}
          {clientNote && (
            <CardDescription>
              {clientNote}
            </CardDescription>
          )}
        </div>
    </div>
  );
}
