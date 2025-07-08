<template>
    <!-- <pre>{{ product }}</pre> -->
    <div class="container mx-auto py-8">
        <!-- Breadcrumb -->
        <nav
            class="hidden lg:flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-8"
        >
            <Link href="/" class="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link
                :href="`/product-category/${product.category.slug}`"
                class="hover:text-gray-700"
                >{{ product.category.name }}</Link
            >
            <span>/</span>
            <span class="text-gray-900">{{ product.product_name }}</span>
        </nav>
        <div class="mx-auto flex flex-col lg:flex-row gap-8">
            <!-- Product Images -->
            <div class="lg:w-1/2 w-full">
                <ProductImages 
                    :product="product" 
                    :hasCampaign="hasCampaign"
                    :selectedAttributeImage="selectedAttributeImage"
                />
            </div>

            <!-- Product Info (Sticky) -->
            <div
                v-if="product"
                class="lg:w-1/2 w-full lg:self-start space-y-3 md:px-6 p-0 rounded-lg"
                :class="{ 'lg:sticky lg:top-0': product }"
            >
                <div class="space-y-2">
                    <h1
                        class="md:text-2xl text-xl font-medium mb-4 text-[#333333]"
                    >
                        {{ product.product_name }}
                    </h1>
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold text-theme"
                            ><span class="font-medium">{{ cartStore.currencysymbol }}</span
                            >{{ parseInt(displayPrice) }}</span
                        >
                        <span
                            v-if="displayPreviousPrice && !hasCampaign"
                            class="text-sm text-gray-500 line-through"
                        >
                            <span class="">{{ cartStore.currencysymbol }}</span
                            >{{ parseInt(displayPreviousPrice) }}
                        </span>
                        <span v-if="hasCampaign" class="text-sm text-red-500">
                            ({{
                                product.product_campaign.campaign.type ===
                                "fixed"
                                    ? cartStore.currencysymbol
                                    : ""
                            }}{{ product.product_campaign.campaign.discount
                            }}{{
                                product.product_campaign.campaign.type ===
                                "percentage"
                                    ? "%"
                                    : ""
                            }}
                            OFF)
                        </span>
                    </div>
                </div>

                <!-- Out of Stock Message -->
                <div v-if="isOutOfStock" class="space-y-2">
                    <p class="text-sm text-red-500">Out of stock</p>
                </div>



                <!-- Dynamic Attributes Products -->
                <div v-if="hasAttributes" class="mt-4">
                    <h3 class="text-sm font-medium mb-2">Select Attributes:</h3>

                    <div
                        v-for="(attributeName, index) in sortedAttributeNames"
                        :key="attributeName"
                        class="mb-4"
                    >
                        <label class="text-sm font-medium">{{ attributeName }}:</label>
                        
                        <!-- Conditional Layout based on combination_id and image -->
                        <div 
                            v-if="groupedAttributes[attributeName].some(opt => opt.combination_id === null && opt.image)"
                            class="grid grid-cols-3 gap-3 mt-2 max-w-md"
                        >
                            <!-- Grid Design for combination_id null with images -->
                            <button
                                v-for="option in groupedAttributes[attributeName]"
                                :key="option.id"
                                @click="
                                    updateAttributeSelection(
                                        attributeName,
                                        0,
                                        option.attribute_option.id,
                                        option.attribute_option.name,
                                        option.price,
                                        option.previous_price,
                                        option.image
                                    )
                                "
                                :class="[
                                    'relative flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:shadow-md',
                                    selectedAttributes[attributeName]?.[0]?.optionId === option.attribute_option.id
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white',
                                ]"
                            >
                                <!-- Option Image -->
                                <div class="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        v-if="option.image"
                                        :src="option.image"
                                        :alt="option.attribute_option.name"
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span class="text-gray-400 text-xs">No Image</span>
                                    </div>
                                </div>
                                
                                <!-- Option Number/ID -->
                                <div class="text-base font-bold text-gray-700 mb-1">
                                    {{ option?.attribute_option?.name }}
                                </div>
                                
                                <!-- Selection Indicator -->
                                <div 
                                    v-if="selectedAttributes[attributeName]?.[0]?.optionId === option.attribute_option.id"
                                    class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                        
                        <!-- Previous Design for combination_id not null -->
                        <div v-else class="flex flex-wrap gap-2 mt-2">
                            <button
                                v-for="option in groupedAttributes[attributeName]"
                                :key="option.id"
                                @click="
                                    updateAttributeSelection(
                                        attributeName,
                                        0,
                                        option.attribute_option.id,
                                        option.attribute_option.name,
                                        option.price,
                                        option.previous_price,
                                        option.image
                                    )
                                "
                                :class="[
                                    'flex items-center gap-2 px-4 py-2 text-sm rounded-full border',
                                    selectedAttributes[attributeName]?.[0]?.optionId === option.attribute_option.id
                                        ? 'bg-gray-900 text-white'
                                        : 'border-gray-300 hover:bg-gray-100',
                                ]"
                            >
                                <!-- Show image only for first group and when combination_id is null -->
                                <img
                                    v-if="option.image && index === 0 && option.combination_id === null"
                                    :src="option.image"
                                    alt="Option Image"
                                    class="w-6 h-6 rounded-full object-cover"
                                />
                                <span>{{ option.attribute_option.name }}</span>
                            </button>
                        </div>
                    </div>
                </div>





                <!-- {{ selectedAttributeImage }} -->


                <!-- Stock Information -->
                <div
                    v-if="!hasAttributes"
                    class="!mt-0 py-3 flex items-center gap-2"
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
                            product.quantity > 0 ? 'text-black' : 'text-red-800'
                        "
                    >
                        {{ product.quantity > 0 ? "In Stock" : "Out of Stock" }}
                    </span>
                </div>

                <div
                    v-else-if="allAttributesSelected"
                    class="!mt-0 py-3 flex items-center gap-2"
                >
                    <div class="flex items-center justify-between">
                        <span
                            class="text-base flex items-center gap-1 font-semibold"
                            :class="
                                isCombinationAvailable
                                    ? 'text-black'
                                    : 'text-red-500'
                            "
                        >
                            <Check v-if="isCombinationAvailable" />
                            {{
                                isCombinationAvailable ? combinationQuantity : 0
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
                            isCombinationAvailable ? "In Stock" : "Out of Stock"
                        }}
                    </span>
                </div>

                <!-- Quantity Selector and Add to Cart -->
                <div class="flex items-center gap-2">
                <div>
                    <h5>Quantity: </h5>
                </div>
                    <div
                        class="flex border border-gray-400 rounded-md overflow-hidden h-10"
                    >
                        <button
                            @click="decrementQuantity"
                            class="w-10 h-10 flex items-center justify-center border-r border-gray-400 hover:bg-gray-200"
                            :disabled="quantity <= 1"
                        >
                            -
                        </button>
                        <span
                            class="w-10 h-10 flex items-center justify-center text-center"
                        >
                            {{ quantity }}
                        </span>
                        <button
                            @click="incrementQuantity"
                            class="w-10 h-10 flex items-center justify-center border-l border-gray-400 hover:bg-gray-200"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div class="flex items-center flex-col sm:flex-row gap-4">
                    <div class="sm:w-1/2 w-full">
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
                                ' w-full px-6 bg-black text-white transition-colors uppercase text-sm font-medium rounded-md flex items-center justify-center h-10',
                                loading ||
                                (hasAttributes
                                    ? allAttributesSelected &&
                                    isCombinationAvailable
                                    : product.quantity > 0)
                                    ? 'bg-[#000] hover:bg-[#000] hover:text-white transition-colors'
                                    : 'cursor-not-allowed',
                            ]"
                        >
                            <span
                                v-if="loading"
                                class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2"
                            ></span>
                            <span class="flex items-center gap-2">
                                <ShoppingCart size="20" />{{
                                    loading ? "Adding..." : "Add to Cart"
                                }}
                            </span>
                        </button>
                    </div>

                    <!-- Buy Now -->
                    <div class="sm:w-1/2 w-full">
                        <div class="buy_new_area w-full">
                            <button
                                @click="buyNow"
                                :disabled="
                                    buynowloding ||
                                    (hasAttributes
                                        ? !allAttributesSelected ||
                                        !isCombinationAvailable
                                        : product.quantity <= 0)
                                "
                                :class="[
                                    'flex-1 px-8 bg-theme text-white transition-colors w-full uppercase text-sm font-medium rounded-md flex items-center justify-center h-10',
                                    buynowloding ||
                                    (hasAttributes
                                        ? allAttributesSelected &&
                                        isCombinationAvailable
                                        : product.quantity > 0)
                                        ? 'bg-[#000] hover:bg-[#000] transition-colors'
                                        : 'cursor-not-allowed',
                                ]"
                            >
                                <span
                                    v-if="buynowloding"
                                    class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2"
                                ></span>
                                <span class="flex items-center gap-2">
                                    <ShoppingBasket size="20" />{{
                                        buynowloding ? "Processing..." : "Buy Now"
                                    }}
                                </span>
                            </button>
                        </div>
                    </div>


                </div>



                <!-- Contact Info -->
                <!-- <div class="cal_btn_area text-center">
                    <a
                        :href="`tel:${siteinfos?.phone_number}`"
                        class="flex items-center justify-center gap-2 bg-white px-4 py-2 text-center rounded-md border-2 border-dashed border-gray-400"
                    >
                        <Phone size="20" />কল করতে ক্লিক করুন :
                        <span>{{ siteinfos?.phone_number }}</span>
                    </a>
                </div> -->

                <!-- <div class="whatapps_btn_area text-center">
                    <a
                        :href="`https://wa.me/${siteinfos?.whatsapp_number}`"
                        class="flex items-center justify-center gap-2 bg-[#2ecc71] text-white px-4 py-2 text-center rounded-md"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                        >
                            
                        </svg>
                        WhatsApp Now
                    </a>
                </div> -->

                <!-- Shipping Charges -->
                <!-- <div v-if="siteinfos?.shipping_charge_inside_dhaka || siteinfos?.shipping_charge_outside_dhaka">
          <div class="mt-2">
            <div class="border border-gray-300 rounded overflow-hidden">
              <div class="bg-gray-100 p-2 text-center font-semibold text-gray-800 border-b border-gray-300">
                ডেলিভারি চার্জ
              </div>
              <div class="grid grid-cols-2">
                <div class="p-3 border-b border-r border-gray-300 font-medium">
                  Inside Dhaka City
                </div>
                <div v-if="siteinfos?.shipping_charge_inside_dhaka" class="p-3 border-b border-gray-300 text-right">
                  {{ cartStore.currencysymbol }} {{ siteinfos?.shipping_charge_inside_dhaka }}
                </div>
                <div class="p-3 border-r border-gray-300 font-medium">
                  Outside Dhaka
                </div>
                <div v-if="siteinfos?.shipping_charge_outside_dhaka" class="p-3 text-right">
                  {{ cartStore.currencysymbol }} {{ siteinfos?.shipping_charge_outside_dhaka }}
                </div>
              </div>
            </div>
          </div>
        </div> -->

                <!-- Additional Note -->
                <!-- <div v-if="siteinfos?.attention_notice" class="adisonal_note">
                    <b class="bg-yellow-400 text-sm">{{
                        siteinfos?.attention_notice
                    }}</b>
                </div> -->

                <!-- Product Details -->
                <div class="space-y-2 pt-4 border-t">
                    <p
                        v-if="product.product_code"
                        class="relative text-[13px] font-semibold text-gray-600"
                    >
                        SKU: {{ product.product_code }}
                    </p>
                    <p
                        v-if="product.category"
                        class="text-sm text-gray-500 font-semibold"
                    >
                        Categories:
                        <span class="text-white bg-theme px-2 py-1 rounded">
                            {{ product.category.name }}
                        </span>
                    </p>
                </div>
            </div>

            <div v-else class="p-4 text-center">Loading product details...</div>
        </div>
    </div>

    <ProductTabs :product="product" />
    <hr />
    <RelatedProducts :product="product" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { toast } from "@steveyuowo/vue-hot-toast";
