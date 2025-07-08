<script setup>
import { ref, defineProps } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const modules = [Navigation, Pagination, Autoplay, EffectFade];
const swiperInstance = ref(null);
const imageLoadingStates = ref({});

const lazyloadingsvg = ref('/assets/images/loading/lazyloading.svg');

const props = defineProps({
    sliders: {
        type: Array,
        required: true,
    },
});

// Initialize loading states for all images
const initializeLoadingStates = () => {
    const states = {};
    props.sliders.forEach((slide) => {
        states[slide.id] = true;
    });
    imageLoadingStates.value = states;
};

// Initialize when component mounts
initializeLoadingStates();

const onSwiper = (swiper) => {
    swiperInstance.value = swiper;
};

const onSlideChange = () => {
    //console.log('slide change')
};

const onImageLoad = (slideId) => {
    console.log('Image loaded:', slideId);
    imageLoadingStates.value[slideId] = false;
};

const onImageError = (slideId) => {
    console.log('Image error:', slideId);
    imageLoadingStates.value[slideId] = false;
};
</script>

<template>
    <div class="swiper-container w-full mx-auto relative mb-6 min-h-screen">
        <swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :loop="sliders.length > 1"
            :effect="'fade'"
            :navigation="{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
        >
            <swiper-slide v-for="slide in sliders" :key="slide.id">
                <div class="relative w-full h-full min-h-screen">
                    <!-- Debug info (remove in production) -->
                    <!-- <div class="absolute top-0 left-0 bg-black text-white p-2 z-20 text-xs">
                        Loading: {{ imageLoadingStates[slide.id] }}
                    </div> -->
                    
                    <!-- Loading Spinner -->
                    <div 
                        v-show="imageLoadingStates[slide.id]" 
                        class="absolute inset-0 flex items-center justify-center bg-gray-200 z-10"
                    >
                        <div class="loading-spinner">
                            <img class="w-32" :src="lazyloadingsvg" alt="lazyloading icon">
                        </div>
                    </div>
                    
                    <!-- Image -->
                    <img 
                        loading="lazy"
                        :src="slide.image_path"
                        alt="slider images"
                        class="w-full h-full object-cover"
                        :class="{ 'opacity-0': imageLoadingStates[slide.id] }"
                        @load="onImageLoad(slide.id)"
                        @error="onImageError(slide.id)"
                    />
                </div>
            </swiper-slide>

            <!-- Custom Navigation Arrows -->
            <div class="swiper-button-prev">
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    ></path>
                </svg>
            </div>
            <div class="swiper-button-next">
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    ></path>
                </svg>
            </div>
        </swiper>
    </div>
</template>

<style scoped>
.swiper-container {
    padding: 0rem 0;
}

:deep(.swiper-pagination-bullet) {
    background-color: white;
    opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
    opacity: 1;
}

:deep(.swiper-slide) {
    opacity: 0 !important;
    transition: opacity 0.3s ease;
}

:deep(.swiper-slide-active) {
    opacity: 1 !important;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
    width: 40px;
    height: 40px;
    background: var(--color-theme);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

:deep(.swiper-button-prev:hover),
:deep(.swiper-button-next:hover) {
    background: rgba(0, 0, 0, 0.8);
}

:deep(.swiper-button-prev) {
    left: 20px;
}

:deep(.swiper-button-next) {
    right: 20px;
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
    display: none;
}

.swiper-button-prev svg,
.swiper-button-next svg {
    width: 24px;
}

/* Loading Spinner Styles */
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}
/* Smooth image transition */
img {
    transition: opacity 0.3s ease-in-out;
}
</style>