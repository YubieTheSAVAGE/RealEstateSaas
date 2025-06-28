"use client";
import React, { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";  
import Stepper from "../../ui/stepper/Stepper";
import { useModal } from "@/hooks/useModal";
import { AiOutlineFileDone, AiOutlineDownload, AiOutlineCalendar, AiOutlineFileText, AiOutlineCheckCircle, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import Select from "../../form/Select";
import {ContractTemplate} from "@/types/ContractTemplate";
import { Role, Status, User } from "@/types/user";
import { Payment } from "@/types/Payment";
import { Contract } from "@/types/Contract";
import { Property } from "@/types/property";
import { Client } from "@/types/client";
import { PaymentValidator, PaymentValidationResult } from "@/utils/paymentValidation";

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
            numberOfProperties: 120,
            totalSurface: 15000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            commissionPerM2: 1000,
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
            numberOfProperties: 85,
            totalSurface: 12000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            commissionPerM2: 1000,
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
            numberOfProperties: 65,
            totalSurface: 8000,
            latitude: 33.5779,
            longitude: -7.5911,
            folderFees: 10000,
            commissionPerM2: 1000,
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
}

export default function ReservationProcessModal({ property }: ReservationProcessModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [step, setStep] = useState(0);
  const [newMontant, setNewMontant] = useState(0);
  const [newDate, setNewDate] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(dummyTemplate[0]);
  const [echeances, setEcheances] = useState<Payment[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [showFirstPaymentSuggestion, setShowFirstPaymentSuggestion] = useState(false);

  // Enhanced first payment handler with validation
  const handleFirstPayment = () => {
    if (!property || !property.prixTotal || !newDate) {
      setValidationError("Please select a date for the first payment and ensure property has a valid price");
      return;
    }

    const recommendedAmount = PaymentValidator.calculateRecommendedFirstPayment(property.prixTotal);
    const validation = PaymentValidator.validateFirstPayment(recommendedAmount, property.prixTotal);

    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid first payment amount");
      return;
    }

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

    setEcheances([newEcheance]); // Replace existing payments with first payment
    setNewMontant(recommendedAmount);
    setValidationError("");
    setShowFirstPaymentSuggestion(false);
  };

  // Enhanced add payment handler with validation
  const handleAddEcheance = () => {
    if (!newMontant || !newDate || !property || !property.prixTotal) {
      setValidationError("Please fill in all required fields and ensure property has a valid price");
      return;
    }

    // Validate the new payment amount
    const validation = PaymentValidator.validateFirstPayment(newMontant, property.prixTotal);
    
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid payment amount");
      if (validation.suggestedAmount) {
        setShowFirstPaymentSuggestion(true);
      }
      return;
    }

    // Check if this is the first payment and validate accordingly
    if (echeances.length === 0) {
      const firstPaymentValidation = PaymentValidator.validateFirstPayment(newMontant, property.prixTotal);
      if (!firstPaymentValidation.isValid) {
        setValidationError(firstPaymentValidation.error || "First payment validation failed");
        if (firstPaymentValidation.suggestedAmount) {
          setShowFirstPaymentSuggestion(true);
        }
        return;
      }
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
    setShowFirstPaymentSuggestion(false);
  };

  // Generate default payment plan
  const handleGenerateDefaultPlan = () => {
    if (!property || !property.prixTotal) {
      setValidationError("Property price is required to generate payment plan");
      return;
    }
    
    try {
      const defaultPlan = PaymentValidator.generateDefaultPaymentPlan(property.prixTotal, 4);
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
      setShowFirstPaymentSuggestion(false);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Failed to generate payment plan");
    }
  };

  // Apply suggested first payment amount
  const handleApplySuggestion = () => {
    if (!property || !property.prixTotal) {
      setValidationError("Property price is required");
      return;
    }
    
    const suggestedAmount = PaymentValidator.calculateRecommendedFirstPayment(property.prixTotal);
    setNewMontant(suggestedAmount);
    setValidationError("");
    setShowFirstPaymentSuggestion(false);
  };

  // Remove échéance
  const handleRemoveEcheance = (id: number) => {
    setEcheances(echeances.filter(e => e.id !== id));
  };

  // Step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            {/* Payment Plan Generation Section */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Plan de paiement recommandé
              </h3>
              {property && property.prixTotal ? (
                <>
                  <p className="text-sm text-blue-700 mb-3">
                    Premier paiement: {PaymentValidator.calculateRecommendedFirstPayment(property.prixTotal).toLocaleString()} MAD 
                    ({((PaymentValidator.calculateRecommendedFirstPayment(property.prixTotal) / property.prixTotal) * 100).toFixed(1)}% du prix total)
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleGenerateDefaultPlan}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Générer le plan de paiement par défaut
                  </Button>
                </>
              ) : (
                <p className="text-sm text-red-700 mb-3">
                  Prix de la propriété non disponible
                </p>
              )}
            </div>

            {/* First Payment Quick Add */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Premier paiement (20% minimum)
              </h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Date du premier paiement <span className="text-red-500">*</span></Label>
                  <Input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={handleFirstPayment}
                  disabled={!newDate || !property || !property.prixTotal}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Ajouter le premier paiement
                </Button>
              </div>
            </div>

            {/* Manual Payment Addition */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Ajouter des paiements manuellement</h3>
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
                      setShowFirstPaymentSuggestion(false);
                    }}
                    min={property && property.prixTotal ? PaymentValidator.calculateRecommendedFirstPayment(property.prixTotal).toString() : "0"}
                    max={property && property.prixTotal ? property.prixTotal.toString() : "0"}
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{validationError}</p>
                  {showFirstPaymentSuggestion && (
                    <Button 
                      size="sm"   
                      onClick={handleApplySuggestion}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Appliquer la suggestion
                    </Button>
                  )}
                </div>
              )}

              {/* Payment Summary */}
              {echeances.length > 0 && property && property.prixTotal && (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Résumé des paiements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total des paiements:</span> {echeances.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} MAD
                    </div>
                    <div>
                      <span className="font-medium">Prix de la propriété:</span> {property.prixTotal.toLocaleString()} MAD
                    </div>
                    <div>
                      <span className="font-medium">Premier paiement:</span> {echeances[0]?.amount.toLocaleString()} MAD 
                        ({echeances[0] ? ((echeances[0].amount / property.prixTotal) * 100).toFixed(1) : 0}%)
                    </div>
                    <div>
                      <span className="font-medium">Reste à payer:</span> {(property.prixTotal - echeances.reduce((sum, e) => sum + e.amount, 0)).toLocaleString()} MAD
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="text-sm mb-4 w-full min-w-[600px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">N</th>
                    <th className="text-left py-2">Montant à payer</th>
                    <th className="text-left py-2">Date d'échéance</th>
                    <th className="text-left py-2">% du prix total</th>
                    <th className="text-left py-2">Statut</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {echeances.map((e, index) => (
                    <tr key={e.id} className="border-b border-gray-100">
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{e.amount.toLocaleString()} MAD</td>
                      <td className="py-2">{e.dueDate.toLocaleDateString()}</td>
                      <td className="py-2">
                        {property && property.prixTotal ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            index === 0 && (e.amount / property.prixTotal) * 100 >= 20
                              ? "bg-green-100 text-green-600"
                              : index === 0
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {((e.amount / property.prixTotal) * 100).toFixed(1)}%
                            {index === 0 && (e.amount / property.prixTotal) * 100 >= 20 && " ✓"}
                            {index === 0 && (e.amount / property.prixTotal) * 100 < 20 && " ✗"}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          e.status === "PAID" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-yellow-100 text-yellow-600"
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex gap-1">
                          <button 
                            className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                            onClick={() => handleRemoveEcheance(e.id)}
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
              <div className="text-center py-8 text-gray-500">
                <AiOutlineCalendar className="text-4xl mx-auto mb-2 text-gray-300" />
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
                className="dark:bg-dark-900"
              />
              
              {selectedTemplate && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
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
                      <div className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded border max-h-32 overflow-y-auto">
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
            <div className="mb-6 font-medium text-center">
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
      <AiOutlineFileDone 
        className="text-green-500 text-lg hover:text-green-600 cursor-pointer transition-colors" 
        onClick={openModal} 
      />
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-5 lg:p-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Processus de réservation</h1>
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
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {step < 2 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
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
              <Button 
                size="sm" 
                onClick={() => setStep(step + 1)}
                className="min-w-[100px]"
              >
                {step === steps.length - 2 ? "Générer" : "Suivant"}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
