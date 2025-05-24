"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Client } from "@/types/client"
import { useRouter } from "next/navigation";
import { get } from "http";

import ClientCard from "../cards/card-with-icon/ClientCard";
import ClientNoteCard from "../cards/card-with-icon/ClientNoteCard";
import ClientPropertiesCard from "../cards/card-with-icon/ClientPropertiesCard";
import InterestTable from "../ecommerce/InterestTable";
import { User } from "@/types/user";
import getAgentById from "./getAgentById";
import { Agent } from "@/types/Agent";
import AgentCard from "../cards/card-with-icon/AgentCard.tsx";
import MonthlySalesChart from "../ecommerce/MonthlySalesChart";
import { getUserRoleFromToken } from "@/app/(auth)/signin/login";
import getApartements from "../tables/DataTables/Properties/getApartements";
import { StatsCard } from "../ecommerce/StatsCard";

interface AgentDetailsProps {
    agentId: string;
}

export default function AgentDetails({ agentId }: AgentDetailsProps) {
    const router = useRouter();
    const [agent, setAgent] = React.useState<Agent | null>(null);
    const [apartementsData, setApartementsData] = useState([]);
    const [userRole, setUserRole] = useState("");

    const fetchAgent = useCallback(async () => {
        const Data = await getAgentById(agentId);
        console.log("Agent data:", Data);
        if (Data.error || !Data) {
            console.log("Error fetching agent:", Data.error);
            router.push("/not-found");
        }
        setAgent(Data);
    }, [agentId, router]);

    React.useEffect(() => {
        fetchAgent();
    }, [fetchAgent]);

    const fetchApartements = useCallback(async () => {
        // API call to fetch projects
        const data = await getApartements();
        const filteredData = data.filter((item:any) => agentId === item.userId);
        setApartementsData(filteredData);
    }, []);
        
    useEffect(() => {
        fetchApartements();
    }, [fetchApartements]);

    if (!agent) {
        return <div>Loading...</div>;
    }
    

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                <AgentCard agent={agent} />
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