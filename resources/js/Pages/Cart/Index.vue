<script setup>

import AppLayout from '@/Layouts/AppLayout.vue'
import ShoppingCart from '@/components/Cart/ShoppingCart.vue'
import { Head } from '@inertiajs/vue3';

</script>


<template>  
  <Head>
    <title>Cart</title>
  </Head>
  <AppLayout>
    <div class="cartPage">
      <ShoppingCart />
    </div>
  </AppLayout>
</template>