<template>
  <div class="product-item overflow-hidden">
    <div class="product-image relative">
      <!-- Skeleton for product image -->
      <div class="w-full h-full bg-gray-300 animate-pulse rounded-lg"></div>
      
      <!-- Skeleton for Discount and Sold Out badges -->
      <span class="absolute top-3 left-3 bg-gray-300 text-white px-2 py-1 rounded-full text-[12px] font-bold w-16 h-5 animate-pulse"></span>
      <span class="absolute top-[40px] left-3 bg-gray-300 text-gray-500 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px] w-24 h-5 animate-pulse"></span>
    </div>
    
    <!-- Skeleton for product title and price -->
    <div class="pt-3 px-3 text-center">
      <!-- Skeleton for Product Title -->
      <div class="w-3/4 h-4 bg-gray-300 mx-auto animate-pulse rounded-lg mb-2"></div>
      
      <!-- Skeleton for price section -->
      <div class="bangla-font flex justify-center items-center space-x-2">
        <div class="w-16 h-5 bg-gray-300 animate-pulse rounded-lg"></div> <!-- Skeleton for previous price -->
        <div class="w-24 h-5 bg-gray-300 animate-pulse rounded-lg"></div> <!-- Skeleton for current price -->
      </div>
    </div>
    test
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Optional: Add custom styles if needed for the skeleton effect */
</style>
