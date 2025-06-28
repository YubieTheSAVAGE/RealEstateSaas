import React, { useState } from "react";
import { Card } from "../../ui/card";
import Image from "next/image";
import { Company } from "../../../types/Company";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Button from "../../ui/button/Button";
import { TbEdit } from "react-icons/tb";

interface CompanyCardProps {
  company: Company;
  onEdit?: () => void;
  onSave?: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onEdit, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Company>(company);
  const [errors, setErrors] = useState<{ [K in keyof Company]?: string }>({});
  const [isDirty, setIsDirty] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(typeof company.logo === 'string' ? company.logo : '');

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setForm(company);
    setLogoPreview(typeof company.logo === 'string' ? company.logo : '');
    setIsEditing(false);
  };

  const handleSave = (data: Company) => {
    if (onSave) onSave(data);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        setLogoPreview(result);
        setForm(prev => ({ ...prev, logo: result }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations de l'entreprise</h2>
          <p className="text-gray-600 mt-1">Gérez les informations de votre entreprise</p>
        </div>
        {!isEditing ? (
          <Button size="sm" onClick={handleEdit} className="shrink-0">
            <TbEdit className="w-4 h-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel} type="button">Annuler</Button>
            <Button size="sm" onClick={() => handleSave(form)} type="submit" disabled={!isDirty}>Sauvegarder</Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <form onSubmit={() => handleSave(form)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Company Profile Card */}
          <Card>
            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
                    <Image 
                      src={logoPreview} 
                      alt={form.name} 
                      width={160} 
                      height={160} 
                      className="rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {!isEditing ? (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900">{company.name}</h3>
                      <div className="inline-flex items-center gap-3 bg-gray-50 text-gray-700 rounded-full px-6 py-3 border border-gray-200">
                        <HiOutlineOfficeBuilding className="w-5 h-5" />
                        <span className="text-base font-medium">ICE: {company.iceNumber}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full text-2xl font-bold text-gray-900 text-center border border-gray-300 rounded-lg px-4 py-2 mb-2"
                        placeholder="Nom de l'entreprise"
                      />
                      {/* {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>} */}
                      <div className="inline-flex items-center gap-3 bg-gray-50 text-gray-700 rounded-full px-6 py-3 border border-gray-200">
                        <HiOutlineOfficeBuilding className="w-5 h-5" />
                        <input
                          name="iceNumber"
                          value={form.iceNumber}
                          onChange={handleInputChange}
                          className="text-base font-medium bg-transparent outline-none border-none"
                          placeholder="Numéro ICE"
                        />
                      </div>
                      {/* {errors.iceNumber && <span className="text-red-500 text-xs">{errors.iceNumber.message}</span>} */}
                    </>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-6 w-full flex flex-col items-center">
                    <label className="bg-white/80 px-4 py-2 rounded cursor-pointer text-xs font-medium border border-gray-300 shadow w-full text-center">
                      Changer le logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="xl:col-span-2 space-y-4">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordonnées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border border-red-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <HiOutlineLocationMarker className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">
                        Adresse
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          {company.address}
                        </p>
                      ) : (
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleInputChange}
                          className="w-full text-sm font-medium text-gray-900 leading-relaxed border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Adresse complète"
                        />
                      )}
                      {/* {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>} */}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <HiOutlinePhone className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                        Téléphone
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium text-gray-900">
                          {company.phone}
                        </p>
                      ) : (
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Numéro de téléphone"
                        />
                      )}
                      {/* {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>} */}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 md:col-span-2">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <HiOutlineMail className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      {!isEditing ? (
                        <p className="text-sm font-medium text-gray-900">
                          {company.email}
                        </p>
                      ) : (
                        <input
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Adresse email"
                        />
                      )}
                      {/* {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>} */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Important Notice */}
            <Card>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <HiOutlineExclamationTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-amber-900 mb-2">
                      Information importante
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Assurez-vous que toutes les informations de votre entreprise sont correctes et à jour. 
                      Ces données sont utilisées dans vos contrats et documents légaux.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Contrats
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Documents légaux
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Facturation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyCard;
