/**
 * Pinia store for managing similar users.
 *
 * This store is used to manage the state and actions related to fetching
 * and storing users who share similar hobbies or interests with the current user.
 */

/**
 * Interface representing a user with shared hobbies.
 */
interface SimilarUser {
  id: number;
  name: string;
  email: string;
  shared_hobbies_count: number;
}

import { defineStore } from "pinia";

export const useSimilarUsersStore = defineStore("similarUsers", {
  state: () => ({
    users: [] as SimilarUser[],
    nextUrl: null as string | null,
    prevUrl: null as string | null,
  }),

  actions: {
    async fetchSimilarUsers(url = "http://localhost:8000/api/similar-users/") {
      try {
        const response = await fetch(url, { credentials: "include" }); 
        if (response.ok) {
          const data = await response.json();
          this.users = data.results; 
          this.nextUrl = data.next; 
          this.prevUrl = data.previous; 
        } else {
          console.error("Failed to fetch similar users:", response.status);
        }
      } catch (error) {
        console.error("Error fetching similar users:", error);
      }
    },
  },
});
