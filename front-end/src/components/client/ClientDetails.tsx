"use client";
import React, { useCallback } from "react";
import { Client } from "@/types/client"
import { useRouter } from "next/navigation";
import getClientById from "./getClientById";
import ClientCard from "../cards/card-with-icon/ClientCard";
import ClientPaymentCard from "../cards/card-with-icon/ClientPaymentCard";
import ClientPropertiesCard from "../cards/card-with-icon/ClientPropertiesCard";
import ClientStatusCard from "../cards/card-with-icon/ClientStatusCard";
import InterestTable from "../ecommerce/InterestTable";
import { FallingLines } from "react-loader-spinner";
import { dummyClient } from "./ClientInterface/dummyClient";

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
        return <div className="flex mt-24 w-full items-center justify-center py-4">
                        <FallingLines
                            height="80"
                            width="80"
                            color="#4460FF"
                            visible={client === null}
                        />
                    </div>;
    }
    console.log("Client details:", client.apartments);
    return (
        <div className="space-y-6">
            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2 xl:grid-cols-4">
                <div className="lg:col-span-2">
                    <ClientCard client={dummyClient} onRefresh={fetchClient} />
                </div>
                <ClientPaymentCard client={dummyClient} />
                <ClientStatusCard client={dummyClient} />
            </div>

            {/* Properties Card - Full Width */}
            <div className="mb-8">
                <ClientPropertiesCard ClientProperties={dummyClient.apartments || []} />
            </div>

            {/* Interest Table - Full Width */}
            <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Propriétés d'intérêt
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Propriétés que le client a marquées comme intéressantes
                    </p>
                </div>
                <div className="p-6">
                    <InterestTable ProjectDetails={dummyClient.interestedApartments || []} />
                </div>
            </div>
        </div>
    );
}
