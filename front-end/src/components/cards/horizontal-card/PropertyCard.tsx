import React from "react";
import { Property } from "@/types/property";
import { PhotoProvider } from "react-photo-view";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div>
      <h2>{property.type}</h2>
      <p>{property.price}</p>
    </div>
  );
};

export default PropertyCard;
