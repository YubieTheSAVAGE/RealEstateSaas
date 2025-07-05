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
      marginBottom: '5px',
      color: 'var(--text-color, #000)'
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
      defaultCenter={[projectLocation.latitude, projectLocation.longitude]} // [latitude, longitude]
      defaultZoom={17}
      height={400}
    >
      <Marker 
        width={80}
        anchor={[projectLocation.latitude, projectLocation.longitude]}
      >
        <CustomMarker name={projectName} />
      </Marker>
      <ZoomControl />
    </Map>
  );
};

export default ProjectMap;
