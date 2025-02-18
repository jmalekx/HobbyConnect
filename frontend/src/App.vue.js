/// <reference types="../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
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
                    }
                    else {
                        console.error("Failed to log out:", response.status);
                        alert("An error occurred while logging out. Please try again.");
                    }
                }
                catch (error) {
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
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    ['logout-btn', 'logout-btn',];
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        id: ("app"),
        ...{ class: ("container mt-5 pb-5") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("text-center mb-4") },
    });
    if (__VLS_ctx.userStore.currentUser) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
            ...{ class: ("display-4 text-primary") },
        });
        (__VLS_ctx.userStore.currentUser.name);
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
            ...{ class: ("display-4 text-secondary") },
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("text-center mb-4") },
    });
    if (__VLS_ctx.userStore.currentUser) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: ("btn btn-danger px-4 py-2") },
            'aria-label': ("Log out of your account"),
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: ("nav justify-content-center mb-4") },
    });
    const __VLS_0 = {}.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Home' })),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Home' })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_6 = {}.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Profile' })),
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Profile' })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Friends' })),
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'Friends' })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_17.slots.default;
    var __VLS_17;
    const __VLS_18 = {}.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'HobbyForm' })),
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'HobbyForm' })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.RouterLink;
    /** @type { [typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ] } */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'SimilarUsers' })),
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: ("nav-link btn btn-outline-primary mx-2") },
        to: (({ name: 'SimilarUsers' })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_29.slots.default;
    var __VLS_29;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mt-5") },
    });
    const __VLS_30 = {}.RouterView;
    /** @type { [typeof __VLS_components.RouterView, ] } */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        ...{ class: ("flex-shrink-0") },
    }));
    const __VLS_32 = __VLS_31({
        ...{ class: ("flex-shrink-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    ['container', 'mt-5', 'pb-5', 'text-center', 'mb-4', 'display-4', 'text-primary', 'display-4', 'text-secondary', 'text-center', 'mb-4', 'btn', 'btn-danger', 'px-4', 'py-2', 'nav', 'justify-content-center', 'mb-4', 'nav-link', 'btn', 'btn-outline-primary', 'mx-2', 'nav-link', 'btn', 'btn-outline-primary', 'mx-2', 'nav-link', 'btn', 'btn-outline-primary', 'mx-2', 'nav-link', 'btn', 'btn-outline-primary', 'mx-2', 'nav-link', 'btn', 'btn-outline-primary', 'mx-2', 'mt-5', 'flex-shrink-0',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
let __VLS_self;
