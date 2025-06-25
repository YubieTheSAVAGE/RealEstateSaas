"use client";
import ContractStatusHeader from "@/components/contract/ContractStatusheader";
import React, { useState } from "react";
import { TbContract, TbFile } from "react-icons/tb";

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

const tabData: TabData[] = [
  {
    id: "contracts",
    label: "Contrats",
    icon: <TbFile size={20} />,
    content: <ContractStatusHeader totalContracts={10} validContracts={10} legalizedContracts={10} validatedContracts={10} />,
  },
  {
    id: "templates",
    label: "Templates",
    icon: <TbContract size={20} />,
    content: <div>Templates</div>,
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
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
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
