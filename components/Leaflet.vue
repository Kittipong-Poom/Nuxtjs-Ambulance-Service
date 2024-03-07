<template>
    <div>
      <div id="map" style="height: 500px;"></div>
      
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  
  export default {
    mounted() {
      // สร้างแผนที่ Leaflet
      this.map = L.map('map').setView([20.04489742406062, 99.89451960806792], 13); // ตำแหน่งเริ่มต้นที่ [0, 0] และขนาดของแผนที่ 13
  
      // เพิ่มแผนที่ฐาน OSM
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.updateCurrentLocation, this.handleLocationError);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    },
    data() {
    return {
        currentLocationMarker: null
    };
    },
    methods: {
    updateCurrentLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        if (!this.currentLocationMarker) {
            var redIcon = L.icon({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            this.currentLocationMarker = L.marker([latitude, longitude], { icon: redIcon }).addTo(this.map)
                .bindPopup('ตำแหน่งล่าสุด')
                .openPopup();
        } else {
            this.currentLocationMarker.setLatLng([latitude, longitude]);
        }
             // ตรวจสอบว่าผู้ใช้กำลังมองแผนที่หรือไม่
        if (this.map.getBounds().contains([latitude, longitude])) {
            // อัปเดตตำแหน่งแต่ไม่ซูมเอ้าท์
            this.map.setView([latitude, longitude], this.map.getZoom());
        } else {
            // ซูมเข้าเฉพาะเมื่อผู้ใช้ไม่ได้มองแผนที่
            this.map.setView([latitude, longitude], 13);
        }
    },
    handleLocationError(error) {
        console.error('Error getting location:', error);
    }
}

  }
  </script>
  
  <style>
  /* เพิ่มสไตล์เพื่อความสวยงาม (ไม่จำเป็น) */
  #map {
    width: 100%;

  }
  </style>
  