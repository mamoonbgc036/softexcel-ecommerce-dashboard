<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { Head } from "@inertiajs/vue3";
import { useWishlistStore } from "@/Store/wishlistStore";
import ProductCard from "@/components/Product/ProductCard.vue";

const wishlistStore = useWishlistStore();

</script>

<template>

  <Head>
    <title>Wishlist</title>
  </Head>
  <AppLayout>

    <section class="wishlistPage">

      <div class="bg-gray-100 py-8 px-6 flex items-center justify-between">
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold text-center">My Wishlist</h1>
        </div>
      </div>


      <div class="container mx-auto py-8">
        <div v-if="wishlistStore.wishlist.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard v-for="product in wishlistStore.wishlist" :key="product.id" :product="product.product"
            :is-wishlisted="true" />
        </div>
        <div v-else class="text-center py-8 space-y-4">
          <p class="text-lg font-semibold">Your wishlist is empty.</p>
          <p class="text-gray-500">Browse products and add them to your wishlist.</p>
        </div>
      </div>

    </section>

  </AppLayout>
</template>