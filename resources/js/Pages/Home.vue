<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import HeroSlider from "@/components/HeroSlider.vue";
import ProductCard from "@/components/Product/ProductCard.vue";
import TopCategories from "@/components/Category/TopCategories.vue";
import CategoryTabsWithProducts from "../components/Product/CategoryTabsWithProducts.vue";
import CampaignProduct from "@/components/Product/CampaignProduct.vue";
import { Link, Head } from "@inertiajs/vue3";
import { computed, defineProps, onMounted, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import CategoryGroupsShowcase from "@/components/Category/CategoryGroupsShowcase.vue";
import VideoProducts from "@/components/Home/VideoProducts.vue";
import { useHomeStore } from "@/Store/homeStore";

// Initialize the store
const homeStore = useHomeStore();

// Define props
// const props = defineProps({
//     products: Array,
//     categories: Array,
//     sliders: Array,
//     compaigns: Array,
//     featureProducts: Array,
//     categoriesWithProducts: Object,
//     videoProducts: Array
// });

// Use computed to ensure reactivity
const categoryGroups = computed(() => {
    return homeStore.categoryGroups;
});
</script>

<template>
    <Head>
        <title>
            {{
                homeStore.siteinfos[0]?.home_page_title ??
                homeStore.siteinfos[0]?.app_name ??
                "Home"
            }}
        </title>
    </Head>

    <AppLayout>
        <!-- Hero Slider -->
        <HeroSlider :sliders="homeStore.sliders" />

        <!-- Campaign Product -->
        <CampaignProduct
            v-if="homeStore.compaigns.length > 0"
            :compaigns="homeStore.compaigns"
        />

        <!-- Top Categories -->
        <TopCategories
            v-if="homeStore.categories.length > 0"
            :categories="homeStore.categories"
        />

        <div
            v-if="homeStore.featureProducts.length > 0"
            class="featureProducts_area py-2 mb-6"
        >
            <div class="container px-0">
                <div class="mb-[20px]">
                    <h2 class="text-xl font-semibold text-gray-800">
                        Featured Products
                    </h2>
                </div>
                <div>
                    <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    >
                        <ProductCard
                            v-for="product in homeStore.featureProducts"
                            :key="product.id"
                            :product="product"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Category Tabs with Products -->
        <CategoryTabsWithProducts
            v-if="homeStore.categoriesWithProducts"
            :categoriesWithProducts="homeStore.categoriesWithProducts"
            :categories="homeStore.categories"
        />

        <!-- Category Groups Showcase with better loading state handling -->
        <!-- <div class="container mx-auto my-8">
            <div v-if="homeStore.isLoadingCategoryGroups" class="text-center py-8">
                <p class="text-lg">Loading category groups...</p>
            </div>
            <CategoryGroupsShowcase v-else :categoryGroups="categoryGroups" />
        </div> -->

        <!-- video Products -->
        <!-- <VideoProducts :videoProducts="homeStore.videoProducts" /> -->
    </AppLayout>
</template>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
    color: #000;
    padding: 45px 22px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
}

.swiper-pagination-bullet-active {
    background: #000;
}

.swiper-scrollbar {
    bottom: 0 !important;
    left: 0;
    width: 100%;
    height: 5px;
    background: rgba(0, 0, 0, 0.2);
}

.swiper-scrollbar-drag {
    background: #000;
    height: 100%;
}
</style>
