import L from 'leaflet';
import axios from 'axios';

export default {
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
      map: null,
      markers: [],
      selectedYear: null, // Default no year selected
      years: []
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
        const markerDataArray = response.data;

        // Populate years based on the marker data using `service_date`
        this.populateYears(markerDataArray);
        
        // If a year is selected, filter markers by the selected year
        const filteredMarkers = this.selectedYear 
          ? markerDataArray.filter(marker => new Date(marker.service_date).getFullYear() === this.selectedYear) 
          : markerDataArray;

        this.createMarkers(filteredMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    },
    populateYears(markerDataArray) {
      const uniqueYears = new Set();
      markerDataArray.forEach(marker => {
        const eventYear = new Date(marker.service_date).getFullYear(); // Using `service_date` instead of `date`
        uniqueYears.add(eventYear);
      });

      this.years = Array.from(uniqueYears).sort((a, b) => b - a); // Sort in descending order
      if (!this.selectedYear && this.years.length > 0) {
        this.selectedYear = this.years[0]; // Set default year as the most recent year
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
    },
    onYearChange() {
      this.fetchMarkers(); // Fetch markers when the selected year changes
    }
  }
}