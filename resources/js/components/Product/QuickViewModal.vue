<!-- components/QuickViewModal.vue -->
<template>
    <teleport to="body">
        <div
            v-if="visible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <div
                ref="modalContent"
                class="bg-white responsive sm:max-h-[582px] md:w-[1000px] h-[506px] aspect-square max-w-5xl rounded-lg shadow-lg relative flex flex-col md:flex-row overflow-y-auto"
            >
                <!-- Close Button -->
                <button
                    @click="emit('close')"
                    class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
                >
                    ×
                </button>

                <div class="bg-white w-full flex flex-col md:flex-row">
                    <!-- Product Images -->
                    <div
                        class="sm:w-full sm:h-full md:w-[50%] lg:w-[50%] relative"
                    >
                        <!-- Swiper Component -->
                        <Swiper
                            :modules="modules"
                            :slides-per-view="1"
                            :space-between="10"
                            :pagination="{ clickable: true }"
                            :navigation="{
                                nextEl: '.custom-next',
                                prevEl: '.custom-prev',
                            }"
                            class="aspect-square"
                        >
                            <!-- Featured Image -->
                            <SwiperSlide>
                                <img
                                    :src="product.featured_image"
                                    alt="Featured Image"
                                    class="w-full h-full object-cover rounded-lg"
                                />
                            </SwiperSlide>

                            <!-- Gallery Images -->
                            <SwiperSlide
                                v-for="(image, index) in parsedGalleryImages"
                                :key="index"
                            >
                                <img
                                    :src="image"
                                    :alt="`Gallery Image ${index + 1}`"
                                    class="w-full h-auto object-cover rounded-lg"
                                />
                            </SwiperSlide>
                        </Swiper>

                        <!-- Custom Navigation Arrows -->
                        <div
                            class="custom-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
                        >
                            <ChevronLeft />
                        </div>

                        <div
                            class="custom-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
                        >
                            <ChevronRight />
                        </div>
                    </div>

                    <!-- Product Info (Sticky) -->
                    <div
                        v-if="product"
                        class="sm:w-full sm:h-full md:w-[50%] lg:w-[50%] lg:sticky lg:top-0 lg:self-start space-y-3 px-2 md:px-6 rounded-lg md:p-6"
                    >
                        <div class="space-y-2">
                            <h1
                                class="md:text-2xl text-xl font-medium mb-2 text-[#333333] h-[63px] overflow-y-hidden"
                            >
                                {{ product.product_name }}
                            </h1>
                            <div class="flex items-center gap-2">
                                <span class="text-2xl font-bold text-theme"
                                    >{{ displayPrice
                                    }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span></span
                                >
                                <span
                                    v-if="basePreviousPrice && !hasCampaign"
                                    class="text-lg text-gray-500 line-through"
                                >
                                    <span class="bangla-font">{{ cartStore.currencysymbol }}</span
                                    >{{ formatPrice(basePreviousPrice) }}
                                </span>
                                <span
                                    v-if="hasCampaign"
                                    class="text-sm text-red-500"
                                >
                                    ({{
                                        product.product_campaign.campaign
                                            .discount
                                    }}{{
                                        product.product_campaign.campaign
                                            .type === "fixed"
                                            ? cartStore.currencysymbol
                                            : "%"
                                    }}
                                    OFF)
                                </span>
                            </div>
                        </div>

                        <div v-if="isOutOfStock" class="space-y-2">
                            <p class="text-sm text-red-500">Out of stock</p>
                        </div>

                        <p
                            v-if="product.product_code"
                            class="relative text-[13px] text-gray-600"
                        >
                            SKU: {{ product.product_code }}
                        </p>

                        <div
                            class="text-sm pb-1 h-[60px] overflow-hidden"
                            v-html="product.short_description"
                        ></div>

                        <!-- Dynamic Attributes -->
                        <div
                            v-for="attributeName in sortedAttributeNames"
                            :key="attributeName"
                            class="mt-0"
                        >
                            <label class="text-sm font-medium"
                                >{{ attributeName }}:</label
                            >
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="option in groupedAttributes[
                                        attributeName
                                    ]"
                                    :key="option.id"
                                    @click="
                                        selectAttribute(
                                            attributeName,
                                            option.attribute_option.id,
                                            option.attribute_option.name,
                                            option.price,
                                            option.previous_price
                                        )
                                    "
                                    :class="[
                                        'px-4 py-1 text-sm rounded-full border',
                                        selectedAttributes[attributeName]
                                            ?.optionId ===
                                        option.attribute_option.id
                                            ? 'bg-gray-900 text-white'
                                            : 'border-gray-300 hover:bg-gray-100',
                                    ]"
                                >
                                    {{ option.attribute_option.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Stock Information -->
                        <div
                            v-if="!hasAttributes"
                            class="mt-0 py-1 flex items-center gap-2"
                        >
                            <div class="flex items-center justify-between">
                                <span
                                    v-show="product.quantity > 0"
                                    class="text-base flex items-center gap-1 font-semibold"
                                    :class="
                                        product.quantity > 0
                                            ? 'text-black'
                                            : 'text-red-500'
                                    "
                                >
                                    <Check /> {{ product.quantity }}
                                </span>
                            </div>
                            <span
                                class="text-base font-semibold"
                                :class="
                                    product.quantity > 0
                                        ? 'text-black'
                                        : 'text-red-800'
                                "
                            >
                                {{
                                    product.quantity > 0
                                        ? "In Stock"
                                        : "Out of Stock"
                                }}
                            </span>
                        </div>

                        <div
                            v-else-if="allAttributesSelected"
                            class="mt-0 py-0 flex items-center gap-2"
                        >
                            <div class="flex items-center justify-between">
                                <span
                                    v-show="isCombinationAvailable"
                                    class="text-base flex items-center gap-1 font-semibold"
                                    :class="
                                        isCombinationAvailable
                                            ? 'text-black'
                                            : 'text-red-500'
                                    "
                                >
                                    <Check v-if="isCombinationAvailable" />
                                    {{
                                        isCombinationAvailable
                                            ? combinationQuantity
                                            : 0
                                    }}
                                </span>
                            </div>
                            <span
                                class="text-base font-semibold"
                                :class="
                                    isCombinationAvailable
                                        ? 'text-black'
                                        : 'text-red-800'
                                "
                            >
                                {{
                                    isCombinationAvailable
                                        ? "In Stock"
                                        : "Out of Stock"
                                }}
                            </span>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 mt-[2px]">
                            <!-- Quantity Selector -->
                            <div
                                class="flex w-fit border border-gray-400 rounded-md overflow-hidden h-12"
                            >
                                <button
                                    @click="decrementQuantity"
                                    class="w-12 h-12 flex items-center justify-center border-r border-gray-400 hover:bg-gray-200"
                                    :disabled="quantity <= 1"
                                >
                                    -
                                </button>
                                <span
                                    class="w-12 h-12 flex items-center justify-center text-center"
                                >
                                    {{ quantity }}
                                </span>
                                <button
                                    @click="incrementQuantity"
                                    class="w-12 h-12 flex items-center justify-center border-l border-gray-400 hover:bg-gray-200"
                                >
                                    +
                                </button>
                            </div>

                            <!-- Add to Cart Button -->
                            <button
                                @click="addToCart"
                                :disabled="
                                    loading ||
                                    (hasAttributes
                                        ? !allAttributesSelected ||
                                          !isCombinationAvailable
                                        : product.quantity <= 0)
                                "
                                :class="[
                                    'flex-1 py-[13px] px-8 bg-[#000] text-white transition-colors uppercase text-sm font-medium rounded-md flex items-center justify-center h-12',
                                    loading ||
                                    (hasAttributes
                                        ? !allAttributesSelected ||
                                          !isCombinationAvailable
                                        : product.quantity <= 0)
                                        ? 'cursor-not-allowed'
                                        : 'bg-[#000] hover:bg-[#000] hover:text-white transition-colors',
                                ]"
                            >
                                <span
                                    v-if="loading"
                                    class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2"
                                ></span>
                                <span>{{
                                    loading ? "Adding..." : "Add to Cart"
                                }}</span>
                            </button>
                        </div>

                        <div class="buy_new_area">
                            <button
                                @click="buyNow"
                                :disabled="
                                    buynowLoading ||
                                    (hasAttributes
                                        ? !allAttributesSelected ||
                                          !isCombinationAvailable
                                        : product.quantity <= 0)
                                "
                                :class="[
                                    'flex-1 px-8 bg-[#000] text-white transition-colors w-full uppercase text-sm font-medium rounded-md flex items-center justify-center h-12',
                                    buynowLoading ||
                                    (hasAttributes
                                        ? !allAttributesSelected ||
                                          !isCombinationAvailable
                                        : product.quantity <= 0)
                                        ? 'cursor-not-allowed'
                                        : 'bg-[#000] hover:bg-[#000] transition-colors',
                                ]"
                            >
                                <span
                                    v-if="buynowLoading"
                                    class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2"
                                ></span>
                                <span>{{
                                    buynowLoading
                                        ? "Processing..."
                                        : "Buy it now"
                                }}</span>
                            </button>
                        </div>

                        <!-- Product Details -->
                        <div class="border-t">
                            <p
                                v-if="product.category"
                                class="text-sm text-gray-500"
                            >
                                Categories:
                                <span class="text-gray-900">
                                    {{ product.category.name }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div v-else class="p-4 text-center">
                        Loading product details...
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import { router } from "@inertiajs/vue3";
import { useAuthStore } from "@/Store/authStore";
import { useCartStore } from "@/Store/cartStore";
import { useHomeStore } from "@/Store/homeStore";
import { Check, ChevronRight, ChevronLeft } from "lucide-vue-next";
import { trackAddToCart } from "@/services/gtmHelper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Navigation, Pagination];

const props = defineProps({
    visible: Boolean,
    product: Object,
});


const cartStore = useCartStore();

const emit = defineEmits(["close"]);
const modalContent = ref(null);
const isJustOpened = ref(false);
const $axios = inject("$axios");
const homeStore = useHomeStore();

const quantity = ref(1);
const basePrice = ref(0);
const basePreviousPrice = ref(null);
const selectedAttributes = ref({});
const selectedCombination = ref(null);
const currentTime = ref(new Date());
const loading = ref(false);
const buynowLoading = ref(false);
const timer = ref(null);

// Handle click outside
const handleClickOutside = (event) => {
    if (isJustOpened.value || !props.visible || !modalContent.value) {
        isJustOpened.value = false;
        return;
    }
    if (!modalContent.value.contains(event.target)) {
        emit("close");
    }
};

// Watch for modal visibility changes
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            isJustOpened.value = true;
            setTimeout(() => {
                isJustOpened.value = false;
            }, 100);
        }
    }
);

