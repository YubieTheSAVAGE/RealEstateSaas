import React, { useState } from "react";
import { CheckLineIcon, CloseLineIcon } from "../../icons";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";
import { subscriptionPlans, SubscriptionPlanKey } from "../../data/subscriptionPlans";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlanKey | null;
}

function CheckoutModal({ isOpen, onClose, selectedPlan }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSubscribe = async () => {
    if (!selectedPlan || !email || !companyName) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Call your backend API to create subscription
      // 2. Redirect to payment gateway (Stripe, etc.)
      // 3. Handle success/error responses
      
      console.log(`Subscribing to ${selectedPlan} plan for ${email} from ${companyName}`);
      
      // For demo purposes, show success and close
      alert(`Abonnement ${subscriptionPlans[selectedPlan].name} activé avec succès!`);
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Erreur lors de l\'abonnement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) return null;

  const plan = subscriptionPlans[selectedPlan];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-6 lg:p-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
          Finaliser votre abonnement
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Plan {plan.name} - {plan.pricePerLot} MAD / lot / mois
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Nom de votre entreprise"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email professionnel <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="contact@entreprise.com"
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
          Récapitulatif de votre plan
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• {plan.name} - {plan.pricePerLot} MAD / lot / mois</li>
          <li>• Jusqu'à {plan.lotLimit} lots</li>
          <li>• {plan.features.filter(f => f.included).length} fonctionnalités incluses</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing || !email || !companyName}
          className="flex-1"
        >
          {isProcessing ? "Traitement..." : "S'abonner maintenant"}
        </Button>
      </div>
    </Modal>
  );
}

