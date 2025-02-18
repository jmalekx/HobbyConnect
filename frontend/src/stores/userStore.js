/**
 * Pinia store for managing user-related data and actions.
 *
 * This store provides state management and actions for handling users, hobbies,
 * friends, and related operations in the application. It includes functions
 * for fetching, updating, and interacting with API endpoints.
 */
import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
    state: () => ({
        currentUser: null,
        hobbies: [],
        similarUsers: [],
        nextUrl: null,
        prevUrl: null,
        friends: [],
        isLoading: false,
    }),
    actions: {
        async fetchCurrentUser() {
            try {
                const response = await fetch("http://localhost:8000/api/current_user/", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                }
                else {
                    console.error("Failed to fetch current user:", response.status);
                }
            }
            catch (error) {
                console.error("Error fetching current user:", error);
            }
        },
        clearUser() {
            this.currentUser = null;
            this.hobbies = [];
            this.similarUsers = [];
            this.nextUrl = null;
            this.prevUrl = null;
        },
        async fetchHobbies() {
            try {
                const response = await fetch("http://localhost:8000/api/hobbies/", { credentials: "include" });
                if (response.ok) {
                    this.hobbies = await response.json();
                }
                else {
                    console.error("Failed to fetch hobbies");
                }
            }
            catch (error) {
                console.error("Error fetching hobbies:", error);
            }
        },
        async fetchFriends() {
            this.isLoading = true;
            try {
                const response = await fetch("http://localhost:8000/api/friends/", {
                    credentials: "include",
                });
                if (response.ok) {
                    this.friends = await response.json();
                }
                else {
                    console.error("Failed to fetch friends");
                }
            }
            catch (error) {
                console.error("Error fetching friends:", error);
            }
            finally {
                this.isLoading = false;
            }
        },
        async sendFriendRequest(email) {
            try {
                const response = await fetch("http://localhost:8000/api/friend-requests/send/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                    credentials: "include",
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Failed to send friend request");
                }
                return await response.json();
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error sending friend request:", error.message);
                    throw error;
                }
                else {
                    console.error("An unknown error occurred:", error);
                    throw new Error("An unknown error occurred. Please try again.");
                }
            }
        },
        async updateUserProfile(updatedFields) {
            try {
                // Get the CSRF token from cookies
                const csrfToken = document.cookie
                    .split(";")
                    .find((cookie) => cookie.trim().startsWith("csrftoken="))
                    ?.split("=")[1];
                if (!csrfToken) {
                    throw new Error("CSRF token not found. Ensure it is set correctly in the cookies.");
                }
                // Make the PUT request with the CSRF token
                const response = await fetch("http://localhost:8000/api/profile/", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken, // Include CSRF token
                    },
                    credentials: "include", // Ensure cookies are sent with the request
                    body: JSON.stringify(updatedFields),
                });
                if (response.ok) {
                    const updatedUser = await response.json();
                    this.currentUser = { ...this.currentUser, ...updatedUser }; // Update the user in the store
                }
                else {
                    console.error("Failed to update user profile:", response.status);
                }
            }
            catch (error) {
                console.error("Error updating user profile:", error);
            }
        },
        async fetchFriendRequests() {
            try {
                const response = await fetch("http://localhost:8000/api/friend-requests/", {
                    credentials: "include",
                });
                if (response.ok) {
                    return await response.json();
                }
                console.error("Failed to fetch friend requests");
            }
            catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        },
        async acceptFriendRequest(requestId) {
            try {
                const response = await fetch(`http://localhost:8000/api/friend-requests/accept/${requestId}/`, {
                    method: "POST",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    this.friends = data.friends;
                }
                else {
                    console.error("Failed to accept friend request");
                }
            }
            catch (error) {
                console.error("Error accepting friend request:", error);
            }
        },
        async rejectFriendRequest(requestId) {
            await fetch(`http://localhost:8000/api/friend-requests/reject/${requestId}/`, {
                method: "DELETE",
                credentials: "include",
            });
        },
        async addHobbyToUser(hobbyId) {
            if (!this.currentUser)
                return;
            const selectedHobby = this.hobbies.find(hobby => hobby.id === hobbyId);
            if (selectedHobby) {
                const alreadyExists = this.currentUser.hobbies.some(h => h.id === selectedHobby.id);
                if (!alreadyExists) {
                    this.currentUser.hobbies.push(selectedHobby);
                    await this.updateUserHobbiesOnServer();
                }
            }
        },
        async removeHobbyFromUser(hobbyId) {
            if (!this.currentUser)
                return;
            const hobbyIndex = this.currentUser.hobbies.findIndex(hobby => hobby.id === hobbyId);
            if (hobbyIndex !== -1) {
                this.currentUser.hobbies.splice(hobbyIndex, 1);
                await this.updateUserHobbiesOnServer();
            }
        },
        async updateUserHobbiesOnServer() {
            if (!this.currentUser)
                return;
            try {
                const response = await fetch(`http://localhost:8000/api/users/${this.currentUser.id}/update_hobbies/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ hobbies: this.currentUser.hobbies }),
                });
                if (!response.ok) {
                    console.error("Error updating hobbies:", response.status, await response.text());
                }
            }
            catch (error) {
                console.error("Error syncing hobbies:", error);
            }
        },
        async fetchSimilarUsers(url = "http://localhost:8000/api/similar-users/") {
            try {
                const response = await fetch(url, { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    this.similarUsers = data.results;
                    this.nextUrl = data.next;
                    this.prevUrl = data.previous;
                }
                else {
                    console.error("Failed to fetch similar users");
                }
            }
            catch (error) {
                console.error("Error fetching similar users:", error);
            }
        },
    },
});
