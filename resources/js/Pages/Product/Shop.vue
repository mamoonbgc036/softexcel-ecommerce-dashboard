
<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { ref, onMounted, inject, onBeforeUnmount, computed, reactive, watch } from "vue";
import { Link, usePage, Head } from "@inertiajs/vue3";
import { ChevronDown, LayoutGridIcon, SlidersHorizontal } from "lucide-vue-next";
import ProductCard from "@/components/Product/ProductCard.vue";
import { useHomeStore } from '@/Store/homeStore';
import Preloader from "../../components/Preloader/Preloader.vue";
import { useCartStore } from "@/Store/cartStore";

// Use the store
const homeStore = useHomeStore();
const cartStore = useCartStore();
const page = usePage();

// Get URL parameters on initial load
const getInitialUrlParams = () => {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  return {
    category_slug: params.get('category') || null,
    subcategory_slug: params.get('subcategory') || null,
    name: params.get('search') || "",
    min_price: parseInt(params.get('min_price') || 0),
    max_price: parseInt(params.get('max_price')) || null,
    sort: params.get('sort') || "",
    attributes: parseAttributesFromUrl(params)
  };
};

// Parse attributes from URL
const parseAttributesFromUrl = (params) => {
  const attributes = {};
  for (const [key, value] of params.entries()) {
    if (key.startsWith('attr_')) {
      const attrName = key.replace('attr_', '');
      attributes[attrName] = value.split(',');
    }
  }
  return attributes;
};

const props = defineProps({
  initialCategorySlug: { type: [String, Number, null], default: null },
  initialSubCategorySlug: { type: [String, Number, null], default: null },
});

const products = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);
const showLoadMore = ref(false);
const isLoadingMore = ref(false);

const $axios = inject("$axios");

// Calculate dynamic max price
const allProducts = computed(() => homeStore.products);
const dynamicMaxPrice = computed(() => {
  if (!allProducts.value || allProducts.value.length === 0) return 500000000;
  return Math.ceil(Math.max(...allProducts.value.map(p => parseFloat(p.price))));
});

// Constants
const min_price = 0;
const min_gap = 100;

// Initialize filters
const urlParams = getInitialUrlParams();
const filters = reactive({
  category_slug: urlParams.category_slug || props.initialCategorySlug || null,
  subcategory_slug: urlParams.subcategory_slug || props.initialSubCategorySlug || null,
  name: urlParams.name || "",
  min_price: urlParams.min_price || 0,
  max_price: urlParams.max_price || dynamicMaxPrice.value,
  attributes: urlParams.attributes || {},
  sort: urlParams.sort || "",
  page: 1,
});

const old_min_price = ref(filters.min_price);
const old_max_price = ref(filters.max_price);

// Update URL
const updateUrl = () => {
  const params = new URLSearchParams();
  if (filters.category_slug) params.set('category', filters.category_slug);
  if (filters.subcategory_slug) params.set('subcategory', filters.subcategory_slug);
  if (filters.name) params.set('search', filters.name);
  if (filters.min_price > min_price) params.set('min_price', filters.min_price);
  if (filters.max_price < dynamicMaxPrice.value) params.set('max_price', filters.max_price);
  if (filters.sort) params.set('sort', filters.sort);

  Object.entries(filters.attributes).forEach(([attrName, values]) => {
    if (values.length > 0) {
      params.set(`attr_${attrName}`, values.join(','));
    }
  });

  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', url);
};

const updateFilters = () => {
  if (filters.max_price - filters.min_price < min_gap) {
    if (filters.min_price === old_min_price.value) {
      filters.min_price = Math.max(min_price, filters.max_price - min_gap);
    } else {
      filters.max_price = Math.min(dynamicMaxPrice.value, filters.min_price + min_gap);
    }
  }

  old_min_price.value = filters.min_price;
  old_max_price.value = filters.max_price;

  filters.page = 1;
  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;

  updateUrl();
  fetchData();
};

