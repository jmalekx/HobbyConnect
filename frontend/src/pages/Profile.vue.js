/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { defineComponent } from "vue";
import { useUserStore } from "../stores/userStore";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
export default defineComponent({
    data() {
        return {
            title: "Profile",
            editForm: {
                name: "",
                email: "",
                date_of_birth: "",
            },
            selectedHobbyId: null,
        };
    },
    computed: {
        user() {
            return useUserStore().currentUser; // Get the current user from the store
        },
        globalHobbies() {
            const hobbies = useUserStore().hobbies; // Get the list of global hobbies from the store
            return hobbies;
        },
    },
    async mounted() {
        const userStore = useUserStore();
        await userStore.fetchCurrentUser();
        await userStore.fetchHobbies();
    },
    methods: {
        // Open the edit profile modal
        openEditModal() {
            const user = this.user;
            if (user) {
                this.editForm.name = user.name;
                this.editForm.email = user.email;
                this.editForm.date_of_birth = user.date_of_birth;
            }
            const modal = new bootstrap.Modal(document.getElementById("editProfileModal"));
            modal.show();
        },
        async submitEditProfile() {
            try {
                const userStore = useUserStore();
                // Call the Pinia action
                await userStore.updateUserProfile(this.editForm);
                // Close the modal after a successful update
                const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
                modal?.hide();
            }
            catch (error) {
                console.error("Error submitting edit profile:", error);
            }
        },
        async deleteHobby(index) {
            if (!this.user)
                return;
            const hobby = this.user.hobbies[index];
            try {
                const userStore = useUserStore();
                await userStore.removeHobbyFromUser(hobby.id);
                this.user.hobbies.splice(index, 1);
            }
            catch (error) {
                console.error("Error deleting hobby:", error);
            }
        },
        // Add hobby from dropdown to user's hobbies
        addHobbyFromDropdown() {
            if (this.selectedHobbyId === null)
                return;
            const selectedHobby = this.globalHobbies.find(hobby => hobby.id === this.selectedHobbyId);
            if (selectedHobby && this.user) {
                const alreadyExists = this.user.hobbies.some(h => h.id === selectedHobby.id);
                if (!alreadyExists) {
                    this.user.hobbies.push(selectedHobby);
                    this.updateUserHobbiesOnServer();
                }
            }
        },
        async updateUserHobbiesOnServer() {
            if (!this.user)
                return;
            try {
                const userStore = useUserStore();
                await userStore.updateUserHobbiesOnServer();
            }
            catch (error) {
                console.error("Error adding hobby:", error);
            }
        },
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: ("text-center text-primary") },
    });
    (__VLS_ctx.title);
    if (__VLS_ctx.user) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: ("mb-3") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("card p-4 mb-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.user.email);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.user.name);
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.user.date_of_birth);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-center mt-4") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.openEditModal) },
            ...{ class: ("btn btn-primary") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: ("mb-3") },
        });
        if (__VLS_ctx.user.hobbies.length > 0) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
                ...{ class: ("list-group") },
            });
            for (const [hobby, index] of __VLS_getVForSourceType((__VLS_ctx.user.hobbies))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                    key: ((hobby.id)),
                    ...{ class: ("list-group-item d-flex justify-content-between align-items-center") },
                });
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                __VLS_elementAsFunction(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                (hobby.name);
                (hobby.description);
                __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!((__VLS_ctx.user)))
                                return;
                            if (!((__VLS_ctx.user.hobbies.length > 0)))
                                return;
                            __VLS_ctx.deleteHobby(index);
                        } },
                    type: ("button"),
                    ...{ class: ("btn btn-sm btn-danger") },
                });
            }
        }
        else {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("mt-3") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: ("hobbyDropdown"),
            ...{ class: ("form-label") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
            id: ("hobbyDropdown"),
            ...{ class: ("form-select") },
            value: ((__VLS_ctx.selectedHobbyId)),
        });
        for (const [hobby] of __VLS_getVForSourceType((__VLS_ctx.globalHobbies))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: ((hobby.id)),
                value: ((hobby.id)),
            });
            (hobby.name);
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.addHobbyFromDropdown) },
            type: ("button"),
            ...{ class: ("btn btn-sm btn-success mt-2") },
        });
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("text-center") },
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: ("spinner-border text-primary") },
            role: ("status"),
        });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ("sr-only") },
        });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("modal fade") },
        id: ("editProfileModal"),
        tabindex: ("-1"),
        'aria-labelledby': ("editProfileModalLabel"),
        'aria-hidden': ("true"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("modal-dialog") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("modal-content") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("modal-header") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: ("modal-title") },
        id: ("editProfileModalLabel"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: ("button"),
        ...{ class: ("btn-close") },
        'data-bs-dismiss': ("modal"),
        'aria-label': ("Close"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("modal-body") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.submitEditProfile) },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("name"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        type: ("text"),
        id: ("name"),
        ...{ class: ("form-control") },
        value: ((__VLS_ctx.editForm.name)),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("email"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        type: ("email"),
        id: ("email"),
        ...{ class: ("form-control") },
    });
    (__VLS_ctx.editForm.email);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: ("mb-3") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("dob"),
        ...{ class: ("form-label") },
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({
        type: ("date"),
        id: ("dob"),
        ...{ class: ("form-control") },
    });
    (__VLS_ctx.editForm.date_of_birth);
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: ("submit"),
        ...{ class: ("btn btn-success mt-3") },
    });
    ['container', 'mt-5', 'text-center', 'text-primary', 'mb-3', 'card', 'p-4', 'mb-4', 'text-center', 'mt-4', 'btn', 'btn-primary', 'mb-3', 'list-group', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'btn', 'btn-sm', 'btn-danger', 'mt-3', 'form-label', 'form-select', 'btn', 'btn-sm', 'btn-success', 'mt-2', 'text-center', 'spinner-border', 'text-primary', 'sr-only', 'modal', 'fade', 'modal-dialog', 'modal-content', 'modal-header', 'modal-title', 'btn-close', 'modal-body', 'mb-3', 'form-label', 'form-control', 'mb-3', 'form-label', 'form-control', 'mb-3', 'form-label', 'form-control', 'btn', 'btn-success', 'mt-3',];
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
