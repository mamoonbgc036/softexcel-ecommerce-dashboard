<template>
  <div class="py-12 bg-gray-50 ">

    <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-normal mb-6">REGISTER</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-2">
            name 
            <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            class="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block mb-2">
            Email address 
            <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          
        </div>

        <div>
          <label class="block mb-2">
            Password
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              required
              class="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"
              :class="{ 'border-red-500': errors.password }"
            />
            <button 
              type="button" 
              @click="togglePassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block mb-2">
            Confirm Password
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input 
              v-model="form.confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              required
              class="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <button 
              type="button" 
              @click="toggleConfirmPassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400" />
              <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>

        <button 
          type="submit"
          class="w-full btn__primary py-2 rounded text-white font-semibold"
          :disabled="!isFormValid || isSubmitting"
        >
          {{ isSubmitting ? 'REGISTERING...' : 'REGISTER' }}
        </button>

        <div class="text-center mt-4">
          <span class="text-gray-600">Already have an account?</span>
          <Link href="/login" class="text-theme hover:underline ml-1">Log in</Link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, inject } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import * as yup from 'yup'
import { Link } from '@inertiajs/vue3'
import { toast } from "@steveyuowo/vue-hot-toast";
import { router } from '@inertiajs/vue3';

const $axios = inject('$axios');

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const schema = yup.object().shape({
  name: yup
    .string()
    .required('name is required')
    .min(3, 'name must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_-]+$/, 'name can only contain letters, numbers, dashes and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const validateField = async (field) => {
  try {
    await schema.validateAt(field, form)
    errors[field] = ''
  } catch (error) {
    errors[field] = error.message
  }
}

watch(() => form.name, () => validateField('name'))
watch(() => form.email, () => validateField('email'))
watch(() => form.password, () => {
  validateField('password')
  if (form.confirmPassword) {
    validateField('confirmPassword')
  }
})
watch(() => form.confirmPassword, () => validateField('confirmPassword'))

const isFormValid = computed(() => {
  return Object.values(errors).every(error => error === '') &&
         Object.values(form).every(value => value !== '')
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
    if (!isFormValid.value) return;

    isSubmitting.value = true;

    try {
        const response = await $axios.post('/register', form);
        console.log('Registration successful:', response.data);
        toast.success('Registration successful!');
        router.get('/login');
    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Handle validation errors
            const validationErrors = error.response.data.errors || {};
            for (const [key, value] of Object.entries(validationErrors)) {
                errors[key] = value[0]; // Display the first error message
            }
            toast.error('Please fix the validation errors.');
        } else if (error.response) {
            console.error('Registration failed:', error.response.data);
            toast.error(error.response.data.message || 'Please try again.');
        } else if (error.request) {
            console.error('No response received:', error.request);
            alert('No response from server. Please try again later.');
        } else {
            console.error('Error during request setup:', error.message);
            alert('An error occurred. Please try again later.');
        }
    } finally {
        isSubmitting.value = false;
    }
};

</script>

<style>
/* Add any additional custom styles here if needed */
</style>