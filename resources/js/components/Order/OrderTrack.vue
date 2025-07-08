<template>
    <div class="container py-12">
        <div class="content">
            <h2 class="text-center text-lg">Track Your Order</h2>
        </div>

        <div class="max-w-md mx-auto mt-10">
            <label
                class="mx-auto relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-1 px-2 rounded-md gap-2 shadow-lg focus-within:border-gray-300"
                for="search-bar"
            >
                <input
                    id="search-bar"
                    placeholder="Invoice Number"
                    v-model="OrderTrackingKey"
                    class="px-4 py-2 w-full rounded-md flex-1 outline-none bg-white"
                    required
                />
                <button
                    @click.prevent="orderTracking"
                    :disabled="!OrderTrackingKey || isLoading"
                    class="w-full md:w-auto px-6 py-2 bg-theme broder text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-md transition-all disabled:opacity-70"
                >
                    <div class="relative">
                        <!-- Loading animation -->
                        <div
                            :class="isLoading ? 'opacity-100' : 'opacity-0'"
                            class="flex items-center justify-center h-3 w-3 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"
                        >
                            <svg
                                class="animate-spin w-full h-full"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>

                        <div
                            :class="isLoading ? 'opacity-0' : 'opacity-100'"
                            class="flex items-center transition-all"
                        >
                            <span
                                class="text-sm font-semibold whitespace-nowrap truncate mx-auto"
                            >
                                Track
                            </span>
                        </div>
                    </div>
                </button>
            </label>
        </div>

        <!-- Invoice Style Display -->
        <div class="max-w-4xl mx-auto mt-10" v-if="orderTrackProduct?.data?.length > 0">
            <!-- Print Button -->
            <div class="flex justify-end mb-4 print:hidden no-print">
                <button 
                    @click="printInvoice"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    Print Invoice
                </button>
            </div>

            <!-- SINGLE INVOICE CONTAINER - Only first order will print -->
            <div class="print-content">
                <div v-for="(order, index) in orderTrackProduct.data" :key="order.id" :class="index > 0 ? 'no-print' : ''" class="invoice-page">
                    <!-- Invoice Header Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="bg-white p-4 rounded-lg shadow-sm border">
                            <div class="text-center">
                                <p class="text-sm text-gray-600 mb-1">Order Number</p>
                                <p class="text-lg font-semibold">{{ order.invoice_number || order.id }}</p>
                            </div>
                        </div>
                        
                        <div class="bg-white p-4 rounded-lg shadow-sm border">
                            <div class="text-center">
                                <p class="text-sm text-gray-600 mb-1">Order Date</p>
                                <p class="text-lg font-semibold">{{ formatDate(order.created_at) }}</p>
                            </div>
                        </div>
                        
                        <div class="bg-white p-4 rounded-lg shadow-sm border">
                            <div class="text-center">
                                <p class="text-sm text-gray-600 mb-1">Order Total</p>
                                <p class="text-lg font-semibold">৳{{ order.total_price }}</p>
                            </div>
                        </div>
                        
                        <div class="bg-white p-4 rounded-lg shadow-sm border">
                            <div class="text-center">
                                <p class="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p class="text-lg font-semibold capitalize">{{ order.payment_method }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Details Card -->
                    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-6 text-gray-800">Order Details</h3>
                            
                            <!-- Order Status -->
                            <div class="mb-6 flex flex-wrap gap-4">
                                <div class="flex items-center">
                                    <span class="text-sm text-gray-600 mr-2">Order Status:</span>
                                    <span 
                                        :class="getStatusClass(order.order_status)"
                                        class="px-3 py-1 rounded-full text-sm font-medium capitalize"
                                    >
                                        {{ order.order_status }}
                                    </span>
                                </div>
                                <div class="flex items-center" v-if="order.couriar_status">
                                    <span class="text-sm text-gray-600 mr-2">Courier Status:</span>
                                    <span 
                                        :class="getStatusClass(order.couriar_status)"
                                        class="px-3 py-1 rounded-full text-sm font-medium capitalize"
                                    >
                                        {{ order.couriar_status }}
                                    </span>
                                </div>
                            </div>

                            <!-- Customer Information -->
                            <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                                <h4 class="font-medium text-gray-800 mb-2">Customer Information</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span class="text-gray-600">Name:</span>
                                        <span class="ml-2 font-medium">{{ order.customer_name }}</span>
                                    </div>
                                    <div class="md:col-span-2">
                                        <span class="text-gray-600">Phone:</span>
                                        <span class="ml-2 font-medium">{{ order.phone_number }}</span>
                                    </div>
                                    <div class="md:col-span-2">
                                        <span class="text-gray-600">Address:</span>
                                        <span class="ml-2 font-medium">{{ order.address }}</span>
                                    </div>
                                    <div v-if="order.email">
                                        <span class="text-gray-600">Email:</span>
                                        <span class="ml-2 font-medium">{{ order.email }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Products Header -->
                            <div class="flex justify-between items-center mb-4 pb-2 border-b">
                                <h4 class="font-medium text-gray-800">Product</h4>
                                <h4 class="font-medium text-gray-800">Total</h4>
                            </div>

                            <!-- Products List -->
                            <div class="space-y-4 mb-6">
                                <div 
                                    v-for="item in order.items" 
                                    :key="item.id"
                                    class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                                >
                                    <div class="flex items-center space-x-4 flex-1">
                                        <img
                                            :src="item.product_info?.featured_image"
                                            :alt="item.product_info?.product_name"
                                            class="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <div class="flex-1">
                                            <h5 class="font-medium text-gray-800 mb-1">
                                                {{ item.product_info?.product_name }}
                                            </h5>
                                            <div class="text-sm text-gray-600">
                                                <span>Quantity: {{ item.quantity }}</span>
                                                <span class="mx-2">×</span>
                                                <span>৳{{ item.price }}</span>
                                            </div>
                                            <!-- Product Options -->
                                            <div v-if="item.option && item.option.length > 0" class="mt-1">
                                                <div 
                                                    v-for="option in item.option" 
                                                    :key="option.id"
                                                    class="text-xs text-gray-500"
                                                >
                                                    {{ option.attribute_option?.attribute?.name }}: 
                                                    {{ option.attribute_option?.name }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-gray-800">
                                            ৳{{ item.quantity * item.price }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Order Summary -->
                            <div class="border-t pt-4">
                                <div class="space-y-2 mb-4">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Subtotal:</span>
                                        <span class="font-medium">৳{{ order.total_price - order?.extra_charge }}</span>
                                    </div>
                                    
                                    <div class="flex justify-between text-sm" v-if="order.additional_discount > 0">
                                        <span class="text-gray-600">Additional Discount:</span>
                                        <span class="font-medium text-green-600">-৳{{ order.additional_discount }}</span>
                                    </div>
                                    
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Shipping:</span>
                                        <span class="font-medium">৳{{ order.delivery_charge || 0 }}</span>
                                    </div>
                                    
                                    <div class="flex justify-between text-sm" v-if="order.extra_charge > 0">
                                        <span class="text-gray-600">Extra Charge:</span>
                                        <span class="font-medium">৳{{ order.extra_charge }}</span>
                                    </div>
                                </div>
                                
                                <div class="flex justify-between text-sm mb-4">
                                    <span class="text-gray-600">Payment Method:</span>
                                    <span class="font-medium capitalize">{{ order.payment_method }}</span>
                                </div>

                                <div class="flex justify-between text-lg font-semibold pt-2 border-t">
                                    <span>Order Total:</span>
                                    <span>৳{{ order.total_price }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-10" v-if="isOrderTrackDataFetched && orderTrackProduct?.data?.length === 0">
            <div class="bg-white p-8 rounded-lg shadow-sm border max-w-md mx-auto">
                <p class="text-gray-600">No Order Found</p>
                <p class="text-sm text-gray-500 mt-2">Please check your invoice number and try again.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { toast } from "@steveyuowo/vue-hot-toast";

const isOrderTrackDataFetched = ref(false);
const orderTrackProduct = ref([]);
const isLoading = ref(false);

const globalLoadingState = inject("globalLoadingState");
const $axios = inject("$axios");
const OrderTrackingKey = ref("");

// Order Tracking
const orderTracking = async () => {
    isOrderTrackDataFetched.value = false;
    isLoading.value = true;
    try {
        const response = await $axios.post("/orders/filter", {
            key: OrderTrackingKey.value,
        });
        orderTrackProduct.value = response.data;
        console.log("ordertrack", orderTrackProduct.value);
    } catch (error) {
        console.error("Error Order Tracking:", error);

        orderTrackProduct.value = { data: [] };

        // Check for the specific error message
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            toast.error(error.response.data.message);
        } else if (error.message) {
            toast.error(error.message);
        } else {
            toast.error(
                "An error occurred while tracking the order. Please try again later."
            );
        }
    } finally {
        isOrderTrackDataFetched.value = true;
        isLoading.value = false;
    }
};

// FIXED Print Invoice Function - SINGLE PAGE ONLY
const printInvoice = () => {
    // Remove existing print styles
    const existingPrintStyles = document.getElementById('print-styles');
    if (existingPrintStyles) {
        existingPrintStyles.remove();
    }
    
    const printStyles = document.createElement('style');
printStyles.id = 'print-styles';
printStyles.innerHTML = `
    @media print {
        @page {
            margin: 0.4in;
            size: A4;
            orphans: 2; /* Prevents widows/orphans */
            widows: 2;
        }
        
        /* Hide everything first */
        * {
            visibility: hidden;
        }
        
        /* Show only print content */
        .print-content,
        .print-content * {
            visibility: visible;
        }
        
        /* Hide non-printable elements */
        .no-print,
        .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
        }
        
        /* Position print content at top */
        .print-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important; /* Ensure content fits */
        }
        
        /* Prevent page breaks */
        .invoice-page {
            width: 100% !important;
            margin: 0 !important;
            padding: 8px !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
            height: auto !important; /* Ensure content fits */
        }
        
        /* Reset body and html */
        html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
        }
        
        /* Ensure content fits within one page */
        .container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 0 !important; /* Prevent extra height */
        }
        
        /* Adjust grid layout */
        .grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
            margin-bottom: 8px !important;
            min-height: 0 !important; /* Prevent extra height */
        }
        
        /* Card and content adjustments */
        .bg-white {
            background-color: white !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            padding: 6px !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            min-height: 0 !important; /* Prevent extra height */
        }
        
        /* Remove shadows */
        .shadow-sm, .shadow-lg {
            box-shadow: none !important;
        }
        
        /* Text sizing */
        .text-sm { font-size: 10px !important; line-height: 1.2 !important; }
        .text-lg { font-size: 12px !important; line-height: 1.3 !important; }
        .text-xl { font-size: 14px !important; line-height: 1.4 !important; }
        
        /* Spacing adjustments */
        .mb-6 { margin-bottom: 8px !important; }
        .mb-4 { margin-bottom: 6px !important; }
        .mb-3 { margin-bottom: 4px !important; }
        .p-6 { padding: 8px !important; }
        .p-4 { padding: 6px !important; }
        .p-2 { padding: 4px !important; }
        
        /* Product images */
        img { max-width: 40px !important; max-height: 40px !important; width: 40px !important; height: 40px !important; object-fit: cover !important; }
        
        /* Status badges */
        .bg-yellow-100 { background-color: #fff7d1 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-blue-100 { background-color: #e1f2ff !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-purple-100 { background-color: #f0e6ff !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-green-100 { background-color: #e6ffe6 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-red-100 { background-color: #ffe6e6 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-gray-100 { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        .bg-gray-50 { background-color: #f8f8f8 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
        
        /* Prevent extra pages */
        * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            min-height: 0 !important; /* Prevent extra height */
        }
    }
`;
document.head.appendChild(printStyles);

setTimeout(() => {
    window.print();
}, 100);
};

// Helper Methods
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

const getStatusClass = (status) => {
    const statusClasses = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800'
    };
    
    return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
</script>