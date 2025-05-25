"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import getAgentById from "./getAgentById";
import { Agent } from "@/types/Agent";
import { Apartment } from "@/types/Apartment";
import AgentCard from "../cards/card-with-icon/AgentCard.tsx";
import MonthlySalesChart from "../ecommerce/MonthlySalesChart";
import getApartements from "../tables/DataTables/Properties/getApartements";
import { StatsCard } from "../ecommerce/StatsCard";

interface AgentDetailsProps {
    agentId: string;
}

export default function AgentDetails({ agentId }: AgentDetailsProps) {
    const router = useRouter();
    const [agent, setAgent] = React.useState<Agent | null>(null);
    const [apartementsData, setApartementsData] = useState<Apartment[]>([]);

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
        const filteredData = data.filter((item:string) => agentId === item.userId);
        setApartementsData(filteredData);
    };

    // useEffect(() => {
    //     fetchApartements();
    // }, []);

    if (!agent) {
        return <div>Loading...</div>;
    }
    

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                <AgentCard agent={agent} onEdit={() => {fetchAgent()}}/>
                <MonthlySalesChart apartements={apartementsData} />
                <span className="col-span-2">
                    <StatsCard apartments={apartementsData} />
                </span>

                {/* <ClientCard client={agent} />
                <ClientNoteCard clientNote={agent.notes || ""} />
                <ClientPropertiesCard ClientProperties={agent.apartments || []} /> */}
                <div className="col-span-2"></div>
            </div>
            {/* <InterestTable ProjectDetails={agent.interestedApartments || []} /> */}
        </div>
    );
}