/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineComponent, ref, onMounted } from "vue";
import { useHobbiesStore } from "../stores/hobbiesStore";
export default defineComponent({
    name: "HobbyForm",
    setup() {
        const hobbyName = ref("");
        const hobbyDescription = ref("");
        const hobbiesStore = useHobbiesStore();
        onMounted(() => {
            hobbiesStore.fetchHobbies();
        });
        const addHobby = async () => {
            if (!hobbyName.value.trim()) {
                alert("Hobby name is required.");
                return;
            }
            await hobbiesStore.addHobby({
                name: hobbyName.value.trim(), // Trim whitespace
                description: hobbyDescription.value.trim(),
            });
            hobbyName.value = "";
            hobbyDescription.value = "";
        };
        return {
            hobbyName,
            hobbyDescription,
            hobbiesStore,
            addHobby,
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
    for (const [hobby] of __VLS_getVForSourceType((__VLS_ctx.hobbiesStore.hobbies))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: ((hobby.id)),
            ...{ class: ("list-group-item d-flex justify-content-between align-items-center") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (hobby.name);
        (hobby.description);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("card p-4") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: ("text-secondary mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.addHobby) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("hobbyName"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        id: ("hobbyName"),
        value: ((__VLS_ctx.hobbyName)),
        type: ("text"),
        ...{ class: ("form-control") },
        placeholder: ("Enter hobby name"),
        required: (true),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("hobbyDescription"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        id: ("hobbyDescription"),
        value: ((__VLS_ctx.hobbyDescription)),
        ...{ class: ("form-control") },
        rows: ("3"),
        placeholder: ("Enter hobby description"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: ("submit"),
        ...{ class: ("btn btn-primary w-100") },
    });
    ['container', 'mt-5', 'text-center', 'text-primary', 'list-group', 'mb-4', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'card', 'p-4', 'text-secondary', 'mb-3', 'mb-3', 'form-label', 'form-control', 'mb-3', 'form-label', 'form-control', 'btn', 'btn-primary', 'w-100',];
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