import { router, Link } from "@inertiajs/vue3";
import { useAuthStore } from "@/Store/authStore";
import { useCartStore } from "@/Store/cartStore";
import { useHomeStore } from "@/Store/homeStore";
import { Check, ShoppingBasket, ShoppingCart, Phone } from "lucide-vue-next";
import ProductImages from "./ProductImages.vue";
import ProductTabs from "./ProductTabs.vue";
import RelatedProducts from "./RelatedProducts.vue";
import { trackAddToCart, trackViewItem } from "@/services/gtmHelper";

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const cartStore = useCartStore();


const $axios = inject("$axios");
const homeStore = useHomeStore();
const siteinfos = computed(() => homeStore.siteinfos?.[0] || {});
const quantity = ref(1);
const basePrice = ref(0); // Initialize to 0
const basePreviousPrice = ref(null); // Initialize to null
const selectedAttributes = ref({}); // { attributeName: [{ optionId, optionName, price, previous_price }] }
const selectedCombination = ref(null);
const currentTime = ref(new Date());
const loading = ref(false);
const buynowloding = ref(false);

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
    if (!hasAttributes.value) return { price: "0.00", previous_price: null };
    return props.product.product_attributes.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price);
        const lowestPrice = parseFloat(lowest.price);
        return currentPrice < lowestPrice ? current : lowest;
    }, props.product.product_attributes[0]);
});

