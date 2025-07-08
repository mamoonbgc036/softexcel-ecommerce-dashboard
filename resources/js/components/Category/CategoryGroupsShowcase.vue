<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  categoryGroups: {
    type: Array,
    required: true
  }
});

const sortedCategoryGroups = props.categoryGroups.sort((a, b) => a.ordering - b.ordering);

const swiperOptions = {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  centeredSlides: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1.5, spaceBetween: 15 },
    768: { slidesPerView: 2, spaceBetween: 30 },
    1024: { slidesPerView: 2.5, spaceBetween: 30 },
    1280: { slidesPerView: 3, spaceBetween: 50 }
  }
};
</script>

<template>
  <div class="category-groups-showcase py-16">
    <div class=" mx-auto">
      <!-- First Category Group (Unchanged) -->
      <div v-if="sortedCategoryGroups && sortedCategoryGroups.length > 0" class="mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">{{ sortedCategoryGroups[0]?.name }}
        </h2>
        <div class="relative mx-auto container">
          <div class="swiper-button-prev !left-2 md:!left-5 z-10"></div>
          <div class="swiper-button-next !right-2 md:!right-5 z-10"></div>
          <Swiper v-bind="swiperOptions" class="fashion-showcase">
            <SwiperSlide v-for="(category, index) in sortedCategoryGroups[0]?.categories" :key="index" class="relative">
              <div class="flex flex-col items-center">
                <Link :href="`/shop?category=${category.slug}`" class="block relative w-full overflow-hidden">
                <div class="aspect-square mx-auto shine-effect">
                  <img :src="category.image" :alt="category.name" class="w-full h-full object-cover" />
                </div>
                </Link>
                <div class="text-center mt-4">
                  <h3 class="text-base md:text-2xl font-samibold uppercase">{{ category.name }}</h3>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <!-- Second Category Group: Masonry Layout with explicit divs -->
      <div v-if="sortedCategoryGroups && sortedCategoryGroups.length > 1" class="mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">{{ sortedCategoryGroups[1]?.name }}
        </h2>

        <div class="max-w-5xl mx-auto">
          <!-- Custom masonry grid -->
          <div class="flex gap-5 flex-col md:flex-row">
            <!-- Item 1: Large left top -->
            <div class="left-area md:w-1/2">
              <div class="masonry-item grid-item-large mb-5" v-if="sortedCategoryGroups[1]?.categories[0]">
                <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[0].slug}`"
                  class="block relative w-full group overflow-hidden">
                <div class="relative aspect-[5/4]">
                  <img :src="sortedCategoryGroups[1].categories[0].image"
                    :alt="sortedCategoryGroups[1].categories[0].name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                    <div class=" p-2 text-center">
                      <h3 class="text-white text-[12px] md:text-xl font-samibold uppercase">{{
                        sortedCategoryGroups[1].categories[0].name }}</h3>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div class="right-area-bottom-div flex gap-5">
                <!-- Item 2: Medium right top -->
                <div class="masonry-item grid-item-medium w-1/2" v-if="sortedCategoryGroups[1]?.categories[1]">
                  <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[1].slug}`"
                    class="block relative w-full group overflow-hidden">
                  <div class="relative aspect-square">
                    <img :src="sortedCategoryGroups[1].categories[1].image"
                      :alt="sortedCategoryGroups[1].categories[1].name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                      <div class=" p-2 text-center">
                        <h3 class="text-white text-[12px] md:text-xl font-samibold uppercase">{{
                          sortedCategoryGroups[1].categories[1].name }}</h3>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>

                <!-- Item 3: Medium right middle -->
                <div class="masonry-item grid-item-medium w-1/2" v-if="sortedCategoryGroups[1]?.categories[2]">
                  <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[2].slug}`"
                    class="block relative w-full group overflow-hidden">
                  <div class="relative aspect-square">
                    <img :src="sortedCategoryGroups[1].categories[2].image"
                      :alt="sortedCategoryGroups[1].categories[2].name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                      <div class=" p-2 text-center">
                        <h3 class="text-white text-[12px] md:text-xl font-samibold uppercase">{{
                          sortedCategoryGroups[1].categories[2].name }}</h3>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
              </div>

            </div>

            <div class="right_area md:w-1/2">

              <div class="right-area-bottom-div flex gap-5 mb-5">
                <!-- Item 4: Small left bottom left -->
                <div class="masonry-item grid-item-small w-1/2" v-if="sortedCategoryGroups[1]?.categories[3]">
                  <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[3].slug}`"
                    class="block relative w-full group overflow-hidden">
                  <div class="relative aspect-square">
                    <img :src="sortedCategoryGroups[1].categories[3].image"
                      :alt="sortedCategoryGroups[1].categories[3].name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                      <div class=" p-2 text-center">
                        <h3 class="text-white text-[12px] md:text-xl font-samibold uppercase">{{
                          sortedCategoryGroups[1].categories[3].name }}</h3>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
                <!-- Item 5: Small left bottom right -->
                <div class="masonry-item grid-item-small w-1/2" v-if="sortedCategoryGroups[1]?.categories[4]">
                  <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[4].slug}`"
                    class="block relative w-full group overflow-hidden">
                  <div class="relative aspect-square">
                    <img :src="sortedCategoryGroups[1].categories[4].image"
                      :alt="sortedCategoryGroups[1].categories[4].name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                      <div class=" p-2 text-center">
                        <h3 class="text-white text-[12px] md:text-xl font-samibold uppercase">{{
                          sortedCategoryGroups[1].categories[4].name }}</h3>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
              </div>

              <!-- Item 6: Large right bottom -->
              <div class="masonry-item grid-item-large" v-if="sortedCategoryGroups[1]?.categories[5]">
                <Link :href="`/shop?category=${sortedCategoryGroups[1].categories[5].slug}`"
                  class="block relative w-full group overflow-hidden">
                <div class="relative aspect-[5/4]">
                  <img :src="sortedCategoryGroups[1].categories[5].image"
                    :alt="sortedCategoryGroups[1].categories[5].name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent">
                    <div class="p-2 text-center">
                      <h3 class="text-white text-[12px] md:text-xl font-semibold uppercase">
                        {{ sortedCategoryGroups[1].categories[5].name }}
                      </h3>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* First Category Group styles (unchanged) */
.swiper-button-next,
.swiper-button-prev {
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  transition: background 0.3s;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0, 0, 0, 0.5);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 18px !important;
}

.fashion-showcase {
  overflow: hidden !important;
  padding: 20px 0;
}

.fashion-showcase .swiper-slide {
  transition: all 0.3s ease;
  opacity: 1;
  transform: scale(0.9);
}

.fashion-showcase .swiper-slide-active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
}

/* .masonry-item::before {
    position: absolute;
    bottom: 0;
    top: auto;
    left: 0;
    background-image: linear-gradient(360deg, black, transparent);
    width: 100%;
    height: 100%;
    z-index: 1;
    content: "";
} */

@media (min-width: 768px) {
  .fashion-showcase .swiper-slide-active {
    transform: scale(1.05);
  }
}
</style>