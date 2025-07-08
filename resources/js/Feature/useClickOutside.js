// composables/useClickOutside.js
import { onMounted, onUnmounted } from "vue";

export function useClickOutside(el_target_ref, callback_fn) {
    if (!el_target_ref) return;

    const listener = (e) => {
        // Check if the click target is the element or its descendants
        if (
            e.target === el_target_ref.value ||
            e.composedPath().includes(el_target_ref.value)
        ) {
            return; // Click is inside, do nothing
        }
        // Click is outside, call the callback
        if (typeof callback_fn === "function") {
            callback_fn();
        }
    };

    onMounted(() => {
        document.addEventListener("click", listener);
    });

    onUnmounted(() => {
        document.removeEventListener("click", listener);
    });
}