// Display price (lowest or selected attribute price)
const displayPrice = computed(() => {
    if (!hasAttributes.value) return formatPrice(props.product.price);
    if (!allAttributesSelected.value) {
        return formatPrice(lowestAttributePrice.value.price);
    }
    return formatPrice(basePrice.value);
});

// Display previous price (lowest or selected attribute previous_price)
const displayPreviousPrice = computed(() => {
    if (!hasAttributes.value) return props.product.previous_price;
    if (!allAttributesSelected.value) {
        return lowestAttributePrice.value.previous_price;
    }
    return basePreviousPrice.value;
});

// Format price
const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

// Grouped attributes for selection
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

// Sorted attribute names
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

// Check if all attributes are selected
const allAttributesSelected = computed(() => {
    if (!hasAttributes.value) return true;
    return sortedAttributeNames.value.every(
        (attr) =>
            selectedAttributes.value[attr] &&
            selectedAttributes.value[attr][0]?.optionId
    );
});

// Find matched combination
const matchedCombination = computed(() => {
    if (
        !hasAttributes.value ||
        !allAttributesSelected.value ||
        !props.product.product_attributes_combaine
    ) {
        return null;
    }
    const selected = [];
    for (const attributeName in selectedAttributes.value) {
        selectedAttributes.value[attributeName].forEach((selection) => {
            if (selection.optionId) {
                const attribute = props.product.product_attributes.find(
                    (attr) =>
                        attr.attribute.name === attributeName &&
                        attr.attribute_option.id === selection.optionId
                );
                if (attribute) {
                    selected.push({
                        attributeId: attribute.attribute_id,
                        optionId: selection.optionId,
                        optionName: selection.optionName,
                    });
                }
            }
        });
    }
    return (
        props.product.product_attributes_combaine.find((combination) => {
            const comboAttributes = JSON.parse(combination.combination_string);
            return (
                comboAttributes.every((comboAttr) =>
                    selected.some(
                        (selAttr) =>
                            selAttr.attributeId === comboAttr.attributeId &&
                            selAttr.optionId === comboAttr.optionId
                    )
                ) &&
                selected.every((selAttr) =>
                    comboAttributes.some(
                        (comboAttr) =>
                            comboAttr.attributeId === selAttr.attributeId &&
                            comboAttr.optionId === selAttr.optionId
                    )
                )
            );
        }) || null
    );
});

