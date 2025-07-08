<script setup>
import { ref, computed, watch, inject, onMounted, reactive } from "vue";
import { useCartStore } from "@/Store/cartStore";
import { useAuthStore } from "@/Store/authStore";
import { useHomeStore } from "@/Store/homeStore";
import { toast } from "@steveyuowo/vue-hot-toast";
import { router, Link } from "@inertiajs/vue3";
import {
    trackCheckout,
    trackDiractCheckout,
    trackPurchase,
} from "@/services/gtmHelper";

const cartStore = useCartStore();
const authStore = useAuthStore();
const homeStore = useHomeStore();

const $axios = inject("$axios");

const siteinfos = computed(() => homeStore.siteinfos?.[0] || {});
const cartItems = computed(() => cartStore.cartItems);
const directOrderProduct = ref(null);

onMounted(() => {
    if (typeof window !== "undefined") {
        const storedProductData = localStorage.getItem(
            "directOrderProductData"
        );
        if (storedProductData) {
            directOrderProduct.value = JSON.parse(storedProductData);
        }
    }
});

const subtotal = computed(() => {
    if (cartStore.is_direct_order) {
        return directOrderProductSubtotal.value;
    } else {
        return cartItems.value.reduce((total, item) => {
            const price =
                parseFloat(item.individual_price.replace(/,/g, "")) || 0;
            const quantity = item.quantity || 1;

            return total + price * quantity;
        }, 0);
    }
});

const directOrderProductSubtotal = computed(() => {
    if (!directOrderProduct.value) return 0;

    const basePrice = parseFloat(directOrderProduct.value.price || 0);
    const quantity = directOrderProduct.value.quantity || 1;

    const additionalPrices = directOrderProduct.value.selectedAttributes.reduce(
        (total, attr) => total + parseFloat(attr.attribute_option_price || 0),
        0
    );

    const unitTotal = basePrice + additionalPrices;
    const subtotal = unitTotal * quantity;

    return subtotal;
});

const campaignDiscount = computed(() => {
    if (cartStore.is_direct_order) {
        if (
            directOrderProduct.value &&
            directOrderProduct.value.campaign_id &&
            directOrderProduct.value.discount_value
        ) {
            const discountValue = parseFloat(
                directOrderProduct.value.discount_value
            );
            const quantity = directOrderProduct.value.quantity || 1;
            const price = parseFloat(
                directOrderProduct.value.product?.price || 0
            );

            if (directOrderProduct.value.discount_type === "percentage") {
                return ((price * discountValue) / 100) * quantity;
            } else {
                return discountValue * quantity;
            }
        }
        return 0;
    } else {
        return cartItems.value.reduce((total, item) => {
            const discountValue = item.discount_value
                ? parseFloat(item.discount_value)
                : 0;
            const quantity = item.quantity || 1;
            const price = parseFloat(item.product?.price || 0);

            if (item.discount_type === "percentage") {
                return total + ((price * discountValue) / 100) * quantity;
            } else {
                return total + discountValue * quantity;
            }
        }, 0);
    }
});

const total = computed(() =>
    Math.round(
        subtotal.value + form.value.delivery_charge - (form.value.discount || 0)
    )
);

const cod = ref("/assets/images/payment/cod-pay.png");
// const bKash = ref("/assets/images/payment/bkash-pay.png");

const addresses = ref([]);

onMounted(() => {
    if (authStore.user) {
        fetchAddresses();
    }
});

async function fetchAddresses() {
    try {
        const response = await $axios.get("/get-addresses");
        if (response.data.success) {
            addresses.value = response.data.address;
            fillAddressData();
        } else {
            toast.error("Failed to fetch addresses.");
        }
    } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to fetch addresses.");
    }
}

function fillAddressData() {
    if (addresses.value && addresses.value.length > 0) {
        const defaultAddress = addresses.value.find(
            (addr) => addr.is_default === 1
        );
        if (defaultAddress) {
            form.value.name = defaultAddress.name;
            form.value.mobile = defaultAddress.phone;
            form.value.address = defaultAddress.address;
        } else if (addresses.value[0]) {
            form.value.name = addresses.value[0].name;
            form.value.mobile = addresses.value[0].phone;
            form.value.address = addresses.value[0].address;
        }
    }
}

