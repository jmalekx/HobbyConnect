<!-- 
 * Component for Vue Component for Managing Friends and Friend Requests 
 -->

 <template>
  <div class="container mt-4">
    <!-- Friends List -->
    <h2 class="mb-3">Your Friends</h2>
    <div v-if="isLoading" class="text-muted">Loading friends...</div>
    <ul v-else class="list-group">
      <li
        v-for="friend in friends"
        :key="friend.id"
        class="list-group-item"
      >
        {{ friend.friend_name }}
      </li>
    </ul>

    <!-- Send Friend Request -->
    <h2 class="mt-4 mb-3">Send Friend Request</h2>
    <div class="input-group mb-3">
      <input
        v-model="email"
        type="email"
        placeholder="Enter user's email"
        class="input-email"
      />
      <button @click="sendFriendRequest" class="btn btn-primary">
        Send Request
      </button>
    </div>

    <!-- Received Friend Requests -->
    <h2 class="mt-4 mb-3">Received Friend Requests</h2>
    <div v-if="isLoading" class="text-muted">Loading requests...</div>
    <ul v-else class="list-group">
      <li
        v-for="request in receivedRequests"
        :key="request.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          {{ request.name }} ({{ request.email }})
        </div>
        <div>
          <button
            @click="acceptFriendRequest(request.id)"
            class="btn btn-success btn-sm me-2"
          >
            Accept
          </button>
          <button
            @click="rejectFriendRequest(request.id)"
            class="btn btn-danger btn-sm"
          >
            Reject
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/userStore";

// Pinia store
const userStore = useUserStore();

// Local state
const email = ref(""); // Input for sending friend requests
interface FriendRequest {
  id: number;
  name: string;
  email: string;
}

const receivedRequests = ref<FriendRequest[]>([]); // List of received friend requests
const isLoading = computed(() => userStore.isLoading);
const friends = computed(() => userStore.friends);

// Fetch received friend requests
const fetchFriendRequests = async () => {
  const data = await userStore.fetchFriendRequests();
  receivedRequests.value = data?.received_requests || [];
};

const sendFriendRequest = async () => {
  if (!email.value) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    // Call the Pinia store action
    const response = await userStore.sendFriendRequest(email.value);

    // Handle success
    alert(response.detail || "Friend request sent successfully!");
    email.value = "";
  } catch (error) {

    // Handle errors gracefully with a pop-up alert
    if (error instanceof Error) {
      alert(error.message || "Failed to send friend request. Please try again.");
    } else {
      alert("An unknown error occurred. Please try again.");
    }
  }
};

// Accept a friend request
const acceptFriendRequest = async (requestId: number) => {
  await userStore.acceptFriendRequest(requestId);
  await fetchFriendRequests();
  await userStore.fetchFriends();
};

// Reject a friend request
const rejectFriendRequest = async (requestId: number) => {
  await userStore.rejectFriendRequest(requestId);
  await fetchFriendRequests();
};

// Fetch initial data on mount
onMounted(() => {
  userStore.fetchFriends();
  fetchFriendRequests();
});
</script>