// Check if the selected combination is available
const isCombinationAvailable = computed(() => {
    if (!hasAttributes.value) {
        return props.product.quantity > 0;
    }
    if (!allAttributesSelected.value) {
        return false;
    }
    if (matchedCombination.value === null) {
        const selectedAttributeQuantities = [];
        for (const attributeName in selectedAttributes.value) {
            selectedAttributes.value[attributeName].forEach((selection) => {
                if (selection.optionId) {
                    const attribute = props.product.product_attributes.find(
                        (attr) =>
                            attr.attribute.name === attributeName &&
                            attr.attribute_option.id === selection.optionId &&
                            attr.combination_id === null
                    );
                    if (attribute) {
                        selectedAttributeQuantities.push(attribute.quantity);
                    }
                }
            });
        }
        return (
            selectedAttributeQuantities.length > 0 &&
            Math.min(...selectedAttributeQuantities) > 0
        );
    } else {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === matchedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 && Math.min(...quantities) > 0;
    }
});

// Combination quantity
const combinationQuantity = computed(() => {
    if (!hasAttributes.value) {
        return props.product.quantity;
    }
    if (matchedCombination.value === null) {
        const selectedAttributeQuantities = [];
        for (const attributeName in selectedAttributes.value) {
            selectedAttributes.value[attributeName].forEach((selection) => {
                if (selection.optionId) {
                    const attribute = props.product.product_attributes.find(
                        (attr) =>
                            attr.attribute.name === attributeName &&
                            attr.attribute_option.id === selection.optionId &&
                            attr.combination_id === null
                    );
                    if (attribute) {
                        selectedAttributeQuantities.push(attribute.quantity);
                    }
                }
            });
        }
        return selectedAttributeQuantities.length > 0
            ? Math.min(...selectedAttributeQuantities)
            : 0;
    } else {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === matchedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 ? Math.min(...quantities) : 0;
    }
});