const form = ref({
    name: "",
    mobile: "",
    email: "",
    extra_mobile: "",
    address: "",
    note: "",
    order_status: "pending",
    order_type: "checkout",
    delivery: "cod",
    delivery_area: "",
    delivery_charge: 0,
    discount: 0,
});

const errors = reactive({
    name: "",
    mobile: "",
    address: "",
    thana: "",
    zila: "",
    delivery_area: "",
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
    const hasCartFreeShipping = cartItems.value?.some(
        (item) => item.product?.is_free_shipping === 1
    );
    const hasDirectOrderFreeShipping =
        directOrderProduct?.value?.is_free_shipping === 1;
    if (hasCartFreeShipping || hasDirectOrderFreeShipping) {
        form.value.delivery_charge = 0;
    } else {
        if (form.value.delivery_area === "inside") {
            form.value.delivery_charge = scInsideDhaka.value;
        } else {
            form.value.delivery_charge = scOutsideDhaka.value;
        }
    }
};

watch(
    () => form.value.delivery_area,
    () => {
        updateDeliveryCharge();
        errors.delivery_area = form.value.delivery_area
            ? ""
            : "Delivery area is required.";
    }
);

watch(
    () => authStore.user,
    (newUser) => {
        if (newUser && !form.value.name) {
            form.value.name = newUser.name;
        }
    },
    { immediate: true }
);

const toggleCoupon = () => {
    showCoupon.value = !showCoupon.value;
};

const showCoupon = ref(false);
const couponCode = ref("");

const couponPayload = computed(() => {
    if (cartStore.is_direct_order && directOrderProduct.value) {
        return [
            {
                coupon_code: couponCode.value,
                product_id: directOrderProduct.value.product_id,
                quantity: directOrderProduct.value.quantity,
                product_attr_ids:
                    directOrderProduct.value.selectedAttributes?.map(
                        (attr) => attr.product_attr_id
                    ) || [],
            },
        ];
    }

    return cartItems.value.map((item) => ({
        coupon_code: couponCode.value,
        product_id: item.product.id,
        quantity: item.quantity,
        product_attr_ids: item.attributes.map((attr) => attr.product_attr_id),
    }));
});

const appliedCoupon = ref(null);

const applyCoupon = async () => {
    try {
        const response = await $axios.post("/coupon", couponPayload.value);

        if (response.data.status) {
            const couponData = response.data.coupon;
            const discountDetails = response.data.discount_details;

            appliedCoupon.value = {
                id: couponData.id,
                code: couponData.code,
                discount_type: couponData.discount_type,
                discount_amount: couponData.discount_amount,
            };

            if (couponData.discount_type === "percentage") {
                form.value.discount = Math.round(
                    (subtotal.value *
                        Number.parseFloat(couponData.discount_amount)) /
                        100
                );
            } else if (couponData.discount_type === "fixed") {
                form.value.discount = Math.round(
                    Number.parseFloat(couponData.discount_amount)
                );
            }

            if (discountDetails && discountDetails.total_discount) {
                form.value.discount = Math.round(
                    Number.parseFloat(discountDetails.total_discount)
                );
            }

            toast.success(
                response.data.message || "Coupon applied successfully."
            );

            if (
                discountDetails &&
                discountDetails.discounted_products &&
                !cartStore.is_direct_order
            ) {
                const discountedProductIds =
                    discountDetails.discounted_products.map((p) => p.id);
                cartItems.value.forEach((item) => {
                    const discountedProduct =
                        discountDetails.discounted_products.find(
                            (p) => p.id === item.product.id
                        );
                    if (discountedProduct) {
                        item.coupon_discount = discountedProduct.discount;
                    }
                });
            } else if (
                discountDetails &&
                discountDetails.discounted_products &&
                cartStore.is_direct_order
            ) {
                if (
                    directOrderProduct.value &&
                    discountDetails.discounted_products.some(
                        (p) => p.id === directOrderProduct.value.product_id
                    )
                ) {
                    const discountedProduct =
                        discountDetails.discounted_products.find(
                            (p) => p.id === directOrderProduct.value.product_id
                        );
                    if (discountedProduct) {
                        directOrderProduct.value.coupon_discount =
                            discountedProduct.discount;
                        localStorage.setItem(
                            "directOrderProductData",
                            JSON.stringify(directOrderProduct.value)
                        );
                    }
                }
            }
        } else {
            toast.error(response.data.message || "Invalid coupon code.");
        }
    } catch (error) {
        console.error("Error applying coupon:", error);
        toast.error(error.response?.data?.message || "Failed to apply coupon.");
    }
};

const updateQuantity = (product, change) => {
    if (!product) return;

    const newQuantity = product.quantity + change;

    if (newQuantity < 1) {
        toast.error("Quantity cannot be less than 1");
        return;
    }

    const minStock = Math.min(
        ...product.selectedAttributes.map(
            (attr) => attr.attribute_option_quantity
        )
    );

    if (newQuantity > minStock) {
        toast.error("Stock Out");
        return;
    }

    product.quantity = newQuantity;
    localStorage.setItem("directOrderProductData", JSON.stringify(product));

    couponCode.value = "";
    form.value.discount = 0;

    toast.success(`Updated Quantity`);
};

const validateForm = () => {
    errors.name = "";
    errors.mobile = "";
    errors.address = "";
    errors.thana = "";
    errors.zila = "";
    errors.delivery_area = "";

    let isValid = true;

    if (!form.value.name) {
        errors.name = "Name is required.";
        isValid = false;
    }
    if (!form.value.address) {
        errors.address = "Address is required.";
        isValid = false;
    }
    // if (!form.value.thana) {
    // errors.thana = "Thana is required.";
    // isValid = false;
    // }
    // if (!form.value.zila) {
    // errors.zila = "Zila is required.";
    // isValid = false;
    // }
    if (!form.value.mobile || !/^\d{11}$/.test(form.value.mobile)) {
        errors.mobile = "Mobile number must be 11 digits.";
        isValid = false;
    }
    if (!form.value.delivery_area) {
        errors.delivery_area = "Delivery area is required.";
        isValid = false;
    }

    return isValid;
};

const incompleteOrdervalidateForm = () => {
    if (!form.value.name) {
        return false;
    }
    if (!form.value.mobile || !/^\d{11}$/.test(form.value.mobile)) {
        return false;
    }
    if (!form.value.address) {
        return false;
    }
    return true;
};

const syncCartDecrement = async (cartId, productId, currentQuantity) => {
    await cartStore.syncCartDecrement(cartId, productId, currentQuantity);
    couponCode.value = "";
    form.value.discount = 0;
};

const syncCartIncrement = async (cartId, productId) => {
    await cartStore.syncCartIncrement(cartId, productId);
    couponCode.value = "";
    form.value.discount = 0;
};

const incompleteOrderID = ref(null);

const createIncompleteOrder = async () => {
    if (!incompleteOrdervalidateForm()) return;

    let items = [];

    if (cartStore.is_direct_order && typeof window !== "undefined") {
        const directOrderData = JSON.parse(
            localStorage.getItem("directOrderProductData")
        );
        if (directOrderData) {
            items = [
                {
                    product_id: directOrderData.product_id,
                    quantity: directOrderData.quantity,
                    individual_price: Number.parseFloat(directOrderData?.price),
                    total:
                        Number.parseFloat(directOrderData.price) *
                        directOrderData.quantity,
                    attributes: directOrderData.selectedAttributes || [],
                    attributeOptionId: null,
                    campaign_discount: directOrderData.discount_value
                        ? Number.parseFloat(directOrderData.discount_value) *
                          directOrderData.quantity
                        : 0,
                    coupon_discount: 0,
                    original_price: Number.parseFloat(directOrderData.price),
                    campaign_id: directOrderData.campaign_id || null,
                },
            ];
        }
    } else {
        if (!cartStore.cartItems || cartStore.cartItems.length === 0) {
            return;
        }

        items = cartStore.cartItems.map((item) => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity || 1,
            individual_price: parseFloat(
                item.individual_price.replace(/,/g, "") || item.price || 0
            ),
            total: parseFloat(
                (item.individual_price.replace(/,/g, "") ||
                    item.price.replace(/,/g, "") ||
                    0) * item.quantity
            ),
            attributes: item.attributes || [],
            attributeOptionId: item.attributeOptionId || "",
            campaign_discount:
                parseFloat(item.discount_value || 0) * item.quantity,
            coupon_discount: item.coupon_discount || 0,
            original_price: parseFloat(item.original_price || item.price || 0),
            campaign_id: item.campaign_id || null,
        }));
    }

    const campaignIds = items
        .map((item) => item.campaign_id)
        .filter((id) => id !== null);

    let user_id = authStore.user ? authStore.user.id : null;
    if (typeof window !== "undefined") {
        user_id = user_id || localStorage.getItem("guest_id");
    }

    const orderData = {
        items,
        user_id,
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
        total_campaign_discount: campaignDiscount.value,
        total_coupon_discount: form.value.discount || 0,
        final_total: total.value,
        is_direct_order: cartStore.is_direct_order || false,
        incomplete_order_id: 0,
        campaign_id: campaignIds.length > 0 ? campaignIds[0] : null,
        campaign_ids: campaignIds.length > 0 ? campaignIds : null,
    };

    try {
        const response = await $axios.post("/create-order", orderData);
        incompleteOrderID.value = response.data.id;

        if (typeof window !== "undefined") {
            localStorage.setItem(
                "incomplete_order_id",
                response.data.incomplete_order_id
            );
        }
    } catch (error) {
        console.error("Error creating incomplete order:", error);
        toast.error(error.response?.data?.message || "Failed to create order.");
    }
};

