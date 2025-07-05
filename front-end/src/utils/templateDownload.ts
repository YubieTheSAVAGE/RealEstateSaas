import { ContractTemplate } from "@/types/ContractTemplate";
import { dynamicTags } from "@/data/dynamicTags";

// Interface for template data that will be used to replace tags
export interface TemplateData {
  // Company data
  company?: {
    name?: string;
    ice?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  // Client data
  client?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    idNumber?: string;
  };
  // Project data
  project?: {
    name?: string;
    address?: string;
  };
  // Lot data
  lot?: {
    number?: string;
    surface?: string;
    habitableSurface?: string;
    balconySurface?: string;
    terraceSurface?: string;
    poolSurface?: string;
    parkingIncluded?: boolean;
  };
  // Payment data
  payment?: {
    totalPrice?: string;
    pricePerSquareMeter?: string;
    depositAmount?: string;
    depositPercentage?: string;
    installments?: string;
  };
  // Date data
  dates?: {
    contractDate?: string;
    signatureDate?: string;
    currentYear?: string;
    dueDate?: string;
  };
}

// Create a map of tag keys to their examples from dynamicTags
const createTagExampleMap = () => {
  const exampleMap: Record<string, string> = {};
  
  dynamicTags.forEach(tag => {
    if (tag.example) {
      exampleMap[tag.key] = tag.example;
    }
  });
  
  return exampleMap;
};

const TAG_EXAMPLES = createTagExampleMap();

// Tag mapping for replacement using examples from dynamicTags
const TAG_MAPPING: Record<string, (data: TemplateData) => string> = {
  // Company tags
  "{nom_entreprise}": (data) => data.company?.name || TAG_EXAMPLES["{nom_entreprise}"] || "Doha",
  "{ice_entreprise}": (data) => data.company?.ice || TAG_EXAMPLES["{ice_entreprise}"] || "1234567890",
  "{adresse_entreprise}": (data) => data.company?.address || TAG_EXAMPLES["{adresse_entreprise}"] || "123 Avenue Mohammed V, Casablanca",
  "{telephone_entreprise}": (data) => data.company?.phone || TAG_EXAMPLES["{telephone_entreprise}"] || "1234567890",
  "{email_entreprise}": (data) => data.company?.email || TAG_EXAMPLES["{email_entreprise}"] || "contact@doha.ma",
  
  // Client tags
  "{nom_client}": (data) => data.client?.lastName || TAG_EXAMPLES["{nom_client}"] || "Doe",
  "{prenom_client}": (data) => data.client?.firstName || TAG_EXAMPLES["{prenom_client}"] || "John",
  "{nom_complet_client}": (data) => data.client?.fullName || TAG_EXAMPLES["{nom_complet_client}"] || "John Doe",
  "{email_client}": (data) => data.client?.email || TAG_EXAMPLES["{email_client}"] || "john.doe@example.com",
  "{telephone_client}": (data) => data.client?.phone || TAG_EXAMPLES["{telephone_client}"] || "1234567890",
  "{numero_id_client}": (data) => data.client?.idNumber || TAG_EXAMPLES["{numero_id_client}"] || "IM234567890",
  
  // Project tags
  "{nom_project}": (data) => data.project?.name || TAG_EXAMPLES["{nom_project}"] || "Projet 1",
  "{adresse_project}": (data) => data.project?.address || TAG_EXAMPLES["{adresse_project}"] || "123 Avenue Mohammed V, Casablanca",
  
  // Lot tags
  "{numero_lot}": (data) => data.lot?.number || TAG_EXAMPLES["{numero_lot}"] || "A-101",
  "{surface_lot}": (data) => data.lot?.surface || TAG_EXAMPLES["{surface_lot}"] || "100 m²",
  "{surface_habitable}": (data) => data.lot?.habitableSurface || TAG_EXAMPLES["{surface_habitable}"] || "100 m²",
  "{surface_balcon}": (data) => data.lot?.balconySurface || TAG_EXAMPLES["{surface_balcon}"] || "100 m²",
  "{surface_terrasse}": (data) => data.lot?.terraceSurface || TAG_EXAMPLES["{surface_terrasse}"] || "100 m²",
  "{surface_piscine}": (data) => data.lot?.poolSurface || TAG_EXAMPLES["{surface_piscine}"] || "100 m²",
  "{parking_inclus}": (data) => {
    if (data.lot?.parkingIncluded !== undefined) {
      return data.lot.parkingIncluded ? "oui" : "non";
    }
    return TAG_EXAMPLES["{parking_inclus}"] || "oui";
  },
  
  // Payment tags
  "{prix_total}": (data) => data.payment?.totalPrice || TAG_EXAMPLES["{prix_total}"] || "100000 MAD",
  "{prix_metre_carre}": (data) => data.payment?.pricePerSquareMeter || TAG_EXAMPLES["{prix_metre_carre}"] || "1000 MAD",
  "{montant_acompte}": (data) => data.payment?.depositAmount || TAG_EXAMPLES["{montant_acompte}"] || "10000 MAD",
  "{pourcentage_acompte}": (data) => data.payment?.depositPercentage || TAG_EXAMPLES["{pourcentage_acompte}"] || "10%",
  "{echeances}": (data) => data.payment?.installments || TAG_EXAMPLES["{echeances}"] || "10000 MAD",
  
  // Date tags
  "{date_contrat}": (data) => data.dates?.contractDate || TAG_EXAMPLES["{date_contrat}"] || "2025-01-01",
  "{date_signature}": (data) => data.dates?.signatureDate || TAG_EXAMPLES["{date_signature}"] || "2025-01-01",
  "{annee_courante}": (data) => data.dates?.currentYear || TAG_EXAMPLES["{annee_courante}"] || "2025",
  "{date_echeance}": (data) => data.dates?.dueDate || TAG_EXAMPLES["{date_echeance}"] || "2025-01-01",
};

