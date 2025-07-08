<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { defineProps, ref, onMounted, inject } from 'vue';
import ProductCard from '@/components/Product/ProductCard.vue';
import NotFound from '@/components/Error/NotFound.vue';
import { Head } from '@inertiajs/vue3';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const $axios = inject('$axios');

const products = ref([]);
const slug = ref(props.slug);
const categoryName = ref('');
const errorPage = ref(false);

const fetchData =  async () => {
  try {
    
    const response = await $axios.get(`/product-category/${slug.value}`); // Fetch product data
    console.log('product-data', response.data.data);
    categoryName.value = response.data.data[0].category.name;
    products.value = response.data.data; // Store product data
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}

onMounted(() => {
  fetchData();
});

</script>

<template>
  <Head>
    <title>{{ categoryName }}</title>
  </Head>
  <AppLayout>
    <div class="header_area py-12 bg-gray-100">
      <div class="container">
        <div class="text-center">
          <h2 class="text-2xl font-semibold">{{ categoryName }}</h2>
        </div>
      </div>
    </div>

    <div v-if="products.length > 0">
      <div class="container py-12">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center py-10">
      <h3 class="text-2xl font-semibold">No products found</h3>
    </div>
  </AppLayout>
</template>