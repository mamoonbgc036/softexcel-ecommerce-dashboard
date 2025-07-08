<script setup>
import { defineProps } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});


</script>

<template>
  <div class="relative">
    <video class="video-js h-[350px] w-full object-cover" loop="" autoplay="" muted="" preload="none" playsinline=""
      :poster="product.featured_image">
      <source :src="product.video_link" type="video/mp4">
    </video>
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <Link :href="`/product/${product.slug}`" class="bg-[#eaeaea85] text-black py-2 px-16 rounded">Shop</Link>
    </div>
  </div>
</template>
