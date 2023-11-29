<template>  
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>
      <form @submit.prevent="save">
      <v-card-text>
        
        <!-- Your form fields go here -->
        <v-text-field v-model="editedItem.hnnumber" label="HN(Hospital Number)" :rules="[rules.hnnumber]" ></v-text-field>
        <v-text-field v-model="editedItem.age" label="Age" :rules="[rules.age]" ></v-text-field>
        <v-text-field v-model="editedItem.gender" label="Gender" :rules="[rules.gender]"></v-text-field>
        <v-text-field v-model="editedItem.numberphone" label="NumberPhone" :rules="[rules.phone]" ></v-text-field>
        <v-text-field v-model="editedItem.address" label="Address" :rules="[rules.address]"></v-text-field>
        <v-text-field v-model="editedItem.coordinate" label="Coordinate" :rules="[rules.coordinate]"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" @click="save">Save</v-btn>
        <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
      </v-card-actions>
      </form> 
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    editedItem: Object,
    dialogTitle: String
  },
  data (){
    return{
      rules: {
        hnnumber: (value) => !!value || "กรอกข้อมูลให้ครบ",

        phone:  (value) => {
          if (value?.length > 9 && /[0-9-]+/.test(value)) return true
        return 'Phone number needs to be at least 9 digits.'
        } ,

        address: (value) =>{
        if (value?.length >= 2) return true

        return 'ที่อยู่ต้องกรอกให้ชัดเจน'
        },
        gender: (value)=>{
          if (value?.length >=2) return true

          return 'กรุณากรอกเพศให้ถูกต้อง'
        },
        age:(value) =>{
          if (value?.length >1 && /[0-2-]+/.test(value)) return true
          return 'กรอกอายุให้ถูกต้อง'
        },
        coordinate:(value) => {
          if (value?.length >3 && /[0-4-]+/.test(value)) return true
          return 'กรอกพิกัด อย่างน้อย 4 ตัว'
        }
      }
    }
  },
  methods: {
    save() {
      // Save the edited item and close the dialog
      if(this.validateForm()){
      this.$emit('save', this.editedItem);
      this.close();
      } 
    },
    close() {
      // Close the dialog
      this.$emit('close');
    },
    validateForm(){
      for(const key in this.editedItem){
        if(!this.editedItem[key]){
          this.$refs[key].validate;
          return false;

        }
      }
      return true;
    }
  }
};
</script>


