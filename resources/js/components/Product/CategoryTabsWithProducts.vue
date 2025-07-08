<script setup>
import { ref, computed, onMounted, watch } from "vue";
import ProductCard from "@/components/Product/ProductCard.vue";
import { Link } from "@inertiajs/vue3";

const props = defineProps({
    categoriesWithProducts: Object,
    categories: Array,
});

// Loading state
const isLoading = ref(false);

// Convert categoriesWithProducts object to array for easier iteration
const categoriesArray = computed(() => {
    if (!props.categoriesWithProducts) return [];
    return Object.values(props.categoriesWithProducts);
});
</script>

<template>
    <div class="category-products-container mb-12">
        <div class="container mx-auto px-4">
            <!-- Render each category section -->
            <div
                v-for="category in categoriesArray"
                :key="category.slug"
                class="category-section mb-12"
            >
                <!-- Category header with name, line, and View All button -->
                <div
                    class="category-header flex items-center justify-between mb-4"
                >
                    <h2 class="text-xl font-semibold text-gray-800">
                        {{ category.name }}
                    </h2>
                    <Link
                        :href="`/shop?category=${category.slug}`"
                        class="text-white bg-theme px-4 py-2 rounded-full  hover:text-primary-dark font-medium transition-colors"
                    >
                        View All
                    </Link>
                </div>

                <!-- Horizontal line -->
                <hr class="border-gray-200 mb-8" />

                <!-- Products grid -->
                <div
                    v-if="category.products && category.products.length > 0"
                    class="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                    <div
                        v-for="product in category.products.slice(0, 10)"
                        :key="product.id"
                        class="product-item"
                    >
                        <ProductCard :product="product" />
                    </div>
                </div>

                <!-- Empty state -->
                <div v-else class="text-center py-8">
                    <p class="text-lg">
                        No products available in this category.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Product card hover effects */
:deep(.product-card) {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

:deep(.product-card:hover) {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* Fade-in animation */
.category-section {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .category-header {
        flex-direction: row;
        align-items: center;
    }

    .products-grid {
        gap: 10px;
    }
}
</style>
