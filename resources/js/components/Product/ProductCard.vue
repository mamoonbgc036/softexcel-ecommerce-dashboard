<script setup>
import { Link } from "@inertiajs/vue3";
import { defineProps, ref, computed, onMounted, onUnmounted } from "vue";
import { PhHeart, PhEye } from "@phosphor-icons/vue";
import QuickViewModal from "./QuickViewModal.vue";
import { useWishlistStore } from "@/Store/wishlistStore";
import { useCartStore } from "@/Store/cartStore";

const cartStore = useCartStore();

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const wishlistStore = useWishlistStore();

const lazyloadingsvg = ref('/assets/images/loading/lazyloading.svg');

// Refs for tracking image loading states
const featuredImageLoaded = ref(false); // Track if main product image has loaded
const hoverImageLoaded = ref(false);     // Track if hover/gallery image has loaded

const toggleWishlist = async (productID) => {
    const exists = wishlistStore.wishlist.some(
        (item) => item.product_id === productID
    );

    if (exists) {
        await wishlistStore.removeFromWishlist(productID);
    } else {
        await wishlistStore.addToWishlist(productID);
    }

    console.log(wishlistStore.wishlist);
    console.log(wishlistStore.whishlistCount);
};

// Reactive refs for component state
const showModal = ref(false);           // Control quick view modal visibility
const product = ref(props.product);     // Product data from props
const currentTime = ref(new Date());    // Current time for campaign countdown
const isHovered = ref(false);           // Track mouse hover state

// Create hover/gallery image path from parsed gallery images
let parsedImages = [];

parsedImages = product.value.gallery_images
    ? JSON.parse(product.value.gallery_images)
    : [];

// Use first gallery image as hover image, fallback to featured image
const firstGalleryImage = parsedImages[0] ?? product.value.featured_image;

// Image loading handlers
// Handle featured image loading events
const onFeaturedImageLoad = () => {
    console.log('Featured image loaded');
    featuredImageLoaded.value = true;
};

const onFeaturedImageError = () => {
    console.log('Featured image error');
    featuredImageLoaded.value = true; // Hide spinner even on error
};

// Handle hover image loading events
const onHoverImageLoad = () => {
    console.log('Hover image loaded');
    hoverImageLoaded.value = true;
};

const onHoverImageError = () => {
    console.log('Hover image error');
    hoverImageLoaded.value = true; // Hide spinner even on error
};

// Check if product has attributes
const hasAttributes = computed(() => {
    return (
        props.product.product_attributes &&
        props.product.product_attributes.length > 0
    );
});

// Find the lowest price and previous_price from product_attributes
const lowestAttributePrice = computed(() => {
    if (!hasAttributes.value) {
        return {
            price: props.product.price,
            previous_price: props.product.previous_price,
        };
    }
    return props.product.product_attributes.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price);
        const lowestPrice = parseFloat(lowest.price);
        return currentPrice < lowestPrice ? current : lowest;
    }, props.product.product_attributes[0]);
});

// Base price to use (lowest attribute price or product price)
const basePrice = computed(() => {
    return hasAttributes.value
        ? lowestAttributePrice.value.price
        : props.product.price;
});

// Base previous price to use
const basePreviousPrice = computed(() => {
    return hasAttributes.value
        ? lowestAttributePrice.value.previous_price
        : props.product.previous_price;
});

// Check if product is sold out
const isSoldOut = computed(() => {
    return props.product.quantity <= 0;
});

// Calculate regular discount percentage
const discountPercentage = computed(() => {
    const price = parseFloat(basePrice.value);
    const previousPrice = parseFloat(basePreviousPrice.value);
    if (!previousPrice || previousPrice <= 0) return 0;
    const discount = ((previousPrice - price) / previousPrice) * 100;
    return Math.round(discount);
});

// Check if product has active campaign
const hasCampaign = computed(() => {
    return (
        props.product.product_campaign &&
        props.product.product_campaign.campaign
    );
});

// Calculate campaign end time
const timeRemaining = computed(() => {
    if (!hasCampaign.value) return null;

    const expiryDate = new Date(
        props.product.product_campaign.campaign.expiry_date
    );
    const diff = expiryDate - currentTime.value;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
});

// Calculate campaign discounted price based on campaign type
const campaignPrice = computed(() => {
    if (!hasCampaign.value) return basePrice.value;

    const campaignType = props.product.product_campaign.campaign.type;
    const discount = parseFloat(
        props.product.product_campaign.campaign.discount
    );
    const originalPrice = parseFloat(basePrice.value);

    // Handle fixed amount discount
    if (campaignType === "fixed") {
        return (originalPrice - discount).toFixed(2);
    } 
    // Handle percentage discount
    else if (campaignType === "percentage") {
        const discountAmount = originalPrice * (discount / 100);
        return (originalPrice - discountAmount).toFixed(2);
    }

    // Fallback to base price
    return basePrice.value;
});

// Lifecycle hooks for component mounting/unmounting
const timer = ref(null);

// Set up timer when component mounts
onMounted(() => {
    // Update current time every second for campaign countdown
    timer.value = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
});

// Clean up timer when component unmounts
onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>

