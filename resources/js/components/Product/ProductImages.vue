<script setup>
import { ref, computed, watch, defineProps, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Thumbs, FreeMode, Pagination } from "swiper/modules";
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    hasCampaign: {
        type: Boolean,
        default: false,
    },
    selectedAttributeImage: {
        type: String,
        default: null,
    }
});

const productImages = ref([]);

watch(
    () => props.product,
    (newProduct) => {
        if (newProduct) {
            const galleryImages = newProduct.gallery_images;
            let parsedImages = [];
            try {
                parsedImages = galleryImages ? JSON.parse(galleryImages) : [];
            } catch (error) {
                console.error("Error parsing gallery images:", error);
            }
            if (!Array.isArray(parsedImages)) {
                parsedImages = [];
            }
            productImages.value = [newProduct.featured_image, ...parsedImages];
        }
    },
    { immediate: true }
);

// ✅ Show selectedAttributeImage as the first image if set
const mainImages = computed(() => {
    if (props.selectedAttributeImage) {
        return [props.selectedAttributeImage, ...productImages.value];
    }
    return productImages.value;
});

const discountPercentage = computed(() => {
    const { price, previous_price } = props.product;
    if (!previous_price || previous_price <= 0) return 0;
    const discount = ((previous_price - price) / previous_price) * 100;
    return Math.round(discount);
});

const thumbsSwiper = ref(null);
const mainSwiper = ref(null);
const activeIndex = ref(0);

const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
};
const setMainSwiper = (swiper) => {
    mainSwiper.value = swiper;
};
const handleSlideChange = (swiper) => {
    activeIndex.value = swiper.activeIndex;
};

const handleThumbClick = (index) => {
    if (mainSwiper.value) {
        mainSwiper.value.slideTo(index);
        activeIndex.value = index;
    }
};

// Image zoom
const showZoom = ref(false);
const zoomPosition = ref({ x: 0, y: 0 });
const isMobile = ref(false);

onMounted(() => {
    isMobile.value = window.innerWidth <= 768;
    window.addEventListener("resize", () => {
        isMobile.value = window.innerWidth <= 768;
    });
});

const handleMouseMove = (event) => {
    if (isMobile.value) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    zoomPosition.value = { x, y };
};
const handleMouseEnter = () => {
    if (!isMobile.value) showZoom.value = true;
};
const handleMouseLeave = () => {
    if (!isMobile.value) showZoom.value = false;
};

const zoomStyle = computed(() =>
    isMobile.value
        ? {}
        : {
              transform: `scale(2)`,
              transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`,
          }
);
</script>

<template>
    <div class="product-images-area group transition-all">
        <!-- You can show this for debugging -->
        <!-- <div>{{ selectedAttributeImage }}</div> -->

        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Thumbnails -->
            <div class="hidden sm:block sm:w-1/5">
                <swiper
                    :modules="[Thumbs, FreeMode]"
                    :slides-per-view="4"
                    :space-between="10"
                    :free-mode="true"
                    :watch-slides-progress="true"
                    direction="vertical"
                    @swiper="setThumbsSwiper"
                    class="thumbs-swiper h-full"
                >
                    <swiper-slide
                        v-for="(image, index) in mainImages"
                        :key="index"
                        @click="handleThumbClick(index)"
                        class="cursor-pointer"
                    >
                        <div
                            :class="[
                                'lg:aspect-square h-[100px] relative cursor-pointer rounded-md overflow-hidden',
                                { 'ring-2 ring-theme ring-offset-2': index === activeIndex }
                            ]"
                        >
                            <img
                                :src="image"
                                :alt="`Thumbnail ${index + 1}`"
                                class="w-full h-full object-cover"
                            />
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <!-- Main Image Swiper -->
            <div class="relative rounded-lg overflow-hidden w-full sm:w-4/5">
                <swiper
                    :modules="[Navigation, Thumbs, Pagination]"
                    :thumbs="{ swiper: thumbsSwiper }"
                    :navigation="{
                        nextEl: '.product-button-next',
                        prevEl: '.product-button-prev',
                    }"
                    :pagination="{
                        clickable: true,
                        el: '.swiper-pagination',
                        type: 'bullets',
                    }"
                    @swiper="setMainSwiper"
                    @slideChange="handleSlideChange"
                    class="product-swiper"
                >
                    <swiper-slide
                        v-for="(image, index) in mainImages"
                        :key="index"
                    >
                        <div
                            class="relative overflow-hidden cursor-zoom-in aspect-auto sm:aspect-square"
                            @mousemove="handleMouseMove"
                            @mouseenter="handleMouseEnter"
                            @mouseleave="handleMouseLeave"
                        >
                            <img
                                :src="image"
                                :alt="`Product image ${index + 1}`"
                                class="w-full h-auto object-cover transition-transform"
                                :class="{
                                    'duration-0': showZoom,
                                    'duration-200': !showZoom,
                                }"
                                :style="showZoom ? zoomStyle : {}"
                            />
                        </div>
                    </swiper-slide>

                    <!-- Pagination -->
                    <div class="swiper-pagination sm:hidden mt-4"></div>
                </swiper>

                <!-- Discount Badge -->
                <div
                    v-if="discountPercentage > 0 && !hasCampaign"
                    class="absolute top-4 right-4 z-[9]"
                >
                    <span class="bg-theme text-white rounded-full py-1 px-3 text-[13px]">
                        {{ discountPercentage }}%
                    </span>
                </div>

                <!-- Navigation Arrows -->
                <div
                    class="absolute inset-0 items-center justify-between hidden group-hover:flex transition-all"
                >
                    <button
                        class="product-button-prev text-theme absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-4"
                    >
                        <PhCaretLeft :size="32" />
                    </button>
                    <button
                        class="product-button-next text-theme absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-4"
                    >
                        <PhCaretRight :size="32" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-swiper {
    width: 100%;
    height: 100%;
}
.product-images-area .swiper-slide {
    width: 100%;
    height: 100%;
}
.thumbs-swiper {
    padding: 5px;
    height: 100%;
}
@media (min-width: 640px) {
    .thumbs-swiper {
        height: 500px;
    }
    .thumbs-swiper .swiper-slide {
        height: calc((100% - 30px) / 4);
    }
}
.thumbs-swiper .swiper-slide {
    transition: all 0.3s ease;
}
.thumbs-swiper .swiper-slide:hover {
    opacity: 0.8;
}
.product-button-prev,
.product-button-next {
    transition: opacity 0.3s ease;
}
.product-button-prev:hover,
.product-button-next:hover {
    opacity: 0.8;
}
.swiper-button-disabled {
    opacity: 0.3;
}
.swiper-button-disabled:hover {
    opacity: 0.3;
}
.product-slider {
    padding: 20px 0px;
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    display: none;
}
:deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    background-color: #ccc;
    opacity: 0.7;
    margin: 0 4px;
}
:deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    background-color: var(--theme-color, #000);
}
.swiper-pagination {
    position: relative;
    bottom: 0;
    margin-top: 10px;
}
</style>
