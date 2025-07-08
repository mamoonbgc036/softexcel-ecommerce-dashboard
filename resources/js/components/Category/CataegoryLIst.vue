<script setup>
import { defineProps } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

// Check if a category has sub-categories
const hasSubCategories = (category) => {
  return category.sub_category && category.sub_category.length > 0;
};
</script>

<template>
  <div class="category_list bg-white p-3 shadow-sm">
    <h2 class="text-xl px-2 font-semibold mb-3">Top Categories</h2>
    <div class="flex flex-col space-y-2">
      <div 
        v-for="category in categories.slice(0, 10)" 
        :key="category.id" 
        class="relative group"
      >
        <!-- Main category item -->
        <Link :href="`/shop?category=${category.slug}`" class="flex items-center py-[3px] 2xl:py-[6px] px-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <div v-if="category.icon" class="w-6 h-6 flex items-center justify-center mr-3">
            <img 
              :src="category.icon" 
              alt="" 
              class="w-full h-full object-contain" 
            />
          </div>
          <div class="flex-1 text-gray-700 font-medium">{{ category.name }}</div>
          <ChevronRight v-if="hasSubCategories(category)" class="w-5 h-5 text-gray-400" />
        </Link>

        <!-- Sub-categories dropdown (smooth transition with hover) -->
        <transition name="fade-slide">
          <div 
            v-if="hasSubCategories(category)"
            class="absolute top-0 left-full ml-2 bg-white rounded-md shadow-md z-10 py-2 border border-gray-100 min-w-[200px] 
                   opacity-0 scale-95 transform transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100"
          >
            <div 
              v-for="subCategory in category.sub_category" 
              :key="subCategory.id"
              class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm"
            >
              <Link :href="`/shop?subcategory=${subCategory.slug}`">{{ subCategory.name }}</Link>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style>
/* Fade and slide animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
