<template>

  <Head>
    <title>Login</title>
  </Head>

  <AppLayout>
    <div class="bg-gray-50 py-12">
      <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h1 class="text-2xl font-normal mb-6">LOGIN</h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block mb-2">
              Username or email address
              <span class="text-red-500">*</span>
            </label>
            <input v-model="form.email" type="email" required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme"
              :class="{ 'border-red-500': errors.email }" />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block mb-2">
              Password
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme"
                :class="{ 'border-red-500': errors.password }" />
              <button type="button" @click="togglePassword" class="absolute right-3 top-1/2 -translate-y-1/2">
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <button type="submit" class="w-full btn__primary py-2 rounded text-white font-semibold"
            :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? 'LOGGING IN...' : 'LOG IN' }}
          </button>

          <div class="flex items-center justify-between mt-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="form.remember"
                class="rounded border-gray-300 text-theme focus:ring-theme" />
              <span class="ml-2">Remember me</span>
            </label>
          </div>
          <div class="text-center mt-6 border-t border-gray-200 pt-4">
            <span class="text-gray-600">Don't have an account?</span>
            <Link href="/register" class="text-theme hover:underline ml-1">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import { ref, reactive, watch, computed, inject } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import * as yup from 'yup'
import { Link, router, Head } from '@inertiajs/vue3'
import { toast } from "@steveyuowo/vue-hot-toast"
import { useAuthStore } from '@/Store/authStore';
import Cookies from 'js-cookie'



const $axios = inject('$axios')


const showPassword = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
})

const validateField = async (field) => {
  try {
    await schema.validateAt(field, form)
    errors[field] = ''
  } catch (error) {
    errors[field] = error.message
  }
}

watch(() => form.email, () => validateField('email'))
watch(() => form.password, () => validateField('password'))

const isFormValid = computed(() => {
  return Object.values(errors).every(error => error === '') &&
    form.email !== '' && form.password !== ''
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}


const authStore = useAuthStore();
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errors.email = ''
  errors.password = ''

  try {
    // Replace with your login API endpoint
    const response = await $axios.post('/login', {
      email: form.email,
      password: form.password,
    })


    toast.success('Login successful')
    router.get('/')

    // Save the token to the cookie
    Cookies.set('authToken', response.data, { expires: 7 })
    await authStore.fetchUserDetails();

  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Map backend validation errors to form errors
      const backendErrors = error.response.data.errors
      for (const field in backendErrors) {
        if (backendErrors[field]) {
          errors[field] = backendErrors[field][0]
        }
      }
    } else {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}


</script>