// Parse gallery images from JSON string to array
const parsedGalleryImages = computed(() => {
    if (!props.product || !props.product.gallery_images) return [];
    try {
        return JSON.parse(props.product.gallery_images);
    } catch (e) {
        console.error("Error parsing gallery images:", e);
        return [];
    }
});

const phoneNumber = computed(
    () => homeStore.siteinfos?.[0]?.phone_number || null
);

// Campaign-related computed properties
const hasCampaign = computed(() => {
    const campaign = props.product.product_campaign?.campaign;
    if (!campaign) return false;
    const today = new Date().toISOString().split("T")[0];
    return campaign.start_date <= today && campaign.expiry_date >= today;
});

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

const campaignPrice = computed(() => {
    if (!hasCampaign.value) return basePrice.value;
    const campaignType = props.product.product_campaign.campaign.type;
    const discount = parseFloat(
        props.product.product_campaign.campaign.discount
    );
    const originalPrice = parseFloat(basePrice.value);
    if (campaignType === "fixed") {
        return (originalPrice - discount).toFixed(2);
    } else if (campaignType === "percentage") {
        const discountAmount = originalPrice * (discount / 100);
        return (originalPrice - discountAmount).toFixed(2);
    }
    return basePrice.value;
});

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

// Check if product is out of stock
const isOutOfStock = computed(() => {
    if (hasAttributes.value) {
        const quantities = props.product.product_attributes.map(
            (attr) => attr.quantity
        );
        return Math.min(...quantities) <= 0;
    }
    return props.product.quantity <= 0;
});

