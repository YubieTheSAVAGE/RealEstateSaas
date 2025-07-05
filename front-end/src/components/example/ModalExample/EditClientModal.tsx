"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Button from "../../ui/button/Button"
import { Modal } from "../../ui/modal"
import Label from "../../form/Label"
import Input from "../../form/input/InputField"
import { useModal } from "@/hooks/useModal"
import Select from "../../form/Select"
import { Trash2, Search } from "lucide-react"
import updateClient from "@/app/(admin)/clients/updateClient"
import getProperties from "@/components/tables/DataTables/Projects/getProperties"
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements"
import { PencilIcon } from "@/icons"
import type { Client } from "@/types/client"
import { Property } from "@/types/property"
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem"
import { Project } from "@/types/project"

// Custom textarea component to replace shadcn/ui textarea
const CustomTextarea = ({
  rows = 3,
  name,
  placeholder,
  onChange,
  defaultValue = "",
}: {
  rows?: number
  name: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  defaultValue?: string
}) => {
  return (
    <textarea
      rows={rows}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
  )
}

interface EditClientModalProps {
  onClientUpdated?: () => void // Callback to refresh client list
  clientData: Client
  details?: boolean
}

interface ProjectApartment {
  projectId: string
  projectName: string
  apartments: {
    id: string
    name: string
  }[]
}

