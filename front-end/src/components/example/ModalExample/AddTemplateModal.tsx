"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import MultiSelect from "../../form/MultiSelect";
import { Textarea } from "@/components/ui/textarea";
import { Role, Status } from "@/types/user";
import { dynamicTags, tagCategories } from "@/data/dynamicTags"; // You need to create this or fetch from API
import { PlusIcon } from "lucide-react";
import Checkbox from "@/components/form/input/Checkbox";

interface AddTemplateModalProps {
  onTemplateAdded?: () => void; // Callback to refresh template list
}

export default function AddTemplateModal({ onTemplateAdded }: AddTemplateModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    content: string;
    isDefault: boolean;
    assignedProjects: string[];
    createdBy: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
      role: Role;
      status: Status;
    };
  }>({
    name: "",
    description: "",
    content: "",
    isDefault: false,
    assignedProjects: [],
    createdBy: {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@immo360.ma",
      phoneNumber: "+212661234567",
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    content: "",
    isDefault: false,
    assignedProjects: [],
    createdBy: {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@immo360.ma",
      phoneNumber: "+212661234567",
      role: Role.ADMIN,
      status: Status.ACTIVE,
    }
  });

  // Example state for tag filtering
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Example project options
  const projectOptions = [
    { value: "1", text: "Projet A", selected: false },
    { value: "2", text: "Projet B", selected: false },
  ];

  // Filter tags by category
  const filteredTags = selectedCategory === "all"
    ? dynamicTags
    : dynamicTags.filter((tag: { category: string }) => tag.category === selectedCategory);

  // Category color mapping
  const categoryColors: Record<string, string> = {
    company: 'bg-blue-100 text-blue-700',
    client: 'bg-green-100 text-green-700',
    project: 'bg-yellow-100 text-yellow-700',
    lot: 'bg-purple-100 text-purple-700',
    payment: 'bg-pink-100 text-pink-700',
    date: 'bg-orange-100 text-orange-700',
  };

  // Ref for textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Insert tag key at cursor position in content
  const handleInsertTag = (tagKey: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formData.content.slice(0, start);
    const after = formData.content.slice(end);
    const newValue = before + tagKey + after;
    setFormData((prev) => ({ ...prev, content: newValue }));
    // Set cursor after inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tagKey.length;
    }, 0);
  };

  // Update form field values
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSelectChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      assignedProjects: selectedValues,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleSave = async () => {
    // Validation
    try {
      closeModal();
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  return (
    <>
      <Button className='bg-brand-500 text-white hover:bg-brand-600 w-full sm:w-auto' onClick={openModal}>
        <PlusIcon className="w-4 h-4" />
        Ajouter un template
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-3xl p-5 lg:p-10"
      >
        <div className="max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 dark:[&::-webkit-scrollbar-track]:bg-gray-800 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
          <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-md sm:text-xl font-bold text-center mb-8 ">les information du template</h2>
            {/* Responsive grid for top fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label>Nom du template <span className="text-red-500">*</span></Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Saisir le nom du template"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Description <span className="text-red-500">*</span></Label>
                <Input
                  name="description"
                  type="text"
                  placeholder="Description du template"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Checkbox
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange}
                  label="Définir comme template par défaut"
                />    
              </div>
              <div className="md:col-span-2">
                <MultiSelect
                  label="Assigné à"
                  options={projectOptions}
                  defaultSelected={formData.assignedProjects}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Contenu du contrat <span className="text-red-500">*</span></Label>
                <Textarea
                  className="h-48"
                  name="content"
                  placeholder="Contenu du contrat avec balises dynamiques ..."
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
                  value={formData.content}
                  ref={textareaRef}
                />
              </div>
            </div>

            {/* Dynamic tags section */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full border font-semibold transition ${selectedCategory === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Toutes les balises
                </button>
                {tagCategories.map((cat: { value: string; label: string }) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`px-3 py-1 rounded-full border font-semibold transition ${categoryColors[cat.value] || "bg-gray-100 text-gray-600"} ${selectedCategory === cat.value ? "ring-2 ring-offset-2 ring-blue-400" : "hover:opacity-80"}`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {filteredTags.map((tag: { key: string; category: string; categoryLabel: string; label: string; description?: string; example?: string }) => (
                  <button
                    type="button"
                    key={tag.key}
                    className={`min-w-[250px] rounded-xl shadow p-4 flex flex-col gap-2 border-2 border-transparent transition hover:border-blue-400 active:scale-95 focus:outline-none ${categoryColors[tag.category] || "bg-gray-50 text-gray-700"}`}
                    onClick={() => handleInsertTag(tag.key)}
                    title="Insérer la balise dans le contenu"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="bg-white/80 border px-2 py-1 rounded text-xs font-mono text-gray-700">{tag.key}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColors[tag.category] || "bg-gray-100 text-gray-600"}`}>{tag.categoryLabel}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{tag.label}</div>
                      <div className="text-xs text-gray-700">{tag.description ?? ""}</div>
                      <div className="text-xs text-gray-500">Exemple: {tag.example ?? ""}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg">Créer le template</Button>
              <Button type="button" variant="outline" onClick={closeModal} className="px-8 py-2 rounded-lg">Annuler</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
