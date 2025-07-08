<template>
  <div class="py-6 container relative">
    <h2 class="text-xl font-medium mb-4">Related Products</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">Loading related products...</div>

    <!-- No Products State -->
    <div v-else-if="filteredRelatedProducts.length === 0" class="text-center">
      No related products found
    </div>

    <!-- Products Display -->
    <div v-else>
      <button
        class="custom-prev-button absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Previous slide">
        <ChevronLeft class="w-6 h-6 text-gray-600" />
      </button>

      <button
        class="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Next slide">
        <ChevronRight class="w-6 h-6 text-gray-600" />
      </button>

      <swiper 
        :modules="[Navigation]" 
        :slides-per-view="5" 
        :space-between="20"
        :autoplay="{ delay: 3000, disableOnInteraction: false }" 
        :breakpoints="breakpoints" 
        :navigation="{
          prevEl: '.custom-prev-button',
          nextEl: '.custom-next-button',
        }" 
        class="product-slider"
      >
        <swiper-slide v-for="relatedProduct in filteredRelatedProducts" :key="relatedProduct.id">
          <ProductCard :product="relatedProduct" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import ProductCard from "./ProductCard.vue";
import { ref, watch, onMounted, inject, computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const $axios = inject("$axios");
const isLoading = ref(true);
const relatedProducts = ref([]);

// Computed property to filter out the current product
const filteredRelatedProducts = computed(() => {
  if (!props.product || !relatedProducts.value) return [];
  
  // Filter out the current product by ID
  return relatedProducts.value.filter(product => product.id !== props.product.id);
});

const breakpoints = {
  320: { slidesPerView: 2, spaceBetween: 10 },
  640: { slidesPerView: 2, spaceBetween: 15 },
  768: { slidesPerView: 3, spaceBetween: 20 },
  1024: { slidesPerView: 4, spaceBetween: 25 },
  1280: { slidesPerView: 5, spaceBetween: 30 },
};

// Function to fetch related products
const fetchRelatedProducts = async (categorySlug) => {
  if (!categorySlug) return;
  
  isLoading.value = true;
  
  try {
    const response = await $axios.get(`/product-category/${categorySlug}`);
    relatedProducts.value = response.data.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    relatedProducts.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch for product category changes
watch(
  () => props.product?.category?.slug,
  (newCategory) => {
    if (newCategory) {
      fetchRelatedProducts(newCategory);
    }
  },
  { immediate: true }
);

// Watch for product ID changes to ensure filtering works when navigating between products
watch(
  () => props.product?.id,
  () => {
    // No need to refetch, the computed property will handle filtering
  }
);

// Fetch related products on component mount
onMounted(() => {
  if (props.product?.category?.slug) {
    fetchRelatedProducts(props.product.category.slug);
  }
});
</script>

<style scoped>
.product-slider {
  padding: 20px 0;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none;
}
</style>