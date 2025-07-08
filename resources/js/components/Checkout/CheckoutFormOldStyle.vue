<script setup>
import { ref, computed, watch, inject, onMounted } from "vue";
import { useCartStore } from "@/Store/cartStore";
import { useAuthStore } from "@/Store/authStore"; // Import Auth Store
import { useHomeStore } from "@/Store/homeStore";
import { toast } from "@steveyuowo/vue-hot-toast";
import { router } from "@inertiajs/vue3";
import { trackCheckout, trackDiractCheckout, trackPurchase } from "@/services/gtmHelper";

const cartStore = useCartStore();
const authStore = useAuthStore();
const homeStore = useHomeStore();

const $axios = inject('$axios');

const cartItems = computed(() => cartStore.cartItems);
const directOrderProduct = ref(null);

onMounted(() => {
  if (typeof window !== "undefined") {
    const storedProductData = localStorage.getItem("directOrderProductData");
 if (storedProductData) {
      directOrderProduct.value = JSON.parse(storedProductData);
    }
  }
});

// Updated computed properties
const subtotal = computed(() => {
  if (cartStore.is_direct_order) {
    return directOrderProductSubtotal.value;
  } else {
    return cartItems.value.reduce((total, item) => {
      const price = parseFloat(item.individual_price.replace(/,/g, '')); // Remove commas
      return total + price * item.quantity;
    }, 0);
  }
});

const directOrderProductSubtotal = computed(() => {
  if (!directOrderProduct.value) return 0;

  let basePrice = parseFloat(directOrderProduct.value.price || 0);
  const additionalPrices = directOrderProduct.value.selectedAttributes.reduce(
    (total, attr) => total + parseFloat(attr.attribute_option_price || 0),
    0
  );
  return basePrice * directOrderProduct.value.quantity;
});

// Add campaign discount calculation for both cart items and direct order
const campaignDiscount = computed(() => {
  if (cartStore.is_direct_order) {
    // Apply campaign discount for direct orders if it exists
    if (directOrderProduct.value && directOrderProduct.value.campaign_id &&
      directOrderProduct.value.discount_value) {
      return parseFloat(directOrderProduct.value.discount_value) * directOrderProduct.value.quantity;
    }
    return 0;
  } else {
    return cartItems.value.reduce((total, item) => {
      // Check if discount_value exists and convert to number
      const discountValue = item.discount_value ? parseFloat(item.discount_value) : 0;
      return total + (discountValue * item.quantity);
    }, 0);
  }
});

// Update total to include campaign discount
const total = computed(() => subtotal.value + form.value.delivery_charge - (form.value.discount || 0) - campaignDiscount.value);

const cod = ref('/assets/images/payment/cod-pay.png');
const bKash = ref('/assets/images/payment/bkash-pay.png');

// Form state
const form = ref({
  name: "",
  mobile: "",
  extra_mobile: "",
  address: "",
  note: "",
  order_status: "pending",
  order_type: "checkout",
  delivery: "cod",
  delivery_area: "", // Default value is empty
  delivery_charge: 0, // Default value is empty
  discount: 0, // Add discount property
});

const scInsideDhaka = computed(() =>
  homeStore.siteinfos?.[0]?.shipping_charge_inside_dhaka
    ? parseFloat(homeStore.siteinfos[0].shipping_charge_inside_dhaka)
    : null
);

const scOutsideDhaka = computed(() =>
  homeStore.siteinfos?.[0]?.shipping_charge_outside_dhaka
    ? parseFloat(homeStore.siteinfos[0].shipping_charge_outside_dhaka)
    : null
);

const updateDeliveryCharge = () => {
  if (form.value.delivery_area === 'inside') {
    form.value.delivery_charge = scInsideDhaka.value; // Add `.value`
  } else {
    form.value.delivery_charge = scOutsideDhaka.value; // Add `.value`
  }
};

// Watch for authenticated user changes
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      form.value.name = newUser.name; // Autofill the name field
    }
  },
  { immediate: true }
);

// Methods
const toggleCoupon = () => {
  showCoupon.value = !showCoupon.value;
};

// Coupon apply
const showCoupon = ref(false);
const couponCode = ref('');

