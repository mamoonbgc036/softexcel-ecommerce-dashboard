<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
  categoryGroups: {
    type: Array,
    required: true
  }
});

// Filter out groups with no categories
const validCategoryGroups = computed(() => {
  return props.categoryGroups.filter(group => group.categories && group.categories.length > 0);
});
</script>

<template>
  <div class="category_group">
    <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-6">
      <!-- Loop through each category group -->
      <div v-for="group in validCategoryGroups" :key="group.id" class="bg-white p-6 shadow-sm">
        <h2 class="lg:text-xl text-base font-bold mb-[18px]">{{ group.name }}</h2>
        
        <!-- If only one category, display at full width -->
        <div v-if="group.categories.length === 1">
          <Link :href="`/shop?category=${group.categories[0].slug}`" class="block hover:opacity-90 transition-opacity">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
              <img 
                v-if="group.categories[0].image" 
                :src="group.categories[0].image" 
                :alt="group.categories[0].name"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-[12px] font-medium">{{ group.categories[0].name }}</span>
          </Link>
        </div>
        
        <!-- If multiple categories, use the grid layout -->
        <div v-else class="grid grid-cols-2 gap-4">
          <div v-for="category in group.categories" :key="category.id">
            <Link :href="`/shop?category=${category.slug}`" class="block hover:opacity-90 transition-opacity">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
                <img 
                  v-if="category.image" 
                  :src="category.image" 
                  :alt="category.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <span class="text-[12px] font-medium">{{ category.name }}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>