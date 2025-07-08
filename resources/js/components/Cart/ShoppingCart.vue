<script setup>
import { ref, computed } from "vue";
import { XIcon, Trash2Icon, HeartIcon, Share2Icon } from "lucide-vue-next";
import EmptyCart from "./EmptyCart.vue";
import { useCartStore } from "@/Store/cartStore";

const cartStore = useCartStore();

// Cart items data
const cartItems = computed(() => cartStore.cartItems);

const total = computed(() => {
    return subtotal.value;
});

// Methods
const formatPrice = (price) => {
    // Handle null, undefined, or non-numeric inputs
    if (price == null || isNaN(parseFloat(price))) return "0";
    // Convert to number (string or number input)
    const numericPrice =
        typeof price === "string"
            ? parseFloat(price.replace(/,/g, ""))
            : Number(price);
    // Return formatted price with 0 decimal places
    return numericPrice.toFixed(0);
};
</script>

<template>
    <!-- <pre>{{ cartItems }}</pre> -->
    
    <div class="max-w-7xl mx-auto px-4 py-8">
        <div
            v-if="cartItems.length > 0"
            class="flex flex-col lg:flex-row gap-6"
        >
            <!-- Main Cart Section -->
            <div class="lg:w-3/4 bg-white rounded-lg shadow-sm border">
                <div class="p-6 border-b">
                    <h1 class="text-2xl font-bold text-gray-800">
                        Shopping Cart
                    </h1>
                </div>

                <!-- Cart Items -->
                <div class="divide-y">
                    <div v-for="item in cartItems" :key="item.id" class="p-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            <!-- Product Image -->
                            <div class="w-32 h-32 flex-shrink-0">
                                <img
                                    :src="item.product.featured_image"
                                    :alt="item.product.product_name"
                                    class="w-full h-full object-contain"
                                />
                            </div>

                            <!-- Product Details -->
                            <div class="flex-1">
                                <h2
                                    class="text-lg font-medium text-gray-900 mb-1"
                                >
                                    {{ item.product.product_name }}
                                </h2>
                                <p class="text-sm text-green-600 mb-2">
                                    In Stock
                                </p>

                                <!-- Product Attributes -->
                                <div
                                    v-if="
                                        item.attributes &&
                                        item.attributes.length > 0
                                    "
                                    class="flex flex-wrap gap-4 mb-3"
                                >
                                    <div
                                        v-for="attr in item.attributes"
                                        :key="attr.product_attr_id"
                                        class="flex items-center text-sm"
                                    >
                                        <span class="text-gray-600 mr-2"
                                            >{{ attr.attribute_name }}:</span
                                        >
                                        <span class="font-medium"
                                            >{{ attr.attribute_option }}
                                            {{
                                                attr.quantity > 1
                                                    ? `(${attr.quantity})`
                                                    : ""
                                            }}</span
                                        >
                                        <span
                                            v-if="parseFloat(attr.price) > 0"
                                            class="text-gray-500 ml-1"
                                        >
                                            (+<span class=" ">{{ cartStore.currencysymbol }} </span>{{
                                                formatPrice(
                                                    parseFloat(attr.price) *
                                                        attr.quantity
                                                )
                                            }})
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="flex flex-wrap items-center gap-4 mt-4"
                                >
                                    <!-- Quantity Selector -->
                                    <div
                                        class="flex items-center border rounded-full overflow-hidden"
                                    >
                                        <button
                                            @click="
                                                cartStore.syncCartDecrement(
                                                    item.id,
                                                    item.product_id,
                                                    item.quantity
                                                )
                                            "
                                            class="px-3 py-1 hover:bg-gray-100"
                                            :disabled="item.quantity <= 1"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            v-model="item.quantity"
                                            class="w-10 text-center border-none focus:ring-0 p-0"
                                            min="1"
                                        />
                                        <button
                                            @click="
                                                cartStore.syncCartIncrement(
                                                    item.id,
                                                    item.product_id
                                                )
                                            "
                                            class="px-3 py-1 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <!-- Action Buttons -->
                                    <button
                                        @click="cartStore.removeItem(item.id)"
                                        class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="text-right">
                                <span class="text-lg font-bold"
                                    ><span class=" ">{{ cartStore.currencysymbol }}</span>{{ formatPrice(item.individual_price)
                                    }}<span class=" "></span
                                ></span>
                                <div class="text-sm text-gray-500 mt-1">
                                    {{ item.quantity }} ×
                                    <span class=" ">{{ cartStore.currencysymbol }}</span>{{ formatPrice(item.individual_price)
                                    }}
                                </div>
                                <div class="font-bold mt-2">
                                    <span class=" ">{{ cartStore.currencysymbol }}</span>{{ formatPrice(item.final_price)
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subtotal at Bottom -->
                <div class="p-6 border-t flex justify-between items-center">
                    <span class="text-lg"
                        >Subtotal ({{ cartItems.length }} item{{
                            cartItems.length > 1 ? "s" : ""
                        }}):</span
                    >
                    <span class="text-xl font-bold"
                        ><span class="">{{ cartStore.currencysymbol }}</span>{{ Math.floor(cartStore.cartTotalPrice)
                        }}</span
                    >
                </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:w-1/4">
                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <h2 class="text-lg font-medium mb-4">
                        Subtotal ({{ cartItems.length }} item{{
                            cartItems.length > 1 ? "s" : ""
                        }}):
                        <span class="font-bold"
                            ><span class=" ">{{ cartStore.currencysymbol }}</span>{{ Math.floor(cartStore.cartTotalPrice)
                            }}</span
                        >
                    </h2>

                    <button
                        @click="cartStore.goToCheckout"
                        class="w-full py-3 bg-theme hover:bg-scondary text-center rounded-full font-medium text-gray-100 transition-colors"
                    >
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>

        <EmptyCart v-else />
    </div>
</template>

<style scoped>
/* You can keep any custom styles here */
.btn__primary {
    @apply py-3 bg-yellow-400 hover:bg-yellow-500 text-center rounded-full font-medium text-gray-900 transition-colors;
}
</style>
