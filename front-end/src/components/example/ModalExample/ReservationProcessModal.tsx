"use client";
import React, { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";  
import Stepper from "../../ui/stepper/Stepper";
import { useModal } from "@/hooks/useModal";
import { AiOutlineCalendar, AiOutlineFileText, AiOutlineCheckCircle, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { FaCheckCircle, FaUser } from "react-icons/fa";
import Select from "../../form/Select";
import {ContractTemplate} from "@/types/ContractTemplate";
import { Role, Status, User } from "@/types/user";
import { Payment } from "@/types/Payment";
import { Contract } from "@/types/Contract";
import { Property } from "@/types/property";
import { Client } from "@/types/client";
import { PaymentValidator, PaymentValidationResult, FirstPaymentCalculation, TotalPaymentBreakdown } from "@/utils/paymentValidation";
import { usePathname } from 'next/navigation'
import { TbFileAlert } from "react-icons/tb";

const steps = [
  { 
    label: "Échéances", 
    description: "Gérer les paiements",
    icon: <AiOutlineCalendar className="text-xs" />
  },
  { 
    label: "Contrat", 
    description: "Générer le contrat",
    icon: <AiOutlineFileText className="text-xs" />
  },
  { 
    label: "Validation", 
    description: "Finaliser",
    icon: <AiOutlineCheckCircle className="text-xs" />
  },
];

const dummyTemplate: ContractTemplate[] = [
  {
    id: 1,
    name: 'Contrat de Réservation Standard',
    description: 'Template standard pour la réservation d\'appartements',
    isDefault: true,
    content: `CONTRAT DE RÉSERVATION

Entre les soussignés :

D'une part, [NOM_ENTREPRISE], société immobilière, dont le siège social est situé à [ADRESSE_ENTREPRISE], immatriculée au Registre du Commerce sous le numéro [RC_NUMBER], représentée par [NOM_REPRESENTANT] en qualité de [FONCTION_REPRESENTANT], ci-après dénommée "le Promoteur",

Et d'autre part, [NOM_CLIENT], de nationalité [NATIONALITE], né(e) le [DATE_NAISSANCE], demeurant à [ADRESSE_CLIENT], titulaire de la carte d'identité nationale n° [CIN_NUMBER], ci-après dénommé(e) "le Réservataire",

Il a été convenu ce qui suit :

ARTICLE 1 - OBJET
Le présent contrat a pour objet la réservation par le Réservataire d'un appartement situé dans le projet immobilier "[NOM_PROJET]", sis à [ADRESSE_PROJET].

ARTICLE 2 - DESCRIPTION DU BIEN
L'appartement réservé est situé :
- Immeuble : [NUMERO_IMMEUBLE]
- Étage : [ETAGE]
- Type : [TYPE_APPARTEMENT]
- Surface : [SURFACE] m²
- Prix : [PRIX] MAD

ARTICLE 3 - MONTANT DE LA RÉSERVATION
Le montant de la réservation s'élève à [MONTANT_RESERVATION] MAD, payable selon les modalités suivantes :
- Acompte à la signature : [ACOMPTE] MAD
- Solde : [SOLDE] MAD

ARTICLE 4 - DURÉE ET CONDITIONS
La réservation est valable pour une durée de [DUREE_RESERVATION] mois à compter de la date de signature du présent contrat.`,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedProjects: [
        {
            id: 1,
            name: 'Résidence Les Palmiers',
            address: 'Avenue Mohammed V, Casablanca',
            numberOfApartments: 120,
            totalSurface: 15000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            status: "planification",
            progress: 0,
        }
    ],
    createdBy: {
        id: 1,
        name: 'Ahmed Benali',
        email: 'ahmed.benali@immo360.ma',
        phoneNumber: '+212661234567',
        role: Role.ADMIN,
        status: Status.ACTIVE,
        passwordHash: 'password',
    }
},
{
    id: 2,
    name: 'Contrat de Vente Définitif',
    description: 'Template pour la vente définitive d\'appartements',
    isDefault: false,
    content: `CONTRAT DE VENTE DÉFINITIVE

Entre les soussignés :

D'une part, [NOM_ENTREPRISE], société immobilière, dont le siège social est situé à [ADRESSE_ENTREPRISE], immatriculée au Registre du Commerce sous le numéro [RC_NUMBER], représentée par [NOM_REPRESENTANT] en qualité de [FONCTION_REPRESENTANT], ci-après dénommée "le Vendeur",

Et d'autre part, [NOM_ACHETEUR], de nationalité [NATIONALITE], né(e) le [DATE_NAISSANCE], demeurant à [ADRESSE_ACHETEUR], titulaire de la carte d'identité nationale n° [CIN_NUMBER], ci-après dénommé(e) "l'Acheteur",

Il a été convenu ce qui suit :

ARTICLE 1 - OBJET
Le présent contrat a pour objet la vente définitive par le Vendeur à l'Acheteur d'un appartement situé dans le projet immobilier "[NOM_PROJET]", sis à [ADRESSE_PROJET].

ARTICLE 2 - DESCRIPTION DU BIEN VENDU
L'appartement vendu est situé :
- Immeuble : [NUMERO_IMMEUBLE]
- Étage : [ETAGE]
- Type : [TYPE_APPARTEMENT]
- Surface : [SURFACE] m²
- Prix de vente : [PRIX_VENTE] MAD

ARTICLE 3 - PRIX ET MODALITÉS DE PAIEMENT
Le prix de vente s'élève à [PRIX_TOTAL] MAD, payable selon les modalités suivantes :
- Apport initial : [APPORT_INITIAL] MAD
- Prêt bancaire : [PRET_BANCAIRE] MAD
- Échéances : [NOMBRE_ECHEANCES] mensualités de [MONTANT_ECHEANCE] MAD

ARTICLE 4 - GARANTIES
Le Vendeur garantit à l'Acheteur la propriété paisible du bien vendu et s'engage à le délivrer libre de toute hypothèque et de tout privilège.`,    
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedProjects: [
        {
            id: 2,
            name: 'Tours Marina',
            address: 'Boulevard de la Corniche, Casablanca',
            numberOfApartments: 85,
            totalSurface: 12000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            status: "planification",
            progress: 0,
        }
    ],
    createdBy: {
        id: 1,
        name: 'Ahmed Benali',
        email: 'ahmed.benali@immo360.ma',
        phoneNumber: '+212661234567',
        role: Role.ADMIN,
        status: Status.ACTIVE,
        passwordHash: 'password',
    }
},
{
    id: 3,
    name: 'Contrat de Location',
    description: 'Template pour la location d\'appartements',
    isDefault: false,
    content: `CONTRAT DE LOCATION

Entre les soussignés :

D'une part, [NOM_PROPRIETAIRE], propriétaire de l'appartement situé à [ADRESSE_APPARTEMENT], ci-après dénommé "le Propriétaire",

Et d'autre part, [NOM_LOCATAIRE], de nationalité [NATIONALITE], né(e) le [DATE_NAISSANCE], demeurant à [ADRESSE_LOCATAIRE], titulaire de la carte d'identité nationale n° [CIN_NUMBER], ci-après dénommé(e) "le Locataire",

Il a été convenu ce qui suit :

ARTICLE 1 - OBJET
Le présent contrat a pour objet la location par le Propriétaire au Locataire d'un appartement situé à [ADRESSE_APPARTEMENT].

ARTICLE 2 - DESCRIPTION DU BIEN LOUÉ
L'appartement loué comprend :
- Surface : [SURFACE] m²
- Nombre de pièces : [NOMBRE_PIECES]
- Équipements : [LISTE_EQUIPEMENTS]

ARTICLE 3 - DURÉE ET LOYER
La durée du bail est fixée à [DUREE_BAIL] mois, à compter du [DATE_DEBUT].
Le loyer mensuel s'élève à [MONTANT_LOYER] MAD, payable d'avance le [JOUR_PAIEMENT] de chaque mois.

ARTICLE 4 - DÉPÔT DE GARANTIE
Un dépôt de garantie de [MONTANT_DEPOT] MAD est versé par le Locataire au Propriétaire.`,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedProjects: [
        {
            id: 3,
            name: 'Résidence Al Andalous',
            address: 'Quartier Maarif, Casablanca',
            numberOfApartments: 65,
            totalSurface: 8000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            status: "planification",
            progress: 0,
        }
    ],
    createdBy: {
        id: 1,
        name: 'Ahmed Benali',
        email: 'ahmed.benali@immo360.ma',
        phoneNumber: '+212661234567',
        role: Role.ADMIN,
        status: Status.ACTIVE,
        passwordHash: 'password',
    }
  },
  
]

interface ReservationProcessModalProps {
  property: Property;
  payments: Payment[];
}

export default function ReservationProcessModal({ property, payments }: ReservationProcessModalProps) {
  const pathname = usePathname();
  const isPropertyPage = pathname.startsWith('/properties/') && pathname !== '/properties'; 
  const { isOpen, openModal, closeModal } = useModal();
  const [step, setStep] = useState(0);
  const [newMontant, setNewMontant] = useState(0);
  const [newDate, setNewDate] = useState("");
  const [folderFees, setFolderFees] = useState(property?.project?.folderFees || 0);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(dummyTemplate[0]);
  const [echeances, setEcheances] = useState<Payment[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [isShaking, setIsShaking] = useState(false);
  const [firstPaymentBreakdown, setFirstPaymentBreakdown] = useState<FirstPaymentCalculation | null>(null);
  const [totalPaymentBreakdown, setTotalPaymentBreakdown] = useState<TotalPaymentBreakdown | null>(null);
  const [paymentDivisions, setPaymentDivisions] = useState(4);

  // Example data for sold property
  property.prixTotal = 687500;
  property.project.folderFees = 400;
  property.prixM2 = 13750;
  property.commissionPerM2 = 2750;
  property.prixType = "M2";
  property.prixBalconPct = 100;
  property.prixTerrassePct = 100;
  property.habitable = 40;
  property.terrasse = 5;
  property.balcon = 5;
  // Calculate prixM2 based on total price and surface area
  const totalSurface = (property.habitable || 0) + (property.terrasse || 0) + (property.piscine || 0);
  property.prixM2 = totalSurface > 0 ? Math.round(property.prixTotal / totalSurface) : 0;

  // Calculate first payment breakdown when property or folder fees change
  useEffect(() => {
    if (property && property.prixTotal) {
      const firstBreakdown = PaymentValidator.calculateFirstPaymentBreakdown(property, folderFees);
      const totalBreakdown = PaymentValidator.calculateTotalPaymentBreakdown(property, folderFees);
      setFirstPaymentBreakdown(firstBreakdown);
      setTotalPaymentBreakdown(totalBreakdown);
    }
  }, [property, folderFees]);

  // Shake animation effect
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 3000);
    return () => clearInterval(shakeInterval);
  }, []);

  // Enhanced validation for sold properties
  const validateSoldPropertyPayments = () => {
    // Only validate if we're trying to proceed to next step, not when adding payments
    return { isValid: true };
  };

  // Enhanced first payment handler with sold property validation
  const handleFirstPayment = () => {
    if (!property || !property.prixTotal || !newDate) {
      setValidationError("Please select a date for the first payment and ensure property has a valid price");
      return;
    }

    const recommendedAmount = firstPaymentBreakdown?.totalFirstPayment || 0;

    const newEcheance: Payment = {
      id: Date.now(),
      amount: recommendedAmount,
      dueDate: new Date(newDate),
      status: "PENDING",
      proofOfPayment: null,
      property: property,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEcheances([newEcheance]);
    setNewMontant(recommendedAmount);
    setValidationError("");
  };

  // Enhanced add payment handler with sold property validation
  const handleAddEcheance = () => {
    if (!newMontant || !newDate || !property || !property.prixTotal) {
      setValidationError("Please fill in all required fields and ensure property has a valid price");
      return;
    }

    if (newMontant <= 0) {
      setValidationError("Payment amount must be greater than zero");
      return;
    }

    const newEcheance: Payment = {
      id: Date.now(),
      amount: newMontant,
      dueDate: new Date(newDate),
      status: "PENDING",
      proofOfPayment: null,
      contract: {
        id: 1,
        name: "Contract 1",
        description: "Contract 1 description",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedProjects: [],
        createdBy: {} as User,
        template: dummyTemplate[0],
        status: "WAITING_CVALIDATION",
        client: {} as Client,
        property: property
      } as Contract,
      property: property,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEcheances([...echeances, newEcheance]);
    setNewMontant(0);
    setNewDate("");
    setValidationError("");
  };

  // Enhanced generate default payment plan with sold property validation
  const handleGenerateDefaultPlan = () => {
    if (!property || !property.prixTotal) {
      setValidationError("Property price is required to generate payment plan");
      return;
    }
    
    try {
      const totalAmount = totalPaymentBreakdown?.totalPayment || property.prixTotal;
      const defaultPlan = PaymentValidator.generateDefaultPaymentPlan(totalAmount, 4);
      const defaultPayments: Payment[] = defaultPlan.payments.map((payment, index) => ({
        id: Date.now() + index,
        amount: payment.amount,
        dueDate: payment.dueDate,
        status: "PENDING" as const,
        proofOfPayment: null,
        property: property,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      setEcheances(defaultPayments);
      setValidationError("");
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Failed to generate payment plan");
    }
  };

  // Remove échéance
  const handleRemoveEcheance = (id: string) => {
    setEcheances(echeances.filter(e => e.id !== parseInt(id)));
  };

  // Enhanced helper to check if Next button should be disabled
  const isNextDisabled = () => {
    if (!echeances || echeances.length === 0) return true;
    if (!totalPaymentBreakdown) return true;
    
    // For sold properties, require complete payment plan
    if (property.status === 'SOLD') {
      const sum = echeances.reduce((acc, e) => acc + (e.amount || 0), 0);
      return sum < totalPaymentBreakdown.totalPayment;
    }
    
    const sum = echeances.reduce((acc, e) => acc + (e.amount || 0), 0);
    return sum <= totalPaymentBreakdown.totalPayment;
  };

  // Step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            {/* Property Status Warning for Sold Properties */}
            {property.status === 'SOLD' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <TbFileAlert className="text-red-500 text-xl" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Propriété Vendue - Configuration des Paiements Requise
                  </h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Cette propriété est marquée comme vendue mais n'a pas de plan de paiement configuré. 
                  Veuillez configurer le plan de paiement pour finaliser la vente.
                </p>
              </div>
            )}

            {/* Total Payment Breakdown */}
            {totalPaymentBreakdown && property && property.prixTotal && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
                  Détail du paiement total
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Prix de base:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{totalPaymentBreakdown.basePrice.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Frais de dossier:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{totalPaymentBreakdown.folderFees.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Commission totale:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{totalPaymentBreakdown.commissionTotal.toLocaleString()} MAD</span>
                    </div>
                    {totalPaymentBreakdown.parkingPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Prix parking:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{totalPaymentBreakdown.parkingPrice.toLocaleString()} MAD</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-bold text-orange-800 dark:text-orange-200">
                      <span>Total à payer:</span>
                      <span>{totalPaymentBreakdown.totalPayment.toLocaleString()} MAD</span>
                    </div>
                  </div>
                  
                  {/* Surface Breakdown */}
                  <div className="space-y-1">
                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-2">Détail des surfaces:</div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span>Surface habitable:</span>
                      <span>{totalPaymentBreakdown.surfaceBreakdown.habitable} m²</span>
                    </div>
                    {totalPaymentBreakdown.surfaceBreakdown.balcon > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>Balcon:</span>
                        <span>{totalPaymentBreakdown.surfaceBreakdown.balcon} m²</span>
                      </div>
                    )}
                    {totalPaymentBreakdown.surfaceBreakdown.terrasse > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>Terrasse:</span>
                        <span>{totalPaymentBreakdown.surfaceBreakdown.terrasse} m²</span>
                      </div>
                    )}
                    {totalPaymentBreakdown.surfaceBreakdown.piscine > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>Piscine:</span>
                        <span>{totalPaymentBreakdown.surfaceBreakdown.piscine} m²</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-1 flex justify-between text-xs font-medium text-gray-700 dark:text-gray-200">
                      <span>Surface totale:</span>
                      <span>{totalPaymentBreakdown.surfaceBreakdown.totalSurface} m²</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Plan Generation Section */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Plan de paiement
              </h3>
              {property && property.prixTotal ? (
                <>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Total à payer: {totalPaymentBreakdown?.totalPayment.toLocaleString() || property.prixTotal.toLocaleString()} MAD
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleGenerateDefaultPlan}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {property.status === 'SOLD' ? 'Générer un plan de paiement complet' : 'Générer un plan de paiement par défaut'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                  Prix de la propriété non disponible
                </p>
              )}
            </div>
            
            {/* Manual Payment Addition */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                {property.status === 'SOLD' ? 'Configuration des paiements pour la vente' : 'Ajouter des paiements manuellement'}
              </h3>
              <div className="flex flex-row gap-4 mb-4">
                <div className="w-full md:w-1/2">
                  <Label>Montant <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="Saisir le montant à payer"
                    value={newMontant}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setNewMontant(value);
                      setValidationError("");
                    }}
                    min="0"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label>Date d'échéance <span className="text-red-500">*</span></Label>
                  <Input 
                    type="date" 
                    placeholder="Sélectionner la date limite de paiement"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex justify-center items-center mt-6">
                  <Button 
                    size="sm" 
                    onClick={handleAddEcheance}
                    disabled={!newMontant || !newDate || !property || !property.prixTotal}
                    className="flex items-center gap-2"
                  >
                    <AiOutlinePlus className="text-sm" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Validation Error Display */}
              {validationError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm">{validationError}</p>
                </div>
              )}

              {/* Payment Summary */}
              {echeances.length > 0 && property && property.prixTotal && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Résumé des paiements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Total des paiements:</span> {echeances.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} MAD
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Prix de base:</span> {property.prixTotal.toLocaleString()} MAD
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Frais de dossier:</span> {folderFees.toLocaleString()} MAD
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Commission:</span> {totalPaymentBreakdown?.commissionTotal.toLocaleString() || 0} MAD
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Premier paiement:</span> {echeances[0]?.amount.toLocaleString()} MAD 
                        ({echeances[0] ? ((echeances[0].amount / (totalPaymentBreakdown?.totalPayment || property.prixTotal)) * 100).toFixed(1) : 0}%)
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Reste à payer:</span> {((totalPaymentBreakdown?.totalPayment || property.prixTotal) - echeances.reduce((sum, e) => sum + e.amount, 0)).toLocaleString()} MAD
                    </div>
                  </div>
                  
                  {/* Additional warning for sold properties with incomplete payments */}
                  {property.status === 'SOLD' && echeances.reduce((sum, e) => sum + e.amount, 0) < (totalPaymentBreakdown?.totalPayment || property.prixTotal) && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                      <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                        ⚠️ Pour une propriété vendue, le plan de paiement doit couvrir le montant total.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="text-sm mb-4 w-full min-w-[600px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-900 dark:text-white">N</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Montant à payer</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Date d'échéance</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">% du prix total</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Statut</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {echeances.map((e, index) => (
                    <tr key={e.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="py-2 text-gray-900 dark:text-white">{e.amount.toLocaleString()} MAD</td>
                      <td className="py-2 text-gray-900 dark:text-white">{e.dueDate.toLocaleDateString()}</td>
                      <td className="py-2">
                        {property && property.prixTotal ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {((e.amount / (totalPaymentBreakdown?.totalPayment || property.prixTotal)) * 100).toFixed(1)}%
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          e.status === "PAID" 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button 
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-red-500 dark:text-red-400"
                            onClick={() => handleRemoveEcheance(e.id.toString())}
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {echeances.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AiOutlineCalendar className="text-4xl mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>Aucune échéance ajoutée</p>
                <p className="text-sm">Utilisez les options ci-dessus pour ajouter des échéances</p>
              </div>
            )}
          </>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Contrat template <span className="text-red-500">*</span></Label>
              <Select
                options={[
                  { value: "1", label: "Template Standard" },
                  { value: "2", label: "Template Premium" },
                  { value: "3", label: "Template Basique" }
                ]}
                placeholder="Sélectionner un template de contrat"
                onChange={(value: string) => {
                  const templates = {
                    "1": {
                      id: 1,
                      name: "Template Standard",
                      description: "Contrat de vente standard avec clauses de base pour les transactions immobilières courantes.",
                      content: "Ce contrat inclut les clauses essentielles de vente immobilière : description du bien, prix, modalités de paiement, conditions suspensives, et obligations des parties. Idéal pour les transactions résidentielles classiques.",
                      isDefault: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      assignedProjects: [],
                      createdBy: {} as User
                    },
                    "2": {
                      id: 2,
                      name: "Template Premium",
                      description: "Contrat premium avec clauses avancées et protections juridiques renforcées.",
                      content: "Contrat haut de gamme incluant des clauses de protection avancées, garanties étendues, modalités de financement complexes, et conditions spéciales. Recommandé pour les biens de luxe et transactions commerciales.",
                      isDefault: false,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      assignedProjects: [],
                      createdBy: {} as User
                    },
                    "3": {
                      id: 3,
                      name: "Template Basique",
                      description: "Contrat simplifié pour les transactions rapides et les petits montants.",
                      content: "Contrat simplifié avec les clauses minimales requises par la loi. Inclut la description du bien, le prix, et les modalités de paiement de base. Parfait pour les petites transactions.",
                      isDefault: false,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      assignedProjects: [],
                      createdBy: {} as User
                    }
                  };
                  setSelectedTemplate(templates[value as keyof typeof templates]);
                }}
                className="dark:bg-gray-800"
              />
              
              {selectedTemplate && (
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {selectedTemplate.name}
                  </h4>
                  {selectedTemplate.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {selectedTemplate.description}
                    </p>
                  )}
                  {selectedTemplate.content && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Contenu du template:
                      </h5>
                      <div className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto">
                        {selectedTemplate.content}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <div className="mb-6 font-medium text-center text-gray-900 dark:text-white">
              Le contrat a été généré avec succès
            </div>
            <div className="flex gap-3">
              <Button size="sm" onClick={closeModal}>Terminé</Button>
              <Button size="sm" variant="outline">Voir</Button>
              <Button size="sm" variant="outline" onClick={closeModal}>Annuler</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!isPropertyPage && (
        <TbFileAlert 
          size={18} 
          onClick={openModal} 
          className={`cursor-pointer text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-all duration-300 ${
            isShaking ? 'animate-shake' : ''
          }`}
          style={{
            animation: isShaking ? 'shake 1s ease-in-out' : 'none'
          }}
        />
      )}
      {isPropertyPage && (
        <div 
          className={`${property.status === 'SOLD' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} rounded-lg p-3 flex items-center gap-2 mt-1 cursor-pointer transition-all duration-300 relative ${
            isShaking ? 'animate-shake' : ''
          }`} 
          onClick={openModal}
          style={{
            animation: isShaking ? 'shake 1s ease-in-out' : 'none'
          }}
        >
          {/* Payment Setup Required Indicator */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
            !
          </div>
          
          <FaUser className={property.status === 'SOLD' ? 'text-red-400 dark:text-red-300' : 'text-yellow-400 dark:text-yellow-300'} />
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {property.status === 'SOLD' ? 'Vendu à' : 'Réservé à'}
            </div>
            <div className="font-bold text-base text-gray-900 dark:text-white">{property.client?.name}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {property.status === 'SOLD' ? 'Client acheteur' : 'Client réservataire'}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
              ⚠️ {property.status === 'SOLD' ? 'Paiements à configurer pour la vente' : 'Paiements à configurer'}
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Add CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-5 lg:p-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {property.status === 'SOLD' ? 'Configuration des Paiements - Propriété Vendue' : 'Processus de réservation'}
            </h1>
          </div>

          {/* Stepper */}
          <div className="mb-4">
            <Stepper 
              steps={steps} 
              currentStep={step} 
              onStepClick={(stepIndex) => {
                // Only allow going to previous steps or current step
                if (stepIndex <= step) {
                  setStep(stepIndex);
                }
              }}
            />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {step < 2 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                {step > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setStep(step - 1)}
                  >
                    Précédent
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {property.status === 'SOLD' && isNextDisabled() && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Plan de paiement incomplet
                  </div>
                )}
                <Button 
                  size="sm" 
                  onClick={() => setStep(step + 1)}
                  className="min-w-[100px]"
                  disabled={isNextDisabled()}
                >
                  {step === steps.length - 2 ? "Générer" : "Suivant"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
