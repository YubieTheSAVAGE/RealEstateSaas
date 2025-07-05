import React from "react";
import { subscriptionPlans, SubscriptionPlanKey } from "../../../data/subscriptionPlans";

interface CurrentPlanCardProps {
  plan: SubscriptionPlanKey;
  planName?: string;
  price?: number;
  lotsUsed: number;
  lotsLimit?: number;
  nextBillingDate?: string; // Format: "2024-01-15" or "15 janvier 2024"
}

export default function CurrentPlanCard({
  plan,
  planName,
  price,
  lotsUsed,
  lotsLimit,
  nextBillingDate,
}: CurrentPlanCardProps) {
  const planData = subscriptionPlans[plan];
  const finalPlanName = planName || planData.name;
  const finalPrice = price || planData.pricePerLot;
  const finalLotsLimit = lotsLimit || planData.lotLimit;
  
  const percent = Math.round((lotsUsed / finalLotsLimit) * 100);
  const monthlyCost = finalPrice * finalLotsLimit;

  // Format next billing date
  const formatBillingDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formattedBillingDate = formatBillingDate(nextBillingDate);

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-100 rounded-full p-2">
          <planData.icon size={32} className="text-brand-500" />
        </div>
        <div>
          <div className="font-semibold text-lg text-blue-900">{finalPlanName}</div>
          <div className="text-sm text-blue-700">{finalPrice} DH par lot • Jusqu'à {finalLotsLimit} lots</div>
        </div>
      </div>
      
      {/* Usage Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold text-blue-900">
          {lotsUsed}/{finalLotsLimit}
        </div>
        <div className="text-xs text-blue-700">lots utilisés</div>
        <div className="text-xs text-blue-700">{percent}%</div>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Billing Information */}
      <div className="border-t border-blue-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-xs text-blue-600 font-medium mb-1">Coût mensuel</div>
            <div className="text-lg font-bold text-blue-900">
              {monthlyCost.toLocaleString('fr-FR')} DH
            </div>
            <div className="text-xs text-blue-600">
              {finalLotsLimit} lots × {finalPrice} DH
            </div>
          </div>
          
          {formattedBillingDate && (
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-1">Prochaine facturation</div>
              <div className="text-lg font-bold text-blue-900">
                {formattedBillingDate}
              </div>
              <div className="text-xs text-blue-600">
                Facturation automatique
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}