let createOrderTimeout = null;

const handleMobileBlur = () => {
    if (createOrderTimeout) clearTimeout(createOrderTimeout);
    createOrderTimeout = setTimeout(() => {
        if (/^\d{11}$/.test(form.value.mobile)) {
            createIncompleteOrder();
        } else {
            toast.error("Please enter a valid 11-digit mobile number.");
        }
    }, 300);
};

const placeOrder = async () => {
    if (!validateForm()) return;

    let userId = authStore.user ? authStore.user.id : null;
    if (typeof window !== "undefined") {
        userId = userId || localStorage.getItem("guest_id");
    }

    let items = [];

    if (cartStore.is_direct_order) {
        if (typeof window !== "undefined") {
            const productData = JSON.parse(
                localStorage.getItem("directOrderProductData")
            );
            if (productData) {
                items = [
                    {
                        product_id: productData.product_id,
                        quantity: productData.quantity,
                        individual_price: Number.parseFloat(productData.price),
                        total:
                            Number.parseFloat(productData.price) *
                            productData.quantity,
                        attributes: productData.selectedAttributes.map(
                            (attr) => ({
                                product_attr_id: attr.product_attr_id,
                                attribute_id: attr.attribute_id,
                                attribute_option_id: attr.attribute_option_id,
                                attribute_name: attr.attribute_name,
                                attribute_option: attr.attribute_option,
                                attribute_option_price:
                                    attr.attribute_option_price || "0.00",
                                quantity: attr.quantity,
                            })
                        ),
                        attributeOptionId:
                            productData.selectedAttributes
                                .map((attr) => attr.product_attr_id)
                                .filter((id) => id)
                                .join(",") || null,
                        campaign_discount: productData.discount_value
                            ? Number.parseFloat(productData.discount_value) *
                              productData.quantity
                            : 0,
                        coupon_discount:
                            Number.parseFloat(productData.coupon_discount) || 0,
                        original_price: Number.parseFloat(productData.price),
                        campaign_id: productData.campaign_id || null,
                    },
                ];
            }
        }
    } else {
        items = cartItems.value.map((item) => {
            const attributeOptionId = item.attributes
                .map((attr) => attr.product_attr_id)
                .filter((id) => id)
                .join(",");
            return {
                product_id: item.product.id,
                quantity: item.quantity,
                individual_price: Number.parseFloat(
                    item.individual_price.replace(/,/g, "")
                ),
                total:
                    Number.parseFloat(item.individual_price.replace(/,/g, "")) *
                    item.quantity,
                attributes: item.attributes.map((attr) => ({
                    product_attr_id: attr.product_attr_id || null,
                    attribute_id: attr.attribute_id,
                    attribute_option_id: attr.attribute_option_id,
                    attribute_name: attr.attribute_name,
                    attribute_option: attr.attribute_option,
                    attribute_option_price:
                        attr.attribute_option_price || "0.00",
                    quantity: attr.quantity,
                })),
                attributeOptionId: attributeOptionId || null,
                campaign_discount:
                    Number.parseFloat(item.discount_value || 0) * item.quantity,
                coupon_discount: item.coupon_discount || 0,
                original_price: Number.parseFloat(
                    item.product.price.replace(/,/g, "")
                ),
                campaign_id: item.campaign_id || null,
            };
        });
    }

    const campaignIds = items
        .map((item) => item.campaign_id)
        .filter((id) => id !== null);

    const orderData = {
        items,
        user_id: userId,
        user_name: form.value.name,
        address: form.value.address,
        phone_number: form.value.mobile,
        email: form.value.email,
        note: form.value.note || "",
        order_status: "pending",
        order_type: "checkout",
        delivery: form.value.delivery || "cod",
        delivery_charge: form.value.delivery_charge,
        select_area: form.value.delivery_area,
        shipping_price: 0,
        subtotal: subtotal.value,
        total_campaign_discount: campaignDiscount.value,
        total_coupon_discount: parseFloat(form.value.discount || 0),
        final_total: total.value,
        is_direct_order: cartStore.is_direct_order || false,
        incomplete_order_id: incompleteOrderID.value || 0,
        coupon_id: appliedCoupon.value ? appliedCoupon.value.id : null,
        code: appliedCoupon.value ? appliedCoupon.value.code : null,
        discount_type: appliedCoupon.value
            ? appliedCoupon.value.discount_type
            : null,
        discount_amount: appliedCoupon.value
            ? appliedCoupon.value.discount_amount
            : null,
        campaign_id: campaignIds.length > 0 ? campaignIds[0] : null,
        campaign_ids: campaignIds.length > 0 ? campaignIds : null,
    };

    try {
        const response = await $axios.post("/create-order", orderData);
        toast.success("Order placed successfully!");

        trackPurchase(response.data);

        if (typeof window !== "undefined") {
            localStorage.removeItem("directOrderProductData");
            localStorage.removeItem("incomplete_order_id");
            localStorage.setItem(
                "lastOrderDetails",
                JSON.stringify(response.data)
            );
        }

        cartStore.is_direct_order = false;
        router.get("/success/" + response.data.invoice_number);
    } catch (error) {
        console.error("Error placing order:", error);
        if (error.response) {
            toast.error(
                error.response.data.message ||
                    "Failed to place order. Please try again."
            );
        } else if (error.request) {
            toast.error(
                "No response from server. Please check your internet connection and try again."
            );
        } else {
            toast.error("An error occurred. Please try again.");
        }
    }
};

