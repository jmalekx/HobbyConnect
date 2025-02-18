<template>
  <div id="app" class="container mt-5 pb-5">
    <!-- Welcome Section -->
    <div class="text-center mb-4">
      <h1 v-if="userStore.currentUser" class="display-4 text-primary">
        Welcome, {{ userStore.currentUser.name }}!
      </h1>
      <h1 v-else class="display-4 text-secondary">
        Welcome!
      </h1>
    </div>

    <!-- Logout Button -->
    <div class="text-center mb-4">
      <button
        v-if="userStore.currentUser"
        @click="handleLogout"
        class="btn btn-danger px-4 py-2"
        aria-label="Log out of your account"
      >
        Logout
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="nav justify-content-center mb-4">
      <router-link
        class="nav-link btn btn-outline-primary mx-2"
        :to="{ name: 'Home' }"
      >
        Home
      </router-link>
      <router-link
        class="nav-link btn btn-outline-primary mx-2"
        :to="{ name: 'Profile' }"
      >
        Profile
      </router-link>
      <router-link
        class="nav-link btn btn-outline-primary mx-2"
        :to="{ name: 'Friends' }"
      >
        Friends
      </router-link>
      <router-link
        class="nav-link btn btn-outline-primary mx-2"
        :to="{ name: 'HobbyForm' }"
      >
        Hobbies
      </router-link>
      <router-link
        class="nav-link btn btn-outline-primary mx-2"
        :to="{ name: 'SimilarUsers' }"
      >
        Similar Users
      </router-link>
    </nav>

    <!-- Active Route's Component -->
    <div class="mt-5">
      <RouterView class="flex-shrink-0" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useUserStore } from "./stores/userStore"; // Import the Pinia store

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    // Fetch the logged-in user's data when the app is mounted
    onMounted(() => {
      userStore.fetchCurrentUser();
    });

    const handleLogout = async () => {
      // Display a confirmation dialog
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        try {
          const response = await fetch("http://localhost:8000/api/logout/", {
            method: "POST", // Make a POST request to the logout endpoint
            credentials: "include", // Include cookies/session info
            headers: {
              "X-CSRFToken": getCSRFToken(), // Add CSRF token
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            userStore.clearUser(); // Clear the user data
            window.location.href = "http://localhost:8000/"; // Redirect to signup page
          } else {
            console.error("Failed to log out:", response.status);
            alert("An error occurred while logging out. Please try again.");
          }
        } catch (error) {
          console.error("Error during logout:", error);
          alert("An unexpected error occurred.");
        }
      }
    };

    // Function to retrieve CSRF token from cookies
    const getCSRFToken = () => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "csrftoken") {
          return value;
        }
      }
      return "";
    };

    return { userStore, handleLogout };
  },
});
</script>

<style scoped>
/* Style for the logout button */
.logout-btn {
  margin-top: 10px;
  padding: 12px 20px;
  background-color: #dc3545; /* Bootstrap danger color */
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.logout-btn:hover {
  background-color: #c82333; /* Darker danger color */
  transform: translateY(-2px);
}

.logout-btn:active {
  background-color: #bd2130;
  transform: translateY(0);
}
</style>