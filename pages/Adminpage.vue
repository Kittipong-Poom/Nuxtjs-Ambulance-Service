<template>

    <v-card>
        <v-card-title class="text-center d-flex justify-center align-center">
            <span class="text-2xl font-semibold">ตารางข้อมูลผู้ใช้งาน</span>
            <!-- ปุ่มกลับหน้าหลัก -->

        </v-card-title>
        <v-row class="justify-space-between">
            <v-col cols="2">
                <!-- ปุ่มเพิ่มผู้ใช้ -->
                <v-btn color="black" class="white--text mb-2" @click="openAddDialog">
                    เพิ่มผู้ใช้งาน
                </v-btn>
            </v-col>
            <v-col cols="2">
                <!-- ปุ่มกลับหน้าหลัก -->
                <v-btn color="primary" class="white--text" @click="goToHome">
                    กลับหน้าหลัก
                </v-btn>
            </v-col>
        </v-row>



        <!-- ตารางข้อมูล -->
        <v-data-table :headers="headers" :items="users" item-key="user_id" class="elevation-1" hide-default-footer>
            <template v-slot:item.action="{ item }">
                <!-- ปุ่มแก้ไข -->
                <v-btn color="#4CAF50" class="mr-2 mb-2 white--text mt-2" @click="openEditDialog(item)">
                    <v-icon>mdi-pencil-box-multiple-outline</v-icon>
                    แก้ไข
                </v-btn>
                <!-- ปุ่มลบ -->
                <v-btn color="red" class="white--text mb-2" @click="openDeleteDialog(item)">
                    <v-icon>mdi-delete</v-icon>
                    ลบ
                </v-btn>
            </template>
        </v-data-table>

        <!-- ป๊อปอัปยืนยันการลบ -->
        <v-dialog v-model="isDeleteDialogOpen" max-width="400">
            <v-card>
                <v-card-title class="headline">ยืนยันการลบ</v-card-title>
                <v-card-text>
                    คุณต้องการลบผู้ใช้งานนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-row>
                        <v-col cols="6">
                            <v-btn color="red" class="white--text mb-2" @click="confirmDelete">ลบ</v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn color="green" class="white--text mb-2" @click="closeDeleteDialog">ยกเลิก</v-btn>
                        </v-col>

                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- ป๊อปอัปแก้ไขข้อมูล -->
        <v-dialog v-model="isEditDialogOpen" max-width="500">
            <v-card>
                <v-card-title class="headline justify-center">แก้ไขข้อมูลผู้ใช้งาน</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editedUser.name" label="ชื่อผู้ใช้งาน" outlined clearable />
                    <v-text-field v-model="editedUser.username" label="รหัสผู้ใช้งาน" outlined clearable />
                    <v-text-field v-model="editedUser.password" label="รหัสผ่าน" outlined clearable />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-row>
                        <v-col>
                            <v-btn color="green" class="white--text mb-2" @click="confirmEdit">บันทึก</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="red" class="white--text mb-2" @click="closeEditDialog">ยกเลิก</v-btn>
                        </v-col>
                    </v-row>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- ป๊อปอัปเพิ่มผู้ใช้ -->
        <v-dialog v-model="isAddDialogOpen" max-width="500">
            <v-card>
                <v-card-title class="headline justify-center">เพิ่มข้อมูลผู้ใช้งาน</v-card-title>
                <v-card-text>
                    <v-text-field v-model="newUser.name" label="ชื่อผู้ใช้งาน" outlined clearable />
                    <v-text-field v-model="newUser.username" label="รหัสผู้ใช้งาน" outlined clearable />
                    <v-text-field v-model="newUser.password" label="รหัสผ่าน" outlined clearable />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-row>
                        <v-col>
                            <v-btn color="green" class="white--text mb-2" @click="confirmAdd">บันทึก</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="red" class="white--text mb-2" @click="closeAddDialog">ยกเลิก</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>

</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            headers: [
                { text: "ชื่อผู้ใช้งาน", value: "name", align: "center" },
                { text: "รหัสผู้ใช้งาน", value: "username", align: "center" },
                { text: "รหัสผ่าน", value: "password", align: "center" },
                { text: "", value: "action", align: "center" },
            ],
            users: [],
            endpointUrl: process.env.NODE_ENV == 'development' ? process.env.API_URL_DEVELOPMENT : 'https://server-nuxtjs-ambulance.onrender.com',
            isDeleteDialogOpen: false,
            userToDelete: null,
            isEditDialogOpen: false,
            isAddDialogOpen: false,
            editedUser: {},
            newUser: {
                name: "",
                username: "",
                password: "",
            },
        };
    },
    async created() {
        try {
            const response = await axios.get(`${this.endpointUrl}/api/user`);
            this.users = response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        if (!localStorage.getItem('Adminuser')) {
            this.$router.push('/');
        }
    },
    methods: {
        openDeleteDialog(user) {
            this.userToDelete = user;
            this.isDeleteDialogOpen = true;
        },
        closeDeleteDialog() {
            this.userToDelete = null;
            this.isDeleteDialogOpen = false;
        },
        async confirmDelete() {
            if (!this.userToDelete) return;
            try {
                await axios.delete(
                    `${this.endpointUrl}/api/user/${this.userToDelete.user_id}`
                );
                // รีเฟรชข้อมูลผู้ใช้หลังจากลบ
                const response = await axios.get(`${this.endpointUrl}/api/user`);
                this.users = response.data; // อัปเดตข้อมูลใน users
                console.log(`User with ID ${this.userToDelete.user_id} deleted.`);
            } catch (error) {
                console.error(
                    `Error deleting user with ID ${this.userToDelete.user_id}:`,
                    error
                );
            } finally {
                this.closeDeleteDialog();
            }
        },
        openEditDialog(user) {
            this.editedUser = { ...user };
            this.isEditDialogOpen = true;
        },
        closeEditDialog() {
            this.editedUser = {};
            this.isEditDialogOpen = false;
        },
        async confirmEdit() {
            try {
                await axios.put(
                    `${this.endpointUrl}/api/user/${this.editedUser.user_id}`,
                    this.editedUser
                );

                // รีเฟรชข้อมูลผู้ใช้หลังจากแก้ไข
                const response = await axios.get(`${this.endpointUrl}/api/user`);
                this.users = response.data; // อัปเดตข้อมูลใน users
                console.log(`User with ID ${this.editedUser.user_id} updated.`);
            } catch (error) {
                console.error(
                    `Error updating user with ID ${this.editedUser.user_id}:`,
                    error
                );
            } finally {
                this.closeEditDialog();
            }
        },
        openAddDialog() {
            this.newUser = { name: "", username: "", password: "" }; // เริ่มต้นค่าว่าง
            this.isAddDialogOpen = true;
        },
        closeAddDialog() {
            this.isAddDialogOpen = false;
        },
        async confirmAdd() {
            try {
                await axios.post(`${this.endpointUrl}/api/user`, this.newUser);
                // รีเฟรชข้อมูลผู้ใช้หลังจากเพิ่ม
                const response = await axios.get(`${this.endpointUrl}/api/user`);
                this.users = response.data; // อัปเดตข้อมูลใน users
                console.log(`User added.`);
            } catch (error) {
                console.error(`Error adding user:`, error);
            } finally {
                this.closeAddDialog();
            }
        },
        goToHome() {
            this.$router.push('/'); // เปลี่ยนเส้นทางไปหน้าหลัก
        }
    },
};
</script>