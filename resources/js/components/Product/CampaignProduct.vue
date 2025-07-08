<script setup>
import ProductCard from "../Product/ProductCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { computed } from "vue";

const props = defineProps({
    compaigns: {
        type: Array,
        required: true,
    },
});

const campaignNames = computed(() => {
    const names = props.compaigns.map(
        (item) => item.product_campaign.campaign.name
    );
    console.log("ronaldo", names);
    return [...new Set(names)];
});

// Group campaign products by campaign name, limited to 10 per campaign
const campaignProductsByName = computed(() => {
    const grouped = {};
    campaignNames.value.forEach((name) => {
        grouped[name] = props.compaigns
            .filter((item) => item.product_campaign.campaign.name === name)
            .slice(0, 10); // Limit to 10 products per campaign
    });
    return grouped;
});

// Swiper modules
const modules = [Navigation, Pagination, Autoplay];
</script>

<template>
    <div class="campaign_area">
        <div
            class="container mx-auto px-4"
            v-for="campaign in campaignNames"
            :key="campaign.id"
        >
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-800">
                    {{ campaign }}
                </h2>
                <hr class="border-gray-200 my-8" />
            </div>
            <swiper
                :modules="modules"
                :slides-per-view="1"
                :space-between="20"
                :breakpoints="{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }"
                :pagination="{ clickable: true }"
                :navigation="true"
                :autoplay="{ delay: 3000, disableOnInteraction: false }"
                class="campaign-swiper mb-0"
            >
                <swiper-slide
                    v-for="product in campaignProductsByName[campaign]"
                    :key="product.id"
                >
                    <ProductCard :product="product" />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<style scoped>
.campaign-swiper {
    padding-bottom: 40px;
}

:deep(.swiper-pagination-bullet) {
    background: #4b5563;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    background: #1f2937;
    opacity: 1;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #1f2937;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 40px;
    height: 40px;
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
    font-size: 20px;
}
</style>
