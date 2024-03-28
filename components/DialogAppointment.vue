<template>
  <v-dialog v-model="dialog" max-width="1500">
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <v-text-field v-model="editedItem.hn_id" label="HN (Hospital Number)*"></v-text-field>
          <v-text-field readonly v-model="editedItem.age_name"></v-text-field>
          <v-text-field readonly v-model="editedItem.gender"></v-text-field>
          <v-text-field readonly v-model="editedItem.coordinate" label="จุดเกิดเหตุ/พิกัด"></v-text-field>
          <v-text-field readonly v-model="editedItem.other" label="เพิ่มเติม" :rules="[rules.other]"></v-text-field>

          <!-- Date -->
          <!-- <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="editedItem.service_date"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" prepend-icon="mdi-calendar" readonly
                v-bind="attrs" v-on="on" clearable></v-text-field>
            </template>

<v-date-picker v-model="date" no-title scrollable locale="th" :min="today">
  <v-spacer></v-spacer>
  <v-btn text color="primary" @click="menu = false">
    ยกเลิก
  </v-btn>
  <v-btn text color="primary" @click="$refs.menu.save(date)">
    ตกลง
  </v-btn>
</v-date-picker>
</v-menu> -->
          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="editedItem.service_date"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formattedDate" label="วันที่นัดหมาย" prepend-icon="mdi-calendar" readonly
                v-bind="attrs" v-on="on" clearable></v-text-field>
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




          <!-- Time -->
          <v-text-field v-model="editedItem.time" label="เวลา" prepend-icon="mdi-clock-outline"></v-text-field>
          <!-- Status -->
          <v-select v-model="editedItem.status_case_id" label="สถานะ" :items="items_status" item-text="casestatus_name"
            item-value="casestatus_id"></v-select>

        </v-card-text>

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
      viewMode: false,
    };
  },
  computed: {
    // formattedDate() {
    //   console.log('date',this.date);
    //   if (!this.date) {
    //     return '';
    //   }
    //   const thaiDate = dayjs(this.date).add(543, 'year');
    //   const thaiFormattedDate = thaiDate.format('DD-MM-YYYY');
    //   return thaiFormattedDate;
    // },
    formattedDate() {

      console.log(this.editedItem.service_date);
      // if (this.editedItem.service_date) {
      //   const thaiLocale = 'th-TH';
      //   return this.editedItem.service_date.toLocaleDateString(thaiLocale);
      // } else {
      //   return '';
      // }
      if (!this.editedItem.service_date) {
        return '';
      }
      const thaiDate = dayjs(this.editedItem.service_date).add(543, 'year');
      return thaiDate.format('DD-MM-YYYY')
    },
    readonlyHnNumber() {
      // If the dialog is in view mode or if the dialog is for editing existing patient, make HN number readonly
      return this.viewMode || this.dialogTitle.includes('นัดหมาย');
    },
    readonlyAge() {
      // If the dialog is in view mode or if the dialog is for editing existing patient, make HN number readonly
      return this.viewMode || this.dialogTitle.includes('นัดหมาย');
    },
    readonlyGender() {
      // If the dialog is in view mode or if the dialog is for editing existing patient, make HN number readonly
      return this.viewMode || this.dialogTitle.includes('นัดหมาย');
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
        if (!this.viewMode && this.validateForm()) {
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
    // selectStatus() {
    //   // Method to update selectedStatus when v-select value changes
    //   this.editedItem.casestatus = this.selectedStatus;
    // },
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
