"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import getAgentById from "./getAgentById";
import { Agent } from "@/types/Agent";
import { Property } from "@/types/property";
import AgentCard from "../cards/card-with-icon/AgentCard.tsx";
import MonthlySalesChart from "../ecommerce/MonthlySalesChart";
import getApartements from "../tables/DataTables/Properties/getApartements";
import { StatsCard } from "../ecommerce/StatsCard";
import { FallingLines } from "react-loader-spinner";

interface AgentDetailsProps {
    agentId: string;
}

export default function AgentDetails({ agentId }: AgentDetailsProps) {
    const router = useRouter();
    const [agent, setAgent] = React.useState<Agent | null>(null);
    const [apartementsData, setApartementsData] = useState<Property[]>([]);

    const fetchAgent = async () => {
        const Data = await getAgentById(agentId);
        console.log("Agent data:", Data);
        if (Data.error || !Data) {
            console.log("Error fetching agent:", Data.error);
            router.push("/not-found");
        }
        setAgent(Data);
        await fetchApartements()
    };

    React.useEffect(() => {
        fetchAgent();
    });

    const fetchApartements = async () => {
        // API call to fetch projects
        const data = await getApartements();
        const filteredData = data.filter((item: Property) => Number(agentId) === item.userId);
        setApartementsData(filteredData);
    };

    if (!agent) {
        return <div className="flex mt-24 w-full items-center justify-center py-4">
            <FallingLines
                height="80"
                width="80"
                color="#4460FF"
                visible={agent === null}
            />
        </div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                <AgentCard agent={agent} onEdit={() => {fetchAgent()}}/>
                <MonthlySalesChart apartements={apartementsData} />
                <span className="col-span-2">
                    <StatsCard apartments={apartementsData} />
                </span>

                <div className="col-span-2"></div>
            </div>
            {/* <InterestTable ProjectDetails={agent.interestedApartments || []} /> */}
        </div>
    );
}