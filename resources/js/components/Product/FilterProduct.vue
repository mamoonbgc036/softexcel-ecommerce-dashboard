<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import {
    ref,
    onMounted,
    inject,
    onBeforeUnmount,
    computed,
    reactive,
    onUnmounted,
} from "vue";
import {
    ChevronDown,
    LayoutGridIcon,
    SlidersHorizontal,
} from "lucide-vue-next";
import ProductCard from "@/components/Product/ProductCard.vue";
import { useHomeStore } from "@/Store/homeStore";

// Use the store
const homeStore = useHomeStore();

const products = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);

const $axios = inject("$axios");

const filters = reactive({
    category_id: null,
    name: "",
    min_price: 0,
    max_price: 5000,
    attributes: {},
    sort: "",
    page: 1,
});

const min_price = 0;
const max_price = 5000;
const min_gap = 100;

const updateFilters = () => {
    if (filters.max_price - filters.min_price < min_gap) {
        if (filters.min_price === old_min_price) {
            filters.min_price = Math.max(
                min_price,
                filters.max_price - min_gap
            );
        } else {
            filters.max_price = Math.min(
                max_price,
                filters.min_price + min_gap
            );
        }
    }

    filters.page = 1;
    products.value = [];
    hasMore.value = true;
    fetchData();
};

