import AgentsDataTable from "@/components/tables/DataTables/Agents/AgentsDataTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immo360 | Agents",
  description: "This is Immo360 Agents Page",
};

export default function AgentsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Agents" />
      <AgentsDataTable />
    </>
  );
}