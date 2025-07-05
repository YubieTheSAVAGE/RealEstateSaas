'use client'

import React from "react";
import { TbClock } from "react-icons/tb";
import { LuStamp } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";

import ContractStatusCard from "../cards/card-with-icon/ContractStatusCard";

interface ContractStatusHeaderProps {
    waitingContracts: number;
    validContracts: number;
    legalizedContracts: number;
    validatedContracts: number;
}

export default function ContractStatusHeader({ waitingContracts, validContracts, legalizedContracts, validatedContracts }: ContractStatusHeaderProps) {
    const totalContracts = waitingContracts + validContracts + legalizedContracts + validatedContracts;
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <ContractStatusCard title="En attente" description={waitingContracts.toString()} icon={<TbClock size={20} />} color="bg-yellow-50 text-yellow-500 dark:bg-yellow-500/10" />
                <ContractStatusCard title="validés par le client" description={validContracts.toString()} icon={<TbClock size={20} />} color="bg-warning-50 text-warning-500 dark:bg-warning-500/10" />
                <ContractStatusCard title="légalisés" description={legalizedContracts.toString()} icon={<LuStamp size={20} />} color="bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/10" />
                <ContractStatusCard title="validés" description={validatedContracts.toString()} icon={<CiCircleCheck size={20} />} color="bg-success-50 text-success-500 dark:bg-success-500/10" />    
            </div>
            <p className="text-sm text-right text-gray-500 dark:text-gray-400">
                total : {totalContracts} contrats
            </p>
        </>
    )
}