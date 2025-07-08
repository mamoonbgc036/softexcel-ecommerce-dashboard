
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, SearchIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')

const selectedOption = computed(() => 
  props.options.find(option => option.value === props.modelValue)
)

const filteredOptions = computed(() => {
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest('.relative')) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>


<template>
  <div class="relative">
    <label class="block mb-2 text-sm font-medium">
      জেলা সিলেক্ট করুন <span class="text-red-500">*</span>
    </label>
    
    <!-- Main select button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="relative w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
    >
      <span class="block truncate">{{ selectedOption?.label || 'Select' }}</span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDownIcon class="h-5 w-5 text-gray-400" />
      </span>
    </button>

    <!-- Dropdown panel -->
    <div v-if="isOpen" class="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50">
      <!-- Search input -->
      <div class="px-3 py-2 border-b">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Search..."
            @input="filterOptions"
          />
          <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <!-- Options list -->
      <ul
        class="max-h-60 overflow-auto py-1"
        role="listbox"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm"
          :class="{
            'bg-[#D86A29] text-white': option.value === modelValue,
            'text-gray-900 hover:bg-gray-100': option.value !== modelValue
          }"
          role="option"
        >
          {{ option.label }}
        </li>
        <li v-if="filteredOptions.length === 0" class="relative cursor-default select-none py-2 pl-3 pr-9 text-sm text-gray-500">
          No results found
        </li>
      </ul>
    </div>
  </div>
</template>

