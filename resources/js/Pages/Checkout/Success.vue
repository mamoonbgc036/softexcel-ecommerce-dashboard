<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { Link, Head, router } from "@inertiajs/vue3";
import { defineProps, computed, ref, onMounted, inject } from "vue";
import { useCartStore } from "@/Store/cartStore";


const cartStore = useCartStore();

const props = defineProps({
  invoiceNumber: {
    type: String,
    required: true,
  },
});

const order = ref(null);
const checkoutMessage = ref("");
const $axios = inject("$axios");

const fetchOrderData = async () => {
  try {
    const response = await $axios.get(`/order/data/${props.invoiceNumber}`);
    console.log("API Response:", response.data);

    if (response.data.success) {
      order.value = response.data.data.order;
      checkoutMessage.value = response.data.data.checkoutMessage || "";
    } else {
      console.error("Order not found in response");
    }
  } catch (error) {
    console.error("Error fetching order data:", error);
  }
};

onMounted(() => {
  fetchOrderData();
});

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-amber-400';
    case 'processed': return 'bg-blue-500';
    case 'shipped': return 'bg-green-500';
    case 'returned': return 'bg-red-500';
    case 'delivered': return 'bg-green-600';
    case 'cancelled': return 'bg-red-600';
    case 'on delivery': return 'bg-amber-500';
    case 'pending delivery': return 'bg-orange-500';
    case 'incomplete': return 'bg-gray-500';
    default: return 'bg-gray-400';
  }
};

// Calculate coupon discount - 15% of product price (73)
const couponDiscount = computed(() => {
  if (order.value?.items && order.value.items.length) {
    let totalDiscount = 0;
    order.value.items.forEach(item => {
      // Use the item price (1010) not the base product price (1000)
      const actualPrice = item.price;
      if (item.discount && item.discount_type) {
        if (item.discount_type.toLowerCase() === 'percentage') {
          const discountAmount = (parseFloat(actualPrice) * item.quantity * parseFloat(item.discount)) / 100;
          totalDiscount += Math.round(discountAmount);
        } else if (item.discount_type.toLowerCase() === 'fixed') {
          totalDiscount += parseFloat(item.discount);
        }
      }
    });
    return totalDiscount;
  }
  return 0;
});

// Campaign discount - flat 50
const campaignDiscount = computed(() => {
  if (order.value?.items && order.value.items.length) {
    let totalDiscount = 0;
    order.value.items.forEach(item => {
      if (item.campaign) {
        totalDiscount += parseFloat(item.campaign.discount) * item.quantity;
      }
    });
    return totalDiscount;
  }
  return 0;
});

// Calculate subtotal based on original product price
const subtotal = computed(() => {
  let total = 0;
  if (order.value?.items && order.value.items.length) {
    order.value.items.forEach(item => {
      // Use the item price (1010) which includes attribute option costs
      total += parseFloat(item.price) * item.quantity;
    });
  }
  return total;
});

const totalDiscount = computed(() => {
  return couponDiscount.value + campaignDiscount.value + parseFloat(order.value?.discount || 0);
});

