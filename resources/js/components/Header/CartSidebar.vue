<script setup>
import { onMounted, computed, ref } from "vue";
import { PhX } from "@phosphor-icons/vue";
import { Link } from "@inertiajs/vue3";
import { useCartStore } from "@/Store/cartStore";

const emptyCartIcon = ref('/assets/images/icons/empty-cart.png');

const cartStore = useCartStore();

// Fetch cart items when the component mounts
onMounted(() => {
  cartStore.fetchCartItems();
});

// Access cart items from the store
const cartItems = computed(() => cartStore.cartItems);

</script>

<template>

  <!-- <pre>{{ cartItems }}</pre> -->
  <div>
    <!-- Overlay -->
    <div v-if="cartStore.isCartOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="cartStore.toggleCart"></div>

    <!-- Cart Panel -->
    <div
      class="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300"
      :class="{ 'translate-x-0': cartStore.isCartOpen, 'translate-x-full': !cartStore.isCartOpen }">
      <!-- Header -->
      <div class="p-4 flex justify-between items-center border-b">
        <h2 class="text-xl font-semibold">Shopping cart</h2>
        <button @click="cartStore.toggleCart" class="flex items-center text-gray-600 hover:text-gray-800">
          <span class="text-2xl mr-1">
            <PhX :size="28" />
          </span> Close
        </button>
      </div>

      <!-- Cart Items -->
      <div class="p-4 overflow-y-auto h-full pb-[235px]">
        <div v-if="cartItems.length === 0" class="text-center text-gray-600">
          <div class="mb-4 w-full pt-5 flex justify-center items-center h-full">
            <img :src="emptyCartIcon" alt="Empty Cart" class="mx-auto w-[200px] mb-4" />
          </div>
          Your cart is empty.
        </div>
        <div v-else>
          <div v-for="item in cartItems" :key="item.id" class="flex items-start space-x-3 mb-4">
            <div class="w-20 h-20 bg-gray-100 rounded">
              <img :src="item.product.featured_image" :alt="item.product.product_name"
                class="w-full h-full object-cover rounded" />
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-medium mb-2">{{ item.product.product_name }} - <span class="mr-2"
                  v-for="attribute in item.attributes" :key="attribute.id">{{ attribute.attribute_option }}</span></h3>
              <div class="flex text-[13px] items-center text-gray-600">
                <span>{{ item.quantity }} × </span>
                <span class="text-theme ml-1">{{ item.individual_price }}{{ cartStore.currencysymbol }}</span>
              </div>
            </div>
            <button @click="cartStore.removeItem(item.id)" class="text-gray-400 hover:text-gray-600 text-xl">
              <PhX :size="28" />
            </button>
          </div>
        </div>
      </div>

      <!-- Subtotal and Buttons -->
      <div class="fixed bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-600">Subtotal:</span>
          <span class="text-theme font-semibold">{{ cartStore.cartTotalPrice }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span> </span>
        </div>

        <div class="space-y-3">
          <Link href="/cart" 
            class="w-full block text-center bg-gray-200 text-gray-800 text-sm font-semibold py-3 rounded hover:bg-gray-300 transition"
            
            >
          VIEW CART
          </Link>
          <button @click="cartStore.goToCheckout" :disabled="cartItems.length === 0"
            class="w-full block text-center bg-theme text-white py-3 text-sm font-semibold rounded hover:bg-secondary transition"
            :class="cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''"
            >
          CHECKOUT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
