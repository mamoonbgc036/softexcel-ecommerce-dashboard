<script setup>

import AppLayout from '@/Layouts/AppLayout.vue'
import { Head } from '@inertiajs/vue3';
import OrderTrack from '../../components/Order/OrderTrack.vue';

</script>


<template>
  <Head>
    <title>Order Tracking</title>
  </Head>
  <AppLayout>
    <div class="orderTracking">
      <OrderTrack />
    </div>
  </AppLayout>
</template>
