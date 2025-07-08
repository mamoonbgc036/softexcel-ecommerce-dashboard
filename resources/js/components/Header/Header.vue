<script setup>
import {
    ref,
    nextTick,
    onMounted,
    onUnmounted,
    inject,
    computed,
    watch,
} from "vue";

import { Link, router } from "@inertiajs/vue3";
import {
    SearchIcon,
    ChevronDown,
    UserRound,
    X,
    ShoppingBag,
    Heart,
    Menu,
    House,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    Phone,
    Mail,
    UsersRound,
} from "lucide-vue-next";
import NavigationMenu from "@/components/Header/NavigationMenu.vue";
import MobileMenu from "@/components/Header/MobileMenu.vue";
import CartSidebar from "@/components/Header/CartSidebar.vue";
import { useAuthStore } from "@/Store/authStore";
import { useCartStore } from "@/Store/cartStore";
import { useHomeStore } from "@/Store/homeStore";
import { useWishlistStore } from "@/Store/wishlistStore";

const cartStore = useCartStore();
const authStore = useAuthStore();
const homeStore = useHomeStore();
const wishlistStore = useWishlistStore();
const $axios = inject("$axios");

const categories = computed(() => homeStore.categories);

// Mobile Menu
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
// Compute site information dynamically
const siteinfos = computed(() => homeStore.siteinfos?.[0] || {});

const storePhone = computed(() => siteinfos.value.store_phone_number || "N/A");

const facebookUrl = computed(() => siteinfos.value.facebook_url || "#");
const instagramUrl = computed(() => siteinfos.value.instagram_url || "#");
const youtubeUrl = computed(() => siteinfos.value.youtube_url || "#");
const tiktokUrl = computed(() => siteinfos.value.tiktok_url || "#");
const xUrl = computed(() => siteinfos.value.x_url || "#");

console.log("hello wor", siteinfos.value);
// Search functionality
const searchQuery = ref("");
const searchInput = ref(null);
const showDropdown = ref(false);
const isLoading = ref(false);
const selectedCategory = ref("All");
const selectedCategorySlug = ref(null);

// Search slide-in state
const isSearchOpen = ref(false);

const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value;
    if (isSearchOpen.value) {
        nextTick(() => {
            document.querySelector(".search-input")?.focus();
        });
    } else {
        // Reset search when closing
        searchQuery.value = "";
        showDropdown.value = false;
    }
};

const isCategoryDropdownOpen = ref(false);

const selectCategory = (name, slug = null) => {
    selectedCategory.value = name;
    selectedCategorySlug.value = slug;
    isCategoryDropdownOpen.value = false;
};

// Add toggle function
const toggleCategoryDropdown = () => {
    isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
};

// Add click outside handler for category dropdown
const handleCategoryClickOutside = (event) => {
    const categoryDropdowns = document.querySelectorAll(".category-dropdown");
    let shouldClose = true;

    categoryDropdowns.forEach((dropdown) => {
        if (dropdown && dropdown.contains(event.target)) {
            shouldClose = false;
        }
    });

    if (shouldClose) {
        isCategoryDropdownOpen.value = false;
    }
};

// Fetch search results from the product-filtter endpoint
const fetchSearchResults = async () => {
    if (!searchQuery.value) return [];

    isLoading.value = true;
    try {
        const params = {
            name: searchQuery.value,
            category_slug:
                selectedCategory.value !== "All"
                    ? selectedCategorySlug.value
                    : null,
            page: 1,
            limit: 5,
        };

        const response = await $axios.get("/product-filtter", { params });
        isLoading.value = false;
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching search results:", error);
        isLoading.value = false;
        return [];
    }
};

// Keep filteredProducts computed property but update to use API
const filteredProducts = ref([]);

const onSearchInputChange = async () => {
    showDropdown.value = searchQuery.value.length > 2;
    if (searchQuery.value.length > 2) {
        filteredProducts.value = await fetchSearchResults();
    } else {
        filteredProducts.value = [];
    }
};

