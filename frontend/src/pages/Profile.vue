<!-- 
* Component for displaying and managing the user's profile.
-->

<template>

  <!-- Display the user's profile information -->
  <div class="container mt-5">
    <h1 class="text-center text-primary">{{ title }}</h1>
    <div v-if="user">
      <h3 class="mb-3">User Profile</h3>
      <div class="card p-4 mb-4">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Date of Birth:</strong> {{ user.date_of_birth }}</p>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-primary" @click="openEditModal">Edit Profile</button>
      </div>

      <!-- Display the user's hobbies -->
      <h4 class="mb-3">Hobbies</h4>
      <div v-if="user.hobbies.length > 0">
        <ul class="list-group">
          <li v-for="(hobby, index) in user.hobbies" :key="hobby.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>{{ hobby.name }}:</strong> {{ hobby.description }}</span>
            <button type="button" class="btn btn-sm btn-danger" @click="deleteHobby(index)">Delete</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No hobbies listed.</p>
      </div>

      <!-- Add hobby dropdown -->
      <div class="mt-3">
        <label for="hobbyDropdown" class="form-label">Add Hobby</label>
        <select id="hobbyDropdown" class="form-select" v-model="selectedHobbyId">
          <option v-for="hobby in globalHobbies" :key="hobby.id" :value="hobby.id">
            {{ hobby.name }}
          </option>
        </select>
        <button type="button" class="btn btn-sm btn-success mt-2" @click="addHobbyFromDropdown">Add Hobby</button>
      </div>

    </div>

    <div v-else>
      <div class="text-center">
        <p>Loading...</p>
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileModalLabel">Edit Profile</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitEditProfile">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" class="form-control" v-model="editForm.name" />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" v-model="editForm.email" />
              </div>
              <div class="mb-3">
                <label for="dob" class="form-label">Date of Birth</label>
                <input type="date" id="dob" class="form-control" v-model="editForm.date_of_birth" />
              </div>
              <button type="submit" class="btn btn-success mt-3">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../stores/userStore";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface EditForm {
  name: string;
  email: string;
  date_of_birth: string;
}

export default defineComponent({
  data() {
    return {
      title: "Profile",
      editForm: {
        name: "",
        email: "",
        date_of_birth: "",
      } as EditForm,
      selectedHobbyId: null as number | null,
    };
  },
  computed: {
    user() {
      return useUserStore().currentUser; // Get the current user from the store
    },
    globalHobbies() {
      const hobbies = useUserStore().hobbies; // Get the list of global hobbies from the store
      return hobbies;
    },
  },
  async mounted(): Promise<void> {
    const userStore = useUserStore();
    await userStore.fetchCurrentUser();
    await userStore.fetchHobbies();
  },
  methods: {

    // Open the edit profile modal
    openEditModal(): void {
      const user = this.user;
      if (user) {
        this.editForm.name = user.name;
        this.editForm.email = user.email;
        this.editForm.date_of_birth = user.date_of_birth;
      }
      const modal = new bootstrap.Modal(document.getElementById("editProfileModal")!);
      modal.show();
    },

    async submitEditProfile(): Promise<void> {
  try {
    const userStore = useUserStore();

    // Call the Pinia action
    await userStore.updateUserProfile(this.editForm);

    // Close the modal after a successful update
    const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal")!);
    modal?.hide();
  } catch (error) {
    console.error("Error submitting edit profile:", error);
  }
},

    async deleteHobby(index: number): Promise<void> {
      if (!this.user) return;

      const hobby = this.user.hobbies[index];
      try {
        const userStore = useUserStore();
        await userStore.removeHobbyFromUser(hobby.id!);
        this.user.hobbies.splice(index, 1);
      } catch (error) {
        console.error("Error deleting hobby:", error);
      }
    },

    // Add hobby from dropdown to user's hobbies
    addHobbyFromDropdown(): void {
      if (this.selectedHobbyId === null) return;

      const selectedHobby = this.globalHobbies.find(hobby => hobby.id === this.selectedHobbyId);
      if (selectedHobby && this.user) {
        const alreadyExists = this.user.hobbies.some(h => h.id === selectedHobby.id);
        if (!alreadyExists) {
          this.user.hobbies.push(selectedHobby);
          this.updateUserHobbiesOnServer();
        }
      }
    },

    async updateUserHobbiesOnServer(): Promise<void> {
      if (!this.user) return;
      try {
        const userStore = useUserStore();
        await userStore.updateUserHobbiesOnServer();
      } catch (error) {
        console.error("Error adding hobby:", error);
      }
    },
  },
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
