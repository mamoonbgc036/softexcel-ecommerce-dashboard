<script setup>
import { defineProps } from "vue";
import { Link } from "@inertiajs/vue3";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <section class="container mx-auto mb-10 px-2 sm:px-0">
        <div>
            <h2 class="text-xl font-semibold text-gray-800">TOP CATEGORIES</h2>
            <hr class="border-gray-200 my-8" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 sm:gap-6 gap-4">
            <div v-for="category in categories" :key="category.id" class="text-center">
                <Link :href="'/shop?category=' + category.slug" class="group block">
                    <div
                        class="sm:w-[180px] sm:h-[180px] w-[130px] h-[130px] mx-auto rounded-full overflow-hidden bg-gray-100 shadow hover:shadow-lg transition-shadow duration-300"
                    >
                        <img
                            :src="category.image"
                            :alt="category.name"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h3 class="mt-3 text-sm font-medium text-gray-700 group-hover:text-black">
                        {{ category.name }}
                    </h3>
                </Link>
            </div>
        </div>
    </section>
</template>


<style scoped>
.mySwiper {
    padding: 20px 0;
}

:deep(.swiper-pagination-bullet) {
    background-color: white;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    opacity: 1;
}
</style>
