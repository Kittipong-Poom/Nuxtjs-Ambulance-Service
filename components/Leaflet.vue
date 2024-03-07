<template>
  <div>
    <div id="map"></div>
    <v-btn class="mt-2" @click="getCurrentLocation" style="position: absolute; bottom: 20%; ">ตำแหน่งของรถฉุกเฉิน</v-btn>
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  mounted() {
    // Create Leaflet map
    this.map = L.map('map').setView([20.04489742406062, 99.89451960806792], 13); // Initial position at [0, 0] and map size 13

    // Add OSM base map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },
  data() {
    return {
      currentLocationMarker: null
    };
  },
  methods: {
    getCurrentLocation() {
      // Get user's current position
      navigator.geolocation.getCurrentPosition(position => {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Add current location marker
        var redIcon = L.icon({
          iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        // Add marker using custom icon
        if (this.currentLocationMarker) {
          this.map.removeLayer(this.currentLocationMarker);
        }

        // Add new current location marker
        this.currentLocationMarker = L.marker([latitude, longitude], { icon: redIcon }).addTo(this.map)
          .bindPopup('ตำแหน่งล่าสุดของคุณ')
          .openPopup();

        // Move map view to current position
        this.map.setView([latitude, longitude], 13);
      }, error => {
        // If there's an error getting the location
        console.error('Error getting location:', error);
      });
    }
  }
}
</script>

<style>
/* Additional styles for aesthetics (optional) */

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 75%;
}
</style>
