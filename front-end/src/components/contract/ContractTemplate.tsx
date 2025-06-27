import React from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import TemplateCard from '../cards/card-with-icon/TemplateCard'
import { ContractTemplate } from '@/types/ContractTemplate'
import { Role, Status } from '@/types/user'
import AddTemplateModal from '../example/ModalExample/AddTemplateModal'

const templates: ContractTemplate[] = [
    {
        id: 1,
        name: 'Contrat de Réservation Standard',
        description: 'Template standard pour la réservation d\'appartements',
        isDefault: true,
        content: `CONTRAT DE VENTE EN L'ÉTAT FUTUR D'ACHÈVEMENT (VEFA)

Entre les soussignés :

La société {nom_entreprise}, 
ICE : {ice_entreprise}
Adresse : {adresse_entreprise}
Téléphone : {telephone_entreprise}
Email : {email_entreprise}

Ci-après dénommée "le Vendeur"

ET

M./Mme {nom_complet_client}
Nom : {nom_client}
Prénom : {prenom_client}
Email : {email_client}
Téléphone : {telephone_client}
Numéro d'identité : {numero_id_client}

Ci-après dénommé(e) "l'Acheteur"

IL A ÉTÉ CONVENU CE QUI SUIT :

Article 1 - OBJET DU CONTRAT

Le Vendeur vend et l'Acheteur achète en l'état futur d'achèvement, conformément aux dispositions du Dahir du 2 juin 1915, tel que modifié et complété, un lot dans le projet immobilier dénommé "{nom_project}" situé à l'adresse suivante : {adresse_project}.

Article 2 - DÉSIGNATION DU LOT

Le lot objet de la présente vente est désigné comme suit :
- Numéro du lot : {numero_lot}
- Surface totale : {surface_lot}
- Surface habitable : {surface_habitable}
- Surface balcon : {surface_balcon}
- Surface terrasse : {surface_terrasse}
- Surface piscine : {surface_piscine}
- Parking inclus : {parking_inclus}

Article 3 - PRIX ET MODALITÉS DE PAIEMENT

Le prix de vente est fixé à {prix_total} (prix au mètre carré : {prix_metre_carre}).

Modalités de paiement :
- Acompte à la signature : {montant_acompte} ({pourcentage_acompte} du prix total)
- Échéances : {echeances}
- Solde à la livraison

Article 4 - DATES IMPORTANTES

- Date de signature du contrat : {date_signature}
- Date d'échéance de l'acompte : {date_echeance}
- Année de construction : {annee_courante}

Article 5 - OBLIGATIONS DU VENDEUR

Le Vendeur s'engage à :
- Livrer le lot dans l'état d'achèvement conformément aux plans et spécifications
- Respecter les délais de livraison convenus
- Garantir la conformité aux normes en vigueur

Article 6 - OBLIGATIONS DE L'ACHETEUR

L'Acheteur s'engage à :
- Payer les sommes dues selon l'échéancier convenu
- Respecter les conditions d'occupation
- Ne pas modifier la destination du lot sans accord préalable

Article 7 - RÉSILIATION

En cas de défaut de paiement de deux échéances consécutives, le Vendeur pourra résilier le présent contrat de plein droit.

Article 8 - DROIT APPLICABLE

Le présent contrat est soumis au droit marocain. Tout litige sera soumis aux tribunaux compétents du lieu de situation de l'immeuble.

Fait à Casablanca, le {date_contrat}

Le Vendeur                                    L'Acheteur
{nom_entreprise}                              {nom_complet_client}

Signature : _________________                 Signature : _________________

Témoins :

1. _________________                          2. _________________
   Nom : _________________                       Nom : _________________
   Adresse : _________________                   Adresse : _________________

NOTES IMPORTANTES :
- Ce contrat est soumis aux dispositions légales en vigueur
- Toute modification doit faire l'objet d'un avenant signé par les deux parties
- Les annexes font partie intégrante du présent contrat
`,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedProjects: [
            {
                id: 1,
                name: 'Résidence Les Palmiers',
                address: 'Avenue Mohammed V, Casablanca',
                numberOfApartments: 120,
                totalSurface: 15000,
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
    }
]

export default function ContractTemplate() {
  return (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 ">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Templates</h1>
                <p className="text-sm text-gray-500">
                    Templates sont utilisés pour générer des contrats.
                </p>
            </div>
            <AddTemplateModal onTemplateAdded={() => {}} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
            {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
            ))}
        </div>
    </>
  )
}