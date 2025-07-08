<script setup>
import { Link } from "@inertiajs/vue3";
import { defineProps, ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const product = ref(props.product);
const currentTime = ref(new Date()); // Add reactive current time

// Check if product is sold out
const isSoldOut = computed(() => {
  return props.product.quantity <= 0;
});

// Calculate regular discount percentage
const discountPercentage = computed(() => {
  const { price, previous_price } = props.product;
  if (!previous_price || previous_price <= 0) return 0;
  const discount = ((previous_price - price) / previous_price) * 100;
  return Math.round(discount);
});

// Check if product has active campaign
const hasCampaign = computed(() => {
  return props.product.product_campaign && props.product.product_campaign.campaign;
});

// Calculate campaign end time
const timeRemaining = computed(() => {
  if (!hasCampaign.value) return null;

  const expiryDate = new Date(props.product.product_campaign.campaign.expiry_date);
  const diff = expiryDate - currentTime.value; // Use reactive currentTime

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
});

// Calculate campaign discounted price
const campaignPrice = computed(() => {
  if (!hasCampaign.value) return props.product.price;

  const discount = parseFloat(props.product.product_campaign.campaign.discount); // Fixed discount
  const originalPrice = parseFloat(props.product.price);
  return (originalPrice - discount).toFixed(2);
});

// Update timer every second
const timer = ref(null);
onMounted(() => {
  timer.value = setInterval(() => {
    currentTime.value = new Date(); // Update current time every second
  }, 1000);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<template>
  <div class="product-item overflow-hidden">
    <div class="product-image relative">
      <Link :href="`/product/${product.slug}`">
      <img :src="product?.featured_image" :alt="product.product_name" class="w-full h-full object-cover" />
      </Link>

      <!-- Regular Discount Badge -->
      <span v-if="!hasCampaign && discountPercentage > 0"
        class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold">
        -{{ discountPercentage }}%
      </span>

      <!-- Campaign Discount Badge -->
      <span v-if="hasCampaign"
        class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold">
        -{{ product.product_campaign.campaign.discount }}{{ cartStore.currencysymbol }}
      </span>

      <!-- Sold Out Badge -->
      <span v-if="isSoldOut"
        class="absolute top-[40px] left-3 bg-white text-gray-500 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]">
        SOLD OUT
      </span>

      <!-- Campaign Timer -->
      <!-- <div v-if="hasCampaign && timeRemaining" class="text-xs text-white mb-2 absolute bottom-3 left-3">
        <span class="bg-theme px-2 py-1 rounded">
          Ends in: {{ timeRemaining.days }}d {{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m {{
            timeRemaining.seconds }}s
        </span>
      </div> -->

    </div>

    <div class="pt-3 px-3 text-center">
      <h3 class="product-title text-[14px] font-normal mb-2">
        <Link :href="`/product/${product.slug}`">{{ product.product_name }}</Link>
      </h3>

      
      <div class="bangla-font flex justify-center items-center">
        
        <span v-if="product.previous_price" class="text-gray-500 line-through mr-2">
          {{ product.previous_price }}{{ cartStore.currencysymbol }}
        </span>

        
        <span v-if="hasCampaign" class="text-theme font-bold">
          {{ campaignPrice }}{{ cartStore.currencysymbol }}
        </span>
        <span v-else class="text-theme font-bold">
          {{ product.price }}{{ cartStore.currencysymbol }}
        </span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.product-item {
  @apply p-[10px] md:p-[15px] bg-white;
  transition: transform 0.3s;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
}

.product-image {
  @apply relative overflow-hidden h-[160px] lg:h-[300px] md:h-[230px] sm:h-[220px];
}

.product-title {
  @apply text-gray-700 hover:text-gray-900 transition-colors;
}

.section-title-wrapper::after {
  position: absolute;
  width: 100%;
  height: .1px;
  background: #f3f3f3;
  top: 50%;
  right: 0;
  content: "";
  transform: translateY(-50%);
}
</style>