<template>
  <div class=" py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Feature 1 -->
        <div class="flex items-center bg-white rounded-lg p-4 shadow-sm">
          <div class="flex-shrink-0 mr-4">
            <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
              <ThumbsUp class="w-6 h-6 text-gray-700" />
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">হাই-কোয়ালিটি পণ্য</h3>
            <p class="text-sm text-gray-600">Enjoy top quality items for less</p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex items-center bg-white rounded-lg p-4 shadow-sm">
          <div class="flex-shrink-0 mr-4">
            <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
              <Headphones class="w-6 h-6 text-gray-700" />
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">২৪/৭ লাইভ চ্যাট</h3>
            <p class="text-sm text-gray-600">Get instant assistance</p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="flex items-center bg-white rounded-lg p-4 shadow-sm">
          <div class="flex-shrink-0 mr-4">
            <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
              <Truck class="w-6 h-6 text-gray-700" />
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">এক্সপ্রেস শিপিং</h3>
            <p class="text-sm text-gray-600">Fast & reliable delivery options</p>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="flex items-center bg-white rounded-lg p-4 shadow-sm">
          <div class="flex-shrink-0 mr-4">
            <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
              <Lock class="w-6 h-6 text-gray-700" />
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">সিকিউর্ড পেমেন্ট</h3>
            <p class="text-sm text-gray-600">Multiple safe payment methods</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ThumbsUp, Headphones, Truck, Lock } from 'lucide-vue-next';
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>