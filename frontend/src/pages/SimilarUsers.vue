<!-- 
 * Vue component for displaying a list of similar users with shared hobbies and filtering options. 
 -->

<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary">Similar Users</h2>

    <!-- Display list of similar users -->
    <ul class="list-group mb-4">
      <li v-for="user in similarUsersStore.users" :key="user.id"
        class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>{{ user.name }}</strong></span>
        <span class="badge bg-secondary">{{ user.shared_hobbies_count }} shared hobbies</span>
      </li>
    </ul>

    <!-- Pagination controls -->
    <div class="d-flex justify-content-between mb-4">
      <button class="btn btn-outline-primary" @click="fetchSimilarUsers(similarUsersStore.prevUrl)"
        :disabled="!similarUsersStore.prevUrl">
        Previous
      </button>
      <button class="btn btn-outline-primary" @click="fetchSimilarUsers(similarUsersStore.nextUrl)"
        :disabled="!similarUsersStore.nextUrl">
        Next
      </button>
    </div>

    <!-- Filter by Age -->
    <div class="card p-4">
      <h4 class="text-secondary mb-3">Filter by Age</h4>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="min-age" class="form-label">Min Age</label>
          <input id="min-age" type="number" class="form-control" v-model="minAge" placeholder="Enter minimum age" />
        </div>
        <div class="col-md-6 mb-3">
          <label for="max-age" class="form-label">Max Age</label>
          <input id="max-age" type="number" class="form-control" v-model="maxAge" placeholder="Enter maximum age" />
        </div>
      </div>
      <div class="row">
        <button class="btn btn-primary" @click="updateFilters">Apply Filters</button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useSimilarUsersStore } from "../stores/similarUsersStore";

export default defineComponent({
  name: "SimilarUsers",
  setup() {
    const similarUsersStore = useSimilarUsersStore();
    const minAge = ref<number | null>(null);
    const maxAge = ref<number | null>(null);

    onMounted(() => {
      fetchSimilarUsers();
    });

    const fetchSimilarUsers = async (url: string | null = null) => {
      // Set default values if minAge or maxAge is blank
      const minAgeValue = minAge.value !== null ? minAge.value : 0;
      const maxAgeValue = maxAge.value !== null ? maxAge.value : 100;

      // If no URL is provided, use default
      let apiUrl = url || `http://localhost:8000/api/similar-users/`;

      const urlObj = new URL(apiUrl, window.location.origin);
      urlObj.searchParams.set("min_age", minAgeValue.toString());
      urlObj.searchParams.set("max_age", maxAgeValue.toString());

      // Fetch similar users from the constructed URL
      await similarUsersStore.fetchSimilarUsers(urlObj.toString());
    };

    const updateFilters = () => {
      fetchSimilarUsers();
    };

    return {
      similarUsersStore,
      minAge,
      maxAge,
      fetchSimilarUsers,
      updateFilters,
    };
  },
});
</script>

<style scoped>
/* Style for pagination buttons */
button {
  margin: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>