const isCombinationAvailable = computed(() => {
    if (!hasAttributes.value) {
        return props.product.quantity > 0;
    }
    if (!allAttributesSelected.value) {
        return false;
    }
    if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === selectedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 && Math.min(...quantities) > 0;
    }
    const quantities = [];
    for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        const attribute = props.product.product_attributes.find(
            (attr) =>
                attr.attribute.name === attributeName &&
                attr.attribute_option.id === selection.optionId
        );
        if (attribute) {
            quantities.push(attribute.quantity);
        }
    }
    return quantities.length > 0 && Math.min(...quantities) > 0;
});

const combinationQuantity = computed(() => {
    if (!hasAttributes.value) {
        return props.product.quantity;
    }
    if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === selectedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 ? Math.min(...quantities) : 0;
    }
    const quantities = [];
    for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        const attribute = props.product.product_attributes.find(
            (attr) =>
                attr.attribute.name === attributeName &&
                attr.attribute_option.id === selection.optionId
        );
        if (attribute) {
            quantities.push(attribute.quantity);
        }
    }
    return quantities.length > 0 ? Math.min(...quantities) : 0;
});

const groupedAttributes = computed(() => {
    if (!hasAttributes.value) return {};

    const grouped = {};
    props.product.product_attributes.forEach((attr) => {
        if (!attr.attribute || !attr.attribute.name) return;
        if (!grouped[attr.attribute.name]) {
            grouped[attr.attribute.name] = [];
        }
        const optionExists = grouped[attr.attribute.name].some(
            (existing) =>
                existing.attribute_option.id === attr.attribute_option.id
        );
        if (!optionExists) {
            grouped[attr.attribute.name].push(attr);
        }
    });
    return grouped;
});