/**
 * Replaces all dynamic tags in template content with actual values
 * @param content - The template content with tags
 * @param data - Optional data to use for replacement (uses examples from dynamicTags if not provided)
 * @returns The content with all tags replaced
 */
export function replaceTemplateTags(content: string, data: TemplateData = {}): string {
  if (!content || typeof content !== 'string') {
    console.warn('Template content is empty or invalid');
    return content || '';
  }

  let processedContent = content;

  // Replace all known tags
  Object.entries(TAG_MAPPING).forEach(([tag, valueFunction]) => {
    const regex = new RegExp(escapeRegExp(tag), 'g');
    processedContent = processedContent.replace(regex, valueFunction(data));
  });

  // Find any remaining unmatched tags and replace with placeholder
  const remainingTags = processedContent.match(/\{[^}]+\}/g);
  if (remainingTags && remainingTags.length > 0) {
    console.warn('Found unmatched tags:', remainingTags);
    processedContent = processedContent.replace(/\{[^}]+\}/g, '[VALEUR NON DÉFINIE]');
  }

  return processedContent;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generates a filename for the downloaded template
 * @param template - The template object
 * @param extension - File extension (default: 'docx')
 * @returns A sanitized filename
 */
export function generateTemplateFilename(template: ContractTemplate, extension: string = 'docx'): string {
  if (!template || !template.name) {
    return `template_${Date.now()}.${extension}`;
  }

  // Sanitize the filename
  const sanitizedName = template.name
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .trim();

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${sanitizedName}_${timestamp}.${extension}`;
}

/**
 * Creates a Blob for download with proper MIME type
 * @param content - The processed content
 * @param format - The desired format ('docx', 'pdf', 'txt')
 * @returns A Blob object ready for download
 */
export function createDownloadBlob(content: string, format: 'docx' | 'pdf' | 'txt' = 'docx'): Blob {
  const mimeTypes = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    txt: 'text/plain'
  };

  // For now, we'll create a simple text file
  // In a real implementation, you might want to use libraries like docx or jsPDF
  const mimeType = mimeTypes[format] || 'text/plain';
  
  // Add BOM for UTF-8 encoding
  const BOM = '\uFEFF';
  const contentWithBOM = BOM + content;
  
  return new Blob([contentWithBOM], { type: mimeType });
}

/**
 * Triggers the download of the template
 * @param template - The template to download
 * @param data - Optional data for tag replacement
 * @param format - The desired download format
 * @param filename - Optional custom filename
 */
export function downloadTemplate(
  template: ContractTemplate,
  data: TemplateData = {},
  format: 'docx' | 'pdf' | 'txt' = 'docx',
  filename?: string
): void {
  try {
    // Validate template
    if (!template || !template.content) {
      throw new Error('Template is invalid or has no content');
    }

    // Replace tags with actual values (using examples from dynamicTags as defaults)
    const processedContent = replaceTemplateTags(template.content, data);

    // Generate filename if not provided
    const downloadFilename = filename || generateTemplateFilename(template, format);

    // Create blob
    const blob = createDownloadBlob(processedContent, format);

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Template "${template.name}" downloaded successfully as ${downloadFilename}`);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
}