export default function SubsriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanKey | null>(null);
  const [activePlan, setActivePlan] = useState<SubscriptionPlanKey | null>('promoteur'); // Demo: set to 'constructeur' as active
  const checkoutModal = useModal();

  const handlePlanSelect = (plan: SubscriptionPlanKey) => {
    setSelectedPlan(plan);
    checkoutModal.openModal();
  };

  return (
    <>
      <div className="grid gap-5 gird-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {/* Artisan Plan */}
        <div className={`rounded-2xl border bg-white p-6 dark:bg-white/[0.03] xl:p-8 relative ${
          activePlan === 'artisan' 
            ? 'border-brand-500 dark:border-brand-500' 
            : 'border-gray-200 dark:border-gray-800'
        }`}>
          {activePlan === 'artisan' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                Plan actuel
              </span>
            </div>
          )}
          
          <div className="flex items-start justify-between -mb-4">
            <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {subscriptionPlans.artisan.name}
            </span>

            <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
              <subscriptionPlans.artisan.icon size={30} />
            </span>
          </div>

          <div className="flex items-end">
            <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
              {subscriptionPlans.artisan.pricePerLot} MAD
            </h2>

            <span className="inline-block mb-1 text-sm text-gray-500 dark:text-gray-400">
              / lot / mois
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Jusqu'à {subscriptionPlans.artisan.lotLimit} lots
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            À partir de {subscriptionPlans.artisan.lotMin} lot{subscriptionPlans.artisan.lotMin > 1 ? 's' : ''}
          </p>

          <div className="w-full h-px my-6 bg-gray-200 dark:bg-gray-800"></div>

          <ul className="mb-8 space-y-3">
            {subscriptionPlans.artisan.features.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 text-sm ${
                  item.included
                    ? "text-gray-700 dark:text-gray-400"
                    : "text-gray-400"
                }`}
              >
                {item.included ? (
                  <CheckLineIcon className="text-brand-500" />
                ) : (
                  <CloseLineIcon className="text-gray-400" />
                )}
                {item.name}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => handlePlanSelect('artisan')}
            disabled={activePlan === 'artisan'}
            className={`flex w-full items-center justify-center rounded-lg p-3.5 text-sm font-medium shadow-theme-xs transition-colors ${
              activePlan === 'artisan'
                ? 'bg-brand-500 text-white cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-brand-500 dark:bg-white/10'
            }`}
          >
            {activePlan === 'artisan' ? 'Plan actuel' : 'Choisir ce plan'}
          </button>
        </div>

        {/* Constructeur plan */}
        <div className={`rounded-2xl border-2 bg-white p-6 dark:bg-white/[0.03] xl:p-8 relative ${
          activePlan === 'constructeur' 
            ? 'border-brand-500 dark:border-brand-500' 
            : 'border-gray-200 dark:border-gray-800'
        }`}>
          {activePlan === 'constructeur' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                Plan actuel
              </span>
            </div>
          )}
          
          <div className="flex items-start justify-between -mb-4">
            <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {subscriptionPlans.constructeur.name}
            </span>

            <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
              <subscriptionPlans.constructeur.icon size={30} />
            </span>
          </div>

          <div className="flex items-end">
            <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
              {subscriptionPlans.constructeur.pricePerLot} MAD
            </h2>

            <span className="inline-block mb-1 text-sm text-gray-500 dark:text-gray-400">
              / Lot / mois
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Jusqu'à {subscriptionPlans.constructeur.lotLimit} lots 
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            À partir de {subscriptionPlans.constructeur.lotMin} lots
          </p>

          <div className="w-full h-px my-6 bg-white/20"></div>

          <ul className="mb-8 space-y-3">
            {subscriptionPlans.constructeur.features.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 text-sm ${
                  item.included
                    ? "text-gray-700 dark:text-gray-400"
                    : "text-gray-400"
                }`}
              >
                {item.included ? (
                  <CheckLineIcon className="text-brand-500" />
                ) : (
                  <CloseLineIcon className="text-gray-400" />
                )}
                {item.name}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => handlePlanSelect('constructeur')}
            disabled={activePlan === 'constructeur'}
            className={`flex w-full items-center justify-center rounded-lg p-3.5 text-sm font-medium shadow-theme-xs transition-colors ${
              activePlan === 'constructeur'
                ? 'bg-brand-500 text-white cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-brand-500 dark:bg-white/10'
            }`}
          >
            {activePlan === 'constructeur' ? 'Plan actuel' : 'Choisir ce plan'}
          </button>
        </div>

        {/* Promoteur plan */}
        <div className={`rounded-2xl border bg-white p-6 dark:bg-white/[0.03] xl:p-8 relative ${
          activePlan === 'promoteur' 
            ? 'border-brand-500 dark:border-brand-500' 
            : 'border-gray-200 dark:border-gray-800'
        }`}>
          {activePlan === 'promoteur' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                Plan actuel
              </span>
            </div>
          )}
          
          <div className="flex items-start justify-between -mb-4">
            <span className="block font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {subscriptionPlans.promoteur.name}
            </span>

            <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500">
              <subscriptionPlans.promoteur.icon size={30} />
            </span>
          </div>

          <div className="flex items-end">
            <h2 className="font-bold text-gray-800 text-title-md dark:text-white/90">
              {subscriptionPlans.promoteur.pricePerLot} MAD
            </h2>

            <span className="inline-block mb-1 text-sm text-gray-500 dark:text-gray-400">
              / Lot / mois
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Jusqu'à {subscriptionPlans.promoteur.lotLimit} lots (+1000 lots)
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            À partir de {subscriptionPlans.promoteur.lotMin} lots
          </p>

          <div className="w-full h-px my-6 bg-gray-200 dark:bg-gray-800"></div>

          <ul className="mb-8 space-y-3">
            {subscriptionPlans.promoteur.features.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 text-sm ${
                  item.included
                    ? "text-gray-700 dark:text-gray-400"
                    : "text-gray-400"
                }`}
              >
                {item.included ? (
                  <CheckLineIcon className="text-brand-500" />
                ) : (
                  <CloseLineIcon className="text-gray-400" />
                )}
                {item.name}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => handlePlanSelect('promoteur')}
            disabled={activePlan === 'promoteur'}
            className={`flex w-full items-center justify-center rounded-lg p-3.5 text-sm font-medium shadow-theme-xs transition-colors ${
              activePlan === 'promoteur'
                ? 'bg-brand-500 text-white cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-brand-500 dark:bg-white/10'
            }`}
          >
            {activePlan === 'promoteur' ? 'Plan actuel' : 'Choisir ce plan'}
          </button>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={checkoutModal.closeModal}
        selectedPlan={selectedPlan}
      />
    </>
  );
}
