"use client"

import React, { useState, useEffect } from "react"
import Button from "../../ui/button/Button"
import Input from "../../form/input/InputField"
import Label from "../../form/Label"
import Select from "../../form/Select"
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/hooks/useModal"
import addClient from "@/app/(admin)/clients/addClient"
import getProperties from "@/components/tables/DataTables/Projects/getProperties"
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements"


interface AddClientModalProps {
  onClientAdded?: () => void
}

interface Project {
  id: number
  name: string
  apartments: Apartment[]
}

interface Apartment {
  id: number
  number: string
  type: string
  area: number
  price: number
}

interface FormData {
  name: string
  email: string
  phoneNumber: string
  status: "PROSPECT" | "CLIENT"
  notes: string
  provenance: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

export default function AddClientModal({ onClientAdded }: AddClientModalProps) {
  const { isOpen, openModal, closeModal } = useModal()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    status: "PROSPECT",
    notes: "",
    provenance: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedApartmentIds, setSelectedApartmentIds] = useState<string[]>([])
  const [currentProjectApartments, setCurrentProjectApartments] = useState<Apartment[]>([])

  // Status options
  const statusOptions = [
    { value: "PROSPECT", label: "Prospect" },
    { value: "CLIENT", label: "Client" },
  ]

  // Project options for select
  const projectOptions = projects.map(project => ({
    value: project.id.toString(),
    label: project.name
  }))

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        status: "PROSPECT",
        notes: "",
        provenance: "",
        password: "",
        confirmPassword: "",
      })
      setErrors({})
      setSelectedProjectId("")
      setSelectedApartmentIds([])
      setCurrentProjectApartments([])
    }
  }, [isOpen])

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...")
      const response = await getProperties()
      setProjects(response)
      console.log("Projects fetched:", response)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchApartmentsForProject = async (projectId: string) => {
    try {
      console.log("Fetching apartments for project:", projectId)
      const apartments = await getProjectApartements(projectId)
      setCurrentProjectApartments(apartments)
      console.log("Apartments fetched:", apartments)
    } catch (error) {
      console.error("Error fetching apartments:", error)
      setCurrentProjectApartments([])
    }
  }

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    if (projectId) {
      fetchApartmentsForProject(projectId)
    } else {
      setCurrentProjectApartments([])
    }
  }

  const handleApartmentToggle = (apartment: Apartment) => {
    const apartmentId = apartment.id.toString()
    if (selectedApartmentIds.includes(apartmentId)) {
      setSelectedApartmentIds(prev => prev.filter(id => id !== apartmentId))
    } else {
      setSelectedApartmentIds(prev => [...prev, apartmentId])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est requis"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
      isValid = false
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis"
      isValid = false
    }

    if (!formData.provenance.trim()) {
      newErrors.provenance = "La provenance est requise"
      isValid = false
    }

    // Password validation for CLIENT status
    if (formData.status === "CLIENT") {
      if (!formData.password.trim()) {
        newErrors.password = "Le mot de passe est requis pour les clients"
        isValid = false
      } else if (formData.password.length < 6) {
        newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        isValid = false
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "La confirmation du mot de passe est requise"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
        isValid = false
      }
    }

    // At least one apartment must be selected
    if (selectedApartmentIds.length === 0) {
      newErrors.apartments = "Au moins un bien doit être sélectionné"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    console.log("🎯 [Modal] Submit button clicked")
    console.log("📝 [Modal] Form data:", formData)
    console.log("🏠 [Modal] Selected apartments:", selectedApartmentIds)

    if (!validateForm()) {
      console.log("❌ [Modal] Form validation failed")
      return
    }

    console.log("✅ [Modal] Form validation passed")
    setIsSubmitting(true)

    try {
      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        status: formData.status,
        notes: formData.notes.trim(),
        provenance: formData.provenance.trim(),
        apartmentId: selectedApartmentIds,
        ...(formData.status === "CLIENT" && { password: formData.password })
      }

      console.log("🚀 [Modal] Sending client data:", { ...clientData, password: clientData.password ? "[REDACTED]" : undefined })

      const result = await addClient(clientData)
      console.log("✅ [Modal] Client created successfully:", result)

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        status: "PROSPECT",
        notes: "",
        provenance: "",
        password: "",
        confirmPassword: "",
      })
      setSelectedApartmentIds([])
      setSelectedProjectId("")
      setCurrentProjectApartments([])
      setErrors({})

      if (onClientAdded) {
        console.log("🔄 [Modal] Calling refresh callback")
        onClientAdded()
      }

      closeModal()
    } catch (error) {
      console.error("💥 [Modal] Error creating client:", error)
      setErrors({ submit: error instanceof Error ? error.message : "Une erreur est survenue" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Button to open modal */}
      <Button onClick={openModal}>
        Ajouter un Client
      </Button>

      {/* Modal */}
      {isOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Ajouter un Client</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              Nom complet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nom complet du client"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber">
              Numéro de téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="06-12-34-56-78"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!errors.phoneNumber}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">
              Statut <span className="text-red-500">*</span>
            </Label>
            <Select
              options={statusOptions}
              name="status"
              placeholder="Sélectionner un statut"
              defaultValue={formData.status}
              onChange={(value, name) => handleSelectChange(value, name)}
            />
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
          </div>

          {/* Password fields - only show for CLIENT status */}
          {formData.status === "CLIENT" && (
            <>
              <div>
                <Label htmlFor="password">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe (min. 6 caractères)"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Provenance */}
          <div>
            <Label htmlFor="provenance">
              Provenance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="provenance"
              name="provenance"
              type="text"
              placeholder="Comment le client nous a trouvé"
              value={formData.provenance}
              onChange={handleInputChange}
              error={!!errors.provenance}
            />
            {errors.provenance && <p className="mt-1 text-sm text-red-500">{errors.provenance}</p>}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notes additionnelles..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Project Selection */}
          <div>
            <Label>
              Projet <span className="text-red-500">*</span>
            </Label>
            <Select
              options={projectOptions}
              name="projectId"
              placeholder="Sélectionner un projet"
              onChange={(value) => handleProjectSelect(value)}
            />
          </div>

          {/* Apartment Selection */}
          {selectedProjectId && currentProjectApartments.length > 0 && (
            <div>
              <Label>
                Biens intéressés <span className="text-red-500">*</span>
              </Label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                {currentProjectApartments.map((apartment) => (
                  <div key={apartment.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`apartment-${apartment.id}`}
                      checked={selectedApartmentIds.includes(apartment.id.toString())}
                      onChange={() => handleApartmentToggle(apartment)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`apartment-${apartment.id}`} className="flex-1 text-sm cursor-pointer">
                      {apartment.type} {apartment.number} - {apartment.area}m² - {apartment.price?.toLocaleString()}€
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedApartmentIds.length} bien(s) sélectionné(s)
              </p>
              {errors.apartments && <p className="mt-1 text-sm text-red-500">{errors.apartments}</p>}
            </div>
          )}

          {selectedProjectId && currentProjectApartments.length === 0 && (
            <div>
              <Label>
                Biens intéressés <span className="text-red-500">*</span>
              </Label>
              <div className="p-4 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-500">Aucun bien disponible pour ce projet</p>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.name.trim() ||
                !formData.email.trim() ||
                !formData.phoneNumber.trim() ||
                !formData.provenance.trim() ||
                selectedApartmentIds.length === 0 ||
                (formData.status === "CLIENT" && (!formData.password.trim() || formData.password !== formData.confirmPassword))
              }
            >
              {isSubmitting ? "Création..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
      </div>
      )}
    </>
  )
}
