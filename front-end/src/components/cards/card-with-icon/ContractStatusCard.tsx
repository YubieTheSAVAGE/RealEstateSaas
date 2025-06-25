import React from "react";
import { CardDescription, CardTitle } from "../../ui/card";

interface ContractStatusCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function ContractStatusCard({ title, description, icon, color }: ContractStatusCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div>
        <CardDescription>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle>{title}</CardTitle>
              <div className="flex-grow text-xl font-semibold">{description}</div>
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-[10.5px] ${color} text-2xl font-bold`}>
              {icon}
            </div>
          </div>
        </CardDescription>
      </div>
    </div>
  );
}




