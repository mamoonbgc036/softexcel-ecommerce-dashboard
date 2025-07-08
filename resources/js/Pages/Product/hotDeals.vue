<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import ProductCard from '@/components/Product/ProductCard.vue';
import Preloader from '@/components/Preloader/Preloader.vue';

const $axios = inject('$axios'); 

const hotDeals = ref([]);
const pagination = ref({
  current_page: 1,
  last_page: 1,
});
const loading = ref(true);
const error = ref(null);

const fetchHotDeals = async (page = 1) => {
  loading.value = true;
  try {
    const response = await $axios.get(`/hot-deals?page=${page}`); 
    hotDeals.value = response.data;
    pagination.value.current_page = response.data.current_page;
    pagination.value.last_page = response.data.last_page;
  } catch (err) {
    error.value = 'Failed to fetch hot deals!';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Generate page numbers dynamically
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= pagination.value.last_page; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchHotDeals(page);
  }
};

onMounted(() => fetchHotDeals());
</script>

<template>
  <Head>
    <title>Hot Deals</title>
  </Head>
  <AppLayout>
    <div class="hot_deals pb-10 min-h-[40vh]">
      <div class="section_title_area py-10 bg-white mb-5 px-5">
        <div class="container flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 class="text-2xl font-semibold">Hot Deals</h2>
        </div>
      </div>

      <div class="container">
        <div v-if="loading" class=" flex justify-center min-h-[40vh] items-center">
          <Preloader />
        </div>

        <div v-else-if="error" class="text-center text-red-500">
          {{ error }}
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <template v-for="product in hotDeals.data" :key="product.id">
            <ProductCard :product="product" />
          </template>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="flex justify-center mt-6 space-x-2">
          <!-- Previous Button -->
          <button 
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            :disabled="pagination.current_page === 1"
            @click="goToPage(pagination.current_page - 1)"
          >
            Previous
          </button>

          <!-- Page Numbers -->
          <button
            v-for="page in pageNumbers"
            :key="page"
            class="px-4 py-2 rounded-md"
            :class="{
              'bg-theme text-white': pagination.current_page === page,
              'bg-gray-200 hover:bg-gray-300': pagination.current_page !== page
            }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <!-- Next Button -->
          <button 
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            :disabled="pagination.current_page === pagination.last_page"
            @click="goToPage(pagination.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
