"use client";
import ContractStatusHeader from "@/components/contract/ContractStatusheader";
import ContractTemplate from "@/components/contract/ContractTemplate";
import ContractsTable from "@/components/ecommerce/ContractsTable";
import { Contract } from "@/types/Contract";
import React, { useState } from "react";
import { TbContract, TbFile } from "react-icons/tb";
import { Role, Status } from "@/types/user";

export interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TabButtonProps extends TabData {
  isActive: boolean;
  onClick: () => void;
}

const contracts: Contract[] = [
  {
    id: 1,
    template: {
      id: 1,
      name: 'Template 1',
      description: 'Description 1',
      content: 'Template content here',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedProjects: [],
      isDefault: false,
      createdBy: {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        phoneNumber: '+1234567890',
        role: Role.ADMIN,
        status: Status.ACTIVE,
        passwordHash: 'password',
      },
    },
    client: {
      id: 1,
      name: 'Client 1',
      email: 'client1@example.com',
      phoneNumber: '+1234567890',
      provenance: 'Website',
      status: 'CLIENT',
      createdById: 1,
    },
    property: {
      id: 1,
      number: '1',
      project: {
        id: 1,
        name: 'Résidence Les Palmiers',
        address: 'Address 1',
        totalSurface: 100,
        numberOfApartments: 10
      },
      floor: 1,
      type: 'APARTMENT',
      area: 100,
      price: 100000,
      pricePerM2: 1000,
      zone: 'Zone A',
      status: 'AVAILABLE',
      projectId: 1,
    },
    status: 'WAITING_CVALIDATION',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]



const tabData: TabData[] = [
  {
    id: "contracts",
    label: "Contrats",
    icon: <TbFile size={20} />,
    content: <>
      <div className="flex flex-col gap-4">
        <ContractStatusHeader waitingContracts={10} validContracts={10} legalizedContracts={10} validatedContracts={10} />
        <ContractsTable contracts={contracts} />
      </div>
    </>,
  },
  {
    id: "templates",
    label: "Templates",
    icon: <TbContract size={20} />,
    content: <ContractTemplate />,
  },
];

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`inline-flex items-center gap-2 border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400"
          : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

interface TabContentProps {
  content: React.ReactNode;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ content, isActive }) => {
  if (!isActive) return null;

  return (
    <div>
      {content}
    </div>
  );
};

export default function ContractTab() {
  const [activeTab, setActiveTab] = useState<TabData["id"]>("contracts");

  return (
    <div className="mb-4 p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {tabData.map((tab) => (
            <TabButton
              key={tab.id}
              {...tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4">
        {tabData.map((tab) => (
          <TabContent
            key={tab.id}
            content={tab.content}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>
    </div>
  );
}
