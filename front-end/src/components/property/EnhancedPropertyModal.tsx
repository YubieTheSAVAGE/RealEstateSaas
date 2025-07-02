"use client";
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import { useModal } from "@/hooks/useModal";
import { 
  PropertyType, 
  PropertyTypeConfig, 
  PROPERTY_TYPES, 
  getPropertyTypeConfig,
  getRequiredFields 
} from "./PropertyTypeConfig";

interface EnhancedPropertyModalProps {
  onPropertyAdded?: () => void;
}

export default function EnhancedPropertyModal({ onPropertyAdded }: EnhancedPropertyModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  
  // Form state
  const [selectedType, setSelectedType] = useState<PropertyType | "">("");
  const [formData, setFormData] = useState<Record<string, any>>({
    number: "",
    type: "",
    status: "AVAILABLE",
    floor: "",
    zone: "",
    notes: "",
    projectId: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Array<{ value: string; label: string }>>([]);

  // Get current property config
  const propertyConfig: PropertyTypeConfig | null = selectedType ? getPropertyTypeConfig(selectedType) : null;

  // Load projects on mount
  useEffect(() => {
    // Load projects from API
    // This would be replaced with actual API call
    setProjects([
      { value: "1", label: "Projet Résidentiel A" },
      { value: "2", label: "Projet Commercial B" }
    ]);
  }, []);

  // Handle form field changes
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle property type change
  const handleTypeChange = (type: PropertyType) => {
    setSelectedType(type);
    setFormData(prev => ({ 
      ...prev, 
      type,
      // Reset type-specific fields
      ...Object.fromEntries(
        propertyConfig?.fields.map(field => [field.name, ""]) || []
      )
    }));
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedType) return false;
    
    const newErrors: Record<string, string> = {};
    const requiredFields = getRequiredFields(selectedType);
    const config = getPropertyTypeConfig(selectedType);
    
    // Validate required fields
    requiredFields.forEach(fieldName => {
      if (!formData[fieldName] || formData[fieldName] === "") {
        newErrors[fieldName] = "Ce champ est requis";
      }
    });
    
    // Validate type-specific fields with custom validation
    config.fields.forEach(field => {
      const value = formData[field.name];
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      console.log("Submitting property:", formData);
      // Here you would call your API
      // await addProperty(formData);
      
      if (onPropertyAdded) {
        onPropertyAdded();
      }
      closeModal();
      resetForm();
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedType("");
    setFormData({
      number: "",
      type: "",
      status: "AVAILABLE",
      floor: "",
      zone: "",
      notes: "",
      projectId: ""
    });
    setErrors({});
  };

  // Render form field based on configuration
  const renderField = (field: any) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];

    switch (field.type) {
      case "text":
      case "number":
        return (
          <div key={field.name} className="col-span-1">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      case "select":
        return (
          <div key={field.name} className="col-span-1">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              options={field.options || []}
              value={value}
              onChange={(val) => handleChange(field.name, val)}
              placeholder={`Sélectionner ${field.label.toLowerCase()}`}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      case "checkbox":
        return (
          <div key={field.name} className="col-span-1">
            <Checkbox
              label={field.label}
              checked={!!value}
              onChange={(checked) => handleChange(field.name, checked)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      case "textarea":
        return (
          <div key={field.name} className="col-span-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <TextArea
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
        Ajouter un bien
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Ajouter un nouveau bien">
        <div className="space-y-6">
          {/* Property Type Selection */}
          <div>
            <Label>Type de bien <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(PROPERTY_TYPES).map(([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type as PropertyType)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedType === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{config.icon}</div>
                  <div className="text-sm font-medium">{config.label}</div>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
          </div>

          {/* Basic Information */}
          {selectedType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Selection */}
              <div className="col-span-1">
                <Label>Projet <span className="text-red-500">*</span></Label>
                <Select
                  options={projects}
                  value={formData.projectId}
                  onChange={(val) => handleChange("projectId", val)}
                  placeholder="Sélectionner un projet"
                />
                {errors.projectId && <p className="text-sm text-red-500 mt-1">{errors.projectId}</p>}
              </div>

              {/* Property Number */}
              <div className="col-span-1">
                <Label>Numéro <span className="text-red-500">*</span></Label>
                <Input
                  name="number"
                  type="text"
                  placeholder="ex: A-101"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                />
                {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
              </div>

              {/* Floor (if required) */}
              {propertyConfig?.requiresFloor && (
                <div className="col-span-1">
                  <Label>Étage <span className="text-red-500">*</span></Label>
                  <Input
                    name="floor"
                    type="number"
                    placeholder="ex: 2"
                    value={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                  />
                  {errors.floor && <p className="text-sm text-red-500 mt-1">{errors.floor}</p>}
                </div>
              )}

              {/* Zone (if required) */}
              {propertyConfig?.requiresZone && (
                <div className="col-span-1">
                  <Label>Zone <span className="text-red-500">*</span></Label>
                  <Input
                    name="zone"
                    type="text"
                    placeholder="ex: Zone A"
                    value={formData.zone}
                    onChange={(e) => handleChange("zone", e.target.value)}
                  />
                  {errors.zone && <p className="text-sm text-red-500 mt-1">{errors.zone}</p>}
                </div>
              )}

              {/* Status */}
              <div className="col-span-1">
                <Label>Statut</Label>
                <Select
                  options={[
                    { value: "AVAILABLE", label: "Disponible" },
                    { value: "RESERVED", label: "Réservé" },
                    { value: "SOLD", label: "Vendu" }
                  ]}
                  value={formData.status}
                  onChange={(val) => handleChange("status", val)}
                />
              </div>
            </div>
          )}

          {/* Type-Specific Fields */}
          {propertyConfig && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Caractéristiques - {propertyConfig.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyConfig.fields.map(renderField)}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <TextArea
              name="notes"
              placeholder="Informations complémentaires..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedType}>
              Ajouter le bien
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
