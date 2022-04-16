import React from "react";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";

interface Props {
  location: { lat: number; lng: number };
  zoomLevel: number;
}

// const LocationPin = (props: { lat: number; lng: number }) => (
//   <div className="pin">
//     <RoomIcon className="pin-icon" />
//   </div>
// );

const Map = ({ location, zoomLevel }: Props) => {
  return (
    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyDOPN7JplFKBGQeHn2ISjO-vrH3K3VDsOU",
        }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        {/* <LocationPin lat={location.lat} lng={location.lng} /> */}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
