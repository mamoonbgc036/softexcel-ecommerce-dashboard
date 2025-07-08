<template>
  <div class="home_preloader absolute top-0 left-0 w-full h-full bg-white z-[999] ">
    <div class="min-h-screen bg-gray-100">
      <div class="loader absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img v-if="media[0]?.loader" :src="media[0]?.loader" alt="loader" class="w-28">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHomeStore } from '@/Store/homeStore';

const homeStore = useHomeStore();

const media = computed(() => homeStore.siteinfos?.media || {});
</script>

