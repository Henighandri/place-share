import React from 'react';
import {Map,Layers,layer} from 'react-openlayers'
import './Map.css';

const MyMap = props => {
  const lat=props.center.lat;
  const lng=props.center.lng;
  const zoom=props.zoom
  console.log("lat=",lat, "lng=",lng ,"zoom=",zoom)

  return (
    <div className={`map ${props.className}`}
      style={props.style}
    >
  <Map view={{center:[parseFloat({lat}),parseFloat({lng})],zoom:{zoom}}}>
    <Layers>
      <layer.Tile></layer.Tile>
    </Layers>
  </Map>

    </div>
  );
};

export default MyMap;