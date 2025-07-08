<script setup>
import { PhDiamondsFour } from "@phosphor-icons/vue";
import { ref, onMounted, onUnmounted } from "vue";
import { Link } from "@inertiajs/vue3";
import { ChevronDownIcon } from "lucide-vue-next";

// Define props
const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});

const isDropdownOpen = ref(false);
let closeTimer = null;

// Toggle dropdown
const toggleDropdownHeader = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Open dropdown on hover
const openDropdown = () => {
    isDropdownOpen.value = true;
    cancelCloseTimer();
};

// Start timer to close dropdown
const startCloseTimer = () => {
    closeTimer = setTimeout(() => {
        isDropdownOpen.value = false;
    }, 300); // 300ms delay
};

// Cancel close timer
const cancelCloseTimer = () => {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

// Close dropdown when clicking outside
const closeDropdown = (event) => {
    if (isDropdownOpen.value && !event.target.closest(".relative")) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
    document.removeEventListener("click", closeDropdown);
});
</script>

<template>
    <nav id="navbarid" class="sticky top-0 z-50 bg-[#fff]">
        <div class="menu_area flex items-center justify-between">
            <div class="relative">
                <!-- Button -->
                <a
                    @click="toggleDropdownHeader"
                    @mouseover="openDropdown"
                    @mouseleave="startCloseTimer"
                    class="text-[16px] font-bold flex items-center gap-2 px-4 py-4 left-0 text-black rounded-md cursor-pointer"
                >
                    <PhDiamondsFour :size="22" />
                    <span>Browse Categories</span>
                    <ChevronDownIcon
                        :class="{ 'rotate-180': isDropdownOpen }"
                        class="h-4 w-4 ml-auto transition-transform duration-200"
                    />
                </a>

                <!-- Dropdown -->
                <div
                    v-if="isDropdownOpen"
                    @mouseover="cancelCloseTimer"
                    @mouseleave="startCloseTimer"
                    ref="dropdown"
                    class="absolute left-0 mt-2 w-60 z-50 bg-white shadow-lg rounded-md"
                >
                    <ul class="py-2">
                        <li
                            v-for="category in categories"
                            :key="category.id"
                            v-show="
                                category.status && category.status === 'Active'
                            "
                            class="px-4 py-2 hover:bg-gray-100 cursor-pointer group flex items-center"
                        >
                            <Link
                                :href="'/shop?category=' + category.slug"
                                class="group flex items-center w-full text-xs font-bold"
                            >
                                <img
                                    :src="
                                        category.image ||
                                        '/placeholder.svg?height=24&width=24'
                                    "
                                    :alt="category.name"
                                    class="w-7 h-8 object-cover mr-2"
                                />
                                {{ category.name }}
                                <ChevronDownIcon
                                    v-if="
                                        category.sub_category &&
                                        category.sub_category.length > 0
                                    "
                                    class="h-4 w-4 ml-auto group-hover:rotate-180 transition-transform duration-200"
                                />
                            </Link>

                            <div
                                v-if="
                                    category.sub_category &&
                                    category.sub_category.length > 0
                                "
                                class="absolute left-full mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                            >
                                <ul class="py-2">
                                    <li
                                        v-for="sub in category.sub_category"
                                        :key="sub.id"
                                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <Link
                                            :href="
                                                '/shop?category=' +
                                                category.slug +
                                                '&subcategory=' +
                                                sub.slug
                                            "
                                        >
                                            {{ sub.name }}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <ul class="header-main-menu flex !gap-[20px]">
                <li>
                    <Link
                        href="/"
                        class="text-black font-bold hover:text-gray-700 flex items-center text-sm menu-item [&::after]:w-0"
                        >Home
                    </Link>
                </li>
                <li
                    v-for="item in props.categories.slice(0, 8)"
                    :key="item.id"
                    class="relative group"
                >
                    <Link
                        :href="`/shop?category=${item.slug}`"
                        class="menu-item [&::after]:w-0 text-black font-bold hover:text-gray-700 flex items-center text-sm"
                    >
                        {{ item.name }}
                        <ChevronDownIcon
                            v-if="item.sub_category?.length"
                            class="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200"
                        />
                    </Link>

                    <div
                        v-if="item.sub_category?.length"
                        class="absolute top-full left-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                    >
                        <ul class="py-2">
                            <li
                                v-for="subItem in item.sub_category"
                                :key="subItem.id"
                                class="menu-item [&::after]:w-0 relative group/sub"
                            >
                                <Link
                                    :href="`/shop?subcategory=${subItem.slug}`"
                                    class="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-orange-50 hover:text-black flex items-center justify-between"
                                >
                                    {{ subItem.name }}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <Link
                        href="/shop"
                        class="menu-item [&::after]:w-0 text-black font-bold hover:text-gray-700 flex items-center text-sm"
                        >All Products
                    </Link>
                </li>
            </ul>

            <div class="hidden lg:block">
                <Link
                    href="/hot-deals"
                    class="btn btn-success btn-sm flex items-center justify-center bg-black hover:bg-gray-700 text-white text-sm py-3 mx-auto px-4 rounded"
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
                    <span class="ms-2">Hot Deals</span>
                </Link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.header-main-menu li {
    list-style: none;
}
.group:hover .group-hover\:rotate-180 {
    transform: rotate(180deg);
}

.menu-container {
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE & Edge */
}

.menu-container::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
}

.header-main-menu {
    display: flex;
    gap: 2rem;
    /* Adjust spacing as needed */
}

/* Custom styles for hover border animation */
.menu-item {
    position: relative;
}
.menu-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: orange;
    transition: width 0.3s ease;
}
.menu-item:hover::after {
    width: 100%;
}
</style>