const isOutOfStock = computed(() => props.product.quantity === 0);

// Update base price and previous price
const updateBasePrice = (newPrice, newPreviousPrice) => {
    basePrice.value = Number.parseFloat(newPrice) || 0;
    basePreviousPrice.value = newPreviousPrice
        ? Number.parseFloat(newPreviousPrice)
        : null;
};

const selectedAttributeImage = ref(null);

// Update attribute selection
const updateAttributeSelection = (
    attributeName,
    index,
    optionId,
    optionName,
    price,
    previous_price,
    image
) => {
    if (!selectedAttributes.value[attributeName]) {
        selectedAttributes.value[attributeName] = [];
    }
    if (!selectedAttributes.value[attributeName][index]) {
        selectedAttributes.value[attributeName][index] = {};
    }
    selectedAttributes.value[attributeName][index] = {
        optionId,
        optionName,
        price,
        previous_price,
    };
    selectedAttributes.value = { ...selectedAttributes.value };

        // ✅ Set the image
    selectedAttributeImage.value = image;

    updateTotalPrice();
};

// Update total price based on selected attributes
const updateTotalPrice = () => {
    let totalPrice = 0; // Start with main price = 0
    let totalPreviousPrice = null; // Start with null
    if (allAttributesSelected.value) {
        // Use the first attribute in the matched combination or selected attribute
        if (matchedCombination.value) {
            const combinationAttributes =
                props.product.product_attributes.filter(
                    (attr) =>
                        attr.combination_id === matchedCombination.value.id
                );
            if (combinationAttributes.length > 0) {
                totalPrice =
                    Number.parseFloat(combinationAttributes[0].price) || 0;
                totalPreviousPrice = combinationAttributes[0].previous_price
                    ? Number.parseFloat(combinationAttributes[0].previous_price)
                    : null;
            }
        } else {
            for (const attributeName in selectedAttributes.value) {
                const selection = selectedAttributes.value[attributeName][0];
                if (selection && selection.optionId) {
                    totalPrice = Number.parseFloat(selection.price) || 0;
                    totalPreviousPrice = selection.previous_price
                        ? Number.parseFloat(selection.previous_price)
                        : null;
                    break; // Only use the first selected attribute
                }
            }
        }
    }
    updateBasePrice(totalPrice.toFixed(2), totalPreviousPrice);
};

// Get selected attribute IDs
const getSelectedAttributeIds = () => {
    const attributeIds = [];
    if (matchedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === matchedCombination.value.id
        );
        combinationAttributes.forEach((attr) => {
            attributeIds.push(attr.id);
        });
    } else {
        for (const attributeName in selectedAttributes.value) {
            selectedAttributes.value[attributeName].forEach((selection) => {
                if (selection.optionId) {
                    const attribute = props.product.product_attributes.find(
                        (attr) =>
                            attr.attribute.name === attributeName &&
                            attr.attribute_option.id === selection.optionId &&
                            attr.combination_id === null
                    );
                    if (attribute) {
                        attributeIds.push(attribute.id);
                    }
                }
            });
        }
    }
    return attributeIds;
};

// Get selected attributes details
const getSelectedAttributesDetails = () => {
    const details = [];
    if (matchedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
            (attr) => attr.combination_id === matchedCombination.value.id
        );
        combinationAttributes.forEach((attr) => {
            details.push({
                attribute_id: attr.attribute_id,
                attribute_option_id: attr.attribute_option_id,
                attribute_name: attr.attribute.name,
                attribute_option: attr.attribute_option.name,
                attribute_option_price: attr.price,
                id: attr.id,
            });
        });
    } else {
        for (const attributeName in selectedAttributes.value) {
            selectedAttributes.value[attributeName].forEach((selection) => {
                if (selection.optionId) {
                    const attribute = props.product.product_attributes.find(
                        (attr) =>
                            attr.attribute.name === attributeName &&
                            attr.attribute_option.id === selection.optionId &&
                            attr.combination_id === null
                    );
                    if (attribute) {
                        details.push({
                            attribute_id: attribute.attribute_id,
                            attribute_option_id: attribute.attribute_option_id,
                            attribute_name: attribute.attribute.name,
                            attribute_option: attribute.attribute_option.name,
                            attribute_option_price: attribute.price,
                            id: attribute.id,
                        });
                    }
                }
            });
        }
    }
    return details;
};

// Increment quantity
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

// Decrement quantity
const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// Get storage
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

