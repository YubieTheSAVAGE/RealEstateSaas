"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Button from "../../ui/button/Button"
import { Modal } from "../../ui/modal"
import Label from "../../form/Label"
import Input from "../../form/input/InputField"
import { useModal } from "@/hooks/useModal"
import Select from "../../form/Select"
import { Trash2 } from "lucide-react"
import updateClient from "@/app/(admin)/clients/updateClient"
import getProperties from "@/components/tables/DataTables/Projects/getProperties"
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements"
import MultiSelect from "@/components/form/MultiSelect"
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
    name: clientData.name || "",
    email: clientData.email || "",
    phoneNumber: clientData.phoneNumber || "",
    status: clientData.status || "LEAD",
    notes: clientData.notes || "",
    provenance: clientData.provenance || "",
    projectId: "",
    apartmentId: [] as string[],
  })

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    provenance: "",
  })

  // State for projects and their apartments
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([])
  const [selectedApartments, setSelectedApartments] = useState<ProjectApartment[]>([])
  const [currentProjectApartments, setCurrentProjectApartments] = useState<{ value: string; text: string; selected: boolean }[]>([])
  const [tempSelectedApartments, setTempSelectedApartments] = useState<string[]>([])
  const [currentProjectName, setCurrentProjectName] = useState("")

  useEffect(() => {
    console.log("Selected apartments:", selectedApartments)
  }, [selectedApartments])
  // Status options
  const status = [
    { value: "CLIENT", label: "Client" },
    { value: "LEAD", label: "Lead" },
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

        // Add all apartments from this project
        if (item.project.apartments && item.project.apartments.length > 0) {
          const project = projectMap.get(String(projectId))!

          item.project.apartments.forEach((apartment) => {
            project.apartments.push({
              id: String(apartment.id),
              name: apartment.type || `Apartment ${apartment.number || apartment.id}`,
            })
          })
        }
      })

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
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (!/^[+\d\s\-()]{7,20}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      valid = false;
    }

    if (!formData.provenance.trim()) {
      newErrors.provenance = "This field is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    // Validate required fields
    if (!validateForm()) {
      return;
    }

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

    console.log("Form data to send:", allApartmentIds)

    try {
      await updateClient(formDataToSend)

      if (onClientUpdated) {
        onClientUpdated() // Call the refresh callback to update the client list
      }

      closeModal()
    } catch (error) {
      console.error("Error updating client:", error)
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
        text: apartment.project?.name || `Apartment ${apartment.number || apartment.id}`,
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
  const handleMultiSelectChange = (selected: string[]) => {
    setTempSelectedApartments(selected)
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

  return (
    <>
      {details ? (
        <DropdownItem 
          className="text-gray-500 hover:text-warning-400 dark:text-gray-400 dark:hover:text-warning-400 cursor-pointer"
          onClick={openModal}
        >
          Edit
        </DropdownItem>
      ) : (
        <span className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer">
          <PencilIcon onClick={openModal} />
        </span>
      )}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Edit Client Information</h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                onChange={handleChange}
                defaultValue={formData.name}
              />
            </div>
            <div className="col-span-1">
              <Label>
                Status <span className="text-red-500">*</span>
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
                placeholder="e.g. john.doe@example.com"
                onChange={handleChange}
                defaultValue={formData.email}
              />
            </div>

            <div className="col-span-1">
              <Label>
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                name="phoneNumber"
                type="phone"
                placeholder="e.g. 123-456-7890"
                onChange={handleChange}
                defaultValue={formData.phoneNumber}
              />
            </div>

            {/* Project and Apartment Selection Section */}
            <div className="col-span-2">
              <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">Add Properties</h5>
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label>Project</Label>
                    <Select
                      options={projects}
                      name="projectId"
                      placeholder="Select a project"
                      defaultValue={formData.projectId}
                      onChange={(value, name) => handleSelectChange(value, name)}
                    />
                  </div>
                  {formData.projectId && (
                    <div className="col-span-1">
                      <Label>Properties</Label>
                      <MultiSelect
                        label=""
                        options={currentProjectApartments}
                        onChange={handleMultiSelectChange}
                      />
                    </div>
                  )}
                </div>

                {formData.projectId && (
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddApartments} disabled={tempSelectedApartments.length === 0}>
                      Add Properties
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* Selected Apartments Display */}
            {selectedApartments.length > 0 && (
              <div className="col-span-2 mt-2">
                <h5 className="mb-2 font-medium text-gray-800 dark:text-white/90">Selected Properties</h5>
                <div className="p-4 border rounded-lg max-h-[300px] overflow-y-auto">
                  {selectedApartments.map((project) => (
                    <div key={project.projectId} className="mb-4">
                      <h6 className="mb-2 font-medium">{project.projectName}</h6>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.apartments.length === 0 && (
                          <p className="text-sm text-gray-500">No apartments selected</p>
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

            <div className="col-span-1 sm:col-span-2">
              <Label>
                How did you hear about us? <span className="text-red-500">*</span>
              </Label>
              <Input
                name="provenance"
                type="text"
                placeholder="e.g. Google, Referral"
                onChange={handleChange}
                defaultValue={formData.provenance}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <CustomTextarea
                rows={3}
                name="notes"
                placeholder="e.g. Notes about the client"
                onChange={handleTextareaChange}
                defaultValue={formData.notes}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={selectedApartments.length === 0}>
              Update Client
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
