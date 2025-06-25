'use client';

import { Map, Marker, ZoomControl } from 'pigeon-maps';

const CustomMarker = ({ name }: { name: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      background: 'white', 
      padding: '4px 8px', 
      borderRadius: '4px', 
      fontSize: '12px', 
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      marginBottom: '5px'
    }}>
      {name}
    </div>
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '12px solid red',
      margin: '0 auto'
    }} />
  </div>
);

interface ProjectMapProps {
  projectName: string;
  projectLocation: {
    latitude: number;
    longitude: number;
  };
}

const ProjectMap = ({ projectName, projectLocation }: ProjectMapProps) => {
  return (
    <Map
      defaultCenter={[32.2340593, -7.9465522]} // [latitude, longitude]
      defaultZoom={17}
      height={400}
    >
      <Marker 
        width={80}
        anchor={[32.2340593, -7.9465522]}
      >
        <CustomMarker name="Project Location" />
      </Marker>
      <ZoomControl />
    </Map>
  );
};

export default ProjectMap;
