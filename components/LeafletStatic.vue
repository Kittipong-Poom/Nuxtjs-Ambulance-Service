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

    // ปรับแต่ง icon เป็นสีแดง
    const redIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // เพิ่มจุด Marker ในแผนที่
    L.marker([20.047451052798706, 99.89189808040975], { icon: redIcon }).addTo(this.map)
      .bindPopup('This is your marker!');
},


}
</script>

<style>
/* เพิ่มสไตล์เพื่อความสวยงาม (ไม่จำเป็น) */
#map {
  width: 100%;
}
</style>
