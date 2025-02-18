import { createRouter, createWebHistory } from 'vue-router';

// 1. Define route components.
// These can be imported from other files
import Home from '../pages/Home.vue';
import Profile from '../pages/Profile.vue';
import Friends from '../pages/Friends.vue';
import Unknown from '../pages/Unknown.vue';
import HobbyForm from '../pages/HobbyForm.vue';  
import SimilarUsers from '../pages/SimilarUsers.vue'; // Import the new component

let base = import.meta.env.MODE === "development" ? import.meta.env.BASE_URL : "";

// 2. Define routes
const router = createRouter({
    history: createWebHistory(base),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/profile', name: 'Profile', component: Profile },
        { path: '/friends', name: 'Friends', component: Friends },
        { path: '/create-hobby', name: 'HobbyForm', component: HobbyForm },
        { path: '/similar-users', name: 'SimilarUsers', component: SimilarUsers }, // Add the new route here
        
        // Catch-all route for unknown paths
        { path: '/:pathMatch(.*)*', name: 'Unknown', component: Unknown },
    ]
});

export default router;