<template>
    <div
        class="producthover product-item group overflow-hidden group"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <div class="product-image relative">
            <!-- Loading Spinner for Featured Image -->
            <!-- Shows until the main product image finishes loading -->
            <div 
                v-show="!featuredImageLoaded" 
                class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
            >
                <img 
                    :src="lazyloadingsvg" 
                    alt="Loading..." 
                    class="w-12 h-12 animate-spin"
                />
            </div>

            <!-- Loading Spinner for Hover Image -->
            <!-- Only shows when hovering and hover image hasn't loaded yet -->
            <div 
                v-show="isHovered && firstGalleryImage && !hoverImageLoaded" 
                class="absolute inset-0 flex items-center justify-center bg-gray-100 z-20"
            >
                <img 
                    :src="lazyloadingsvg" 
                    alt="Loading..." 
                    class="w-12 h-12 animate-spin"
                />
            </div>

            <Link :href="`/product/${product.slug}`">
                <!-- Featured/Main Product Image -->
                <img
                    loading="lazy"
                    :src="product.featured_image"
                    :alt="product.product_name"
                    class="w-full h-full object-cover transition-opacity duration-500"
                    :class="{
                        'opacity-0': isHovered || !featuredImageLoaded,
                        'opacity-100': !isHovered && featuredImageLoaded,
                    }"
                    @load="onFeaturedImageLoad"
                    @error="onFeaturedImageError"
                />

                <!-- Hover Image (First Gallery Image) -->
                <!-- Shows on hover if gallery images exist -->
                <img
                    loading="lazy"
                    v-if="firstGalleryImage"
                    :src="firstGalleryImage"
                    :alt="product.product_name"
                    class="w-full h-full object-cover absolute inset-0 transition-opacity duration-500"
                    :class="{
                        'opacity-100': isHovered && hoverImageLoaded,
                        'opacity-0': !isHovered || !hoverImageLoaded,
                    }"
                    @load="onHoverImageLoad"
                    @error="onHoverImageError"
                />
            </Link>

            <!-- Product Badges Section -->
            
            <!-- Regular Discount Badge (shown when no campaign is active) -->
            <span
                v-if="!hasCampaign && discountPercentage > 0"
                class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold"
            >
                -{{ discountPercentage }}%
            </span>

            <!-- Campaign Discount Badge (shown when campaign is active) -->
            <span
                v-if="hasCampaign"
                class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold"
            >
                -{{ product.product_campaign.campaign.discount
                }}{{
                    product.product_campaign.campaign.type === "fixed"
                        ? cartStore.currencysymbol
                        : "%"
                }}
            </span>

            <!-- Sold Out Badge (shown when product is out of stock) -->
            <span
                v-if="isSoldOut"
                class="absolute top-[40px] left-3 bg-white text-gray-500 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]"
            >
                SOLD OUT
            </span>

            <!-- Free Shipping Badge (shown when product has free shipping) -->
            <span
                v-if="product.is_free_shipping"
                class="absolute top-3 right-3 bg-gray-100 text-gray-900 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]"
            >
                Free Shipping
            </span>


        </div>

        <!-- Product Information Section -->
        <div class="sm:pt-[2px] md:pt-3 resonsecard">
            <div class="px-[5px] pb-[10px]">
                <!-- Product Title/Name -->
                <h3
                    class="product-title text-[14px] font-normal text-center mb-4 mt-1 overflow-hidden"
                >
                    <Link :href="`/product/${product.slug}`">
                        {{ product.product_name }}
                    </Link>
                </h3>

                <!-- Product Pricing Section -->
                <div class="flex justify-center items-center gap-2">
                    <!-- Regular/Previous Price (crossed out when campaign is not active) -->
                    <span
                        v-if="basePreviousPrice && !hasCampaign"
                        class="text-gray-500 text-sm line-through"
                    >
                        {{ cartStore.currencysymbol }} {{ parseInt(basePreviousPrice) }}
                    </span>
                    
                    <!-- Current Price (when no campaign) -->
                    <span v-if="!hasCampaign" class="text-theme font-bold">
                        <span class="font-normal">{{ cartStore.currencysymbol }} </span
                        >{{ parseInt(basePrice) }}
                    </span>

                    <!-- Campaign Price (when campaign is active) -->
                    <span v-if="hasCampaign" class="text-theme font-bold">
                        {{ cartStore.currencysymbol }} {{ parseInt(campaignPrice) }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal
        :visible="showModal"
        :product="product"
        @close="showModal = false"
    />
</template>

<style scoped>
.product-item {
    @apply bg-white border-spacing-1;
    transition: transform 0.3s;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
    padding: 8px;
}

.product-image{
    aspect-ratio: 1/1;
    @apply relative overflow-hidden;
}

.product-title {
    @apply text-gray-700 hover:text-theme transition-colors sm:text-[16px] text-[12px] capitalize font-medium;
}

.product_card_btn {
    @apply w-full py-3 bg-theme text-white text-[12px] sm:text-[14px] flex justify-center items-center gap-2 uppercase font-semibold;
}

.section-title-wrapper::after {
    position: absolute;
    width: 100%;
    height: 0.1px;
    background: #f3f3f3;
    top: 50%;
    right: 0;
    content: "";
    transform: translateY(-50%);
}

.producthover {
    transform: scale(1) !important;
}

.producthover:hover {
    transform: scale(1.1) !important;
    @apply border border-theme;
}

/* Custom loading animation */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Responsive Design Media Queries */

/* Small mobile devices (393px and up) */
@media (min-width: 393px) {
    .quickviewcustom {
        bottom: 0px;
        font-size: 10px;
    }
}

/* Medium mobile devices (430px and up) */
@media (min-width: 430px) {
    .quickviewcustom {
        bottom: 0px;
        font-size: 10px;
    }
    .resonsecard {
        padding-top: 8px;
    }
}

/* Large mobile devices (480px and up) */
@media (min-width: 480px) {
    .quickviewcustom {
        bottom: 0px;
        font-size: 14px;
    }

    .resonsecard {
        padding-top: 8px;
    }
}

/* Desktop and larger screens (890px and up) */
@media (min-width: 890px) {
    .quickviewcustom {
        bottom: 0px;
        font-size: 14px;
    }

    .resonsecard {
        padding-top: 8px;
    }
}
</style>