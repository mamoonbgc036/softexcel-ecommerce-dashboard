<template>
    <AppLayout>
        <div class="privacy-policy-page py-12">
            <div class="container mx-auto max-w-[96rem]">
                <h1 class="text-3xl font-bold mb-6">Terms & Conditions</h1>

                <!-- Render content when type is policies -->
                <div
                    v-if="policyContent"
                    v-html="policyContent"
                    class="text-gray-800"
                ></div>
                <div v-else class="text-red-500">
                    No privacy policy available.
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useHomeStore } from "@/Store/homeStore";
import { computed } from "vue";

// Access home store
const homeStore = useHomeStore();

// Filter pages to find the one with type 'policies'
const policyContent = computed(() => {
    const policyPage = homeStore.siteinfos?.pages?.find(
        (page) => page.type === "terms"
    );
    return policyPage?.content || "";
});
</script>
