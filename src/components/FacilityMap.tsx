import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite doesn't resolve Leaflet's default marker asset paths automatically —
// point them at the bundled images explicitly.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface FacilityMapProps {
  userLat: number;
  userLon: number;
  userZip: string;
  facilityLat: number;
  facilityLon: number;
  facilityName: string;
}

export default function FacilityMap({
  userLat,
  userLon,
  userZip,
  facilityLat,
  facilityLon,
  facilityName,
}: FacilityMapProps) {
  const bounds = L.latLngBounds(
    [userLat, userLon],
    [facilityLat, facilityLon]
  );

  return (
    <div className="rounded-xl overflow-hidden border border-mist-gray h-64">
      <MapContainer
        bounds={bounds}
        boundsOptions={{
          // Extra top-left padding keeps markers clear of the zoom control widget,
          // which sits in that corner and can otherwise overlap a pin.
          paddingTopLeft: [50, 50],
          paddingBottomRight: [24, 24],
        }}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLat, userLon]}>
          <Popup>Your zip code: {userZip}</Popup>
        </Marker>
        <Marker position={[facilityLat, facilityLon]}>
          <Popup>{facilityName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
