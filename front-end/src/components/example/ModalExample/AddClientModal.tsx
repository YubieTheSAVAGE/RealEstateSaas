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
import addClient from "@/app/(admin)/clients/addClient"
import { Textarea } from "@/components/ui/textarea"
import getProperties from "@/components/tables/DataTables/Projects/getProperties"
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements"
import MultiSelect from "@/components/form/MultiSelect"
import { Property } from "@/types/property"
import { Project } from "@/types/project"

interface AddProjectModalProps {
  onClientAdded?: () => void // Callback to refresh client list
}

interface ProjectApartment {
  projectId: string
  projectName: string
  apartments: {
    id: string
    name: string
  }[]
}

export default function AddClientModal({ onClientAdded }: AddProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "LEAD",
    notes: "",
    provenance: "",
    projectId: "",
    apartmentId: [] as string[],
  })

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "LEAD",
    notes: "",
    provenance: "",
    projectId: "",
    apartmentId: [] as string[],
  })

  // State for projects and their apartments
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([])
  const [selectedApartments, setSelectedApartments] = useState<ProjectApartment[]>([])
  const [currentProjectApartments, setCurrentProjectApartments] = useState<{ value: string; text: string; selected: boolean }[]>([])
  const [tempSelectedApartments, setTempSelectedApartments] = useState<string[]>([])
  const [currentProjectName, setCurrentProjectName] = useState("")

  // Status options
  const status = [
    { value: "CLIENT", label: "Client" },
    { value: "LEAD", label: "Lead" },
  ]

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

  const handleSave = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Flatten all selected apartments into a single array of IDs
    const allApartmentIds = selectedApartments.flatMap((project) => project.apartments.map((apt) => apt.id))

    const formDataToSend = new FormData()

    // Add all form fields except apartmentId
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "apartmentId") {
        formDataToSend.append(key, value as string)
      }
    })

    // Add all apartment IDs
    allApartmentIds.forEach((id) => {
      formDataToSend.append("apartmentId", id)
    })

    try {
      console.log("Form data to send:", formDataToSend)
      await addClient(formDataToSend)

      if (onClientAdded) {
        onClientAdded() // Call the refresh callback to update the client list
      }

      // Reset form on successful submission
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        status: "LEAD",
        notes: "",
        provenance: "",
        projectId: "",
        apartmentId: [],
      });
      setSelectedApartments([]);
      
      closeModal()
    } catch (error) {
      console.error("Error adding client:", error);
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  // Validate form data
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

    if (selectedApartments.length === 0) {
      newErrors.apartmentId = ["At least one property must be selected"];
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties()
        const formattedOptions = response.map((property: Project) => ({
          value: property.id,
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
      console.log("Fetching apartments for project ID:", data)

      const formattedOptions = data.map((apartment: Property) => ({
        value: apartment.id,
        text:  `${apartment.type} ${apartment.number || apartment.id}`,
      }))

      setCurrentProjectApartments(formattedOptions)
    } catch (error) {
      console.error("Error fetching apartments:", error)
      setCurrentProjectApartments([])
    }
  }

  // Handle project selection change
  const handleSelectChange = (selectedValue: string, name: string) => {
    console.log("Selected value:", selectedValue, name)

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

  // Handle multi-select change for apartments
  const handleMultiSelectChange = (selected: string[]) => {
    console.log("Selected apartments:", selected)
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
    // Reset inputs after adding apartments
    setFormData((prev) => ({
      ...prev,
      projectId: "", // Reset project selection
    }))
    setErrors((prev) => ({
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
      <Button size="sm" onClick={openModal}>
        Add Client
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Lead Information</h4>

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
                error={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="col-span-1">
              <Label>
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                options={status}
                name="status"
                placeholder=""
                defaultValue={status[1].value}
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
                error={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                error={!!errors.phoneNumber}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            {/* Project and Apartment Selection Section */}
            <div className="col-span-2">
              <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">Interested Properties <span className="text-red-500">*</span></h5>
              <div className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label>
                      Project <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={projects}
                      name="projectId"
                      placeholder="Select a project"
                      onChange={(value, name) => handleSelectChange(value, name)}
                    />
                    {errors.apartmentId && errors.apartmentId.length > 0 && selectedApartments.length === 0 && (
                      <p className="mt-1 text-sm text-red-500">{errors.apartmentId[0]}</p>
                    )}
                  </div>
                  {formData.projectId && (
                    <div className="col-span-1">
                      <Label>Property <span className="text-red-500">*</span></Label>
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
                      Add Property
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Apartments Display */}
            {selectedApartments.length > 0 && (
              <div className="col-span-2 mt-2">
                <h5 className="mb-2 font-medium text-gray-800 dark:text-white/90">Selected Properties</h5>
                <div className="p-4 border rounded-lg">
                  {selectedApartments.map((project) => (
                    <div key={project.projectId} className="mb-4">
                      <h6 className="mb-2 font-medium">{project.projectName}</h6>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.apartments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm truncate">{apt.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveApartment(project.projectId, apt.id)}
                              className="p-1 text-red-500 hover:text-red-700"
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
                error={!!errors.provenance}
              />
              {errors.provenance && <p className="mt-1 text-sm text-red-500">{errors.provenance}</p>}
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                name="notes"
                placeholder="e.g. Notes about the client"
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
              Close
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={isSubmitting || selectedApartments.length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
