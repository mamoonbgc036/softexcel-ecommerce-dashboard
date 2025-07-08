<template>
  <Head>
    <title>My Orders</title>
  </Head>
  <AccountLayout >
    <h1 class="text-2xl font-bold mb-4">My Orders</h1>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <Preloader  />
    </div>

    

    <!-- Responsive Table Wrapper -->
    <div v-else  class="overflow-x-auto w-full">
      <table class="w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-2 px-4 border-b">Image</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Date</th>
            <th class="py-2 px-4 border-b">Quantity</th>
            <th class="py-2 px-4 border-b">Status</th>
            <th class="py-2 px-4 border-b">Amount</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(order, index) in orders" :key="index">
            <tr v-for="(item, itemIndex) in order.items" :key="itemIndex">
              <td class="py-2 px-4 border-b">
                <img
                  :src="item.product_info?.featured_image"
                  alt="Product Image"
                  class="w-[60px] h-[60px] object-cover rounded"
                />
              </td>
              <td class="py-2 px-4 border-b">
                <span class="text-sm">{{ item.product_info?.product_name }}</span>
              </td>
              <td class="py-2 px-4 border-b">{{ formatDate(order.created_at) }}</td>
              <td class="py-2 px-4 border-b">
                <span class="text-sm">{{ item.quantity }}</span>
              </td>
              <td class="py-2 px-4 border-b">
                <span
                  :class="getStatusClass(order.order_status)"
                  class="text-sm px-2 py-1 rounded-full"
                >
                  {{ order.order_status }}
                </span>
              </td>
              <td class="py-2 px-4 border-b">{{ item.price }}</td>
            </tr>
          </template>
        </tbody>
      </table>


    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from "@/Layouts/AccountLayout.vue";
import { onMounted, ref, inject, watch } from "vue";
import { useAuthStore } from "@/Store/authStore";
import { Head } from "@inertiajs/vue3";
import Preloader from "@/components/Preloader/Preloader.vue";

const authStore = useAuthStore();


const $axios = inject('$axios');

const orders = ref([]);
const isLoading = ref(false);

const fetchUserOrderData = async () => {
  try {
    const userId = authStore.user?.id;
    isLoading.value = true;
    const response = await $axios.get('/order-get/' + userId);
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetching user order data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserOrderData();
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && newUser.id) {
      fetchUserOrderData();
    }
  },
  { immediate: true }
);




// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processed':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800';
    case 'returned':
      return 'bg-red-100 text-red-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'on delivery':
      return 'bg-purple-100 text-purple-800';
    case 'pending delivery':
      return 'bg-orange-100 text-orange-800';
    case 'incomplete':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800'; // Default fallback
  }
};

</script>