const trackCheckoutEvent = () => {
    if (cartStore.is_direct_order) {
        if (directOrderProduct.value) {
            trackDiractCheckout(directOrderProduct.value);
        }
    } else {
        if (cartItems.value && cartItems.value.length > 0) {
            trackCheckout(cartItems.value, total.value);
        }
    }
};

onMounted(() => {
    trackCheckoutEvent();
});
</script>

<template>
    <!-- <pre>{{ cartItems }}</pre> -->
    <!-- <pre>{{ directOrderProduct }}</pre> -->

    <div class="checkout-container bg-white">
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column - Customer Information -->
                <div class="lg:col-span-2">
                    <!-- Contact Information -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-semibold">
                                Billing address
                            </h2>
                            <div v-if="!authStore.user" class="text-sm">
                                <span>Already have an account?</span>
                                <Link
                                    href="/login"
                                    class="text-blue-600 ml-1 hover:underline"
                                    >Log in</Link
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Delivery Information -->
                    <div class="mb-8">
                        <div class="mb-4">
                            <div>
                                <input
                                    v-model="form.name"
                                    type="text"
                                    placeholder="Enter Your First Name"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    :class="{ 'border-red-500': errors.name }"
                                />
                                <p
                                    v-if="errors.name"
                                    class="mt-1 text-xs text-red-500"
                                >
                                    {{ errors.name }}
                                </p>
                            </div>
                        </div>

                        <div class="mb-4">
                            <input
                                v-model="form.address"
                                type="text"
                                placeholder="Enter Your Address"
                                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                :class="{ 'border-red-500': errors.address }"
                                required
                            />
                            <p
                                v-if="errors.address"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.address }}
                            </p>
                        </div>

                        <!-- <div class="mb-4">
              <input v-model="form.thana" type="text" placeholder="Thana"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :class="{ 'border-red-500': errors.thana }" required />
              <p v-if="errors.thana" class="mt-1 text-xs text-red-500">{{ errors.thana }}</p>
            </div> -->

                        <!-- <div class="mb-4">
              <input v-model="form.zila" type="text" placeholder="Zila"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :class="{ 'border-red-500': errors.zila }" required />
              <p v-if="errors.zila" class="mt-1 text-xs text-red-500">{{ errors.zila }}</p>
            </div> -->

                        <div class="mb-4">
                            <input
                                v-model="form.mobile"
                                type="tel"
                                placeholder="Enter Your Phone Number"
                                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                :class="{ 'border-red-500': errors.mobile }"
                                required
                                @blur="handleMobileBlur"
                            />
                            <p
                                v-if="errors.mobile"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.mobile }}
                            </p>
                        </div>

                        <!-- <div class="mb-4">
              <div class="relative">
                <input v-model="form.extra_mobile" type="tel" placeholder=" Extra Phone Number (optional)"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                <div class="absolute inset-y-0 right-0 flex items-center px-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div> -->
                        <!-- delivery ooption -->
                        <!-- <div class="mb-4">
                            <label class="block mb-2 text-sm font-medium"
                                >Select your area</label
                            >
                            <div class="relative">
                                <select
                                    v-model="form.delivery_area"
                                    @change="updateDeliveryCharge"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    :class="{
                                        'border-red-500': errors.delivery_area,
                                    }"
                                >
                                    <option value="" disabled selected>
                                        Select your area
                                    </option>
                                    <option value="inside">Inside Dhaka</option>
                                    <option value="outside">
                                        Outside Dhaka
                                    </option>
                                </select>
                                <div
                                    class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
                                >
                                    <svg
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <p
                                v-if="errors.delivery_area"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.delivery_area }}
                            </p>
                        </div> -->

                        <!-- <div class="mt-4">
                            <textarea
                                v-model="form.note"
                                placeholder="Order notes (optional)"
                                rows="3"
                                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            ></textarea>
                        </div> -->
                    </div>

                    <!-- Payment Method -->
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">Payment</h2>
                        <p class="text-sm text-gray-600 mb-4">
                            All transactions are secure and encrypted.
                        </p>

                        <div class="space-y-3">
                            <!-- Cash on Delivery -->
                            <label
                                class="block border border-gray-300 rounded-md p-4 cursor-pointer transition hover:border-blue-500"
                                :class="{
                                    'border-blue-500 bg-blue-50':
                                        form.delivery === 'cod',
                                }"
                            >
                                <div class="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        v-model="form.delivery"
                                        class="mr-3 h-4 w-4 text-blue-600"
                                    />
                                    <div class="flex items-center">
                                        <img
                                            :src="cod"
                                            alt="Cash on Delivery"
                                            class="h-8 mr-2"
                                        />
                                        <span class="font-medium"
                                            >Cash on Delivery (COD)</span
                                        >
                                    </div>
                                </div>
                                <div
                                    v-if="form.delivery === 'cod'"
                                    class="mt-2 pl-7 text-sm text-gray-600"
                                >
                                    Pay when you receive your order.
                                </div>
                            </label>

                            <!-- bKash -->
                            <!-- <label
                                class="block border border-gray-300 rounded-md p-4 cursor-pointer transition hover:border-blue-500"
                                :class="{
                                    'border-blue-500 bg-blue-50':
                                        form.delivery === 'bkash',
                                }"
                            >
                                <div class="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bkash"
                                        v-model="form.delivery"
                                        class="mr-3 h-4 w-4 text-blue-600"
                                    />
                                    <div class="flex items-center">
                                        <img
                                            :src="bKash"
                                            alt="bKash"
                                            class="h-8 mr-2"
                                        />
                                        <span class="font-medium">bKash</span>
                                    </div>
                                </div>
                                <div
                                    v-if="form.delivery === 'bkash'"
                                    class="mt-2 pl-7 text-sm text-gray-600"
                                >
                                    Pay using bKash mobile payment service.
                                </div>
                            </label> -->
                        </div>
                    </div>
                </div>

                <!-- <pre>{{ cartItems }}</pre> -->

                <!-- Right Column - Order Summary -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-6">Your order</h2>

                    <!-- Products -->
                    <div class="divide-y divide-gray-200 mb-6">
                        <!-- Cart Items -->
                        <div
                            v-if="cartItems.length > 0"
                            v-for="item in cartItems"
                            :key="item.id"
                            class="py-4"
                        >
                            <div class="flex items-start flex-col sm:flex-row">
                                <div
                                    class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4"
                                >
                                    <img
                                        :src="item.product.featured_image"
                                        :alt="item.product.product_name"
                                        class="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div class="flex-grow">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3
                                                class="text-sm font-medium text-gray-900"
                                            >
                                                {{ item.product.product_name }}
                                            </h3>
                                            <p
                                                class="mt-1 text-xs text-gray-500"
                                            >
                                                <span
                                                    v-for="(
                                                        attr, index
                                                    ) in item.attributes"
                                                    :key="attr.product_attr_id"
                                                >
                                                    {{ attr.attribute_name }}:
                                                    {{ attr.attribute_option }}
                                                    {{
                                                        attr.quantity > 1
                                                            ? `(${attr.quantity})`
                                                            : ""
                                                    }}
                                                    <span
                                                        v-if="
                                                            index <
                                                            item.attributes
                                                                .length -
                                                                1
                                                        "
                                                        >,
                                                    </span>
                                                </span>
                                            </p>
                                            <p
                                                v-if="
                                                    item.discount_value &&
                                                    parseFloat(
                                                        item.discount_value
                                                    ) > 0
                                                "
                                                class="mt-1 text-xs text-theme"
                                            >
                                                Campaign Discount:
                                                {{
                                                    item.discount_type ===
                                                    "percentage"
                                                        ? Math.floor(
                                                              item.discount_value
                                                          ) + "%"
                                                        : cartStore.currencysymbol +
                                                          Math.floor(
                                                              item.discount_value
                                                          )
                                                }}
                                                OFF
                                            </p>
                                            <div class="mt-1 flex items-center">
                                                <div
                                                    class="flex items-center border border-gray-300 rounded-full"
                                                >
                                                    <button
                                                        @click="
                                                            syncCartDecrement(
                                                                item.id,
                                                                item.product_id,
                                                                item.quantity
                                                            )
                                                        "
                                                        class="px-3 py-1 hover:bg-gray-100"
                                                    >
                                                        <svg
                                                            class="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M20 12H4"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                    <span
                                                        class="w-10 text-center border-none focus:ring-0 p-0"
                                                        >{{
                                                            item.quantity
                                                        }}</span
                                                    >
                                                    <button
                                                        @click="
                                                            syncCartIncrement(
                                                                item.id,
                                                                item.product_id
                                                            )
                                                        "
                                                        class="px-3 py-1 hover:bg-gray-100"
                                                    >
                                                        <svg
                                                            class="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p
                                            class="text-sm font-bold text-gray-900 flex items-center"
                                        >
                                            <span>{{ cartStore.currencysymbol }}</span>
                                            <span>
                                                {{
                                                    parseFloat(
                                                        item.final_price.replace(
                                                            /,/g,
                                                            ""
                                                        )
                                                    ).toLocaleString("en-US")
                                                }}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Apply Coupon (Moved here and always visible) -->
                    <div class="mb-6 border-t border-gray-200 pt-4">
                        <div
                            class="flex flex-wrap items-center justify-between"
                        >
                            <input
                                v-model="couponCode"
                                type="text"
                                placeholder="Discount code or gift card"
                                class="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                            <button
                                @click="applyCoupon"
                                class="px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-r-md hover:bg-gray-300 transition"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="space-y-4 py-4 border-t border-gray-200">
                        <div class="flex justify-between text-sm font-bold">
                            <span>Subtotal</span>
                            <span>{{ cartStore.currencysymbol }}{{ subtotal.toLocaleString("en-US") }}</span>
                        </div>

                        <div class="flex justify-between text-sm font-bold">
                            <span>Coupon Discount</span>
                            <span
                                >-{{ cartStore.currencysymbol }}{{
                                    Math.round(form.discount).toLocaleString(
                                        "en-US"
                                    )
                                }}</span
                            >
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2 text-sm font-bold"
                                >Shipping</label
                            >
                            <div class="space-y-2">
                                <div
                                    class="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md transition"
                                    :class="{
                                        ' bg-blue-50':
                                            form.delivery_area === 'inside',
                                        'border-red-500': errors.delivery_area,
                                    }"
                                >
                                    <input
                                        type="radio"
                                        v-model="form.delivery_area"
                                        @change="updateDeliveryCharge"
                                        value="inside"
                                        id="inside"
                                        name="delivery_area"
                                        class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label
                                        for="inside"
                                        checked
                                        class="ml-2 text-sm text-gray-700 w-full"
                                        >ঢাকার মধ্যে
                                        {{ cartStore.currencysymbol }}{{
                                            Number(
                                                homeStore.siteinfos?.[0]
                                                    ?.shipping_charge_inside_dhaka
                                            ).toLocaleString("en-US")
                                        }}
                                        </label
                                    >
                                </div>
                                <!-- <div
                                    class="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md transition"
                                    :class="{
                                        'border-blue-500 bg-blue-50':
                                            form.delivery_area === 'nearby',
                                        'border-red-500': errors.delivery_area,
                                    }"
                                >
                                    <input
                                        type="radio"
                                        v-model="form.delivery_area"
                                        @change="updateDeliveryCharge"
                                        value="nearby"
                                        id="nearby"
                                        name="delivery_area"
                                        class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label
                                        for="nearby"
                                        class="ml-2 text-sm text-gray-700 w-full"
                                        >ঢাকার পার্শবর্তী এলাকায় ({{ cartStore.currencysymbol }}100)</label
                                    >
                                </div> -->
                                <div
                                    class="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md transition"
                                    :class="{
                                        'border-blue-500 bg-blue-50':
                                            form.delivery_area === 'outside',
                                        'border-red-500': errors.delivery_area,
                                    }"
                                >
                                    <input
                                        type="radio"
                                        v-model="form.delivery_area"
                                        @change="updateDeliveryCharge"
                                        value="outside"
                                        id="outside"
                                        name="delivery_area"
                                        class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label
                                        for="outside"
                                        class="ml-2 text-sm text-gray-700 w-full"
                                        >ঢাকার বাইরে
                                        {{ cartStore.currencysymbol }}{{
                                            Number(
                                                homeStore.siteinfos?.[0]
                                                    ?.shipping_charge_outside_dhaka
                                            ).toLocaleString("en-US")
                                        }}
                                        </label
                                    >
                                </div>
                            </div>
                            <p
                                v-if="errors.delivery_area"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.delivery_area }}
                            </p>
                        </div>
                        <div
                            v-if="siteinfos?.attention_notice"
                            class="adisonal_note"
                        >
                            <b class="bg-yellow-400 text-sm">{{
                                siteinfos?.attention_notice
                            }}</b>
                        </div>
                        <div
                            class="flex justify-between text-base font-bold pt-4 border-t border-gray-200"
                        >
                            <span>Total</span>
                            <span
                                >{{ cartStore.currencysymbol }}{{
                                    Math.round(total).toLocaleString("en-US")
                                }}</span
                            >
                        </div>
                    </div>

                    <!-- Complete Order Button (Desktop) -->
                    <div class="mt-6">
                        <button
                            @click="placeOrder"
                            class="w-full py-4 bg-theme text-white font-medium rounded-md hover:bg-secondary transition"
                        >
                            Place order
                        </button>
                    </div>

                    <!-- Payment Security Notice -->
                    <p class="text-xs text-gray-500 mt-4 text-center">
                        All transactions are secure and encrypted.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom focus styles */
input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
}

/* Custom checkbox and radio styles */
input[type="checkbox"],
input[type="radio"] {
    accent-color: #3b82f6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .checkout-container {
        padding: 1rem;
    }
}
</style>
