<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <!-- HN AND AGE -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field disabled v-model="editedItem.hn_id" outlined label="HN (Hospital Number)*"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field disabled v-model="editedItem.age_name" outlined label="อายุ"></v-text-field>
            </v-col>
          </v-row>

          <!-- GENDER AND COORDINATE AND OTHER -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field disabled v-model="editedItem.gender" outlined label="เพศ"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field disabled v-model="editedItem.coordinate" outlined label="จุดเกิดเหตุ/พิกัด"></v-text-field>
            </v-col>
          </v-row>
          <v-text-field disabled v-model="editedItem.other" label="เพิ่มเติม" outlined
            :rules="[rules.other]"></v-text-field>

          <!-- วันที่ -->
          <v-row>
            <v-col cols="12" md="6">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                :return-value.sync="editedItem.service_date" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" outlined prepend-icon="mdi-calendar"
                    readonly v-bind="attrs" v-on="on" clearable></v-text-field>
                </template>
                <v-date-picker v-model="dateString" no-title scrollable locale="th" :min="new Date().toISOString()">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(dateString)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <!-- Time -->
            <v-col cols="12" md="6">
              <v-text-field v-model="editedItem.time" label="เวลา" outlined
                prepend-icon="mdi-clock-outline"></v-text-field>
            </v-col>
          </v-row>

          <!-- Status -->
          <v-select v-model="editedItem.status_case_id" label="สถานะ" outlined :items="items_status"
            item-text="casestatus_name" item-value="casestatus_id"></v-select>
        </v-card-text>

        <!-- Save -->
        <v-card-actions>
          <v-btn color="blue darken-1" class="white--text" @click="save">บันทึก</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="closeDialog">ยกเลิก</v-btn>
        </v-card-actions>

      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import axios from 'axios'

export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
    fieldsToDisplay: Array, // Add a prop to specify which fields to display
  },
  data() {
    return {
      endpointUrl: process.env.NODE_ENV == 'development' ? 'http://localhost:5000' : 'https://ambulance-fbf9.onrender.com',
      items_status: [],
      selectedStatus: '',
      dialogVisible: false,
      date: new Date().toISOString(),
      menu: false,
      rules: {
        other: (value) => {
          if (!value) return "กรอกรายละเอียดเพิ่มเติม";
          return true;
        },
      },

    };
  },
  computed: {
    formattedDate() {
      console.log(this.editedItem.service_date);
      if (!this.editedItem.service_date) {
        return '';
      }
      const thaiDate = dayjs(this.editedItem.service_date).add(543, 'year');
      return thaiDate.format('DD-MM-YYYY')
    },
  },
  async created() {
    console.log(this.editedItem);
    const { data } = await axios.get(this.endpointUrl + '/api/status');
    this.items_status = data;
    console.log(this.items_status);
  },
  methods: {
    async save() {
      try {
        this.$emit('notificationSaved');
        if (this.validateForm()) {
          if (!this.editedItem.status_case_id) {
            // Display an error message if casestatus is not selected
            this.$emit('error', 'Please select a status.');
            return; // Exit early if casestatus is not selected
          }
          this.editedItem.service_date = this.formattedDate;
          this.$emit('save', this.editedItem);
          this.closeDialog();
        }
      } catch (error) {
        console.error('Error saving item:', error);
      }
    },

    closeDialog() {
      if (this.dialog) {
        this.dialog = false;
        this.dialogVisible = false;
        this.$emit('close-dialog');
      }
    },

    validateForm() {
      for (const key in this.editedItem) {
        const fieldRef = this.$refs[key];
        if (fieldRef && fieldRef.validate) {
          fieldRef.validate();
          if (fieldRef.hasError) {
            return false;
          }
        }
      }
      return true;
    },
  },
};
</script>