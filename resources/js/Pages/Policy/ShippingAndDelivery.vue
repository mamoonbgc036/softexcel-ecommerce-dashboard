<template>
    <AppLayout>
        <div class="privacy-policy-page py-12">
            <div class="container mx-auto max-w-[96rem]">
                <h1 class="text-3xl font-bold mb-6">Shipping and Delivery</h1>

                <!-- Render content when type is policies -->
                <div
                    v-if="shippingAndDeliveryContent"
                    v-html="shippingAndDeliveryContent"
                    class="text-gray-800"
                ></div>
                <div v-else class="text-red-500">
                    No Shipping and Delivery available.
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useHomeStore } from "@/Store/homeStore";
import { computed, ref } from "vue";
// const tableofcontentref = ref([]);
// Access home store
const homeStore = useHomeStore();
// access html
const shippingAndDeliveryref = ref(null);
// Filter pages to find the one with type 'policies'
const shippingAndDeliveryContent = computed(() => {
    const shippingPage = homeStore.siteinfos?.pages?.find(
        (page) => page.type === "shipping_delivery"
    );
    return shippingPage?.content || "";
});

// const h3Texts = ref([]);

// onMounted(async () => {
//     // Wait for content to load/set
//     await nextTick();

//     // Same logic here
//     const h3Elements = policycontentref.value.querySelectorAll("h3");
//     h3Elements.forEach((el, idx) => {
//         el.id = `section${idx + 1}`;
//     });
// });
</script>
