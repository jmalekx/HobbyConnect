/**
 * Pinia store for managing hobbies.
 *
 * This store handles the fetching, storing, and updating of hobbies data, as well as
 * interactions with the API related to hobbies. It integrates with the `useUserStore`
 * to ensure user-related data is fetched and used when needed.
 */
import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
export const useHobbiesStore = defineStore("hobbies", {
    state: () => ({
        hobbies: [],
    }),
    actions: {
        async mounted() {
            const userStore = useUserStore();
            await userStore.fetchCurrentUser();
            await userStore.fetchHobbies();
        },
        async fetchHobbies() {
            try {
                const response = await fetch("http://localhost:8000/api/hobbies/", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    this.hobbies = data;
                }
                else {
                    console.error("Failed to fetch hobbies:", response.status);
                }
            }
            catch (error) {
                console.error("Error fetching hobbies:", error);
            }
        },
        async addHobby(newHobby) {
            try {
                const response = await fetch("http://localhost:8000/api/hobbies/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newHobby),
                    credentials: "include",
                });
                if (response.ok) {
                    const createdHobby = await response.json();
                    this.hobbies.push(createdHobby);
                }
                else {
                    console.error("Failed to add hobby:", response.status);
                }
            }
            catch (error) {
                console.error("Error adding hobby:", error);
            }
        },
    },
});
