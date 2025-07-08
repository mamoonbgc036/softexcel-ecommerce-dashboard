<template>
  <AppLayout>

    <div class="bg-gray-50 min-h-[50vh] relative">
      <!-- Mobile Menu Icon -->
      <div class="lg:hidden p-4">
        <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700 flex gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Menu
        </button>
      </div>

      <!-- Overlay (Shows when Sidebar is Open) -->
      <div v-if="isSidebarOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 z-40"
           @click="closeSidebar"></div>

      <div class="flex gap-6 container py-12">
        <!-- Sidebar: Mobile (Slide-in Effect) & Desktop (Static) -->
        <div 
          :class="{
            'translate-x-0': isSidebarOpen, 
            '-translate-x-full': !isSidebarOpen
          }" 
          class="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg transition-transform transform lg:static lg:w-1/4 lg:translate-x-0 z-50 p-6">
          <Sidebar />
        </div>

        <!-- Main Content -->
        <div class="w-full lg:w-3/4 p-6 bg-white shadow-sm">
          <slot />
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Sidebar from '@/components/Account/Sidebar.vue';
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Close sidebar when clicking outside (on overlay)
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>