const fetchData = async (loadMore = false) => {
  if (!hasMore.value || (isLoading.value && !loadMore)) return;

  try {
    if (loadMore) {
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
    }
    const response = await $axios.get("/product-filtter", { params: filters });
    if (response.data.data.length > 0) {
      if (loadMore) {
        products.value = [...products.value, ...response.data.data];
      } else {
        products.value = response.data.data;
      }
      filters.page += 1;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.offsetHeight;
  const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
  if (scrollPercentage >= 0.8) {
    showLoadMore.value = true;
  }
};

const loadMore = () => {
  if (!isLoadingMore.value && hasMore.value) {
    fetchData(true);
  }
};

const handlePopState = () => {
  const urlParams = getInitialUrlParams();
  filters.category_slug = urlParams.category_slug;
  filters.subcategory_slug = urlParams.subcategory_slug;
  filters.name = urlParams.name;
  filters.min_price = urlParams.min_price;
  filters.max_price = urlParams.max_price || dynamicMaxPrice.value;
  filters.attributes = urlParams.attributes;
  filters.sort = urlParams.sort;
  filters.page = 1;

  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;
  fetchData();
};

const isMobile = ref(false);
const showSidebar = ref(false);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024;
  // Show sidebar by default on desktop
  showSidebar.value = window.innerWidth > 1024;
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('resize', updateIsMobile);
  homeStore.fetchData();
  fetchData();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('popstate', handlePopState);
  window.removeEventListener('resize', updateIsMobile);
  document.body.classList.remove('overflow-hidden');
  document.body.style.paddingRight = '';
});

const uniqueCategories = computed(() => {
  const categoriesMap = new Map();
  allProducts.value.forEach((product) => {
    const category = product.category;
    const subcategory = product.subcategory;
    if (category && !categoriesMap.has(category.id)) {
      categoriesMap.set(category.id, {
        id: category.id,
        slug: category.slug,
        name: category.name,
        subcategories: new Map(),
      });
    }
    if (subcategory) {
      const cat = categoriesMap.get(category.id);
      cat.subcategories.set(subcategory.id, {
        id: subcategory.id,
        slug: subcategory.slug,
        name: subcategory.name,
      });
    }
  });
  return Array.from(categoriesMap.values()).map(cat => ({
    ...cat,
    subcategories: Array.from(cat.subcategories.values()),
    expanded: ref(false),
  }));
});

const attributes = computed(() => {
  const attributeMap = new Map();
  if (!allProducts.value) return [];
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
    filters.attributes[attributeName] = filters.attributes[attributeName].filter(val => val !== value);
  }
  filters.page = 1;
  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;
  updateUrl();
  fetchData();
};

const handleCategoryClick = (category) => {
  filters.category_slug = category.slug;
  filters.subcategory_slug = null;
  filters.page = 1;
  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;
  updateUrl();
  fetchData();
};

const handleSubcategoryClick = (subcategory) => {
  filters.subcategory_slug = subcategory.slug;
  filters.category_slug = null;
  filters.page = 1;
  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;
  updateUrl();
  fetchData();
};

const updateSort = () => {
  filters.page = 1;
  products.value = [];
  hasMore.value = true;
  showLoadMore.value = false;
  updateUrl();
  fetchData();
};

const viewMode = ref("grid");

const toggleSidebar = () => {
  if (isMobile.value) {
    if (!showSidebar.value) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.classList.add('overflow-hidden');
    }
    showSidebar.value = !showSidebar.value;
    if (!showSidebar.value) {
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        document.body.style.paddingRight = '';
      }, 300);
    }
  }
};

const toggleCategory = (category) => {
  category.expanded = !category.expanded;
};

const isAttributeSelected = (attributeName, value) => {
  return filters.attributes[attributeName]?.includes(value) || false;
};

watch(dynamicMaxPrice, (newMaxPrice) => {
  if (filters.max_price === 5000 || filters.max_price > newMaxPrice) {
    filters.max_price = newMaxPrice;
    updateFilters();
  }
});
</script>

