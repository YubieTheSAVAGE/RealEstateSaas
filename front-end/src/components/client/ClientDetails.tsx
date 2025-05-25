"use client";
import React, { useCallback } from "react";
import { Client } from "@/types/client"
import { useRouter } from "next/navigation";
import getClientById from "./getClientById";
import ClientCard from "../cards/card-with-icon/ClientCard";
import ClientNoteCard from "../cards/card-with-icon/ClientNoteCard";
import ClientPropertiesCard from "../cards/card-with-icon/ClientPropertiesCard";
import InterestTable from "../ecommerce/InterestTable";

interface ClientDetailsProps {
    clientId: string;
}

export default function ClientDetails({ clientId }: ClientDetailsProps) {
    const router = useRouter();
    const [client, setClient] = React.useState<Client | null>(null);
    const fetchClient = useCallback(async () => {
        const Data = await getClientById(clientId);
        console.log("Client data:", Data);
        if (Data.error || !Data) {
            console.log("Error fetching client:", Data.error);
            router.push("/not-found");
        }
        setClient(Data);
    }, [clientId, router]);
    React.useEffect(() => {
        fetchClient();
    }, [fetchClient]);
    if (!client) {
        return <div>Loading...</div>;
    }
    console.log("Client details:", client.apartments);
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                <ClientCard client={client} onRefresh={fetchClient} />
                <ClientNoteCard clientNote={client.notes || ""} />
                <ClientPropertiesCard ClientProperties={client.apartments || []} />
                <div className="col-span-2">
                </div>
            </div>
            <InterestTable ProjectDetails={client.interestedApartments || []} />
        </div>
    );
}
