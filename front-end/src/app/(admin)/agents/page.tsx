import AgentsDataTable from "@/components/tables/DataTables/Agents/AgentsDataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddAgentModal from "@/components/example/ModalExample/AddAgentModal";

export const metadata: Metadata = {
  title: "Immo360 | Agents",
  description: "This is Immo360 Agents Page",
};

export default function AgentsPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
              x-text="pageName"
          >
              Properties
          </h2>
          <AddAgentModal />
      </div>
      <AgentsDataTable />
    </>
  );
}