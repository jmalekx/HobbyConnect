/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/userStore";
// Pinia store
const userStore = useUserStore();
// Local state
const email = ref(""); // Input for sending friend requests
const receivedRequests = ref([]); // List of received friend requests
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
    }
    catch (error) {
        // Handle errors gracefully with a pop-up alert
        if (error instanceof Error) {
            alert(error.message || "Failed to send friend request. Please try again.");
        }
        else {
            alert("An unknown error occurred. Please try again.");
        }
    }
};
// Accept a friend request
const acceptFriendRequest = async (requestId) => {
    await userStore.acceptFriendRequest(requestId);
    await fetchFriendRequests();
    await userStore.fetchFriends();
};
// Reject a friend request
const rejectFriendRequest = async (requestId) => {
    await userStore.rejectFriendRequest(requestId);
    await fetchFriendRequests();
};
// Fetch initial data on mount
onMounted(() => {
    userStore.fetchFriends();
    fetchFriendRequests();
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("container mt-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("mb-3") },
    });
    if (__VLS_ctx.isLoading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-muted") },
        });
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: ("list-group") },
        });
        for (const [friend] of __VLS_getVForSourceType((__VLS_ctx.friends))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: ((friend.id)),
                ...{ class: ("list-group-item") },
            });
            (friend.friend_name);
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("mt-4 mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("input-group mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        type: ("email"),
        placeholder: ("Enter user's email"),
        ...{ class: ("input-email") },
    });
    (__VLS_ctx.email);
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.sendFriendRequest) },
        ...{ class: ("btn btn-primary") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("mt-4 mb-3") },
    });
    if (__VLS_ctx.isLoading) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-muted") },
        });
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: ("list-group") },
        });
        for (const [request] of __VLS_getVForSourceType((__VLS_ctx.receivedRequests))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: ((request.id)),
                ...{ class: ("list-group-item d-flex justify-content-between align-items-center") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            (request.name);
            (request.email);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(!((__VLS_ctx.isLoading))))
                            return;
                        __VLS_ctx.acceptFriendRequest(request.id);
                    } },
                ...{ class: ("btn btn-success btn-sm me-2") },
            });
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(!((__VLS_ctx.isLoading))))
                            return;
                        __VLS_ctx.rejectFriendRequest(request.id);
                    } },
                ...{ class: ("btn btn-danger btn-sm") },
            });
        }
    }
    ['container', 'mt-4', 'mb-3', 'text-muted', 'list-group', 'list-group-item', 'mt-4', 'mb-3', 'input-group', 'mb-3', 'input-email', 'btn', 'btn-primary', 'mt-4', 'mb-3', 'text-muted', 'list-group', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'btn', 'btn-success', 'btn-sm', 'me-2', 'btn', 'btn-danger', 'btn-sm',];
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
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            email: email,
            receivedRequests: receivedRequests,
            isLoading: isLoading,
            friends: friends,
            sendFriendRequest: sendFriendRequest,
            acceptFriendRequest: acceptFriendRequest,
            rejectFriendRequest: rejectFriendRequest,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
