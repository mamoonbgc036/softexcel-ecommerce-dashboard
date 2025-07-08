<template>
    <div class="relative my-10">
        <div class="container mx-auto bg-gray-100 p-6">
            <!-- Tab Navigation -->
            <div class="relative">
                <div class="flex gap-6">
                    <button
                        v-for="tab in tabs"
                        :key="tab"
                        @click="activeTab = tab"
                        class="py-3 text-sm font-medium relative transition-colors duration-200"
                        :class="{
                            'text-theme': activeTab === tab,
                            'text-gray-700 hover:text-gray-900':
                                activeTab !== tab,
                        }"
                    >
                        {{ tab }}
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="px-5 mt-8 productDescription">
                <!-- Description Tab -->
                <div
                    v-if="activeTab === 'DESCRIPTION'"
                    class="descriptionTab transition-opacity duration-200"
                >
                    <div
                        class="text-black desciptionstyless"
                        v-html="product.description"
                    ></div>
                </div>

                <!-- Additional Information Tab -->
                <div
                    v-if="activeTab === 'SPECIFICATION'"
                    class="transition-opacity duration-200 desciptionstyless"
                >
                    <div
                        class="text-gray-600 descriptionstyle"
                        v-html="product.specification"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const activeTab = ref("DESCRIPTION");
const tabs = ["DESCRIPTION"];
</script>
<style scoped>
.desciptionstyless b {
    font-weight: 700 !important;
}

i {
    font-style: italic !important;
}
</style>
