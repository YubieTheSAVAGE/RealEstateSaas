'use client'

import React from "react";
import { TbFile, TbClock } from "react-icons/tb";
import { LuStamp } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";

import ContractStatusCard from "../cards/card-with-icon/ContractStatusCard";

interface ContractStatusHeaderProps {
    totalContracts: number;
    validContracts: number;
    legalizedContracts: number;
    validatedContracts: number;
}

export default function ContractStatusHeader({ totalContracts, validContracts, legalizedContracts, validatedContracts }: ContractStatusHeaderProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContractStatusCard title="Total des contrats" description={totalContracts.toString()} icon={<TbFile size={20} />} color="bg-brand-50 text-brand-500 dark:bg-brand-500/10" />
            <ContractStatusCard title="Contrats valides" description={validContracts.toString()} icon={<TbClock size={20} />} color="bg-orange-50 text-orange-500 dark:bg-orange-500/10" />
            <ContractStatusCard title="Contrats légalisés" description={legalizedContracts.toString()} icon={<LuStamp size={20} />} color="bg-yellow-50 text-yellow-500 dark:bg-yellow-500/10" />
            <ContractStatusCard title="Contrats validés" description={validatedContracts.toString()} icon={<CiCircleCheck size={20} />} color="bg-green-50 text-green-500 dark:bg-green-500/10" />    
        </div>
    )
}