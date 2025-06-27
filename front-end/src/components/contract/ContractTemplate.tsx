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