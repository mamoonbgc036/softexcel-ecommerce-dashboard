<script setup>
import { ref } from "vue";
import { ChevronDownIcon, User } from "lucide-vue-next"; // Removed unused Heart import
import { Link } from "@inertiajs/vue3";
import { useAuthStore } from "@/Store/authStore";

// Auth store
const authStore = useAuthStore();

// Define props with default value for categories
const props = defineProps({
    categories: {
        type: Array,
        default: () => [], // Default to empty array to avoid undefined errors
    },
    isMobileMenuOpen: Boolean,
    toggleMobileMenu: Function,
    logo: String,
});

// Submenu state management
const openSubmenuIds = ref(new Set());

const toggleSubmenu = (id) => {
    if (openSubmenuIds.value.has(id)) {
        openSubmenuIds.value.delete(id);
    } else {
        openSubmenuIds.value.add(id);
    }
};

const isSubmenuOpen = (id) => {
    return openSubmenuIds.value.has(id);
};

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Optional: Transform API data here if not done in parent
// const transformedCategories = props.categories.map(category => ({
//   id: category.id,
//   title: category.name,
//   url: `/category/${category.slug}`,
//   submenu: category.sub_category.map(sub => ({
//     id: sub.id,
//     title: sub.name,
//     url: `/category/${category.slug}/${sub.slug}`,
//     submenu: [] // Add deeper levels if needed
//   }))
// }));
</script>

<template>
    <nav class="bg-white">
        <!-- Overlay -->
        <div
            v-show="isMobileMenuOpen"
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-30"
            @click="toggleMobileMenu"
        ></div>

        <!-- Mobile Menu -->
        <div
            class="fixed top-0 left-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto"
            :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        >
            <!-- Logo -->
            <div class="p-4 mb-5 flex justify-between items-center">
                <button
                    @click="toggleMobileMenu"
                    class="absolute z-[999] top-4 right-4 bg-gray-900 p-2 rounded text-white hover:bg-theme"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div class="relative">
                <!-- Button -->
                <button
                    @click="toggleDropdown"
                    class="text-[16px] font-bold flex items-center gap-2 px-4 py-4 w-full text-gray-700 border-gray-200"
                >
                    <PhDiamondsFour :size="22" />
                    <span>Browse Categories</span>
                    <ChevronDownIcon
                        :class="{ 'rotate-180': isDropdownOpen }"
                        class="h-5 w-5 ml-auto transition-transform duration-300"
                    />
                </button>

                <!-- Dropdown -->
                <div
                    v-if="isDropdownOpen"
                    class="bg-white w-full shadow-md rounded-md"
                >
                    <ul class="py-2">
                        <li
                            v-for="category in categories"
                            :key="category.id"
                            v-show="
                                category.status && category.status === 'Active'
                            "
                            class="border-b border-gray-100"
                        >
                            <div
                                class="flex items-center justify-between px-4 py-3 cursor-pointer text-gray-700 hover:text-theme font-bold"
                                @click="toggleSubmenu(category.id)"
                            >
                                <Link
                                    :href="'/shop?category=' + category.id"
                                    class="flex items-center w-full font-bold"
                                >
                                    <img
                                        :src="
                                            category.image || '/placeholder.svg'
                                        "
                                        :alt="category.name"
                                        class="w-7 h-7 object-cover mr-2"
                                    />
                                    {{ category.name }}
                                </Link>
                                <!-- Add chevron if there are subcategories -->
                                <ChevronDownIcon
                                    v-if="category.sub_category?.length"
                                    :class="{
                                        'rotate-180': isSubmenuOpen(
                                            category.id
                                        ),
                                    }"
                                    class="h-4 w-4"
                                />
                            </div>
                            <!-- Submenu nested inside -->
                            <ul
                                v-if="
                                    category.sub_category?.length &&
                                    isSubmenuOpen(category.id)
                                "
                                class="bg-gray-50 pl-6 py-2"
                            >
                                <li
                                    v-for="subcategory in category.sub_category"
                                    :key="subcategory.id"
                                    v-show="subcategory.status === 'Active'"
                                    class="py-1"
                                >
                                    <Link
                                        :href="
                                            '/shop?category=' +
                                            category.id +
                                            '&subcategory=' +
                                            subcategory.id
                                        "
                                        class="text-gray-600 hover:text-theme text-sm"
                                    >
                                        {{ subcategory.name }}
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Menu Items -->
            <ul v-if="categories.length" class="py-2">
                <li>
                    <Link
                        href="/"
                        class="block p-4 rounded w-full text-left font-bold text-gray-900 hover:bg-gray-100"
                        >Home</Link
                    >
                </li>
                <li v-for="item in categories" :key="item.id">
                    <div class="relative border-b border-gray-100">
                        <div
                            class="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-theme"
                            :class="{ 'text-theme': isSubmenuOpen(item.id) }"
                        >
                            <Link
                                :href="`/shop?category=${item.slug}`"
                                class="flex-grow text-sm font-bold"
                                >{{ item.name }}</Link
                            >
                            <button
                                v-if="item.sub_category?.length"
                                @click.prevent="toggleSubmenu(item.id)"
                                class="p-1 focus:outline-none"
                            >
                                <ChevronDownIcon
                                    class="h-4 w-4 transition-transform duration-200"
                                    :class="{
                                        'rotate-180': isSubmenuOpen(item.id),
                                    }"
                                />
                            </button>
                        </div>

                        <!-- Submenu -->
                        <ul
                            v-if="item.sub_category?.length"
                            class="bg-gray-50 overflow-hidden transition-all duration-300"
                            :class="{
                                'max-h-0': !isSubmenuOpen(item.id),
                                'max-h-[1000px]': isSubmenuOpen(item.id),
                            }"
                        >
                            <li
                                v-for="subItem in item.sub_category"
                                :key="subItem.id"
                                class="border-t border-gray-100"
                            >
                                <div
                                    class="flex items-center justify-between px-6 py-2 text-sm text-gray-600 hover:text-orange-500"
                                >
                                    <Link
                                        :href="`/shop?category=${item.slug}&subcategory=${subItem.slug}`"
                                        >{{ subItem.name }}</Link
                                    >
                                    <button
                                        v-if="subItem.sub_category?.length"
                                        @click.prevent="
                                            toggleSubmenu(subItem.id)
                                        "
                                        class="p-1 focus:outline-none"
                                    >
                                        <ChevronDownIcon
                                            class="h-4 w-4 transition-transform duration-200"
                                            :class="{
                                                'rotate-180': isSubmenuOpen(
                                                    subItem.id
                                                ),
                                            }"
                                        />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <Link
                        href="/hot-deals"
                        class="flex items-center gap-2 p-4 rounded w-full text-left text-gray-900 hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-gift"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"
                            ></path>
                        </svg>
                        <span class="ms-2 font-bold">Hot Deals</span>
                    </Link>
                </li>

                <!-- Additional Menu Items -->
                <li
                    v-if="authStore.isAuthenticated"
                    class="border-b border-gray-100"
                >
                    <Link
                        href="/account/orders"
                        class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-theme"
                    >
                        <User class="h-4 w-4 mr-2" />
                        ACCOUNT
                    </Link>
                </li>
                <li v-else class="border-b border-gray-100">
                    <Link
                        href="/login"
                        class="flex items-center px-4 py-3 text-sm font-bold text-gray-700 hover:text-theme"
                    >
                        <User class="h-4 w-4 mr-2" />
                        LOGIN / REGISTER
                    </Link>
                </li>
            </ul>
            <div v-else class="p-4 text-gray-600">No categories available</div>
        </div>
    </nav>
</template>
