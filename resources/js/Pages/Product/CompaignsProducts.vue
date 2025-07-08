<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head } from '@inertiajs/vue3';
import { useHomeStore } from '@/Store/homeStore';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import ProductCardStyle2 from '@/components/Product/ProductCardStyle2.vue';

const homeStore = useHomeStore()
const compaigns = computed(() => homeStore.compaigns);

// Countdown timer logic
const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const timerInterval = ref(null)

// Get the earliest expiry date from all campaigns
const campaignEndDate = computed(() => {
  if (!compaigns.value || compaigns.value.length === 0) return null

  // Find the earliest expiry date from all campaigns
  const expiryDates = compaigns.value
    .filter(product => product.product_campaign && product.product_campaign.campaign)
    .map(product => new Date(product.product_campaign.campaign.expiry_date))

  if (expiryDates.length === 0) return null
  return new Date(Math.min(...expiryDates))
})

// Calculate time remaining
const updateTimer = () => {
  if (!campaignEndDate.value) return

  const now = new Date()
  const difference = campaignEndDate.value - now

  // If campaign has ended
  if (difference <= 0) {
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    clearInterval(timerInterval.value)
    return
  }

  // Calculate remaining time
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  timeRemaining.value = { days, hours, minutes, seconds }
}

// Get campaign name
const campaignName = computed(() => {
  if (!compaigns.value || compaigns.value.length === 0) return 'Campaign'

  const firstProduct = compaigns.value.find(product =>
    product.product_campaign && product.product_campaign.campaign
  )

  return firstProduct?.product_campaign?.campaign?.name || 'Campaign'
})

onMounted(() => {
  updateTimer()
  timerInterval.value = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>

<template>

  <Head>
    <title>Campaigns</title>
  </Head>
  <AppLayout>
    <div v-if="compaigns.length > 0" class="compaignsPage pb-10">
      <div
        class="section_title_area py-10 bg-white mb-5 px-5 ">
        <div class="container flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 class="text-2xl font-semibold">{{ campaignName }}</h2>

          <!-- Countdown Timer (Right Side) -->
          <div v-if="campaignEndDate" class="flex items-center gap-6 mt-4 md:mt-0">
            <div class="text-center hidden sm:block">
              <span class="bg-theme text-white px-3 py-1 rounded-md font-semibold text-sm inline-block">
                OFFER ENDS IN
              </span>
            </div>
            <div class="flex items-center justify-center">
              <div
                class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]">
                <div class="text-xl sm:text-xl font-bold text-theme">{{ timeRemaining.days }}</div>
                <div class="text-xs text-gray-600 font-medium">Days</div>
              </div>
              <div class="text-xl font-bold mx-1 text-gray-500">:</div>
              <div
                class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]">
                <div class="text-xl sm:text-xl font-bold text-theme">{{ timeRemaining.hours.toString().padStart(2, '0')
                  }}</div>
                <div class="text-xs text-gray-600 font-medium">Hours</div>
              </div>
              <div class="text-xl font-bold mx-1 text-gray-500">:</div>
              <div
                class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]">
                <div class="text-xl sm:text-xl font-bold text-theme">{{ timeRemaining.minutes.toString().padStart(2,
                  '0') }}</div>
                <div class="text-xs text-gray-600 font-medium">Mins</div>
              </div>
              <div class="text-xl font-bold mx-1 text-gray-500">:</div>
              <div
                class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]">
                <div class="text-xl sm:text-xl font-bold text-theme">{{ timeRemaining.seconds.toString().padStart(2,
                  '0') }}</div>
                <div class="text-xs text-gray-600 font-medium">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <template v-for="product in compaigns" :key="product.id">
            <ProductCardStyle2 :product="product" />
          </template>
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center py-10">
      <h3 class="text-2xl font-semibold">No products found</h3>
    </div>
  </AppLayout>
</template>

<style scoped>
.section_title {
  @apply text-2xl font-semibold;
}
</style>