// Handle search submission
const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.value) return;

    // Build the query parameters
    const queryParams = new URLSearchParams();

    if (searchQuery.value) {
        queryParams.append("search", searchQuery.value);
    }

    if (selectedCategory.value !== "All" && selectedCategorySlug.value) {
        queryParams.append("category", selectedCategorySlug.value);
    }

    // Navigate to the shop page with the search parameters
    const url = `/shop?${queryParams.toString()}`;
    router.visit(url);

    // Close the dropdown and search
    showDropdown.value = false;
    isSearchOpen.value = false;
};

// Handle clicks outside the input and dropdown
const handleClickOutside = (event) => {
    if (searchInput.value && !searchInput.value.contains(event.target)) {
        showDropdown.value = false; // Hide dropdown
    }
};

// Update onMounted and onUnmounted to include category dropdown
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleCategoryClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("click", handleCategoryClickOutside);
});

// Add mobile search state
const isMobileSearchOpen = ref(false);

const toggleMobileSearch = () => {
    isMobileSearchOpen.value = !isMobileSearchOpen.value;
    if (isMobileSearchOpen.value) {
        nextTick(() => {
            document.querySelector(".mobile-search-input")?.focus();
        });
    }
};
</script>

<template>
    <div class="bg-black text-white text-[14px] py-2">
        <div class="container mx-auto sm:block md:flex justify-between">
            <ul class="list-none flex gap-3 phonecustom">
                <li class="flex gap-3 items-center">
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="15px"
                        >
                            <path
                                fill="#fff"
                                d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                            />
                        </svg>
                    </span>
                    <span>{{ storePhone }}</span>
                </li>
            </ul>
            <ul
                class="list-none flex gap-3 justify-between items-center customheadercontact"
            >
                <div class="flex">
                    <li class="flex gap-3 items-center">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                                width="15px"
                            >
                                <path
                                    fill="#fff"
                                    d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                                />
                            </svg>
                        </span>
                        <span class="">join our group for more offer</span>
                    </li>
                </div>
                <div class="flex items-center gap-3">
                    <li class="flex gap-3 items-center tooltip">
                        <a :href="facebookUrl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                width="10px"
                            >
                                <path
                                    fill="#fff"
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                                />
                            </svg>
                        </a>
                        <span class="tooltiptext">facebook</span>
                    </li>
                    <li class="flex gap-3 items-center tooltip">
                        <a :href="instagramUrl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                width="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                                />
                            </svg>
                        </a>
                        <div class="tooltiptext">instagram</div>
                    </li>
                    <li class="flex gap-3 items-center tooltip">
                        <a :href="youtubeUrl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                width="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                                />
                            </svg>
                        </a>
                        <div class="tooltiptext">youtube</div>
                    </li>
                    <li class="flex gap-3 items-center tooltip">
                        <a :href="xUrl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                width="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                                />
                            </svg>
                        </a>

                        <div class="tooltiptext">x</div>
                    </li>
                    <li class="flex gap-3 items-center tooltip">
                        <a :href="tiktokUrl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                width="18px"
                            >
                                <path
                                    fill="#fff"
                                    d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
                                />
                            </svg>
                        </a>
                        <div class="tooltiptext">tiktok</div>
                    </li>
                </div>
            </ul>
        </div>
    </div>

    <header
        class="w-full border-b border-gray-200 sticky top-0 bg-white z-10 header"
    >
        <div class="sticky top-0 z-50">
            <!-- Desktop Header -->
            <div class="bg-[#fff] text-white hidden lg:block">
                <div class="container mx-auto">
                    <div class="flex items-center justify-between h-20">
                        <!-- Logo-->
                        <div class="logo_area w-1/4">
                            <Link href="/">
                                <img
                                    v-if="homeStore.logo"
                                    :src="homeStore.logo"
                                    alt="Site Logo"
                                    class="h-20 w-auto"
                                />
                            </Link>
                        </div>

                        <!-- search input -->

                        <div class="search_input w-2/5">
                            <div class="relative">
                                <div class="px-4 py-4 relative">
                                    <div class="flex items-center">
                                        <form
                                            @submit="handleSearch"
                                            class="flex w-full relative border border-theme rounded-md"
                                        >
                                            <!-- Category Dropdown -->
                                            <div
                                                class="relative transition-all category-dropdown"
                                            >
                                                <button
                                                    type="button"
                                                    @click="
                                                        toggleCategoryDropdown
                                                    "
                                                    class="flex items-center text-gray-800 px-4 h-10 text-sm border-r border-theme"
                                                >
                                                    {{ selectedCategory }}
                                                    <ChevronDown
                                                        class="h-4 w-4 ml-1 text-gray-400"
                                                    />
                                                </button>

                                                <div
                                                    v-show="
                                                        isCategoryDropdownOpen
                                                    "
                                                    class="absolute left-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-[100]"
                                                >
                                                    <!-- All Categories Option -->
                                                    <div
                                                        class="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer text-sm"
                                                        @click="
                                                            selectCategory(
                                                                'All'
                                                            )
                                                        "
                                                    >
                                                        All
                                                    </div>

                                                    <!-- Loop through categories -->
                                                    <div
                                                        v-for="category in categories"
                                                        :key="category.id"
                                                    >
                                                        <div
                                                            class="px-4 py-2 text-black z-40 hover:bg-gray-200 cursor-pointer text-sm font-medium"
                                                            @click="
                                                                selectCategory(
                                                                    category.name,
                                                                    category.slug
                                                                )
                                                            "
                                                        >
                                                            {{ category.name }}
                                                        </div>

                                                        <div
                                                            v-if="
                                                                category.sub_category &&
                                                                category
                                                                    .sub_category
                                                                    .length > 0
                                                            "
                                                        >
                                                            <div
                                                                v-for="sub in category.sub_category"
                                                                :key="sub.id"
                                                                class="px-6 py-1.5 text-gray-600 hover:bg-gray-300 cursor-pointer text-sm"
                                                                @click="
                                                                    selectCategory(
                                                                        sub.name,
                                                                        sub.slug
                                                                    )
                                                                "
                                                            >
                                                                - {{ sub.name }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Search Input -->
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                v-model="searchQuery"
                                                @input="onSearchInputChange"
                                                @focus="showDropdown = true"
                                                ref="searchInput"
                                                class="w-full h-10 text-gray-900 px-4 outline-none search-input"
                                            />

                                            <!-- Search Button -->
                                            <button
                                                type="submit"
                                                class="text-white bg-theme h-10 px-5 flex items-center justify-center rounded-r-md"
                                            >
                                                <SearchIcon class="h-5 w-5" />
                                            </button>
                                        </form>
                                    </div>

                                    <!-- Search Results Dropdown -->
                                    <div
                                        v-if="
                                            showDropdown &&
                                            searchQuery.length > 2
                                        "
                                        class="bg-white absolute left-0 right-0 shadow-lg mt-1 w-full z-[51] mr-4 rounded-md overflow-hidden"
                                    >
                                        <div
                                            v-if="isLoading"
                                            class="p-4 text-center text-gray-900"
                                        >
                                            <div class="flex justify-center">
                                                <div
                                                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                                                ></div>
                                            </div>
                                        </div>
                                        <ul
                                            v-else-if="
                                                filteredProducts.length > 0
                                            "
                                            class="max-h-96 overflow-y-auto"
                                        >
                                            <li
                                                v-for="product in filteredProducts"
                                                :key="product.id"
                                                class="hover:bg-gray-200 border-b border-gray-300"
                                            >
                                                <Link
                                                    class="flex items-center p-3 space-x-4"
                                                    :href="`/product/${product.slug}`"
                                                >
                                                    <img
                                                        :src="
                                                            product.featured_image ||
                                                            '/placeholder.svg'
                                                        "
                                                        :alt="
                                                            product.product_name
                                                        "
                                                        class="w-14 h-14 rounded-md object-cover"
                                                    />
                                                    <div class="flex-grow">
                                                        <p
                                                            class="font-medium text-black"
                                                        >
                                                            {{
                                                                product.product_name
                                                            }}
                                                        </p>
                                                        <!-- <p
                                                            class="text-sm text-black"
                                                        >
                                                            {{ product.price
                                                            }}<span
                                                                class="bangla-font"
                                                                >{{ cartStore.currencysymbol }}</span
                                                            >
                                                        </p> -->
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                        <div
                                            v-else-if="searchQuery.length > 0"
                                            class="p-4 text-center text-gray-400"
                                        >
                                            No products found
                                        </div>
                                        <div
                                            v-if="filteredProducts.length > 0"
                                            class="p-3 border-t border-gray-200 text-center"
                                        >
                                            <Link
                                                :href="`/shop?search=${searchQuery}${
                                                    selectedCategorySlug
                                                        ? '&category=' +
                                                          selectedCategorySlug
                                                        : ''
                                                }`"
                                                class="text-sm text-black hover:underline hover:text-theme"
                                            >
                                                View all results
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Icons -->
                        <div class="right_icons w-1/4">
                            <div
                                class="flex items-center justify-end space-x-4"
                            >
                                <Link
                                    href="/order-tracking"
                                    class="text-black hover:text-gray-900 tooltip focus:outline-none"
                                >
                                    <MapPin />
                                    <div class="tooltiptext">Order Track</div>
                                </Link>

                                <!-- Account Icon -->
                                <Link
                                    v-if="!authStore.isAuthenticated"
                                    href="/login"
                                    class="text-black hover:text-gray-900 focus:outline-none relative group"
                                >
                                    <UserRound class="w-6 h-6" />
                                    <div
                                        class="absolute -right-[48px] top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                    >
                                        <div class="p-2 text-center">
                                            <Link
                                                href="/login"
                                                class="text-sm text-gray-900 hover:text-[#000] block py-1"
                                                >Sign In</Link
                                            >
                                            <Link
                                                href="/register"
                                                class="text-sm text-gray-900 hover:text-[#000] block py-1"
                                                >Register</Link
                                            >
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    v-else
                                    href="/account/orders"
                                    class="text-black hover:text-gray-900 focus:outline-none relative group"
                                >
                                    <UserRound class="w-6 h-6" />
                                    <div
                                        class="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999999999999999999999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                    >
                                        <div class="p-2 text-center">
                                            <Link
                                                href="/account/orders"
                                                class="text-sm text-gray-800 hover:text-[#000] block py-1"
                                                >My Account
                                            </Link>
                                            <Link
                                                href="/account/orders"
                                                class="text-sm text-gray-800 hover:text-[#000] block py-1"
                                                >Orders
                                            </Link>
                                            <button
                                                @click="authStore.logout"
                                                class="text-sm text-gray-800 hover:text-[#000] block py-1 w-full"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </Link>

                                <!-- Cart Icon -->
                                <Link href="/cart" class="relative">
                                    <ShoppingBag class="w-6 h-6 text-black" />
                                    <span
                                        class="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                    >
                                        {{ cartStore.cartCount }}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation Menu -->
            <div class="border-t border-gray-200 hidden lg:block shadow-md">
                <div class="container bg-[#fff] rounded-md mx-auto px-0">
                    <div class="">
                        <!-- Menu Items -->
                        <NavigationMenu :categories="categories" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Slide-in Search Bar (Desktop) -->
        <div
            v-if="isSearchOpen"
            class="fixed lg:hidden inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            @click="toggleSearch"
        ></div>
        <div
            class="fixed lg:hidden top-0 left-0 right-0 bg-[#000] transform transition-transform duration-300 z-50"
            :class="isSearchOpen ? 'translate-y-0' : '-translate-y-full'"
        >
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center">
                    <form @submit="handleSearch" class="flex w-full relative">
                        <!-- Category Dropdown -->
                        <div class="relative transition-all category-dropdown">
                            <button
                                type="button"
                                @click="toggleCategoryDropdown"
                                class="flex items-center bg-gray-800 text-white px-4 h-10 text-sm border-r border-gray-700"
                            >
                                {{ selectedCategory }}
                                <ChevronDown
                                    class="h-4 w-4 ml-1 text-gray-400"
                                />
                            </button>

                            <div
                                v-show="isCategoryDropdownOpen"
                                class="absolute left-0 top-full mt-1 w-56 bg-gray-800 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto"
                            >
                                <!-- All Categories Option -->
                                <div
                                    class="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer text-sm"
                                    @click="selectCategory('All')"
                                >
                                    All
                                </div>

                                <!-- Loop through categories -->
                                <div
                                    v-for="category in categories"
                                    :key="category.id"
                                >
                                    <div
                                        class="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer text-sm font-medium"
                                        @click="
                                            selectCategory(
                                                category.name,
                                                category.slug
                                            )
                                        "
                                    >
                                        {{ category.name }}
                                    </div>

                                    <div
                                        v-if="
                                            category.sub_category &&
                                            category.sub_category.length > 0
                                        "
                                    >
                                        <div
                                            v-for="sub in category.sub_category"
                                            :key="sub.id"
                                            class="px-6 py-1.5 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm"
                                            @click="
                                                selectCategory(
                                                    sub.name,
                                                    sub.slug
                                                )
                                            "
                                        >
                                            - {{ sub.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Search Input -->
                        <input
                            type="text"
                            placeholder="Search products..."
                            v-model="searchQuery"
                            @input="onSearchInputChange"
                            @focus="showDropdown = true"
                            ref="searchInput"
                            class="w-full h-10 bg-gray-800 text-white px-4 outline-none search-input"
                        />

                        <!-- Search Button -->
                        <button
                            type="submit"
                            class="bg-white text-[#000] h-10 px-5 flex items-center justify-center"
                        >
                            <SearchIcon class="h-5 w-5" />
                        </button>

                        <!-- Close Button -->
                        <button
                            type="button"
                            @click="toggleSearch"
                            class="ml-2 text-white hover:text-gray-300 focus:outline-none"
                        >
                            <X class="h-6 w-6" />
                        </button>
                    </form>
                </div>

                <!-- Search Results Dropdown -->
                <div
                    v-if="showDropdown && searchQuery.length > 2"
                    class="bg-gray-800 shadow-lg mt-1 w-full z-[51] rounded-md overflow-hidden"
                >
                    <div v-if="isLoading" class="p-4 text-center text-gray-400">
                        <div class="flex justify-center">
                            <div
                                class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                            ></div>
                        </div>
                    </div>
                    <ul
                        v-else-if="filteredProducts.length > 0"
                        class="max-h-96 overflow-y-auto"
                    >
                        <li
                            v-for="product in filteredProducts"
                            :key="product.id"
                            class="hover:bg-gray-700 border-b border-gray-700"
                        >
                            <Link
                                class="flex items-center p-3 space-x-4"
                                :href="`/product/${product.slug}`"
                            >
                                <img
                                    :src="
                                        product.featured_image ||
                                        '/placeholder.svg'
                                    "
                                    :alt="product.product_name"
                                    class="w-14 h-14 rounded-md object-cover"
                                />
                                <div class="flex-grow">
                                    <p class="font-medium text-white">
                                        {{ product.product_name }}
                                    </p>
                                    <!-- <p class="text-sm text-gray-300">
                                        {{ product.price
                                        }}<span class="bangla-font">{{ cartStore.currencysymbol }}</span>
                                    </p> -->
                                </div>
                            </Link>
                        </li>
                    </ul>
                    <div
                        v-else-if="searchQuery.length > 0"
                        class="p-4 text-center text-gray-400"
                    >
                        No products found
                    </div>
                    <div
                        v-if="filteredProducts.length > 0"
                        class="p-3 border-t border-gray-700 text-center"
                    >
                        <Link
                            :href="`/shop?search=${searchQuery}${
                                selectedCategorySlug
                                    ? '&category=' + selectedCategorySlug
                                    : ''
                            }`"
                            class="text-sm text-white hover:underline"
                        >
                            View all results
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Header -->
        <div class="bg-[#fff] text-white lg:hidden z-[9999999999999999]">
            <div class="px-4 py-3">
                <div class="flex items-center justify-between">
                    <!-- Hamburger Menu -->
                    <button
                        @click="toggleMobileMenu"
                        class="text-[#000] hover:text-gray-900 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="16"
                            viewBox="0 0 30 16"
                            fill="currentColor"
                        >
                            <rect width="30" height="1.5"></rect>
                            <rect y="7" width="20" height="1.5"></rect>
                            <rect y="14" width="30" height="1.5"></rect>
                        </svg>
                    </button>

                    <!-- Logo (Centered) -->
                    <Link href="/" class="mx-auto">
                        <img
                            v-if="homeStore.logo"
                            :src="homeStore.logo"
                            alt="logo"
                            class="h-10"
                        />
                    </Link>

                    <!-- Mobile Right Icons -->
                    <div class="flex items-center gap-5">
                        <Link
                            href="/order-tracking"
                            class="text-black hover:text-gray-900 focus:outline-none"
                        >
                            <MapPin />
                        </Link>
                        <!-- Cart Icon -->
                        <Link href="/cart" class="relative">
                            <ShoppingBag class="w-6 h-6 text-black" />
                            <span
                                class="absolute -top-2 -right-2 bg-black text-[#fff] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                            >
                                {{ cartStore.cartCount }}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <MobileMenu
            :categories="categories"
            :isMobileMenuOpen="isMobileMenuOpen"
            :toggleMobileMenu="toggleMobileMenu"
            :logo="homeStore.logo"
        />

        <!-- Cart Sidebar -->
        <CartSidebar />
    </header>

    <div
        class="footer_mobile_bottom_bar fixed z-[9] bottom-0 left-0 right-0 bg-[#fff] border-t border-gray-200 lg:hidden"
    >
        <div class="container mx-auto px-4">
            <div
                class="flex items-center justify-between h-16 bg-[#fff] border-t border-gray-200"
            >
                <div class="item grid place-items-center">
                    <button
                        @click="toggleMobileMenu"
                        href="/account/orders"
                        class="text-[#000] hover:text-gray-900 focus:outline-none"
                    >
                        <Menu class="w-6 h-6" />
                    </button>
                    <p class="text-sm">Menu</p>
                </div>
                <div class="item grid place-items-center">
                    <Link
                        href="/"
                        class="text-[#000] hover:text-gray-900 focus:outline-none"
                    >
                        <House class="w-6 h-6" />
                    </Link>
                    <p class="text-sm">Home</p>
                </div>
                <div class="item grid place-items-center">
                    <Link
                        href="/account/orders"
                        class="text-[#000] hover:text-gray-900 focus:outline-none"
                    >
                        <UserRound class="w-6 h-6" />
                    </Link>
                    <p class="text-sm">Account</p>
                </div>
                <div class="item grid place-items-center">
                    <button
                        @click="toggleSearch"
                        href="/account/orders"
                        class="text-[#000] hover:text-gray-900 focus:outline-none"
                    >
                        <SearchIcon class="w-6 h-6" />
                    </button>
                    <p class="text-sm">Search</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 430px) {
    .phonecustom {
        justify-content: center;
        margin-bottom: 8px;
    }
    .customheadercontact {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

.tooltip {
    position: relative;
    display: inline-block;
    z-index: 999999999999999;
}

/* Tooltip text */

.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #000 !important;
    color: #fff !important;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    top: 25px;
    left: -50px;
    font-size: 12px;
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* Add max height and scrollbar styling for category dropdown */
.category-dropdown .max-h-60 {
    max-height: 240px;
    overflow-y: auto;
}

.category-dropdown .max-h-60::-webkit-scrollbar {
    width: 4px;
}

.category-dropdown .max-h-60::-webkit-scrollbar-track {
    background: #222;
}

.category-dropdown .max-h-60::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.category-dropdown .max-h-60::-webkit-scrollbar-thumb:hover {
    background: #777;
}

/* Mobile category dropdown specific styles */
.mobile-category-dropdown .absolute {
    position: absolute;
    z-index: 100;
}

/* Ensure mobile dropdown is visible above other elements */
.mobile-category-dropdown {
    position: relative;
    z-index: 50;
}

header ul li {
    list-style: none;
}
</style>
