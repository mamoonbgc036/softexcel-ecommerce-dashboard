<script setup>
import VideoProductsCard from '../Product/VideoProductsCard.vue';
import { defineProps } from 'vue';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required Swiper modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const props = defineProps({
  videoProducts: {
    type: Array,
    required: true
  }
});

// Swiper modules
const modules = [Navigation, Pagination, Autoplay];
</script>

<template>
  <div class="container mx-auto my-8">
    <Swiper
      :modules="modules"
      :slides-per-view="5"
      :space-between="20"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false
      }"
      :breakpoints="{
        0: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        500: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }"
      class="video-products-slider"
    >
      <SwiperSlide 
        v-for="product in videoProducts.slice(0, 10)" 
        :key="product.id"
        class="py-4"
      >
        <VideoProductsCard :product="product" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
/* Custom Swiper styles with Tailwind */
.video-products-slider {
  @apply pb-12;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  @apply text-gray-600 hover:text-gray-900 transition-colors duration-300 ;
}

:deep(.swiper-pagination-bullet) {
  @apply bg-gray-300;
}

:deep(.swiper-pagination-bullet-active) {
  @apply bg-gray-800;
}
</style>