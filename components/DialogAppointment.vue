<template>
  <v-dialog v-model="dialog" max-width="1500" >
    <v-card>
      <v-card-title class="text-center d-flex justify-center align-center">
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
        <v-card-text>
          <!-- <v-text-field
            v-if="fieldsToDisplay.includes('date_service')"
            v-model="editedItem.date_service"
            label="วันที่นัดหมาย"
            prepend-icon="mdi-calendar"
            readonly
            clearable
          ></v-text-field> -->

          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="editedItem.date_service"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field  v-model="formattedDate"
                label="วันที่นัดหมาย" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                clearable></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable locale="th" :min="new Date().toISOString().substr(0, 10)">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                ยกเลิก
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                ตกลง
              </v-btn>

            </v-date-picker>
          </v-menu>
          <v-text-field  v-model="editedItem.time" label="เวลา"
            prepend-icon="mdi-clock-outline"></v-text-field>

            <v-select  v-model="selectedStatus"
            :items="['รอรับงาน', 'กำลังดำเนินงาน', 'เสร็จสิ้น']" label="สถานะ"
            @change="selectStatus" :return-value.sync="editedItem.casestatus"></v-select>
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

export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String,
    fieldsToDisplay: Array, // Add a prop to specify which fields to display
  },
  data() {
    return {
      selectedStatus: '',
      dialogVisible: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
    };
  },
  computed: {
    formattedDate() {
      if (!this.date) {
        return ' ';
      }
      const thaiDate = dayjs(this.date).add(543, 'year');
      const thaiFormattedDate = thaiDate.format('DD-MM-YYYY');
      return thaiFormattedDate;
    },
    
  },
  methods: {
    async save() {
      try {
        this.$emit('notificationSaved');
        if (!this.viewMode && this.validateForm()) {
          if (!this.editedItem.casestatus) {
            // Display an error message if casestatus is not selected
            this.$emit('error', 'Please select a status.');
            return; // Exit early if casestatus is not selected
          }

          this.editedItem.date_service = this.formattedDate;
          this.$emit('save', this.editedItem);
          this.closeDialog();
        }
      } catch (error) {
        console.error('Error saving item:', error);
      }
    },
    selectStatus() {
      // Method to update selectedStatus when v-select value changes
      this.editedItem.casestatus = this.selectedStatus;
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