const fetchData = async () => {
    if (!hasMore.value || isLoading.value) return;

    try {
        isLoading.value = true;
        const response = await $axios.get("/product-filtter", {
            params: filters,
        });
        if (response.data.data.length > 0) {
            products.value = [...products.value, ...response.data.data];
            filters.page += 1;
        } else {
            hasMore.value = false;
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleScroll = () => {
    const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    if (scrollPercentage >= 0.8 && hasMore.value) {
        fetchData();
    }
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    homeStore.fetchData();
    fetchData();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

const allProducts = computed(() => homeStore.products);

const uniqueCategories = computed(() => {
    const categoriesMap = new Map();
    allProducts.value.forEach((product) => {
        const category = product.category;
        if (category && !categoriesMap.has(category.id)) {
            categoriesMap.set(category.id, {
                id: category.id,
                name: category.name,
            });
        }
    });
    return Array.from(categoriesMap.values());
});

const attributes = computed(() => {
    const attributeMap = new Map();
    if (!allProducts.value) {
        return [];
    }
    allProducts.value.forEach((product) => {
        if (product?.product_attributes) {
            product.product_attributes.forEach((attr) => {
                if (attr?.attribute?.name && attr?.attribute_option?.name) {
                    if (!attributeMap.has(attr.attribute.name)) {
                        attributeMap.set(attr.attribute.name, []);
                    }
                    const currentValues = attributeMap.get(attr.attribute.name);
                    if (!currentValues.includes(attr.attribute_option.name)) {
                        currentValues.push(attr.attribute_option.name);
                    }
                }
            });
        }
    });
    return Array.from(attributeMap.entries()).map(([name, values]) => ({
        name,
        values,
    }));
});

const updateAttributeFilter = (attributeName, value, isChecked) => {
    if (!filters.attributes[attributeName]) {
        filters.attributes[attributeName] = [];
    }
    if (isChecked) {
        filters.attributes[attributeName].push(value);
    } else {
        filters.attributes[attributeName] = filters.attributes[
            attributeName
        ].filter((val) => val !== value);
    }
    filters.page = 1;
    products.value = [];
    hasMore.value = true;
    fetchData();
};

const handleCategoryClick = (category) => {
    filters.category_id = category.id;
    filters.page = 1;
    products.value = [];
    hasMore.value = true;
    fetchData();
};

const updateSort = () => {
    filters.page = 1;
    products.value = [];
    hasMore.value = true;
    fetchData();
};

const viewMode = ref("grid");
const showSidebar = ref(false);
const isMobile = ref(false);

onMounted(() => {
    isMobile.value = window.innerWidth <= 1024;
});

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
    window.addEventListener("resize", updateIsMobile);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateIsMobile);
});

const sidebarClasses = computed(() => {
    return {
        mobile: isMobile.value,
        active: isMobile.value && showSidebar.value,
    };
});

const toggleCategory = (category) => {
    category.expanded = !category.expanded;
};
</script>

<template>
    <!-- <AppLayout> -->
    <div class="product_details">
        <div class="container">
            <div class="min_price-h-screen py-8">
                <nav
                    class="flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-8"
                >
                    <a href="/" class="hover:text-gray-700">Home</a>
                    <span>/</span>
                    <span class="text-gray-900">shop</span>
                </nav>

                <div class="flex flex-col lg:flex-row gap-16">
                    <div
                        v-if="showSidebar"
                        class="fixed inset-0 bg-black bg-opacity-50 z-40"
                        @click="toggleSidebar"
                    ></div>
                    <div
                        class="filter-sidebar w-full lg:w-[280px] hidden lg:block space-y-8 mt-4"
                        :class="sidebarClasses"
                    >
                        <div class="w-full filter-item">
                            <h3 class="text-gray-800 font-bold mb-8 filterbyp">
                                FILTER BY PRICE
                            </h3>
                            <div class="relative w-full mt-2">
                                <div
                                    class="absolute w-full h-1 bg-gray-200"
                                ></div>
                                <div
                                    class="absolute h-1 bg-theme"
                                    :style="{
                                        left: `${
                                            ((filters.min_price - min_price) /
                                                (max_price - min_price)) *
                                            100
                                        }%`,
                                        right: `${
                                            100 -
                                            ((filters.max_price - min_price) /
                                                (max_price - min_price)) *
                                                100
                                        }%`,
                                    }"
                                ></div>
                                <input
                                    type="range"
                                    v-model="filters.min_price"
                                    :min="min_price"
                                    :max="max_price"
                                    class="absolute w-full appearance-none bg-transparent pointer-events-none"
                                    @change="updateFilters"
                                />
                                <input
                                    type="range"
                                    v-model="filters.max_price"
                                    :min="min_price"
                                    :max="max_price"
                                    class="absolute w-full appearance-none bg-transparent pointer-events-none"
                                    @change="updateFilters"
                                />
                            </div>
                            <div
                                class="mt-12 flex items-center text-sm text-gray-600"
                            >
                                <span
                                    >Price: {{ filters.min_price }}{{ cartStore.currencysymbol }} —
                                    {{ filters.max_price }}{{ cartStore.currencysymbol }}</span
                                >
                            </div>
                        </div>

                        <div class="mt-12 w-full filter-item">
                            <h3 class="text-gray-800 font-bold mb-8">
                                PRODUCT CATEGORIES
                            </h3>
                            <ul class="space-y-3">
                                <li
                                    v-for="category in uniqueCategories"
                                    :key="category.name"
                                >
                                    <div
                                        class="flex items-center justify-between group"
                                    >
                                        <span
                                            @click.prevent="
                                                handleCategoryClick(category)
                                            "
                                            class="flex-grow text-gray-600 cursor-pointer hover:text-gray-800 py-1 transition-colors"
                                        >
                                            {{ category.name }}
                                        </span>
                                        <button
                                            v-if="
                                                category.subcategories?.length
                                            "
                                            @click="toggleCategory(category)"
                                            class="p-2 rounded-full transition-colors hover:bg-gray-200 text-gray-700 hover:text-gray-600 focus:outline-none"
                                        >
                                            <ChevronDown
                                                class="w-4 h-4 transition-transform duration-200"
                                                :class="{
                                                    'rotate-180':
                                                        category.expanded,
                                                }"
                                            />
                                        </button>
                                    </div>
                                    <Transition
                                        enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-out"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0"
                                    >
                                        <ul
                                            v-if="
                                                category.expanded &&
                                                category.subcategories?.length
                                            "
                                            class="pl-4 mt-2 space-y-2"
                                        >
                                            <li
                                                v-for="sub in category.subcategories"
                                                :key="sub"
                                            >
                                                <span
                                                    href="#"
                                                    @click.prevent="
                                                        handleSubcategoryClick(
                                                            category,
                                                            sub
                                                        )
                                                    "
                                                    class="text-gray-500 cursor-pointer hover:text-gray-700 block py-1"
                                                >
                                                    {{ sub }}
                                                </span>
                                            </li>
                                        </ul>
                                    </Transition>
                                </li>
                            </ul>
                        </div>

                        <div class="w-full filter-item !border-b-0">
                            <h3 class="text-gray-800 font-medium mb-8">
                                PRODUCT ATTRIBUTES
                            </h3>
                            <div v-if="attributes.length === 0">
                                No attributes available.
                            </div>
                            <div v-else>
                                <div
                                    v-for="(attribute, index) in attributes"
                                    :key="index"
                                    class="mb-4"
                                >
                                    <h3 class="text-gray-800 font-medium mb-3">
                                        {{ attribute.name }}
                                    </h3>
                                    <ul>
                                        <li
                                            v-for="(
                                                value, i
                                            ) in attribute.values"
                                            :key="i"
                                            class="py-1"
                                        >
                                            <label
                                                class="cursor-pointer text-gray-500 hover:text-gray-700 block"
                                            >
                                                <input
                                                    class="mr-2"
                                                    type="checkbox"
                                                    :value="value"
                                                    :name="attribute.name"
                                                    @change="
                                                        updateAttributeFilter(
                                                            attribute.name,
                                                            value,
                                                            $event.target
                                                                .checked
                                                        )
                                                    "
                                                />
                                                {{ value }}
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main class="flex-1">
                        <div
                            class="flex flex-wrap gap-4 items-center lg:justify-end justify-between mb-6 bg-white"
                        >
                            <div class="lg:hidden flex items-center gap-4">
                                <button
                                    class="filter-button flex items-center gap-3 p-2 hover:text-theme"
                                    @click="toggleSidebar"
                                >
                                    <span class="text-base font-medium">
                                        <SlidersHorizontal class="w-6 h-6" />
                                    </span>
                                    <span>Filters</span>
                                </button>
                            </div>

                            <div class="flex items-center gap-4">
                                <div class="gap-2 hidden lg:flex">
                                    <button
                                        @click="viewMode = 'grid'"
                                        :class="{
                                            'text-theme': viewMode === 'grid',
                                        }"
                                        class="p-2 hover:text-theme"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.1"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            x="0"
                                            y="0"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            style="
                                                enable-background: new 0 0 512
                                                    512;
                                            "
                                            xml:space="preserve"
                                            class=""
                                        >
                                            <g>
                                                <path
                                                    d="M5 0H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM5 9H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM5 18H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM23 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
                                                    fill="currentColor"
                                                    opacity="1"
                                                    data-original="currentColor"
                                                    class="grid33"
                                                ></path>
                                            </g>
                                        </svg>
                                    </button>
                                    <button
                                        @click="viewMode = 'list'"
                                        :class="{
                                            'text-theme': viewMode === 'list',
                                        }"
                                        class="p-2 hover:text-theme"
                                    >
                                        <LayoutGridIcon class="h-6 w-6" />
                                    </button>
                                </div>
                                <div>
                                    <select
                                        v-model="filters.sort"
                                        @change="updateSort"
                                        class="p-2 md:w-[200px] w-auto border border-gray-200"
                                    >
                                        <option value="">Default</option>
                                        <option value="low_to_high">
                                            Low to High
                                        </option>
                                        <option value="high_to_low">
                                            High to Low
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div
                            :class="{
                                'grid gap-6': true,
                                'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
                                    viewMode === 'grid',
                                'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3':
                                    viewMode === 'list',
                            }"
                        >
                            <template
                                v-for="product in products"
                                :key="product.id"
                            >
                                <ProductCard :product="product" />
                            </template>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
    <!-- </AppLayout> -->
</template>

<style scoped>
input[type="range"] {
    height: 0;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: auto;
    width: 14px;
    height: 14px;
    border-radius: 0;
    @apply bg-theme;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    -moz-appearance: none;
    pointer-events: auto;
    width: 14px;
    height: 14px;
    border-radius: 0;
    @apply bg-theme;
    cursor: pointer;
    border: none;
}

input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background: transparent;
}

input[type="range"]::-moz-range-track {
    -moz-appearance: none;
    background: transparent;
}

input[type="range"]:nth-child(3) {
    z-index: 2;
}

.filter-item {
    @apply bg-white pb-8 border-b;
}

.filter-sidebar {
    transition: transform 0.3s ease-in-out;
}

.filter-sidebar.mobile {
    transform: translateX(-100%);
    display: block;
    width: 280px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 99;
    padding: 30px 20px;
    overflow-y: scroll;
    margin: 0;
}

.filter-sidebar.mobile.active {
    transform: translateX(0);
}

.filterbyp {
    font-weight: 700 !important;
}
</style>