const sortedAttributeNames = computed(() => {
    return Object.keys(groupedAttributes.value).sort((a, b) => {
        const aOrder =
            props.product.product_attributes.find(
                (attr) => attr.attribute.name === a
            )?.attribute.order || 0;
        const bOrder =
            props.product.product_attributes.find(
                (attr) => attr.attribute.name === b
            )?.attribute.order || 0;
        return aOrder - bOrder;
    });
});

const allAttributesSelected = computed(() => {
    if (!hasAttributes.value) return true;
    return sortedAttributeNames.value.every(
        (attr) => selectedAttributes.value[attr]?.optionId
    );
});

const displayPrice = computed(() => {
    return formatPrice(
        hasCampaign.value ? campaignPrice.value : basePrice.value
    );
});

const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

const updateBasePrice = (newPrice, newPreviousPrice) => {
    basePrice.value = Number.parseFloat(newPrice) || 0;
    basePreviousPrice.value = newPreviousPrice
        ? Number.parseFloat(newPreviousPrice)
        : null;
};

const selectAttribute = (
    attributeName,
    optionId,
    optionName,
    price,
    previous_price
) => {
    selectedAttributes.value[attributeName] = {
        optionId,
        optionName,
        price,
        previous_price,
    };
    selectedAttributes.value = { ...selectedAttributes.value };
    updateSelectedCombination();
};

const selectDefaultAttributes = () => {
    if (!props.product || !hasAttributes.value) return;

    selectedAttributes.value = {};

    for (const attributeName of sortedAttributeNames.value) {
        const options = groupedAttributes.value[attributeName];
        if (options && options.length > 0) {
            // Prioritize in-stock option, fallback to first option
            const firstInStockOption =
                options.find((option) => option.quantity > 0) || options[0];
            selectAttribute(
                attributeName,
                firstInStockOption.attribute_option.id,
                firstInStockOption.attribute_option.name,
                firstInStockOption.price,
                firstInStockOption.previous_price
            );
        }
    }
};