export default function EditClientModal({ onClientUpdated, clientData, details }: EditClientModalProps) {
  const { isOpen, openModal, closeModal } = useModal()

  // State for form fields
  const [formData, setFormData] = useState({
    id: clientData.id || "",
    firstName: clientData.firstName || "",
    lastName: clientData.lastName || "",
    name: clientData.name || "",
    email: clientData.email || "",
    phoneNumber: clientData.phoneNumber || "",
    whatsappNumber: clientData.whatsappNumber || "",
    status: clientData.status || "PROSPECT",
    notes: clientData.notes || "",
    provenance: clientData.provenance || "",
    projectId: "",
    apartmentId: [] as string[],
    password: "",
    confirmPassword: "",
  })

  // State for validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    provenance: "",
    password: "",
    confirmPassword: "",
  })

  // State for projects and their apartments
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([])
  const [selectedApartments, setSelectedApartments] = useState<ProjectApartment[]>([])
  const [currentProjectApartments, setCurrentProjectApartments] = useState<{ value: string; text: string; selected: boolean }[]>([])
  const [tempSelectedApartments, setTempSelectedApartments] = useState<string[]>([])
  const [currentProjectName, setCurrentProjectName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredApartments, setFilteredApartments] = useState<{ value: string; text: string; selected: boolean }[]>([])

  useEffect(() => {
    // initalize tempselectedApartments with clientData if available
    if (clientData && clientData.interestedApartments) {
      console.log("Client data:", clientData)
      setTempSelectedApartments(clientData.interestedApartments.map((apt) => String(apt.id)))
    }
  }, [clientData])
  console.log("Temp selected apartments:", tempSelectedApartments)

  useEffect(() => {
    console.log("Selected apartments:", selectedApartments)
  }, [selectedApartments])
  // Status options
  const status = [
    { value: "CLIENT", label: "Client" },
    { value: "PROSPECT", label: "Prospect" },
  ]

  // Initialize existing apartments from clientData
  useEffect(() => {
    if (clientData && clientData.interestedApartments) {
      // Group apartments by project
      const projectMap = new Map<string, ProjectApartment>()

      clientData.interestedApartments.forEach((item: Property) => {
        const projectId = item.projectId
        const projectName = item.project.name
        const apartmentId = String(item.id)
        const apartmentNumber = item.number
        const apartmentName = item.type || `${item.number}`


        if (!projectMap.has(String(projectId))) {
          projectMap.set(String(projectId), {
            projectId: String(projectId),
            projectName,
            apartments: [{
              id: apartmentId,
              name: (`${apartmentName} ${apartmentNumber}`),
            }]
          })
        }
        else {
          const project = projectMap.get(String(projectId))!
          // Check if apartment already exists in this project
          if (!project.apartments.some((apt) => apt.id === apartmentId)) {
            project.apartments.push({
              id: apartmentId,
              name: `${apartmentName} ${apartmentNumber}`,
            })
          }
        }
        // Add all apartments from this project
        if (item.project.apartments && item.project.apartments.length > 0) {
          const project = projectMap.get(String(projectId))!
          item.project.apartments.forEach((apartment) => {
            project.apartments.push({
              id: String(apartment.id),
              name: `${apartment.type} ${apartment.number || apartment.id}`,
            })
          })
        }
      })
      console.log("Project map:", projectMap)
      // Convert map to array
      setSelectedApartments(Array.from(projectMap.values()))
    }
  }, [clientData])


  // Update form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom de famille est requis";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
      valid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
      valid = false;
    } else if (!/^[+\d\s\-()]{7,20}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Veuillez entrer un numéro de téléphone valide";
      valid = false;
    }

    // WhatsApp number validation (optional but must be valid if provided)
    if (formData.whatsappNumber.trim() && !/^[+\d\s\-()]{7,20}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = "Format de numéro WhatsApp invalide";
      valid = false;
    }

    if (!formData.provenance.trim()) {
      newErrors.provenance = "Ce champ est requis";
      valid = false;
    }

    // Validate password if changing from PROSPECT to CLIENT
    if (formData.status === "CLIENT" && clientData.status === "PROSPECT") {
      if (!formData.password.trim()) {
        newErrors.password = "Le mot de passe est requis pour créer un compte client";
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        valid = false;
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
        valid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    console.log("🎯 [EditModal] Save button clicked");
    console.log("📝 [EditModal] Form data:", formData);
    console.log("👤 [EditModal] Original client data:", clientData);

    // Validate required fields
    if (!validateForm()) {
      console.log("❌ [EditModal] Form validation failed");
      return;
    }

    console.log("✅ [EditModal] Form validation passed");

    // Flatten all selected apartments into a single array of IDs
    const allApartmentIds = selectedApartments.flatMap((project) => project.apartments.map((apt) => apt.id))

    // Prepare client data object
    const clientDataToSend = {
      id: formData.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      whatsappNumber: formData.whatsappNumber.trim() || undefined,
      status: formData.status as "PROSPECT" | "CLIENT",
      notes: formData.notes.trim(),
      provenance: formData.provenance.trim(),
      apartmentId: allApartmentIds,
      // Only include password if changing from PROSPECT to CLIENT
      ...(formData.status === "CLIENT" && clientData.status === "PROSPECT" && {
        password: formData.password
      })
    };

    console.log("🚀 [EditModal] Sending client data to API...");
    console.log("📋 [EditModal] Client data:", { ...clientDataToSend, password: clientDataToSend.password ? "[REDACTED]" : undefined });

    try {
      await updateClient(clientDataToSend)
      console.log("✅ [EditModal] Client updated successfully");

      if (onClientUpdated) {
        console.log("🔄 [EditModal] Calling refresh callback");
        onClientUpdated() // Call the refresh callback to update the client list
      }

      closeModal()
    } catch (error) {
      console.error("💥 [EditModal] Error updating client:", error)
      // Handle error (could add error state and display to user)
    }
  }

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties()
        const formattedOptions = response.map((property: Project) => ({
          value: String(property.id),
          label: property.name,
        }))
        setProjects(formattedOptions)
      } catch (error) {
        console.error("Error fetching properties:", error)
      }
    }

    fetchProperties()
  }, [])

  // Function to fetch apartments for a specific project
  const fetchApartmentsForProject = async (projectId: string) => {
    try {
      const data = await getProjectApartements(projectId)

      const formattedOptions = data.map((apartment: Property) => ({
        value: String(apartment.id),
        text: `${apartment.type} ${apartment.number || apartment.id} `,
      }))

      setCurrentProjectApartments(formattedOptions)
    } catch (error) {
      console.error("Error fetching apartments:", error)
      setCurrentProjectApartments([])
    }
  }

  // Handle project selection change
  const handleSelectChange = (selectedValue: string, name: string) => {
    if (name === "projectId") {
      // Find the project name for the selected project ID
      const selectedProject = projects.find((p) => p.value === selectedValue)
      if (selectedProject) {
        setCurrentProjectName(selectedProject.label)
      }

      // Reset temporary selected apartments when changing projects
      setTempSelectedApartments([])
    }

    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
    }))
  }

  // Handle multi-select change for apartments
  // const handleMultiSelectChange = (selected: string[]) => {
  //   setTempSelectedApartments(selected)
  // }

  // Add selected apartments to the list
  const handleAddApartments = () => {
    if (tempSelectedApartments.length === 0 || !formData.projectId) return

    // Get the current project name
    const projectName = currentProjectName

    // Get apartment details for the selected IDs
    const apartmentsToAdd = tempSelectedApartments.map((id) => {
      const apt = currentProjectApartments.find((a) => a.value === id)
      return {
        id,
        name: apt ? apt.text : id,
      }
    })

    // Check if this project already exists in our selected apartments
    const existingProjectIndex = selectedApartments.findIndex((p) => p.projectId === formData.projectId)

    if (existingProjectIndex >= 0) {
      // Add to existing project, avoiding duplicates
      const updatedProjects = [...selectedApartments]
      const existingApartmentIds = updatedProjects[existingProjectIndex].apartments.map((a) => a.id)

      // Filter out apartments that are already selected
      const newApartments = apartmentsToAdd.filter((apt) => !existingApartmentIds.includes(apt.id))

      updatedProjects[existingProjectIndex] = {
        ...updatedProjects[existingProjectIndex],
        apartments: [...updatedProjects[existingProjectIndex].apartments, ...newApartments],
      }

      setSelectedApartments(updatedProjects)
    } else {
      // Add as a new project
      setSelectedApartments([
        ...selectedApartments,
        {
          projectId: formData.projectId,
          projectName,
          apartments: apartmentsToAdd,
        },
      ])
    }

    // Reset temporary selection
    setTempSelectedApartments([])
    // Reset project selection
    setFormData((prev) => ({
      ...prev,
      projectId: "",
    }))
    setCurrentProjectName("")
    setCurrentProjectApartments([])
  }

  // Remove an apartment from the selected list
  const handleRemoveApartment = (projectId: string, apartmentId: string) => {
    const updatedProjects = selectedApartments
      .map((project) => {
        if (project.projectId === projectId) {
          return {
            ...project,
            apartments: project.apartments.filter((apt) => apt.id !== apartmentId),
          }
        }
        return project
      })
      .filter((project) => project.apartments.length > 0) // Remove projects with no apartments

    setSelectedApartments(updatedProjects)
  }

  // Update apartments when project changes
  useEffect(() => {
    if (formData.projectId) {
      fetchApartmentsForProject(formData.projectId)
    } else {
      setCurrentProjectApartments([])
    }
  }, [formData.projectId])

  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredApartments(currentProjectApartments)
      return
    }

    const filtered = currentProjectApartments.filter(apt =>
      apt.text.toLowerCase().includes(query)
    )
    setFilteredApartments(filtered)
  }


  return (
    <>
      {details ? (
        <DropdownItem
          className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
          onClick={openModal}
        >
          Modifier
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer">
          <PencilIcon onClick={openModal} />
        </span>
      )}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Modifier les informations du client
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                name="firstName"
                type="text"
                placeholder="ex: Jean"
                onChange={handleChange}
                defaultValue={formData.firstName}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="col-span-1">
              <Label>
                Nom de famille <span className="text-red-500">*</span>
              </Label>
              <Input
                name="lastName"
                type="text"
                placeholder="ex: Dupont"
                onChange={handleChange}
                defaultValue={formData.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
            <div className="col-span-1">
              <Label>
                Statut <span className="text-red-500">*</span>
              </Label>
              <Select
                options={status}
                name="status"
                placeholder=""
                defaultValue={formData.status}
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>
            <div className="col-span-1">
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                name="email"
                type="text"
                placeholder="ex: jean.dupont@exemple.com"
                onChange={handleChange}
                defaultValue={formData.email}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="col-span-1">
              <Label>
                Numéro de téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                name="phoneNumber"
                type="phone"
                placeholder="ex: 06-12-34-56-78"
                onChange={handleChange}
                defaultValue={formData.phoneNumber}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="col-span-1">
              <Label>
                Numéro WhatsApp
              </Label>
              <Input
                name="whatsappNumber"
                type="phone"
                placeholder="ex: 06-12-34-56-78 (optionnel)"
                onChange={handleChange}
                defaultValue={formData.whatsappNumber}
              />
              {errors.whatsappNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.whatsappNumber}</p>
              )}
            </div>

            {/* Project and Apartment Selection Section */}
            <div className="col-span-2">
              <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                Ajouter des biens
              </h5>
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Projet</Label>
                    <Select
                      options={projects}
                      name="projectId"
                      placeholder="Sélectionner un projet"
                      defaultValue={formData.projectId}
                      onChange={(value, name) => handleSelectChange(value, name)}
                    />
                  </div>
                  {formData.projectId && (
                    <div className="col-span-2">
                      <Label>
                        Rechercher des biens <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Rechercher par type ou numéro..."
                            className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                        {searchQuery && filteredApartments.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredApartments.map((apt) => (
                              <div
                                key={apt.value}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  if (!tempSelectedApartments.includes(apt.value)) {
                                    setTempSelectedApartments([...tempSelectedApartments, apt.value])
                                  }
                                }}
                              >
                                {apt.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {tempSelectedApartments.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {tempSelectedApartments.map((id) => {
                              const apt = currentProjectApartments.find((a) => a.value === id)
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded-full"
                                >
                                  <span>{apt?.text}</span>
                                  <button
                                    type="button"
                                    onClick={() => setTempSelectedApartments(tempSelectedApartments.filter(t => t !== id))}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {formData.projectId && (
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddApartments} disabled={tempSelectedApartments.length === 0}>
                      Ajouter les biens
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* Selected Apartments Display */}
            {selectedApartments.length > 0 && (
              <div className="col-span-2 mt-2">
                <h5 className="mb-2 font-medium text-gray-800 dark:text-white/90">
                  Biens sélectionnés
                </h5>
                <div className="p-4 border rounded-lg max-h-[300px] overflow-y-auto">
                  {selectedApartments.map((project) => (
                    <div key={project.projectId} className="mb-4">
                      <h6 className="mb-2 font-medium">{project.projectName}</h6>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.apartments.length === 0 && (
                          <p className="text-sm text-gray-500">Aucun bien sélectionné</p>
                        )}
                        {project.apartments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm truncate">{apt.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveApartment(project.projectId, apt.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                              aria-label={`Remove ${apt.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password fields - only show when converting from PROSPECT to CLIENT */}
            {formData.status === "CLIENT" && clientData.status === "PROSPECT" && (
              <>
                <div className="col-span-1 sm:col-span-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h6 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Création du compte client
                    </h6>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
                      En changeant le statut vers "Client", un compte utilisateur sera créé pour permettre l'accès au portail client.
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label>
                          Mot de passe <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Minimum 6 caractères"
                          onChange={handleChange}
                          value={formData.password}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                        )}
                      </div>
                      <div>
                        <Label>
                          Confirmer le mot de passe <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirmer le mot de passe"
                          onChange={handleChange}
                          value={formData.confirmPassword}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="col-span-1 sm:col-span-2">
              <Label>
                Comment nous avez-vous connu ? <span className="text-red-500">*</span>
              </Label>
              <Input
                name="provenance"
                type="text"
                placeholder="ex: Google, Recommandation"
                onChange={handleChange}
                defaultValue={formData.provenance}
              />
              {errors.provenance && (
                <p className="text-sm text-red-500 mt-1">{errors.provenance}</p>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <CustomTextarea
                rows={3}
                name="notes"
                placeholder="ex: Notes concernant le client"
                onChange={handleTextareaChange}
                defaultValue={formData.notes}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                selectedApartments.length === 0 ||
                (formData.status === "CLIENT" && clientData.status === "PROSPECT" &&
                 (!formData.password.trim() || formData.password !== formData.confirmPassword))
              }
            >
              {formData.status === "CLIENT" && clientData.status === "PROSPECT"
                ? "Créer le compte client"
                : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
