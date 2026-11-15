import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ItineraryItem } from '../types';

interface LeafletMapProps {
  items: ItineraryItem[];
  routeCoordinates?: [number, number][]; // [lat, lng] from OSRM
  className?: string;
  selectedItemId?: string;
  onSelectItem?: (item: ItineraryItem) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  items,
  routeCoordinates,
  className = 'h-96 w-full rounded-2xl overflow-hidden border border-[#26231E]',
  selectedItemId,
  onSelectItem
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center on India
    const defaultLat = items[0]?.lat || 20.5937;
    const defaultLng = items[0]?.lng || 78.9629;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: items.length > 0 ? 9 : 5,
      zoomControl: true,
      attributionControl: false
    });

    // Dark cinematic CartoDB Dark Matter tiles (free, OpenStreetMap data)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers & polylines when items change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const validItems = items.filter((item) => item.lat && item.lng);
    if (validItems.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];

    validItems.forEach((item, index) => {
      const isSelected = selectedItemId === item.id;
      const isDisrupted = item.status === 'disrupted';

      const markerColor = isDisrupted
        ? '#F43F5E' // Rose
        : isSelected
        ? '#F5A65B' // Amber
        : '#E5984A';

      // Custom SVG marker pin
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #141210;
            border: 2px solid ${markerColor};
            color: #EDE5DB;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-family: monospace;
            font-weight: bold;
            box-shadow: 0 0 12px ${markerColor}60;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([item.lat, item.lng], { icon }).addTo(layerGroup);

      // Popup
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #F5A65B; font-size: 13px;">${item.place}</strong><br/>
          <span style="color: #9E9589;">Day ${item.day} · ${item.start_time} - ${item.end_time}</span><br/>
          <span style="color: ${isDisrupted ? '#F43F5E' : '#10B981'}; font-weight: 500;">
            ${isDisrupted ? 'Disruption: ' + (item.disruption_reason || 'Severe weather') : 'Status: ' + item.status}
          </span>
        </div>
      `);

      if (onSelectItem) {
        marker.on('click', () => onSelectItem(item));
      }

      latLngs.push([item.lat, item.lng]);
    });

    // Draw Route Polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    const routeToDraw = (routeCoordinates && routeCoordinates.length > 0)
      ? routeCoordinates
      : (latLngs as [number, number][]);

    if (routeToDraw.length > 1) {
      const polyline = L.polyline(routeToDraw, {
        color: '#F5A65B',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);
      routePolylineRef.current = polyline;
    }

    // Fit bounds to show all markers nicely
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [items, routeCoordinates, selectedItemId]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
