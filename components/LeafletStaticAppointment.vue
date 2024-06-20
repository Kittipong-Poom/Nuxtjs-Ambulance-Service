<template>
  <div>
    <div id="map" style="height: 100vh; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import axios from 'axios';

export default {
  data() {
    return {
endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' :  'http://localhost:5000',
      map: null,
      markers: []
    };
  },
  mounted() {
    this.initMap(); // Call map initialization method
    this.fetchMarkers(); // Fetch and display markers
  },
  methods: {
    async initMap() {
      // Initialize map code here
      this.map = L.map("map").setView([0, 0], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      // Lock pin to the current location

      this.map.on("locationfound", async (e) => {
        const { lat, lng } = e.latlng;
        this.map.setView([lat, lng], 15);
      });
    },

    async fetchMarkers() {
      try {
        const response = await axios.get(this.endpointUrl + `/api/latlongappoint`);
        console.log(response.data); // Log API response
        this.createMarkers(response.data); // Pass the correct data format
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    },

    createMarkers(markerDataArray) {
      // Clear existing markers from the map
      this.markers.forEach(marker => {
        marker.remove();
      });
      this.markers = [];

      markerDataArray.forEach(markerData => {
        const lat = parseFloat(markerData.lati);
        const lng = parseFloat(markerData.longi);
        const stat = markerData.status_case_id;
        // Create a popup content string with lati and longi values
        var redIcon = L.icon({
          iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
        const popupContent = `<b>ละติจูด:</b> ${lat}<br><b>ลองติจูด:</b> ${lng}<br><b>สถานะ:</b> ${stat}`;

        // Create a marker with the popup content
        let markerInstance = L.marker([lat, lng], { icon: redIcon }).bindPopup(popupContent).addTo(this.map);

        this.markers.push(markerInstance); // Add marker instance to the array
      });

      // Fit the map bounds to include all markers
      if (this.markers.length > 0) {
        let group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds());
      }
    }
  }
}
</script>


<style>
/* Add styles for aesthetics (optional) */
#map {
  width: 100%;
  position: relative;
  z-index: 1;
}
</style>