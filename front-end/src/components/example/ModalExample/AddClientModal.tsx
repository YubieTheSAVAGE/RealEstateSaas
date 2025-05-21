"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import Select from "../../form/Select";
import { X } from "lucide-react";
import addClient from "@/app/(admin)/clients/addClient";
import { Textarea } from "@/components/ui/textarea";
import getProperties from "@/components/tables/DataTables/Projects/getProperties";
import getProjectApartements from "@/components/tables/DataTables/Properties/getProjectApartements";

interface AddProjectModalProps {
  onClientAdded?: () => void; // Callback to refresh client list
}

// Define interfaces for type safety
interface Property {
  id: string;
  name: string;
}

interface Apartment {
  id: string;
  name?: string;
  number?: string;
}

interface SelectedProject {
  projectId: string;
  projectName: string;
  apartments: {
    id: string;
    name: string;
  }[];
}

export default function AddClientModal({ onClientAdded }: AddProjectModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "LEAD",
    notes: "",
    provenance: "",
  });

  // State for client interests (projects and apartments)
  const [selectedProjects, setSelectedProjects] = useState<SelectedProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentApartmentIds, setCurrentApartmentIds] = useState<string[]>([]);

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    provenance: "",
  });

  // Update form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSave = async () => {
    // Validation
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    }
    
    if (!formData.provenance.trim()) {
      newErrors.provenance = "Provenance is required";
      valid = false;
    }
    
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const formDataToSend = new FormData();
    
    // Add basic client information
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    
    // Add selected projects and apartments
    if (selectedProjects.length > 0) {
      // Collect all apartment IDs
      const apartmentIds = selectedProjects.flatMap(project => 
        project.apartments.map(apt => apt.id)
      );
      
      // If there are selected apartments, add the first one as the primary apartmentId
      if (apartmentIds.length > 0) {
        formDataToSend.append('apartmentId', apartmentIds[0]);
      }
      
      // Add projects and all apartments as JSON strings for processing on the backend
      formDataToSend.append('interestedProjects', JSON.stringify(
        selectedProjects.map(p => ({ 
          id: p.projectId, 
          name: p.projectName 
        }))
      ));
      
      formDataToSend.append('interestedApartments', JSON.stringify(
        selectedProjects.flatMap(p => 
          p.apartments.map(apt => ({
            id: apt.id,
            name: apt.name,
            projectId: p.projectId
          }))
        )
      ));
    }

    console.log("Form data to send:", formDataToSend);
    
    try {
      await addClient(formDataToSend);
      if (onClientAdded) {
        onClientAdded(); // Call the refresh callback to update the client list
      }
      closeModal();
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const [projectOptions, setProjectOptions] = useState<{ value: string; label: string }[]>([]);
  const [apartmentOptions, setApartmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [projectsMap, setProjectsMap] = useState<Map<string, Property>>(new Map());

  const status = [
    { value: "CLIENT", label: "Client" },
    { value: "LEAD", label: "Lead" },
  ]

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        // Create a map of project IDs to project objects for easy lookup
        const projectMap = new Map();
        response.forEach((property: Property) => {
          projectMap.set(property.id, property);
        });
        setProjectsMap(projectMap);
        
        // Format options for Select component
        const formattedOptions = response.map((property: Property) => ({
          value: property.id,
          label: property.name,
        }));
        setProjectOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Function to fetch apartments for a specific project
  const fetchApartmentsForProject = async (projectId: string) => {
    if (!projectId) return;
    
    try {
      console.log("Fetching apartments for project ID:", projectId);
      const data = await getProjectApartements(projectId);

      const formattedOptions = data.map((apartment: Apartment) => ({
        value: apartment.id,
        label: apartment.name || `Apartment ${apartment.number || apartment.id}`,
      }));
      
      setApartmentOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      setApartmentOptions([]);
    }
  };

  // Handle project selection
  const handleProjectSelect = (value: string, name: string) => {
    if (value) {
      setCurrentProjectId(value);
      fetchApartmentsForProject(value);
    }
  };

  // Handle apartment selection
  const handleApartmentSelect = (value: string, name: string) => {
    if (value) {
      // Clear any previously selected apartment IDs to implement single selection
      // Comment this line out to enable multi-select
      // setCurrentApartmentIds([]);
      
      // Add apartment to current selection if not already added
      if (!currentApartmentIds.includes(value)) {
        setCurrentApartmentIds(prev => [...prev, value]);
      }
    }
  };

  // Add currently selected project and apartments to the selectedProjects list
  const handleAddProjectInterest = () => {
    if (!currentProjectId || currentApartmentIds.length === 0) return;
    
    const project = projectsMap.get(currentProjectId);
    if (!project) return;
    
    // Get apartment details for selected apartment IDs
    const selectedApts = currentApartmentIds.map(id => {
      const apt = apartmentOptions.find(opt => opt.value === id);
      return {
        id,
        name: apt ? apt.label : `Apartment ${id}`
      };
    });
    
    // Check if this project is already in the list
    const existingProjectIndex = selectedProjects.findIndex(
      p => p.projectId === currentProjectId
    );
    
    if (existingProjectIndex >= 0) {
      // Update existing project
      const updatedProjects = [...selectedProjects];
      
      // Add only new apartments
      const existingAptIds = new Set(updatedProjects[existingProjectIndex].apartments.map(a => a.id));
      const newApts = selectedApts.filter(apt => !existingAptIds.has(apt.id));
      
      updatedProjects[existingProjectIndex] = {
        ...updatedProjects[existingProjectIndex],
        apartments: [...updatedProjects[existingProjectIndex].apartments, ...newApts]
      };
      
      setSelectedProjects(updatedProjects);
    } else {
      // Add as new project
      setSelectedProjects(prev => [
        ...prev,
        {
          projectId: currentProjectId,
          projectName: project.name,
          apartments: selectedApts
        }
      ]);
    }
    
    // Reset current apartment selection
    setCurrentApartmentIds([]);
  };

  // Remove a project from the selected list
  const handleRemoveProject = (projectId: string) => {
    setSelectedProjects(prev => prev.filter(p => p.projectId !== projectId));
  };

  // Remove an apartment from a project
  const handleRemoveApartment = (projectId: string, apartmentId: string) => {
    setSelectedProjects(prev => 
      prev.map(p => {
        if (p.projectId === projectId) {
          // Remove the apartment
          const updatedApartments = p.apartments.filter(a => a.id !== apartmentId);
          
          // If no apartments left, remove the whole project
          if (updatedApartments.length === 0) {
            return null;
          }
          
          return {
            ...p,
            apartments: updatedApartments
          };
        }
        return p;
      }).filter(Boolean) as SelectedProject[]
    );
  };

  const handleSelectChange = (selectedValue: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
    }));
  }

  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <Button size="sm" onClick={openModal}>
        Add Client
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[784px] p-5 lg:p-10"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Lead Information
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="col-span-1">
              <Label>Status <span className="text-red-500">*</span></Label>
              <Select
                options={status}
                name="status"
                placeholder=""
                defaultValue={status[1].value}
                onChange={(value, name) => handleSelectChange(value, name)}
              />
            </div>
            <div className="col-span-1">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                name="email"
                type="text"
                placeholder="e.g. john.doe@example.com"
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="col-span-1">
              <Label>Phone Number <span className="text-red-500">*</span></Label>
              <Input
                name="phoneNumber"
                type="phone"
                placeholder="e.g. 123-456-7890"
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <Label>How did you hear about us? <span className="text-red-500">*</span></Label>
              <Input
                name="provenance"
                type="text"
                placeholder="e.g. Google, Referral"
                onChange={handleChange}
              />
              {errors.provenance && <p className="mt-1 text-sm text-red-500">{errors.provenance}</p>}
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <h5 className="mb-2 font-medium text-gray-800 dark:text-white/90">
                Interested Properties
              </h5>
              
              <div className="p-4 mb-4 border rounded-lg border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label>Select Project</Label>
                    <Select
                      options={projectOptions}
                      name="projectId"
                      placeholder="Select a project"
                      onChange={handleProjectSelect}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Select Apartment(s)</Label>
                    <Select
                      options={apartmentOptions}
                      name="apartmentId"
                      placeholder="Select an apartment"
                      onChange={handleApartmentSelect}
                    />
                  </div>
                </div>
                
                {currentApartmentIds.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Currently selected apartments:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentApartmentIds.map(id => {
                        const apt = apartmentOptions.find((a: any) => a.value === id);
                        return apt ? (
                          <span key={id} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                            {apt.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm" 
                    onClick={handleAddProjectInterest}
                    disabled={!currentProjectId || currentApartmentIds.length === 0}
                  >
                    Add to Interests
                  </Button>
                </div>
              </div>
              
              {/* Display selected projects and apartments */}
              {selectedProjects.length > 0 && (
                <div className="p-4 mt-2 border rounded-lg border-gray-200 dark:border-gray-700">
                  <h6 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                    Client's Property Interests:
                  </h6>
                  
                  <div className="space-y-3">
                    {selectedProjects.map(project => (
                      <div key={project.projectId} className="p-3 border rounded-md border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {project.projectName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(project.projectId)}
                            className="p-1 text-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.apartments.map(apt => (
                            <div key={apt.id} className="flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                              <span>{apt.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveApartment(project.projectId, apt.id)}
                                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}