const updateSelectedCombination = () => {
    if (!allAttributesSelected.value) {
        selectedCombination.value = null;
        updateBasePrice(
            lowestAttributePrice.value.price,
            lowestAttributePrice.value.previous_price
        );
        return;
    }

    if (
        !props.product.product_attributes_combaine ||
        props.product.product_attributes_combaine.length === 0
    ) {
        selectedCombination.value = null;
        let totalPrice = Number.parseFloat(props.product.price);
        let totalPreviousPrice = null;
        for (const attributeName in selectedAttributes.value) {
            const selection = selectedAttributes.value[attributeName];
            if (selection && selection.optionId) {
                totalPrice = Number.parseFloat(selection.price) || 0;
                totalPreviousPrice = selection.previous_price
                    ? Number.parseFloat(selection.previous_price)
                    : null;
                break;
            }
        }
        updateBasePrice(totalPrice.toFixed(2), totalPreviousPrice);
        if (
            isCombinationAvailable.value &&
            combinationQuantity.value > 0 &&
            quantity.value > combinationQuantity.value
        ) {
            quantity.value = combinationQuantity.value;
        }
        return;
    }

    const selected = [];
    for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        if (selection.optionId) {
            const attribute = props.product.product_attributes.find(
                (attr) =>
                    attr.attribute.name === attributeName &&
                    attr.attribute_option.id === selection.optionId
            );
            if (attribute) {
                selected.push({
                    attributeId: attribute.attribute_id.toString(),
                    optionId: selection.optionId.toString(),
                    optionName: selection.optionName,
                });
            }
        }
    }

    selectedCombination.value =
        props.product.product_attributes_combaine.find((combo) => {
            try {
                const comboData = JSON.parse(combo.combination_string);
                return (
                    comboData.every((comboAttr) =>
                        selected.some(
                            (selAttr) =>
                                selAttr.attributeId ===
                                    comboAttr.attributeId.toString() &&
                                selAttr.optionId ===
                                    comboAttr.optionId.toString()
                        )
                    ) &&
                    selected.every((selAttr) =>
                        comboData.some(
                            (comboAttr) =>
                                comboAttr.attributeId.toString() ===
                                    selAttr.attributeId &&
                                comboAttr.optionId.toString() ===
                                    selAttr.optionId
                        )
                    )
                );
            } catch (e) {
                console.error("Error parsing combination string:", e);
                return false;
            }
        }) || null;

    if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === selectedCombination.value.id
        );
        if (combinationAttributes.length > 0) {
            const totalPrice =
                Number.parseFloat(combinationAttributes[0].price) || 0;
            const totalPreviousPrice = combinationAttributes[0].previous_price
                ? Number.parseFloat(combinationAttributes[0].previous_price)
                : null;
            updateBasePrice(totalPrice.toFixed(2), totalPreviousPrice);
        }
    } else {
        updateBasePrice(
            lowestAttributePrice.value.price,
            lowestAttributePrice.value.previous_price
        );
    }

    if (
        isCombinationAvailable.value &&
        combinationQuantity.value > 0 &&
        quantity.value > combinationQuantity.value
    ) {
        quantity.value = combinationQuantity.value;
    }
};

const getSelectedAttributeIds = () => {
    if (selectedCombination.value) {
        return props.product.product_attributes
            .filter(
                (attr) => attr.combination_id === selectedCombination.value.id
            )
            .map((attr) => attr.id);
    }
    const ids = [];
    for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        const attribute = props.product.product_attributes.find(
            (attr) =>
                attr.attribute.name === attributeName &&
                attr.attribute_option.id === selection.optionId
        );
        if (attribute) {
            ids.push(attribute.id);
        }
    }
    return ids;
};

const getSelectedAttributesDetails = () => {
    const details = [];
    if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === selectedCombination.value.id
        );
        combinationAttributes.forEach((attr) => {
            details.push({
                attribute_id: attr.attribute_id,
                attribute_option_id: attr.attribute_option_id,
                attribute_name: attr.attribute.name,
                attribute_option: attr.attribute_option.name,
                attribute_option_price: attr.price,
                id: attr.id,
                quantity: quantity.value,
            });
        });
    } else {
        for (const attributeName in selectedAttributes.value) {
            const selection = selectedAttributes.value[attributeName];
            const attribute = props.product.product_attributes.find(
                (attr) =>
                    attr.attribute.name === attributeName &&
                    attr.attribute_option.id === selection.optionId
            );
            if (attribute) {
                details.push({
                    attribute_id: attribute.attribute_id,
                    attribute_option_id: attribute.attribute_option_id,
                    attribute_name: attribute.attribute.name,
                    attribute_option: attribute.attribute_option.name,
                    attribute_option_price: attribute.price,
                    id: attribute.id,
                    quantity: quantity.value,
                });
            }
        }
    }
    return details;
};