// Build cart payload
const buildCartPayload = (user_id) => {
    const campaign = props.product.product_campaign?.campaign;
    const isCampaignActive =
        campaign &&
        new Date(campaign.start_date) <= new Date() &&
        new Date(campaign.expiry_date) >= new Date();

    const price = hasCampaign.value ? campaignPrice.value : basePrice.value;
    const total_price = price;

    const payload = {
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
            price: price,
            featured_image: props.product.featured_image,
        },
        user_id: user_id,
        base_price: basePrice.value,
        total_price: total_price,
        attribute_values: [],
        selectedAttributes: [],
        category: props.product.category?.name || "Uncategorized",
        subcategory: props.product.subcategory?.name || "Uncategorized",
    };

    if (
        hasAttributes.value &&
        allAttributesSelected.value &&
        isCombinationAvailable.value
    ) {
        payload.attribute_values = getSelectedAttributeIds();
        payload.selectedAttributes = getSelectedAttributesDetails();
    }

    return payload;
};

// Add to cart
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
        } else {
            if (!allAttributesSelected.value) {
                toast.error(
                    "Please select at least one option for each attribute."
                );
                return;
            }
            if (!isCombinationAvailable.value) {
                toast.error(
                    "This product is out of stock for the selected options."
                );
                return;
            }
        }

        const cartData = buildCartPayload(user_id);
        const response = await $axios.post("/add-to-cart", cartData);
        toast.success("Added to cart!");
        trackAddToCart(cartData);
        await cartStore.fetchCartItems();
        cartStore.cartOrder();
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(
            error.response?.data?.data?.message || "Failed to add to cart."
        );
    } finally {
        loading.value = false;
    }
};

// Buy now
const buyNow = async () => {
    if (buynowloding.value) return;
    buynowloding.value = true;

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
        } else {
            if (!allAttributesSelected.value) {
                toast.error(
                    "Please select at least one option for each attribute."
                );
                return;
            }
            if (!isCombinationAvailable.value) {
                toast.error(
                    "This product is out of stock for the selected options."
                );
                return;
            }
        }

        const cartData = buildCartPayload(user_id);
        const response = await $axios.post("/add-to-cart", cartData);
        trackAddToCart(cartData);
        await cartStore.fetchCartItems();
        cartStore.cartOrder();
        router.get("/checkout");
    } catch (error) {
        console.error("Error buying now:", error);
        toast.error(
            error.response?.data?.data?.message ||
                "Failed to proceed to checkout."
        );
    } finally {
        buynowloding.value = false;
    }
};


// Replace your existing onMounted function with this updated version
// onMounted(() => {
//     if (hasAttributes.value) {
//         // Initialize with the lowest price first
//         updateBasePrice(
//             lowestAttributePrice.value.price,
//             lowestAttributePrice.value.previous_price
//         );
        
//         // Auto-select the first option for each attribute
//         sortedAttributeNames.value.forEach((attributeName) => {
//             if (!selectedAttributes.value[attributeName]) {
//                 selectedAttributes.value[attributeName] = [
//                     {
//                         optionId: null,
//                         optionName: null,
//                         price: null,
//                         previous_price: null,
//                     },
//                 ];
//             }
            
//             // Auto-select the first available option for this attribute
//             const firstOption = groupedAttributes.value[attributeName]?.[0];
//             if (firstOption) {
//                 updateAttributeSelection(
//                     attributeName,
//                     0,
//                     firstOption.attribute_option.id,
//                     firstOption.attribute_option.name,
//                     firstOption.price,
//                     firstOption.previous_price
//                 );
//             }
//         });
//     } else {
//         updateBasePrice(props.product.price, props.product.previous_price);
//     }
    
//     checkDataLayerAndTrack();
// });

// onUnmounted(() => {
//   if (timer.value) clearInterval(timer.value);
// });

// Google Tag Manager tracking
const checkDataLayerAndTrack = () => {
    if (window.dataLayer) {
        trackViewItem(props.product, displayPrice.value);
    } else {
        setTimeout(checkDataLayerAndTrack, 100);
    }
};
</script>

<style scoped>
.lg\:sticky {
    position: sticky;
    top: 20px;
    align-self: start;
}

@media (min-width: 392px) {
    .addcartmedia {
        width: 205px;
    }
}

@media (min-width: 430px) {
    .addcartmedia {
        width: 240px;
    }
}

@media (min-width: 480px) {
    .addcartmedia {
        width: 290px;
    }
}
@media (min-width: 820px) {
    .addcartmedia {
        width: 570px;
    }
}
</style>
