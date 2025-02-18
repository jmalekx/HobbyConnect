/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineComponent, ref, onMounted } from "vue";
import { useSimilarUsersStore } from "../stores/similarUsersStore";
export default defineComponent({
    name: "SimilarUsers",
    setup() {
        const similarUsersStore = useSimilarUsersStore();
        const minAge = ref(null);
        const maxAge = ref(null);
        onMounted(() => {
            fetchSimilarUsers();
        });
        const fetchSimilarUsers = async (url = null) => {
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
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("container mt-5") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: ("text-center text-primary") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: ("list-group mb-4") },
    });
    for (const [user] of __VLS_getVForSourceType((__VLS_ctx.similarUsersStore.users))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: ((user.id)),
            ...{ class: ("list-group-item d-flex justify-content-between align-items-center") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (user.name);
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("badge bg-secondary") },
        });
        (user.shared_hobbies_count);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("d-flex justify-content-between mb-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.fetchSimilarUsers(__VLS_ctx.similarUsersStore.prevUrl);
            } },
        ...{ class: ("btn btn-outline-primary") },
        disabled: ((!__VLS_ctx.similarUsersStore.prevUrl)),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.fetchSimilarUsers(__VLS_ctx.similarUsersStore.nextUrl);
            } },
        ...{ class: ("btn btn-outline-primary") },
        disabled: ((!__VLS_ctx.similarUsersStore.nextUrl)),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("card p-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: ("text-secondary mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("row") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("col-md-6 mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("min-age"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        id: ("min-age"),
        type: ("number"),
        ...{ class: ("form-control") },
        placeholder: ("Enter minimum age"),
    });
    (__VLS_ctx.minAge);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("col-md-6 mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("max-age"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        id: ("max-age"),
        type: ("number"),
        ...{ class: ("form-control") },
        placeholder: ("Enter maximum age"),
    });
    (__VLS_ctx.maxAge);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("row") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.updateFilters) },
        ...{ class: ("btn btn-primary") },
    });
    ['container', 'mt-5', 'text-center', 'text-primary', 'list-group', 'mb-4', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'badge', 'bg-secondary', 'd-flex', 'justify-content-between', 'mb-4', 'btn', 'btn-outline-primary', 'btn', 'btn-outline-primary', 'card', 'p-4', 'text-secondary', 'mb-3', 'row', 'col-md-6', 'mb-3', 'form-label', 'form-control', 'col-md-6', 'mb-3', 'form-label', 'form-control', 'row', 'btn', 'btn-primary',];
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