const incrementQuantity = () => {
    if (!hasAttributes.value) {
        const nextQuantity = quantity.value + 1;
        if (nextQuantity > props.product.quantity) {
            toast.error(`Stock not available`);
            return;
        }
        quantity.value = nextQuantity;
        return;
    }
    if (!isCombinationAvailable.value) {
        toast.error("This combination is out of stock");
        return;
    }
    const nextQuantity = quantity.value + 1;
    if (nextQuantity > combinationQuantity.value) {
        toast.error(`Stock not available`);
        return;
    }
    quantity.value = nextQuantity;
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const getStorage = () => {
    if (typeof window !== "undefined") {
        return {
            getItem: (key) => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: (key) => localStorage.removeItem(key),
        };
    }
    return {
        getItem: () => null,
        setItem: () => null,
        removeItem: () => null,
    };
};

const addToCart = async () => {
    if (loading.value) return;
    loading.value = true;
    const storage = getStorage();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const isLoggedIn = authStore.isAuthenticated;

    let guest_id = storage.getItem("guest_id");
    if (!isLoggedIn && !guest_id) {
        guest_id = authStore.generateGuestId();
        storage.setItem("guest_id", guest_id);
    } else if (isLoggedIn) {
        storage.removeItem("guest_id");
    }

    let user_id = isLoggedIn ? authStore.user.id : guest_id;

    try {
        const campaign = props.product.product_campaign?.campaign;
        const isCampaignActive =
            campaign &&
            new Date(campaign.start_date) <= new Date() &&
            new Date(campaign.expiry_date) >= new Date();

        if (!hasAttributes.value) {
            if (props.product.quantity <= 0) {
                toast.error("This product is out of stock.");
                return;
            }
            if (quantity.value > props.product.quantity) {
                toast.error(
                    `Only ${props.product.quantity} items available in stock.`
                );
                quantity.value = props.product.quantity;
                return;
            }

            let cartData = {
                product_id: props.product.id,
                quantity: quantity.value,
                campaign_id: isCampaignActive
                    ? props.product.product_campaign.campaign_id
                    : null,
                discount_value: isCampaignActive
                    ? props.product.product_campaign.campaign.discount
                    : null,
                discount_type: isCampaignActive
                    ? props.product.product_campaign.campaign.type
                    : null,
                product: {
                    id: props.product.id,
                    product_name: props.product.product_name,
                    free_delivary: props.product.is_free_shipping,
                    price: hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value,
                    featured_image: props.product.featured_image,
                },
                user_id: user_id,
                base_price: basePrice.value,
                total_price:
                    (hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value) * quantity.value,
                attribute_values: [],
                selectedAttributes: [],
                category: props.product.category?.name || "Uncategorized",
                subcategory: props.product.subcategory?.name || "Uncategorized",
            };

            const response = await $axios.post("/add-to-cart", cartData);
            toast.success("Added to cart!");
            trackAddToCart(cartData);
            await cartStore.fetchCartItems();
            cartStore.cartOrder();
        } else {
            if (!allAttributesSelected.value) {
                toast.error("Please select all required attributes.");
                return;
            }
            if (!isCombinationAvailable.value) {
                toast.error("This product is out of stock.");
                return;
            }
            if (quantity.value > combinationQuantity.value) {
                toast.error(
                    `Only ${combinationQuantity.value} items available in stock.`
                );
                quantity.value = combinationQuantity.value;
                return;
            }

            let cartData = {
                product_id: props.product.id,
                quantity: quantity.value,
                campaign_id: isCampaignActive
                    ? props.product.product_campaign.campaign_id
                    : null,
                discount_value: isCampaignActive
                    ? props.product.product_campaign.campaign.discount
                    : null,
                discount_type: isCampaignActive
                    ? props.product.product_campaign.campaign.type
                    : null,
                product: {
                    id: props.product.id,
                    product_name: props.product.product_name,
                    free_delivary: props.product.is_free_shipping,
                    price: hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value,
                    featured_image: props.product.featured_image,
                },
                user_id: user_id,
                base_price: basePrice.value,
                total_price:
                    (hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value) * quantity.value,
                attribute_values: getSelectedAttributeIds(),
                selectedAttributes: getSelectedAttributesDetails(),
                category: props.product.category?.name || "Uncategorized",
                subcategory: props.product.subcategory?.name || "Uncategorized",
            };

            const response = await $axios.post("/add-to-cart", cartData);
            toast.success("Added to cart!");
            trackAddToCart(cartData);
            await cartStore.fetchCartItems();
            cartStore.cartOrder();
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(
            error.response?.data?.data?.message || "Failed to add to cart."
        );
    } finally {
        loading.value = false;
    }
};

const buyNow = async () => {
    if (buynowLoading.value) return;
    buynowLoading.value = true;
    const storage = getStorage();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const isLoggedIn = authStore.isAuthenticated;

    let guest_id = storage.getItem("guest_id");
    if (!isLoggedIn && !guest_id) {
        guest_id = authStore.generateGuestId();
        storage.setItem("guest_id", guest_id);
    } else if (isLoggedIn) {
        storage.removeItem("guest_id");
    }

    let user_id = isLoggedIn ? authStore.user.id : guest_id;

    try {
        const campaign = props.product.product_campaign?.campaign;
        const isCampaignActive =
            campaign &&
            new Date(campaign.start_date) <= new Date() &&
            new Date(campaign.expiry_date) >= new Date();

        if (!hasAttributes.value) {
            if (props.product.quantity <= 0) {
                toast.error("This product is out of stock.");
                return;
            }
            if (quantity.value > props.product.quantity) {
                toast.error(
                    `Only ${props.product.quantity} items available in stock.`
                );
                quantity.value = props.product.quantity;
                return;
            }

            let cartData = {
                product_id: props.product.id,
                quantity: quantity.value,
                campaign_id: isCampaignActive
                    ? props.product.product_campaign.campaign_id
                    : null,
                discount_value: isCampaignActive
                    ? props.product.product_campaign.campaign.discount
                    : null,
                discount_type: isCampaignActive
                    ? props.product.product_campaign.campaign.type
                    : null,
                product: {
                    id: props.product.id,
                    product_name: props.product.product_name,
                    free_delivary: props.product.is_free_shipping,
                    price: hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value,
                    featured_image: props.product.featured_image,
                },
                user_id: user_id,
                base_price: basePrice.value,
                total_price:
                    (hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value) * quantity.value,
                attribute_values: [],
                selectedAttributes: [],
                category: props.product.category?.name || "Uncategorized",
                subcategory: props.product.subcategory?.name || "Uncategorized",
            };

            const response = await $axios.post("/add-to-cart", cartData);
            trackAddToCart(cartData);
            await cartStore.fetchCartItems();
            cartStore.cartOrder();
            router.get("/checkout");
        } else {
            if (!allAttributesSelected.value) {
                toast.error("Please select all required attributes.");
                return;
            }
            if (!isCombinationAvailable.value) {
                toast.error("This product is out of stock.");
                return;
            }
            if (quantity.value > combinationQuantity.value) {
                toast.error(
                    `Only ${combinationQuantity.value} items available in stock.`
                );
                quantity.value = combinationQuantity.value;
                return;
            }

            let cartData = {
                product_id: props.product.id,
                quantity: quantity.value,
                campaign_id: isCampaignActive
                    ? props.product.product_campaign.campaign_id
                    : null,
                discount_value: isCampaignActive
                    ? props.product.product_campaign.campaign.discount
                    : null,
                discount_type: isCampaignActive
                    ? props.product.product_campaign.campaign.type
                    : null,
                product: {
                    id: props.product.id,
                    product_name: props.product.product_name,
                    free_delivary: props.product.is_free_shipping,
                    price: hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value,
                    featured_image: props.product.featured_image,
                },
                user_id: user_id,
                base_price: basePrice.value,
                total_price:
                    (hasCampaign.value
                        ? campaignPrice.value
                        : basePrice.value) * quantity.value,
                attribute_values: getSelectedAttributeIds(),
                selectedAttributes: getSelectedAttributesDetails(),
                category: props.product.category?.name || "Uncategorized",
                subcategory: props.product.subcategory?.name || "Uncategorized",
            };

            const response = await $axios.post("/add-to-cart", cartData);
            trackAddToCart(cartData);
            await cartStore.fetchCartItems();
            cartStore.cartOrder();
            router.get("/checkout");
        }
    } catch (error) {
        console.error("Error buying now:", error);
        toast.error(
            error.response?.data?.data?.message ||
                "Failed to proceed to checkout."
        );
    } finally {
        buynowLoading.value = false;
    }
};

// Modified onMounted
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    timer.value = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
    if (props.product) {
        updateBasePrice(
            lowestAttributePrice.value.price,
            lowestAttributePrice.value.previous_price
        );
        selectDefaultAttributes();
    }
});

// Modified watch for product prop
watch(
    () => props.product,
    (newProduct) => {
        if (newProduct) {
            selectedAttributes.value = {};
            selectedCombination.value = null;
            quantity.value = 1;
            updateBasePrice(
                lowestAttributePrice.value.price,
                lowestAttributePrice.value.previous_price
            );
            selectDefaultAttributes();
        }
    },
    { deep: true }
);

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
/* Optional custom styles for Swiper */
.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    width: 100% !important;
}

.swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Customize navigation buttons */
.swiper-button-next,
.swiper-button-prev {
    color: #333;
}

/* Customize pagination bullets */
.swiper-pagination-bullet {
    background: #666;
}

.swiper-pagination-bullet-active {
    background: #000;
}

@media (max-width: 640px) {
    .responsive {
        max-width: 640px !important;
    }
}
</style>
