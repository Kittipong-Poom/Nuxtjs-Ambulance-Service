<template>
    <div>
      <div id="map" style="height: 500px;"></div>
      <button @click="getCurrentLocation">ตำแหน่งของรถฉุกเฉิน</button>
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
    },
    data() {
    return {
        currentLocationMarker: null
    };
    },
    methods: {
      getCurrentLocation() {
        // รับตำแหน่งปัจจุบันของผู้ใช้
        navigator.geolocation.getCurrentPosition(position => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
  
          // เพิ่มเครื่องหมายตำแหน่งปัจจุบัน
          // สร้างเครื่องหมายแบบไอคอนกำหนดเอง
        var redIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
        });

        // เพิ่ม marker โดยใช้ไอคอนที่กำหนดเอง
        if (this.currentLocationMarker) {
        this.map.removeLayer(this.currentLocationMarker);
      }

      // เพิ่มเครื่องหมายตำแหน่งปัจจุบันใหม่
      this.currentLocationMarker = L.marker([latitude, longitude], { icon: redIcon }).addTo(this.map)
        .bindPopup('ตำแหน่งล่าสุด')
        .openPopup();

  
          // ย้ายมุมมองแผนที่ไปยังตำแหน่งปัจจุบัน
          this.map.setView([latitude, longitude], 13);
        }, error => {
          // หากเกิดข้อผิดพลาดในการรับตำแหน่ง
          console.error('Error getting location:', error);
        });
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
  