<template>
  <Head>
    <title>Shop</title>
  </Head>
  <AppLayout>
    <div class="product_details">
      <div class="container">
        <div class="min-h-screen py-8">
          <nav class="flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-5">
            <Link href="/" class="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span class="text-gray-900">shop</span>
          </nav>

          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Overlay for mobile/tablet -->
            <div
              v-if="showSidebar && isMobile"
              class="fixed inset-0 bg-black bg-opacity-50 z-50"
              @click="toggleSidebar"
            ></div>

            <!-- Sidebar -->
            <div
              class="filter-sidebar w-full lg:w-[330px] bg-white overflow-y-auto"
              :class="{
                'fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out transform': isMobile,
                'translate-x-0': showSidebar && isMobile,
                '-translate-x-full': !showSidebar && isMobile,
                'static': !isMobile,
              }"
            >
              <div class="p-4 flex justify-between items-center border-b" v-if="isMobile">
                <h2 class="text-lg font-semibold">Filters</h2>
                <button @click="toggleSidebar" class="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div class="w-full filter-item">
                <h3 class="text-gray-800 font-medium mb-8">FILTER BY PRICE</h3>
                <div class="relative w-full mt-2">
                  <div class="absolute w-full h-1 bg-gray-200"></div>
                  <div
                    class="absolute h-1 bg-theme"
                    :style="{
                      left: `${((filters.min_price - min_price) / (dynamicMaxPrice - min_price)) * 100}%`,
                      right: `${100 - ((filters.max_price - min_price) / (dynamicMaxPrice - min_price)) * 100}%`,
                    }"
                  ></div>
                  <input
                    type="range"
                    v-model="filters.min_price"
                    :min="min_price"
                    :max="dynamicMaxPrice"
                    class="absolute w-full appearance-none bg-transparent pointer-events-none"
                    @change="updateFilters"
                  />
                  <input
                    type="range"
                    v-model="filters.max_price"
                    :min="min_price"
                    :max="dynamicMaxPrice"
                    class="absolute w-full appearance-none bg-transparent pointer-events-none"
                    @change="updateFilters"
                  />
                </div>
                <div class="mt-12 flex items-center text-sm text-gray-600">
                  <span>Price: {{ cartStore.currencysymbol }}{{ filters.min_price }} — {{ cartStore.currencysymbol }}{{ filters.max_price }}</span>
                </div>
              </div>

              <div class="mt-12 w-full filter-item">
                <h3 class="text-gray-800 font-medium mb-8">PRODUCT CATEGORIES</h3>
                <ul class="space-y-3">
                  <li v-for="category in uniqueCategories" :key="category.id">
                    <div class="flex items-center justify-between group">
                      <span
                        @click.prevent="handleCategoryClick(category)"
                        class="flex-grow text-gray-600 cursor-pointer hover:text-gray-800 py-1 transition-colors"
                        :class="{ 'text-theme font-medium': filters.category_slug === category.slug }"
                      >
                        {{ category.name }}
                      </span>
                      <button
                        v-if="category.subcategories.length"
                        @click="toggleCategory(category)"
                        class="p-2 rounded-full transition-colors hover:bg-gray-200 text-gray-700 hover:text-gray-600 focus:outline-none"
                      >
                        <ChevronDown
                          class="w-4 h-4 transition-transform duration-200"
                          :class="{ 'rotate-180': category.expanded }"
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
                        v-if="category.expanded && category.subcategories.length"
                        class="pl-4 mt-2 space-y-2"
                      >
                        <li v-for="sub in category.subcategories" :key="sub.id">
                          <span
                            @click.prevent="handleSubcategoryClick(sub)"
                            class="text-gray-500 cursor-pointer hover:text-gray-700 block py-1"
                            :class="{ 'text-theme font-medium': filters.subcategory_slug === sub.slug }"
                          >
                            {{ sub.name }}
                          </span>
                        </li>
                      </ul>
                    </Transition>
                  </li>
                </ul>
              </div>

              <div class="w-full filter-item !border-b-0">
                <h3 class="text-gray-800 font-medium mb-8">PRODUCT ATTRIBUTES</h3>
                <div v-if="attributes.length === 0">No attributes available.</div>
                <div v-else>
                  <div v-for="(attribute, index) in attributes" :key="index" class="mb-4">
                    <h3 class="text-gray-800 font-medium mb-3">{{ attribute.name }}</h3>
                    <ul>
                      <li v-for="(value, i) in attribute.values" :key="i" class="py-1">
                        <label
                          class="cursor-pointer text-gray-500 hover:text-gray-700 block"
                          :class="{ 'text-theme font-medium': isAttributeSelected(attribute.name, value) }"
                        >
                          <input
                            class="mr-2"
                            type="checkbox"
                            :value="value"
                            :name="attribute.name"
                            :checked="isAttributeSelected(attribute.name, value)"
                            @change="updateAttributeFilter(attribute.name, value, $event.target.checked)"
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
              <div class="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white">
                <div class="flex items-center gap-4">
                  <button
                    v-if="isMobile"
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
                      :class="{ 'text-theme': viewMode === 'grid' }"
                      class="p-2 hover:text-theme"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 0H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM5 9H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM5 18H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM23 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      @click="viewMode = 'list'"
                      :class="{ 'text-theme': viewMode === 'list' }"
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
                      <option value="low_to_high">Low to High</option>
                      <option value="high_to_low">High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Active Filters Display -->
              <div
                v-if="
                  filters.category_slug ||
                  filters.subcategory_slug ||
                  Object.keys(filters.attributes).some(key => filters.attributes[key].length > 0) ||
                  filters.min_price > min_price ||
                  filters.max_price < dynamicMaxPrice
                "
                class="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-md"
              >
                <div class="text-sm text-gray-600 mr-2">Active Filters:</div>
                <div
                  v-if="filters.category_slug"
                  class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                >
                  Category: {{ uniqueCategories.find(c => c.slug === filters.category_slug)?.name }}
                  <button
                    @click="filters.category_slug = null; updateFilters()"
                    class="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div
                  v-if="filters.subcategory_slug"
                  class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                >
                  Subcategory: {{
                    uniqueCategories
                      .flatMap(c => c.subcategories)
                      .find(s => s.slug === filters.subcategory_slug)?.name
                  }}
                  <button
                    @click="filters.subcategory_slug = null; updateFilters()"
                    class="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div
                  v-if="filters.min_price > min_price || filters.max_price < dynamicMaxPrice"
                  class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                >
                  Price: {{ filters.min_price }}{{ cartStore.currencysymbol }} — {{ filters.max_price }}{{ cartStore.currencysymbol }}
                  <button
                    @click="filters.min_price = min_price; filters.max_price = dynamicMaxPrice; updateFilters()"
                    class="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <template v-for="(values, attrName) in filters.attributes" :key="attrName">
                  <div
                    v-if="values.length > 0"
                    class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                  >
                    {{ attrName }}: {{ values.join(', ') }}
                    <button
                      @click="filters.attributes[attrName] = []; updateFilters()"
                      class="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                </template>
                <button
                  @click="
                    filters.category_slug = null;
                    filters.subcategory_slug = null;
                    filters.min_price = min_price;
                    filters.max_price = dynamicMaxPrice;
                    filters.attributes = {};
                    filters.sort = '';
                    updateFilters();
                  "
                  class="px-2 py-1 bg-theme text-white rounded-md text-xs"
                >
                  Clear All
                </button>
              </div>

              <div v-if="isLoading" class="flex justify-center items-center h-64">
                <Preloader />
              </div>

              <div
                v-else
                :class="{
                  'grid gap-4': true,
                  'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': viewMode === 'grid',
                  'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3': viewMode === 'list',
                }"
              >
                <template v-for="product in products" :key="product.id">
                  <ProductCard :product="product" />
                </template>
              </div>

              <div v-if="products.length === 0 && !isLoading" class="flex justify-center items-center h-64">
                <div class="text-center">
                  <p class="text-gray-500 mb-4">No products found matching your filters.</p>
                  <button
                    @click="
                      filters.category_slug = null;
                      filters.subcategory_slug = null;
                      filters.min_price = min_price;
                      filters.max_price = dynamicMaxPrice;
                      filters.attributes = {};
                      filters.sort = '';
                      updateFilters();
                    "
                    class="px-4 py-2 bg-theme text-white rounded-md"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div v-if="products.length > 9" class="mt-8 flex justify-center">
                <button
                  @click="loadMore"
                  class="px-4 py-2 bg-theme text-white rounded-md flex items-center"
                  :disabled="isLoadingMore || !hasMore"
                >
                  <span v-if="isLoadingMore" class="mr-2">
                    <svg
                      class="animate-spin h-5 w-5 text-white"
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
                  </span>
                  {{ isLoadingMore ? 'Loading...' : 'Load More' }}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
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
  @apply bg-white py-4 border-b px-4;
}

.filter-sidebar {
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  will-change: transform;
  backface-visibility: hidden;
}

/* Mobile/Tablet: Slide-in sidebar */
@media (max-width: 1024px) {
  .filter-sidebar {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    overflow-y: auto;
    padding-bottom: 80px;
  }
}

/* Desktop: Static sidebar */
@media (min-width: 1025px) {
  .filter-sidebar {
    display: block;
    transition: none;
    transform: none;
    position: relative;
    z-index: auto;
  }
}

/* Prevent body scrolling when sidebar is open on mobile */
body.overflow-hidden {
  overflow: hidden;
  width: 100%;
  position: fixed;
  height: 100%;
}

/* Overlay transition */
.fixed.inset-0.bg-black.bg-opacity-50 {
  transition: opacity 0.3s ease;
}
</style>