import React from "react";


export default function PropertyPage( {
    params,
}: {
    params: { propertyId: string };
} ) {
    return (
        <div>
        <h1>Property Page</h1>
        <p>This is the property page.</p>
        </div>
    );
    }