import { PiBuildingOfficeDuotone, PiHammerDuotone } from "react-icons/pi";
import { RiVipDiamondLine } from "react-icons/ri";
import { SubscriptionPlan } from "../types/subscriptionPlan";

// Define plan features with proper differentiation
const artisanFeatures = [
  { name: "Gestion de base des projets", included: true },
  { name: "Suivi des clients", included: true },
  { name: "Gestion des paiements", included: true },
  { name: "Support par email", included: true },
  { name: "Tableau de bord exécutif", included: true },
  { name: "Support dédié 24/7", included: true },
  { name: "Formations personnalisées", included: true },
  { name: "API intégration", included: true },
  { name: "Rapports avancés", included: true }
];

const constructeurFeatures = [
  { name: "Gestion de base des projets", included: true },
  { name: "Suivi des clients", included: true },
  { name: "Gestion des paiements", included: true },
  { name: "Support par email", included: true },
  { name: "Tableau de bord exécutif", included: true },
  { name: "Support dédié 24/7", included: true },
  { name: "Formations personnalisées", included: true },
  { name: "API intégration", included: true },
  { name: "Rapports avancés", included: true }
];

const promoteurFeatures = [
  { name: "Gestion de base des projets", included: true },
  { name: "Suivi des clients", included: true },
  { name: "Gestion des paiements", included: true },
  { name: "Support par email", included: true },
  { name: "Tableau de bord exécutif", included: true },
  { name: "Support dédié 24/7", included: true },
  { name: "Formations personnalisées", included: true },
  { name: "API intégration", included: true },
  { name: "Rapports avancés", included: true }
];

// Plan configuration using the proper interface
export const subscriptionPlans: Record<string, SubscriptionPlan> = {
  artisan: {
    name: "Immo Essentiel",
    pricePerLot: 390,
    lotMin: 1,
    lotLimit: 200,
    features: artisanFeatures,
    icon: PiHammerDuotone,
    description: "Parfait pour les artisans et petites entreprises"
  },
  constructeur: {
    name: "Immo Premium",
    pricePerLot: 249,
    lotMin: 201,
    lotLimit: 500,
    features: constructeurFeatures,
    icon: PiBuildingOfficeDuotone,
    description: "Idéal pour les constructeurs moyens",
    popular: true
  },
  promoteur: {
    name: "Immo Pro",
    pricePerLot: 199,
    lotMin: 501,
    lotLimit: 1000,
    features: promoteurFeatures,
    icon: RiVipDiamondLine,
    description: "Pour les grands promoteurs immobiliers"
  }
};

// Type for plan keys
export type SubscriptionPlanKey = keyof typeof subscriptionPlans; 