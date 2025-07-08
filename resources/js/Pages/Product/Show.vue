<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import ProductDetail from '@/components/Product/ProductDetail.vue';
import NotFound from '@/components/Error/NotFound.vue';
import { defineProps, ref, onMounted, inject } from 'vue';
import { Head } from '@inertiajs/vue3';
import { useCartStore } from "@/Store/cartStore";

const cartStore = useCartStore();

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const slug = ref(props.slug);
const product = ref(null);
const $axios = inject('$axios');
const errorPage = ref(false);

const fetchData = async () => {
  try {
    cartStore.golobalLoading = true; // Start loading
    const response = await $axios.get(`/product/${slug.value}`);

    // Check if response.data exists and is valid
    if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
      errorPage.value = true;
      return;
    }

    // Handle both array and object responses
    product.value = Array.isArray(response.data) ? response.data[0] : response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    errorPage.value = true; // Show error page only on failure
  } finally {
    cartStore.golobalLoading = false; // Stop loading
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Head>
    <title>{{ product?.meta_title ?? product?.product_name ?? 'Product' }}</title>
    <meta name="description" :content="product?.meta_description ?? ''" />
  </Head>

  <AppLayout>
    <div class="product_details min-h-screen">
      <!-- Show loading state while fetching -->
      <div v-if="cartStore.golobalLoading" class="loading">
        Loading product details...
      </div>
      <!-- Show ProductDetail if product exists and no error, otherwise show NotFound -->
      <ProductDetail v-else-if="product && !errorPage" :product="product" />
      <NotFound v-else />
    </div>
  </AppLayout>
</template>