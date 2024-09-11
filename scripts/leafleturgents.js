import L from 'leaflet';
import axios from 'axios';

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV === 'development' ? process.env.API_URL_DEVELOPMENT : "https://ambulanceserver-uuhg.onrender.com",
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
    const response = await axios.get(this.endpointUrl + `/api/latlongurgent`);
    console.log(response.data); // Log API response
    this.createMarkers(response.data); // Pass the correct data format
  } catch (error) {
    console.error('Error fetching markers:', error);
  }
},

createMarkers(markerDataArray) {
  console.log(markerDataArray); // Log marker data array
  // Clear existing markers from the map
  this.markers.forEach(marker => {
    marker.remove();
  });
  this.markers = [];

  markerDataArray.forEach(markerData => {
    const lat = parseFloat(markerData.lati);
    const lng = parseFloat(markerData.longi);
    const stat = markerData.status;
    var redIcon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    let markerInstance = L.marker([lat, lng], { icon: redIcon }).addTo(this.map); // Add marker to map
    // Add popup to each marker to display status
    markerInstance.bindPopup(` ${stat}`);
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