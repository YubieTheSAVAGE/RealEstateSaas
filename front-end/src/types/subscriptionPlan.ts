export interface SubscriptionPlan {
    name: string;
    pricePerLot: number;
    lotMin: number;
    lotLimit: number;
    features: Array<{name: string, included: boolean}>;
    icon: React.ComponentType<any>;
    description: string;
    popular?: boolean;
}