"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Button from "../../ui/button/Button"
import { Modal } from "../../ui/modal"
import Label from "../../form/Label"
import Input from "../../form/input/InputField"
import { useModal } from "@/hooks/useModal"
import Select from "../../form/Select"
import { Trash2, Search, X } from "lucide-react"
import updateClient from "@/app/(admin)/clients/updateClient"
import { Textarea } from "@/components/ui/textarea"
import getProperties from "@/components/tables/DataTables/Projects/getProperties"
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements"
import FileInput from "../../form/input/FileInput"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for form fields
  const [formData, setFormData] = useState({
    id: clientData.id || "",
    name: clientData.name || "",
    firstName: clientData.firstName || "",
    lastName: clientData.lastName || "",
    email: clientData.email || "",
    phoneNumber: clientData.phoneNumber || "",
    whatsappNumber: clientData.whatsappNumber || "",
    status: clientData.status || "LEAD",
    notes: clientData.notes || "",
    provenance: clientData.provenance || "",
    projectId: "",
    apartmentId: [] as string[],
    identityType: clientData.identityType || "",
    identityNumber: clientData.identityNumber || "",
  })

  // State for file inputs
  const [identityRecto, setIdentityRecto] = useState<File | null>(null)
  const [identityVerso, setIdentityVerso] = useState<File | null>(null)

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    provenance: "",
    identityType: "",
    identityNumber: "",
    identityRecto: "",
    identityVerso: "",
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
    { value: "LEAD", label: "Prospect" },
  ]

  const IdentityType = [
    { value: "Carte d'identité", label: "Carte d'identité" },
    { value: "Passport", label: "Passport" },
  ]

  // Initialize existing apartments from clientData
  useEffect(() => {
    if (clientData && clientData.interestedApartments) {
      // Group apartments by project
      const projectMap = new Map<string, ProjectApartment>()

      clientData.interestedApartments.forEach((item: Property) => {
        const projectId = item.project?.id
        const projectName = item.project?.name
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
        if (item.project?.properties && item.project.properties.length > 0) {
          const project = projectMap.get(String(projectId))!
          item.project.properties.forEach((apartment) => {
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

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'recto' | 'verso') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [fileType === 'recto' ? 'identityRecto' : 'identityVerso']: "Veuillez sélectionner un fichier image"
        }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fileType === 'recto' ? 'identityRecto' : 'identityVerso']: "Le fichier ne doit pas dépasser 5MB"
        }))
        return
      }

      if (fileType === 'recto') {
        setIdentityRecto(file)
      } else {
        setIdentityVerso(file)
      }

      // Clear errors
      setErrors(prev => ({
        ...prev,
        [fileType === 'recto' ? 'identityRecto' : 'identityVerso']: ""
      }))
    }
  }

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
      valid = false;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
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

    if (!formData.provenance.trim()) {
      newErrors.provenance = "Ce champ est requis";
      valid = false;
    }

    // Validate identity documents
    if (formData.status === "CLIENT") {
      if (!formData.identityNumber.trim()) {
        newErrors.identityNumber = "Le numéro de pièce d'identité est requis";
        valid = false;
      }

      if (!identityRecto && !clientData.identityRecto) {
        newErrors.identityRecto = "Le recto de la pièce d'identité est requis";
        valid = false;
      }

      if (formData.identityType === "Carte d'identité" && !identityVerso && !clientData.identityVerso) {
        newErrors.identityVerso = "Le verso de la pièce d'identité est requis";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    // Validate required fields
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Flatten all selected apartments into a single array of IDs
    const allApartmentIds = selectedApartments.flatMap((project) => project.apartments.map((apt) => apt.id))

    const formDataToSend = new FormData()

    // Add client ID for update
    formDataToSend.append("id", formData.id as string)

    // Add all form fields except apartmentId
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "apartmentId" && key !== "projectId") {
        formDataToSend.append(key, value as string)
      }
    })

    // Add all apartment IDs
    allApartmentIds.forEach((id) => {
      formDataToSend.append("apartmentId", id)
    })

    // Add identity document files
    if (identityRecto) {
      formDataToSend.append("identityRecto", identityRecto)
    }
    if (identityVerso) {
      formDataToSend.append("identityVerso", identityVerso)
    }

    console.log("Formulaire envoyé:", formDataToSend)

    try {
      await updateClient(formDataToSend)

      if (onClientUpdated) {
        onClientUpdated() // Call the refresh callback to update the client list
      }

      closeModal()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error)
      // Handle error (could add error state and display to user)
    } finally {
      setIsSubmitting(false);
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
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

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
      setFilteredApartments([])
      setSearchQuery("")
    }
  }, [formData.projectId])

  // Update the useEffect to initialize filtered apartments
  useEffect(() => {
    setFilteredApartments(currentProjectApartments)
  }, [currentProjectApartments])

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

  // Add function to clear search
  const clearSearch = () => {
    setSearchQuery("")
    setFilteredApartments(currentProjectApartments)
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10 max-h-[90vh] overflow-hidden">
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto no-scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <form onSubmit={(e) => e.preventDefault()}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Modifier les informations du client
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* first Name */}
              <div className="col-span-2 sm:col-span-1">
                <Label>
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="firstName"
                  type="text"
                  placeholder="ex: Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
              {/* last Name */}
              <div className="col-span-2 sm:col-span-1">
                <Label>
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="lastName"
                  type="text"
                  placeholder="ex: Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
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
              <div className="col-span-2 sm:col-span-1">
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="text"
                  placeholder="ex: jean.dupont@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label>
                  Numéro de téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="phoneNumber"
                  type="phone"
                  placeholder="ex: 06-12-34-56-78"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              {/* WhatsApp number */}
              <div className="col-span-2 sm:col-span-1">
                <Label>
                  Numéro de WhatsApp
                </Label>
                <Input
                  name="whatsappNumber"
                  type="phone"
                  placeholder="ex: 06-12-34-56-78"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  error={!!errors.whatsappNumber}
                />
                {errors.whatsappNumber && <p className="mt-1 text-sm text-red-500">{errors.whatsappNumber}</p>}
              </div>

              {/* Project and Apartment Selection Section */}
              <div className="col-span-2">
                <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                  Biens intéressés
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
                        <Label>Rechercher des biens</Label>
                        <div className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              placeholder="Rechercher par type ou numéro..."
                              className="w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          {searchQuery && filteredApartments.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredApartments.map((apt) => (
                                <div
                                  key={apt.value}
                                  className="px-3 py-2 cursor-pointer dark:text-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded-full"
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

                  {formData.projectId && tempSelectedApartments.length > 0 && (
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleAddApartments}>
                        Ajouter les biens sélectionnés
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

              {/* Provenance */}
              <div className="col-span-2">
                <Label>
                  Comment nous avez-vous connu ? <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="provenance"
                  type="text"
                  placeholder="ex: Google, Recommandation"
                  value={formData.provenance}
                  onChange={handleChange}
                  error={!!errors.provenance}
                />
                {errors.provenance && <p className="mt-1 text-sm text-red-500">{errors.provenance}</p>}
              </div>

              {/* Identity Type */}
              {formData.status === "CLIENT" && (
                <> 
                <div className="col-span-2 sm:col-span-1">
                  <Label>
                    Type de pièce d'identité <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={IdentityType}
                    name="identityType"
                    placeholder="Sélectionner un type"
                    defaultValue={formData.identityType}
                    onChange={(value, name) => handleSelectChange(value, name)}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>
                    Numéro de pièce d'identité <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="identityNumber"
                    type="text"
                    placeholder="ex: AB234567890"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    error={!!errors.identityNumber}
                  />
                  {errors.identityNumber && <p className="mt-1 text-sm text-red-500">{errors.identityNumber}</p>}
                </div>
                </>
              )}

              {/* Identity Document Upload Section */}
              {formData.status === "CLIENT" && formData.identityType && (
                <div className="col-span-2">
                  <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                    Pièce d'identité <span className="text-red-500">*</span>
                  </h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formData.identityType === "Passport" ? (
                      // Single file input for passport
                      <div className="col-span-1 sm:col-span-2">
                        <Label>
                          Passport <span className="text-red-500">*</span>
                        </Label>
                        <FileInput
                          name="identityRecto"
                          onChange={(e) => handleFileChange(e, 'recto')}
                          placeholder="Sélectionnez le passport"
                        />
                        {identityRecto && (
                          <p className="mt-1 text-sm text-green-600">
                            ✓ {identityRecto.name}
                          </p>
                        )}
                        {clientData.identityRecto && !identityRecto && (
                          <p className="mt-1 text-sm text-blue-600">
                            ✓ Document existant
                          </p>
                        )}
                        {errors.identityRecto && <p className="mt-1 text-sm text-red-500">{errors.identityRecto}</p>}
                      </div>
                    ) : (
                      // Two file inputs for carte d'identité
                      <>
                        <div className="col-span-2 sm:col-span-1">
                          <Label>
                            Recto <span className="text-red-500">*</span>
                          </Label>
                          <FileInput
                            name="identityRecto"
                            onChange={(e) => handleFileChange(e, 'recto')}
                            placeholder="Sélectionnez le recto"
                          />
                          {identityRecto && (
                            <p className="mt-1 text-sm text-green-600">
                              ✓ {identityRecto.name}
                            </p>
                          )}
                          {clientData.identityRecto && !identityRecto && (
                            <p className="mt-1 text-sm text-blue-600">
                              ✓ Document existant
                            </p>
                          )}
                          {errors.identityRecto && <p className="mt-1 text-sm text-red-500">{errors.identityRecto}</p>}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <Label>
                            Verso <span className="text-red-500">*</span>
                          </Label>
                          <FileInput
                            name="identityVerso"
                            onChange={(e) => handleFileChange(e, 'verso')}
                            placeholder="Sélectionnez le verso"
                          />
                          {identityVerso && (
                            <p className="mt-1 text-sm text-green-600">
                              ✓ {identityVerso.name}
                            </p>
                          )}
                          {clientData.identityVerso && !identityVerso && (
                            <p className="mt-1 text-sm text-blue-600">
                              ✓ Document existant
                            </p>
                          )}
                          {errors.identityVerso && <p className="mt-1 text-sm text-red-500">{errors.identityVerso}</p>}
                        </div>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Formats acceptés : JPG, PNG, GIF. Taille maximale : 5MB par fichier.
                  </p>
                </div>
              )}

              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  rows={3}
                  name="notes"
                  placeholder="ex: Notes concernant le client"
                  value={formData.notes}
                  onChange={handleTextareaChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  isSubmitting || 
                  selectedApartments.length === 0 || 
                  (formData.status === "CLIENT" && !identityRecto && !clientData.identityRecto) || 
                  (formData.status === "CLIENT" && formData.identityType === "Carte d'identité" && !identityVerso && !clientData.identityVerso)
                }
              >
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