/**
 * Validates template data and returns any missing required fields
 * @param data - The template data to validate
 * @returns Array of missing field names
 */
export function validateTemplateData(data: TemplateData): string[] {
  const missingFields: string[] = [];

  // Add validation logic here if needed
  // For now, we use examples from dynamicTags for everything, so no validation is required
  
  return missingFields;
}

/**
 * Preview template content with tag replacement using examples from dynamicTags
 * @param template - The template to preview
 * @param data - Optional data for tag replacement
 * @returns The processed content for preview
 */
export function previewTemplate(template: ContractTemplate, data: TemplateData = {}): string {
  if (!template || !template.content) {
    return '';
  }

  return replaceTemplateTags(template.content, data);
}

/**
 * Get all available tags from the dynamic tags data
 * @returns Array of all available tag keys
 */
export function getAvailableTags(): string[] {
  return dynamicTags.map(tag => tag.key);
}

/**
 * Check if a template contains any dynamic tags
 * @param template - The template to check
 * @returns True if template contains dynamic tags
 */
export function hasDynamicTags(template: ContractTemplate): boolean {
  if (!template || !template.content) {
    return false;
  }

  const availableTags = getAvailableTags();
  return availableTags.some(tag => template.content.includes(tag));
}

/**
 * Extract all tags used in a template
 * @param template - The template to analyze
 * @returns Array of tag keys found in the template
 */
export function extractTemplateTags(template: ContractTemplate): string[] {
  if (!template || !template.content) {
    return [];
  }

  const availableTags = getAvailableTags();
  return availableTags.filter(tag => template.content.includes(tag));
}

/**
 * Get the example value for a specific tag
 * @param tagKey - The tag key to get the example for
 * @returns The example value or undefined if not found
 */
export function getTagExample(tagKey: string): string | undefined {
  return TAG_EXAMPLES[tagKey];
}

/**
 * Get all examples from dynamicTags as a data object
 * @returns TemplateData object with all examples
 */
export function getDefaultTemplateData(): TemplateData {
  return {
    company: {
      name: TAG_EXAMPLES["{nom_entreprise}"],
      ice: TAG_EXAMPLES["{ice_entreprise}"],
      address: TAG_EXAMPLES["{adresse_entreprise}"],
      phone: TAG_EXAMPLES["{telephone_entreprise}"],
      email: TAG_EXAMPLES["{email_entreprise}"]
    },
    client: {
      firstName: TAG_EXAMPLES["{prenom_client}"],
      lastName: TAG_EXAMPLES["{nom_client}"],
      fullName: TAG_EXAMPLES["{nom_complet_client}"],
      email: TAG_EXAMPLES["{email_client}"],
      phone: TAG_EXAMPLES["{telephone_client}"],
      idNumber: TAG_EXAMPLES["{numero_id_client}"]
    },
    project: {
      name: TAG_EXAMPLES["{nom_project}"],
      address: TAG_EXAMPLES["{adresse_project}"]
    },
    lot: {
      number: TAG_EXAMPLES["{numero_lot}"],
      surface: TAG_EXAMPLES["{surface_lot}"],
      habitableSurface: TAG_EXAMPLES["{surface_habitable}"],
      balconySurface: TAG_EXAMPLES["{surface_balcon}"],
      terraceSurface: TAG_EXAMPLES["{surface_terrasse}"],
      poolSurface: TAG_EXAMPLES["{surface_piscine}"],
      parkingIncluded: TAG_EXAMPLES["{parking_inclus}"] === "oui"
    },
    payment: {
      totalPrice: TAG_EXAMPLES["{prix_total}"],
      pricePerSquareMeter: TAG_EXAMPLES["{prix_metre_carre}"],
      depositAmount: TAG_EXAMPLES["{montant_acompte}"],
      depositPercentage: TAG_EXAMPLES["{pourcentage_acompte}"],
      installments: TAG_EXAMPLES["{echeances}"]
    },
    dates: {
      contractDate: TAG_EXAMPLES["{date_contrat}"],
      signatureDate: TAG_EXAMPLES["{date_signature}"],
      currentYear: TAG_EXAMPLES["{annee_courante}"],
      dueDate: TAG_EXAMPLES["{date_echeance}"]
    }
  };
} 