// Calculate total to verify it matches 62
const calculatedTotal = computed(() => {
  return subtotal.value - couponDiscount.value - campaignDiscount.value + parseFloat(order.value?.delivery_charge || 0);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toFixed(2);
};

const printReceipt = () => {
  const printContent = document.getElementById("receipt_print");
  const originalContent = document.body.innerHTML;

  document.body.innerHTML = printContent.innerHTML;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
};
</script>

<template>

  <Head>
    <title>Order Successful</title>
  </Head>
  <AppLayout>
    <div v-if="order" id="receipt_print" class="py-4 px-4 bg-gray-50 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <!-- Success Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
          <p class="text-gray-600 mt-2">{{ checkoutMessage }}</p>
        </div>

        <!-- Order Details -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-800">Order Information</h2>
          </div>

          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Invoice Number:</span>
                <span class="font-medium">#{{ order.invoice_number }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Order Date:</span>
                <span class="font-medium">{{ formatDate(order.created_at) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Payment Method:</span>
                <span class="font-medium capitalize">{{ order.payment_method }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Payment Status:</span>
                <span class="font-medium capitalize">{{ order.payment_status }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Order Status:</span>
                <span
                  :class="[getStatusClass(order.order_status), 'px-3 py-1 rounded-full text-white text-sm font-medium']">
                  {{ order.order_status }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-800 mb-2">Customer Details</h3>
                <p class="text-gray-600">{{ order.customer_name }}</p>
                <p class="text-gray-600">{{ order.phone_number }}</p>
                <p v-if="order.alternative_phone_number" class="text-gray-600">Alt: {{ order.alternative_phone_number }}
                </p>
              </div>

              <div>
                <h3 class="font-medium text-gray-800 mb-2">Shipping Address</h3>
                <p class="text-gray-600">{{ order.address || 'N/A' }}</p>
                <p v-if="order.note" class="text-gray-600 mt-2">
                  <span class="font-medium">Note:</span> {{ order.note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-800">Order Items</h2>
          </div>

          <div class="divide-y divide-gray-200">
            <div v-for="(item, index) in order.items" :key="index" class="p-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="w-24 h-24 flex-shrink-0">
                  <img :src="item.product.featured_image" :alt="item.product.product_name"
                    class="w-full h-full object-cover rounded-md" />
                </div>

                <div class="flex-1">
                  <h3 class="font-medium text-gray-800">{{ item.product.product_name }}</h3>
                  <div class="mt-2 text-sm text-gray-600">
                    <p>Quantity: {{ item.quantity }}</p>
                    <!-- <p>Price: {{ cartStore.currencysymbol }}{{ formatCurrency(item.product.price) }}</p> -->

                    <!-- <div class="mt-2 flex flex-wrap gap-2">
                      <span v-if="item.code"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Coupon: {{ item.code }}
                        (-{{ cartStore.currencysymbol }}{{ formatCurrency(
                          Math.round(
                            item.discount_type.toLowerCase() === 'percentage'
                              ? (parseFloat(item.product.price) * item.quantity * parseFloat(item.discount)) / 100
                              : parseFloat(item.discount)
                          )
                        ) }})
                      </span>

                      <span v-if="item.campaign"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {{ item.campaign.name }} Campaign (-{{ cartStore.currencysymbol }}{{ formatCurrency(parseFloat(item.campaign.discount) *
                          item.quantity) }})
                      </span>
                    </div> -->

                    <div v-if="item.options && item.options.length" class="mt-2">
                      <p class="font-medium">Options:</p>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <span v-for="option in item.options" :key="option.id"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {{ option.attribute_option.name }}
                          {{ option.quantity > 1 ? `(${option.quantity})` : '' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div class="text-right">
                  <p class="font-medium text-gray-800">{{ cartStore.currencysymbol }}{{ formatCurrency(parseFloat(item.product.price) *
                    item.quantity) }}</p>

                  <div v-if="item.discount || item.campaign" class="text-sm text-green-600">
                    <p v-if="item.discount">
                      Coupon: -{{ cartStore.currencysymbol }}{{ formatCurrency(
                        Math.round(
                          item.discount_type.toLowerCase() === 'percentage'
                            ? (parseFloat(item.product.price) * item.quantity * parseFloat(item.discount)) / 100
                      : parseFloat(item.discount)
                      )
                      ) }}
                    </p>
                    <p v-if="item.campaign">
                      Campaign: -{{ cartStore.currencysymbol }}{{ formatCurrency(parseFloat(item.campaign.discount) * item.quantity) }}
                    </p>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="flex justify-center items-center p-4 font-medium text-lg">
              <span>Total: {{ cartStore.currencysymbol }}{{ formatCurrency(order.total_price) }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <!-- <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-2">
            <h2 class="text-lg font-semibold text-gray-800">Order Summary</h2>
          </div>

          <div class="p-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ cartStore.currencysymbol }}{{ formatCurrency(subtotal) }}</span>
              </div>

              <div v-if="couponDiscount > 0" class="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-{{ cartStore.currencysymbol }}{{ formatCurrency(couponDiscount) }}</span>
              </div>

              <div v-if="campaignDiscount > 0" class="flex justify-between text-green-600">
                <span>Campaign Discount</span>
                <span>-{{ cartStore.currencysymbol }}{{ formatCurrency(campaignDiscount) }}</span>
              </div>

              <div v-if="parseFloat(order.discount) > 0" class="flex justify-between text-green-600">
                <span>Additional Discount</span>
                <span>-{{ cartStore.currencysymbol }}{{ formatCurrency(order.discount) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Charge</span>
                <span>{{ cartStore.currencysymbol }}{{ formatCurrency(order.delivery_charge) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-2 mt-1">
                <div class="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{{ cartStore.currencysymbol }}{{ formatCurrency(order.total_price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Actions -->
        <div class="flex justify-center gap-4 print-hide">
          <Link href="/"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Continue Shopping
          </Link>
          <button type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="printReceipt">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
              </path>
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
    <div v-else class="py-4 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <p class="text-gray-600">Loading order details...</p>
    </div>
  </AppLayout>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }

  .bg-gray-50 {
    background-color: white !important;
  }

  .max-w-4xl,
  .max-w-4xl * {
    visibility: visible;
  }

  .max-w-4xl {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .print-hide {
    display: none !important;
  }
}
</style>