// Extract product IDs dynamically from cartItems
const productIds = computed(() => {
  if (cartStore.is_direct_order) return [directOrderProduct.value.product_id];
  return cartItems.value.map(item => item.product.id);
});

// Add these refs to store coupon information
const appliedCoupon = ref(null);

// Update the applyCoupon function to store the coupon data
const applyCoupon = async () => {
  try {
    // Make an API call to validate the coupon
    const response = await $axios.post('/coupon', {
      coupon_code: couponCode.value,
      product_ids: productIds.value, // Use dynamically extracted product IDs
    });

    if (response.data.status) {
      // Extract coupon data from the response
      const couponData = response.data.coupon;
      const discountDetails = response.data.discount_details;
      
      // Store the coupon information for later use in order payload
      appliedCoupon.value = {
        id: couponData.id,
        code: couponData.code,
        discount_type: couponData.discount_type,
        discount_amount: couponData.discount_amount
      };
      
      // Apply the discount based on the response
      if (couponData.discount_type === 'percentage') {
        // Apply percentage discount to the subtotal
        form.value.discount = (subtotal.value * Number.parseFloat(couponData.discount_amount)) / 100;
      } else if (couponData.discount_type === 'fixed') {
        // Apply fixed amount discount
        form.value.discount = Number.parseFloat(couponData.discount_amount);
      }
      
      // If the response includes specific discount details, use that instead
      if (discountDetails && discountDetails.total_discount) {
        form.value.discount = Number.parseFloat(discountDetails.total_discount);
      }

      toast.success(response.data.message || 'Coupon applied successfully.');
      
      // Update the UI to show which products received the discount
      if (discountDetails && discountDetails.discounted_products && !cartStore.is_direct_order) {
        // For cart items, update the coupon_discount property
        const discountedProductIds = discountDetails.discounted_products.map(p => p.id);
        
        cartItems.value.forEach(item => {
          const discountedProduct = discountDetails.discounted_products.find(p => p.id === item.product.id);
          if (discountedProduct) {
            item.coupon_discount = discountedProduct.discount;
          }
        });
      } else if (discountDetails && discountDetails.discounted_products && cartStore.is_direct_order) {
        // For direct order, update the coupon_discount property
        if (directOrderProduct.value && 
            discountDetails.discounted_products.some(p => p.id === directOrderProduct.value.product_id)) {
          const discountedProduct = discountDetails.discounted_products.find(
            p => p.id === directOrderProduct.value.product_id
          );
          if (discountedProduct) {
            directOrderProduct.value.coupon_discount = discountedProduct.discount;
            // Update localStorage
            localStorage.setItem("directOrderProductData", JSON.stringify(directOrderProduct.value));
          }
        }
      }
    } else {
      toast.error(response.data.message || 'Invalid coupon code.');
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    toast.error('An error occurred while applying the coupon.');
  }
};

const updateQuantity = (product, change) => {
  if (!product) return;

  // Calculate the new quantity
  const newQuantity = product.quantity + change;

  // Ensure quantity doesn't go below 1
  if (newQuantity < 1) {
    toast.error("Quantity cannot be less than 1");
    return;
  }

  // Check if newQuantity exceeds the lowest attribute_option_quantity
  const minStock = Math.min(...product.selectedAttributes.map(attr => attr.attribute_option_quantity));

  if (newQuantity > minStock) {
    toast.error("Stock Out");
    return;
  }

  // Update the quantity
  product.quantity = newQuantity;

  // Update localStorage
  localStorage.setItem("directOrderProductData", JSON.stringify(product));

  // Provide feedback
  toast.success(`Updated Quantity`);
};

const validateForm = () => {
  if (!form.value.name) {
    toast.error("Name is required.");
    return false;
  }
  if (!form.value.mobile || !/^\d{11}$/.test(form.value.mobile)) {
    toast.error("A valid 11-digit mobile number is required.");
    return false;
  }
  if (!form.value.address) {
    toast.error("Address is required.");
    return false;
  }
  return true;
};

const incompleteOrderID = ref(null);

const createIncompleteOrder = async () => {
  if (!validateForm()) return;

  let items = [];

  // Check if it's a direct order
  if (cartStore.is_direct_order && typeof window !== "undefined") {
    const directOrderData = JSON.parse(localStorage.getItem("directOrderProductData"));
    if (directOrderData) {
      items = [{
        product_id: directOrderData.product_id,
        quantity: directOrderData.quantity,
        individual_price: Number.parseFloat(directOrderData.price),
        total: Number.parseFloat(directOrderData.price) * directOrderData.quantity,
        attributes: directOrderData.selectedAttributes || [],
        attributeOptionId: null, // Default for direct orders
        campaign_discount: directOrderData.discount_value ?
          Number.parseFloat(directOrderData.discount_value) * directOrderData.quantity : 0, // Add campaign discount
        coupon_discount: 0,
        original_price: Number.parseFloat(directOrderData.price),
        campaign_id: directOrderData.campaign_id || null, // Include campaign_id at item level
      }];
    }
  } else {
    // Use cart items for regular orders
    if (!cartStore.cartItems || cartStore.cartItems.length === 0) {
      return;
    }

    items = cartStore.cartItems.map((item) => ({
      product_id: item.product_id || item.id,
      quantity: item.quantity || 1,
      individual_price: parseFloat(item.individual_price.replace(/,/g, '') || item.price || 0),
      total: parseFloat((item.individual_price.replace(/,/g, '') || item.price.replace(/,/g, '') || 0) * item.quantity),
      attributes: item.attributes || [],
      attributeOptionId: item.attributeOptionId || "",
      campaign_discount: parseFloat(item.discount_value || 0) * item.quantity, // Add campaign discount
      coupon_discount: item.coupon_discount || 0,
      original_price: parseFloat(item.original_price || item.price || 0),
      campaign_id: item.campaign_id || null, // Include campaign_id at item level
    }));
  }

  // Get campaign_ids from items
  const campaignIds = items.map(item => item.campaign_id).filter(id => id !== null);

  // Retrieve user_id: Check if user is logged in, else use guest ID
  let user_id = authStore.user ? authStore.user.id : null;
  if (typeof window !== "undefined") {
    user_id = user_id || localStorage.getItem("guest_id");
  }

  const orderData = {
    items,
    user_id,  // Now user_id follows the same logic as placeOrder
    user_name: form.value.name,
    address: form.value.address,
    phone_number: form.value.mobile,
    note: form.value.note || "",
    order_status: "incomplete",
    order_type: "checkout",
    delivery: form.value.delivery,
    delivery_charge: form.value.delivery_charge,
    select_area: form.value.delivery_area,
    shipping_price: 0,
    subtotal: cartStore.subtotal || 0,
    total_campaign_discount: campaignDiscount.value, // Add campaign discount
    total_coupon_discount: form.value.discount || 0,
    final_total: parseFloat(cartStore.total) || 0,
    is_direct_order: cartStore.is_direct_order || false,
    incomplete_order_id: 0,
    // Add campaign_id to the incomplete order payload - use the first campaign_id if multiple exist
    campaign_id: campaignIds.length > 0 ? campaignIds[0] : null,
    // Include all campaign_ids if needed
    campaign_ids: campaignIds.length > 0 ? campaignIds : null,
  };

  try {
    const response = await $axios.post("/create-order", orderData);

    console.log("Incomplete Order Created:", response.data.id);

    incompleteOrderID.value = response.data.id;

    if (typeof window !== "undefined") {
      localStorage.setItem("incomplete_order_id", response.data.incomplete_order_id);
    }
  } catch (error) {
    console.error("Error creating incomplete order:", error);
    toast.error(error.response?.data?.message || "Failed to create order.");
  }
};

let createOrderTimeout = null;

const handleMobileBlur = () => {
  // Debounce to avoid multiple requests
  if (createOrderTimeout) clearTimeout(createOrderTimeout);
  createOrderTimeout = setTimeout(() => {
    if (/^\d{11}$/.test(form.value.mobile)) {
      createIncompleteOrder();
    } else {
      toast.error("Please enter a valid 11-digit mobile number.");
    }
  }, 300);
};

// Update the placeOrder function to include coupon details in the payload
const placeOrder = async () => {
  if (!validateForm()) return;

  let userId = authStore.user ? authStore.user.id : null;
  if (typeof window !== "undefined") {
    userId = userId || localStorage.getItem("guest_id");
  }

  // console.log("User ID:", userId);

  let items = [];

  if (cartStore.is_direct_order) {
    if (typeof window !== "undefined") {
      const productData = JSON.parse(localStorage.getItem("directOrderProductData"));
      if (productData) {
        items = [{
          product_id: productData.product_id,
          quantity: productData.quantity,
          individual_price: Number.parseFloat(productData.price),
          total: Number.parseFloat(productData.price) * productData.quantity,
          attributes: productData.selectedAttributes.map((attr) => ({
            product_attr_id: attr.product_attr_id, // Ensure correct product_attr_id
            attribute_id: attr.attribute_id,
            attribute_option_id: attr.attribute_option_id,
            attribute_name: attr.attribute_name,
            attribute_option: attr.attribute_option,
            attribute_option_price: attr.attribute_option_price || "0.00",
          })),
          attributeOptionId: productData.selectedAttributes
            .map(attr => attr.product_attr_id) // Extract product_attr_id values
            .filter(id => id) // Remove falsy values
            .join(",") || null, // Convert to comma-separated string
          campaign_discount: productData.discount_value ?
            Number.parseFloat(productData.discount_value) * productData.quantity : 0, // Add campaign discount
          coupon_discount: Number.parseFloat(productData.coupon_discount) || 0,
          original_price: Number.parseFloat(productData.price),
          campaign_id: productData.campaign_id || null, // Include campaign_id at item level
        }];
      }
    }
  } else {
    items = cartItems.value.map((item) => {
      // Extract all `product_attr_id` values from attributes and join them into a comma-separated string
      const attributeOptionId = item.attributes
        .map(attr => attr.product_attr_id) // Get `product_attr_id`
        .filter(id => id) // Remove falsy values (null, undefined)
        .join(","); // Convert array to comma-separated string

      return {
        product_id: item.product.id,
        quantity: item.quantity,
        individual_price: Number.parseFloat(item.individual_price.replace(/,/g, '')),
        total: Number.parseFloat(item.individual_price.replace(/,/g, '')) * item.quantity,
        attributes: item.attributes.map((attr) => ({
          product_attr_id: attr.product_attr_id || null, // Ensure it's included
          attribute_id: attr.attribute_id,
          attribute_option_id: attr.attribute_option_id,
          attribute_name: attr.attribute_name,
          attribute_option: attr.attribute_option,
          attribute_option_price: attr.attribute_option_price || "0.00",
        })),
        attributeOptionId: attributeOptionId || null, // Assign formatted string or null if empty
        campaign_discount: Number.parseFloat(item.discount_value || 0) * item.quantity, // Add campaign discount
        coupon_discount: item.coupon_discount || 0,
        original_price: Number.parseFloat(item.product.price.replace(/,/g, '')),
        campaign_id: item.campaign_id || null, // Include campaign_id at item level
      };
    });
  }

  // Get campaign_ids from items
  const campaignIds = items.map(item => item.campaign_id).filter(id => id !== null);
  
  // Create the order data object with coupon details and campaign_ids
  const orderData = {
    items,
    user_id: userId,
    user_name: form.value.name,
    address: form.value.address,
    phone_number: form.value.mobile,
    note: form.value.note || "",
    order_status: "pending",
    order_type: "checkout",
    delivery: form.value.delivery || "cod",
    delivery_charge: form.value.delivery_charge,
    select_area: form.value.delivery_area,
    shipping_price: 0,
    subtotal: subtotal.value,
    total_campaign_discount: campaignDiscount.value, // Add campaign discount
    total_coupon_discount: parseFloat(form.value.discount || 0),
    final_total: total.value,
    is_direct_order: cartStore.is_direct_order || false,
    incomplete_order_id: incompleteOrderID.value || 0,
    // Add coupon details to the order payload
    coupon_id: appliedCoupon.value ? appliedCoupon.value.id : null,
    code: appliedCoupon.value ? appliedCoupon.value.code : null,
    discount_type: appliedCoupon.value ? appliedCoupon.value.discount_type : null,
    discount_amount: appliedCoupon.value ? appliedCoupon.value.discount_amount : null,
    // Add campaign_id to the order payload - use the first campaign_id if multiple exist
    campaign_id: campaignIds.length > 0 ? campaignIds[0] : null,
    // Include all campaign_ids if needed
    campaign_ids: campaignIds.length > 0 ? campaignIds : null,
  };

  try {
    const response = await $axios.post("/create-order", orderData);
    //console.log("Order placed successfully:", response.data);

    toast.success("Order placed successfully!");

    trackPurchase(response.data);

    if (typeof window !== "undefined") {
      localStorage.removeItem("directOrderProductData");
      localStorage.removeItem("incomplete_order_id");
      localStorage.setItem("lastOrderDetails", JSON.stringify(response.data));
    }

    cartStore.is_direct_order = false;
    //router.get('/checkout/success');
    router.get('/success/' + response.data.invoice_number);

  } catch (error) {
    console.error("Error placing order:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      toast.error(error.response.data.message || "Failed to place order. Please try again.");
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No response from server. Please check your internet connection and try again.");
    } else {
      console.error("Error setting up request:", error.message);
      toast.error("An error occurred. Please try again.");
    }
  }
};

// Add GTM tracking for checkout events
const trackCheckoutEvent = () => {
  if (cartStore.is_direct_order) {
    // For direct orders, use `trackDiractCheckout`
    if (directOrderProduct.value) {
      trackDiractCheckout(directOrderProduct.value);
    }
  } else {
    // For cart orders, use `trackCheckout`
    if (cartItems.value && cartItems.value.length > 0) {
      trackCheckout(cartItems.value);
    }
  }
};

onMounted(() => {
  trackCheckoutEvent();
});
</script>

<template>
 <!-- <pre> {{ cartItems }}</pre> -->
  <div class="bg-gray-50 py-12 checkout_page">
    <div class="container">
      <!-- Coupon Section -->
      <div class="mb-8 max-w-xl">
        <div class="flex flex-col md:flex-row items-center gap-2">
          <span>Have a coupon?</span>
          <button @click="toggleCoupon" class="text-theme hover:text-secondary font-medium">
            Click here to enter your code
          </button>
        </div>

        <!-- Collapsible Coupon Input -->
        <transition enter-active-class="transition-all duration-300 ease-out overflow-hidden"
          enter-from-class="max-height-0 opacity-0" enter-to-class="max-height-[500px] opacity-100"
          leave-active-class="transition-all duration-300 ease-in overflow-hidden"
          leave-from-class="max-height-[500px] opacity-100" leave-to-class="max-height-0 opacity-0">
          <div v-if="showCoupon" class="mt-4">
            <div class="p-6 border border-gray-200 rounded-lg bg-white">
              <p class="text-gray-600 mb-4">If you have a coupon code, please apply it below.</p>
              <div class="flex flex-col md:flex-row gap-2">
                <input v-model="couponCode" type="text" placeholder="Coupon code"
                  class="px-4 py-2 border border-gray-300 rounded-md flex-1" />
                <button class="btn__primary uppercase" @click="applyCoupon">
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Billing Details -->
        <div class="checkout-form-area">
          <h2 class="text-xl font-medium mb-6">BILLING DETAILS</h2>
          <form class="space-y-8">
            <div>
              <label class="block mb-1">
                আপনার নাম <span class="text-red-500">*</span>
              </label>
              <input v-model="form.name" type="text" placeholder="আপনার নাম লিখুন"
                class="w-full px-4 py-2 border rounded-md" required />
            </div>

            <div>
              <label class="block mb-1">
                সম্পূর্ণ ঠিকানা <span class="text-red-500">*</span>
              </label>
              <input v-model="form.address" type="text" placeholder="রোড নাম/নং, বাড়ি নাম/নং, ফ্ল্যাট নাম্বার..."
                class="w-full px-4 py-2 border rounded-md" required />
            </div>

            <div>
              <label class="block mb-1">
                মোবাইল নাম্বার <span class="text-red-500">*</span>
              </label>
              <input v-model="form.mobile" type="tel" placeholder="১১ ডিজিটের নাম্বারটি লিখুন"
                class="w-full px-4 py-2 border rounded-md" required @blur="handleMobileBlur" />
            </div>
            <div>
              <label class="block mb-1">
                বিকল্প মোবাইল নম্বর <span class="text-red-500">*</span>
              </label>
              <input v-model="form.extra_mobile" type="tel" placeholder="১১ ডিজিটের নাম্বারটি লিখুন"
                class="w-full px-4 py-2 border rounded-md" required />
            </div>

            <div>
              <label class="block mb-1">
                আপনার এরিয়া সিলেক্ট করুন <span class="text-red-500">*</span>
              </label>
              <select class="w-full px-4 py-2 border rounded-md" name="delivery_area" id="delivery_area"
                v-model="form.delivery_area" @change="updateDeliveryCharge">
                <option value="" selected disabled>আপনার এরিয়া সিলেক্ট করুন</option>
                <option value="inside">ঢাকার ভেতরে</option>
                <option value="outside">ঢাকার বাহিরে</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">নির্দেশনা (optional)</label>
              <textarea v-model="form.note" rows="4" placeholder="আপনার ডেলিভারি কোন নির্দেশনাসমূহ থাকলে এখানে লিখুন"
                class="w-full px-4 py-2 border rounded-md"></textarea>
            </div>

            <div class="payment-methods">
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- Cash on Delivery Option -->
                <label class="relative flex-1 cursor-pointer" :class="{ 'border-primary': form.delivery === 'cod' }">
                  <input type="radio" name="payment" value="cod" v-model="form.delivery" class="sr-only" />
                  <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-primary" :class="{
                    'border-primary': form.delivery === 'cod',
                    'border-gray-200': form.delivery !== 'cod',
                    'bg-red-100': form.delivery === 'cod', /* Add custom background color */
                  }">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="{
                        'border-primary': form.delivery === 'cod',
                        'border-gray-300': form.delivery !== 'cod',
                        'bg-theme': form.delivery === 'cod', /* Selected color for circle */
                      }">
                        <div class="w-3 h-3 rounded-full bg-primary transition-transform duration-200"
                          :class="{ 'scale-100': form.delivery === 'cod', 'scale-0': form.delivery !== 'cod' }"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="text-theme">
                          <img class="w-[100px]" :src="cod" alt="" />
                        </div>
                        <!-- <span class="font-medium">Cash on Delivery</span> -->
                      </div>
                    </div>
                  </div>
                </label>

                <!-- bKash Option -->
                <label class="relative flex-1 cursor-pointer" :class="{ 'border-primary': form.delivery === 'bkash' }">
                  <input type="radio" name="payment" value="bkash" v-model="form.delivery" class="sr-only" />
                  <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-primary" :class="{
                    'border-primary': form.delivery === 'bkash',
                    'border-gray-200': form.delivery !== 'bkash',
                    'bg-red-100': form.delivery === 'bkash', /* Custom background for bKash */
                  }">
                    <div class="flex items-center gap-2">
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="{
                        'border-primary': form.delivery === 'bkash',
                        'border-gray-300': form.delivery !== 'bkash',
                        'bg-theme': form.delivery === 'bkash', /* Selected color for circle */
                      }">
                        <div class="w-3 h-3 rounded-full bg-primary transition-transform duration-200"
                          :class="{ 'scale-100': form.delivery === 'bkash', 'scale-0': form.delivery !== 'bkash' }">
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <img :src="bKash" alt="bKash Logo" class="w-[100px]" />
                        <!-- <span class="font-medium">bKash</span> -->
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div>
          <h2 class="text-xl font-medium mb-6">YOUR ORDER</h2>
          <div class="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div class="flex justify-between font-medium mb-4">
              <span>PRODUCT</span>
              <span>SUBTOTAL</span>
            </div>

            <!-- Single Product for Direct Order -->
            <div v-if="cartStore.is_direct_order" class="flex items-center justify-between py-4 border-t">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <img :src="directOrderProduct?.featured_image" :alt="directOrderProduct?.product_name"
                    class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="sm:text-base text-sm font-medium">{{ directOrderProduct?.product_name }}</h3>
                  <p class="text-sm text-gray-600">
                    <span v-for="(attr, index) in directOrderProduct?.selectedAttributes" :key="index">
                      {{ attr.attribute_name }}: {{ attr.attribute_option }}
                      <!-- <span v-if="attr.attribute_option_price !== '0.00'">(+{{ attr.attribute_option_price }}{{ cartStore.currencysymbol }})</span>, -->
                    </span>
                  </p>
                  <!-- Add campaign discount display for direct order product -->
                  <p v-if="directOrderProduct?.discount_value && parseFloat(directOrderProduct.discount_value) > 0"
                    class="text-sm text-red-500 mt-1">
                    Campaign Discount: -{{ parseFloat(directOrderProduct.discount_value) * directOrderProduct.quantity
                    }}
                    <span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                  </p>
                  <div class="space-y-2 mt-3">
                    <div class="flex items-center gap-2">
                      <button @click="updateQuantity(directOrderProduct, -1)"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
                        -
                      </button>
                      <span
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-center">
                        {{ directOrderProduct?.quantity }}
                      </span>
                      <button @click="updateQuantity(directOrderProduct, 1)"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <!-- Show original price with strikethrough if discount exists -->
                <!-- <span v-if="directOrderProduct?.discount_value && parseFloat(directOrderProduct.discount_value) > 0"
                  class="text-sm text-gray-500 line-through">
                  {{ parseFloat(directOrderProduct.price) * directOrderProduct.quantity }}
                  <span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                </span> -->
                <!-- Show final price after discount -->
                <span class="font-medium">
                  {{ (parseFloat(directOrderProduct?.price || 0) * directOrderProduct?.quantity) -
                    (parseFloat(directOrderProduct?.discount_value || 0) * directOrderProduct?.quantity) }}
                  <span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                </span>
              </div>
            </div>

            <!-- Cart Products for Cart Order -->
            <div v-else v-for="item in cartItems" :key="item.id"
              class="flex items-center justify-between py-4 border-t">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <img :src="item.product.featured_image" :alt="item.product.product_name"
                    class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="sm:text-base text-sm font-medium">{{ item.product.product_name }}</h3>
                  <p class="text-sm text-gray-600">
                    <span v-for="attr in item.attributes" :key="attr.product_attr_id">
                      {{ attr.attribute_name }}: {{ attr.attribute_option }},
                    </span>
                  </p>
                  <!-- Add campaign discount display if it exists -->
                  <p v-if="item.discount_value && parseFloat(item.discount_value) > 0"
                    class="text-sm text-red-500 mt-1">
                    Campaign Discount: -{{ parseFloat(item.discount_value) * item.quantity }}<span
                      class="bangla-font">{{ cartStore.currencysymbol }}</span>
                  </p>
                  <div class="space-y-2 mt-3">
                    <div class="flex items-center gap-2">
                      <button @click="cartStore.syncCartDecrement(item.id, item.product_id, item.quantity)"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
                        -
                      </button>
                      <span
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-center">
                        {{ item.quantity }}
                      </span>
                      <button @click="cartStore.syncCartIncrement(item.id, item.product_id)"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                
                <!-- <span v-if="item.discount_value && parseFloat(item.discount_value) > 0"
                  class="text-sm text-gray-500 line-through">
                  {{ parseFloat(item.product.price) * item.quantity }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                </span>  -->
                <!-- Show final price after discount -->
                <span class="font-medium">
                  {{ (parseFloat(item.final_price.replace(/,/g, '')))  }}
                  <span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                </span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-4 py-4 border-t">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ subtotal }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span>
              </div>
              <!-- Add campaign discount row if there is any -->
              <div v-if="campaignDiscount > 0" class="flex justify-between text-red-500">
                <span>Campaign Discount</span>
                <span>-{{ campaignDiscount }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span>
              </div>
              <div class="flex justify-between">
                <span>Coupon Discount</span>
                <span>-{{ form.discount }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Charge</span>
                <span>{{ form.delivery_charge }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span class="text-theme">{{ total }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="py-4 border-t">
              <h3 class="font-medium mb-2">Cash on delivery</h3>
              <p class="text-gray-600 text-sm bangla-font">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।</p>
            </div>

            <!-- Privacy Policy -->
            <div class="text-sm text-gray-600 mt-4">
              Your personal data will be used to process your order. Described in our
              <a href="#" class="text-theme">Privacy policy</a>.
            </div>

            <!-- Place Order Button -->
            <button @click="placeOrder" class="w-full btn__primary uppercase tracking-wide mt-4">
              Place Order
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.max-height-0 {
  max-height: 0;
}

.max-height-\[500px\] {
  max-height: 500px;
}

.checkout-form-area {
  font-family: 'Hind Siliguri', sans-serif;
}

.checkout-form-area label {
  font-family: 'Hind Siliguri', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #333;
}
</style>

