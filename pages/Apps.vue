<template>
  <div>
    <v-text-field
      ref="searchTextField"
      v-model="searchTextField"
      label="Search Map"
      @keydown="searchAddress()"
      color="rgba(65, 27, 153, 0.95)"
      outlined
    ></v-text-field>

    <GmapMap
      :center="{ lat: 20.046143, lng: 99.876203 }"
      :zoom="15"
      map-type-id="terrain"
      style="height: 650px"
    >

    
      <!-- Markers -->
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
      />

      <!-- Polyline -->
      <GmapPolyline
        :path="markers.map(marker => marker.position)"
        :options="{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTextField: "", // Use v-model directly in data
      place: "",
      selectedAddress: "",
      autocomplete: null, // Initialize as null
      markers: [
        { position: { lng: 99.876470, lat: 20.043806 } },
        { position: { lng: 99.873938, lat: 20.031244 } }
      ]
    };
  },
  methods: {
    async searchAddress() {
      // Access the ref using this.$refs
      var address1Field = this.$refs.searchTextField.$el;
      this.autocomplete = new google.maps.places.Autocomplete(address1Field, {
        componentRestrictions: {},
        fields: ["address_components", "geometry"],
        types: ["address"],
      });
      address1Field.focus();
      this.autocomplete.addListener("place_changed", this.fillInAddress);
    },
    fillInAddress() {
      this.place = this.autocomplete.getPlace();
      this.selectedAddress = this.place.address_components;
      console.log(this.selectedAddress);
    }
  },
};
</script>
