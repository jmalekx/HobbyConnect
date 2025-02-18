<!-- 
 * Component for managing and displaying a list of hobbies.
-->


<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary">Hobbies List</h2>

    <!-- Display the list of hobbies -->
    <ul class="list-group mb-4">
      <li v-for="hobby in hobbiesStore.hobbies" :key="hobby.id"
        class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ hobby.name }}</strong> - {{ hobby.description }}
        </div>
      </li>
    </ul>

    <!-- Form to add a new hobby -->
    <div class="card p-4">
      <h4 class="text-secondary mb-3">Add a New Hobby</h4>
      <form @submit.prevent="addHobby">
        <div class="mb-3">
          <label for="hobbyName" class="form-label">Hobby Name</label>
          <input id="hobbyName" v-model="hobbyName" type="text" class="form-control" placeholder="Enter hobby name"
            required />
        </div>
        <div class="mb-3">
          <label for="hobbyDescription" class="form-label">Hobby Description</label>
          <textarea id="hobbyDescription" v-model="hobbyDescription" class="form-control" rows="3"
            placeholder="Enter hobby description"></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Add Hobby</button>
      </form>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useHobbiesStore } from "../stores/hobbiesStore";

export default defineComponent({
  name: "HobbyForm",
  setup() {
    const hobbyName = ref("");
    const hobbyDescription = ref("");
    const hobbiesStore = useHobbiesStore();


    onMounted(() => {
      hobbiesStore.fetchHobbies();
    });

    const addHobby = async () => {
      if (!hobbyName.value.trim()) {
        alert("Hobby name is required.");
        return;
      }

      await hobbiesStore.addHobby({
        name: hobbyName.value.trim(), // Trim whitespace
        description: hobbyDescription.value.trim(),
      });

      hobbyName.value = "";
      hobbyDescription.value = "";
    };

    return {
      hobbyName,
      hobbyDescription,
      hobbiesStore,
      addHobby,
    };
  },
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>