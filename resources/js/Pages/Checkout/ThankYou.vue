<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8">
      <div class="container mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <img :src="thankyouPng" alt="Delivery Truck" class="w-32 h-32 mx-auto mb-6" />
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            Thank you for your order, {{ orderDetails.customer_name }}!
          </h1>
          <p class="text-gray-600">
            Your order #{{ orderDetails.invoice_number }} has been received and is being processed
          </p>
        </div>

        <!-- Order Details Grid -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <!-- Shipping Address -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              <div class="text-gray-600">
                <p>{{ orderDetails.customer_name }}</p>
                <p>{{ orderDetails.address }}</p>
                <p>Phone: {{ orderDetails.phone_number }}</p>
                <p>Email: {{ orderDetails.email }}</p>
              </div>
            </div>

            <!-- Order Summary -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div class="space-y-2">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span><span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ orderDetails.total_price }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span><span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ orderDetails.delivery_charge }}</span>
                </div>
                <!-- Coupon Discount -->
                <div v-if="totalCouponDiscount > 0" class="flex justify-between text-gray-600">
                  <span>Coupon Discount</span>
                  <span class="text-red-600">-<span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ totalCouponDiscount }}</span>
                </div>
                <!-- Campaign Discount -->
                <div v-if="totalCampaignDiscount > 0" class="flex justify-between text-gray-600">
                  <span>Campaign Discount</span>
                  <span class="text-red-600">-<span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ totalCampaignDiscount }}</span>
                </div>
                <!-- General Discount -->
                <div v-if="orderDetails.discount > 0" class="flex justify-between text-gray-600">
                  <span>General Discount</span>
                  <span class="text-red-600">-<span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ orderDetails.discount }}</span>
                </div>
                <div class="flex justify-between font-medium text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span><span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ finalTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <h2 class="text-lg font-medium text-gray-900 p-6 border-b">Order Items</h2>
          <div class="divide-y divide-gray-200">
            <div v-for="item in orderDetails.items" :key="item.product.id" class="p-6">
              <div class="flex items-center flex-col md:flex-row text-center md:text-left gap-5">
                <img :src="item.product.featured_image" :alt="item.product.product_name"
                  class="w-20 h-20 object-cover rounded-lg" />
                <div class="flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    {{ item.product.product_name }}
                  </h3>
                  <div class="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                    <span>Quantity: {{ item.quantity }}</span>
                    <span class="hidden md:inline">•</span>
                    <span><span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ item.individual_price }} each</span>
                    <template v-if="getItemTotalDiscount(item) > 0">
                      <span class="hidden md:inline">•</span>
                      <span class="text-red-600">
                        Savings: <span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ getItemTotalDiscount(item) }}
                      </span>
                    </template>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-base font-medium text-gray-900">
                    <span class="bangla-font">{{ cartStore.currencysymbol }}</span>{{ item.total }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Status -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            Order Status:
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                  :class="orderStatusClass">
              {{ orderDetails.order_status }}
            </span>
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Order Date: {{ formatDate(orderDetails.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { ref, computed, onMounted } from 'vue'

const orderDetails = ref({})
const thankyouPng = ref('/assets/images/icons/thank-you.png')

// Computed for total coupon discount
const totalCouponDiscount = computed(() => {
  if (!orderDetails.value?.items) return 0
  return orderDetails.value.items.reduce((sum, item) => 
    sum + (item.coupon_discount || 0), 0)
})

// Computed for total campaign discount
const totalCampaignDiscount = computed(() => {
  if (!orderDetails.value?.items) return 0
  return orderDetails.value.items.reduce((sum, item) => 
    sum + (item.campaign_discount || 0), 0)
})

// Computed for total discount
const totalDiscount = computed(() => {
  return totalCouponDiscount.value + 
         totalCampaignDiscount.value + 
         (orderDetails.value?.discount || 0)
})

// Computed for final total
const finalTotal = computed(() => {
  if (!orderDetails.value) return 0
  return (orderDetails.value.total_price || 0) + 
         (orderDetails.value.delivery_charge || 0) - 
         totalDiscount.value
})

// Computed for order status class
const orderStatusClass = computed(() => {
  const status = orderDetails.value?.order_status
  return {
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-green-100 text-green-800': status === 'completed',
    'bg-blue-100 text-blue-800': status === 'processing'
  }
})

// Function to get total discount for an item
const getItemTotalDiscount = (item) => {
  return (item.coupon_discount || 0) + (item.campaign_discount || 0)
}

// Function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  const lastOrderDetails = localStorage.getItem('lastOrderDetails')
  if (lastOrderDetails) {
    orderDetails.value = JSON.parse(lastOrderDetails)
  }
})
</script>

<style scoped>
.bangla-font {
  font-family: 'SolaimanLipi', Arial, sans-serif;
}
</style>