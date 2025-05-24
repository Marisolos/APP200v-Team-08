<template>
    <div class="autocomplete-container">
      <input
        class="text-input"
        v-model="search"
        :class="{ 'input-error': props.errors.adresse && props.touched.adresse }"
        @input="onInput"
        @focus="onFocus"
        @blur="handleBlur"
        placeholder="Skriv inn adresse..."
      />
      <ul v-if="showDropdown && suggestions.length">
        <li
          v-for="(result, index) in suggestions"
          :key="index"
          @click="select(result)"
        >
          {{ result.display_name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, getCurrentInstance, defineProps } from 'vue'
  import { useRegisterFormStore } from '@/stores/registerForm'
  
  // Props med reaktiv tilgang
  const props = defineProps({
    errors: Object,
    touched: Object
  })
  
  const { emit } = getCurrentInstance()
  const form = useRegisterFormStore()
  
  // Init med eksisterende verdi fra store
  const search = ref(form.adresse || '')
  
  // Sync input med store
  watch(search, (newValue) => {
    form.adresse = newValue
    if (newValue.trim() === '') {
      form.lat = null
      form.lng = null
      form.postnummer = ''
      form.poststed = ''
    }
  })
  
  const onFocus = () => emit('focus')
  const onBlur = () => emit('blur')
  const handleBlur = () => {
    onBlur()
    hideDropdownWithDelay()
  }
  
  const suggestions = ref([])
  const showDropdown = ref(false)
  let debounceTimer = null
  
  const onInput = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      if (search.value.length < 3) return
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search.value
        )}&format=json&addressdetails=1`
      )
      suggestions.value = await response.json()
      showDropdown.value = true
    }, 300)
  }
  
  const select = (result) => {
    showDropdown.value = false
  
    const a = result.address
    const gateadresse = `${a.road || ''} ${a.house_number || ''}`.trim()
  
    form.adresse = gateadresse
    search.value = gateadresse
    form.lat = parseFloat(result.lat)
    form.lng = parseFloat(result.lon)
  
    if (a && a.postcode) {
      form.postnummer = a.postcode
      emit('postcode-updated')
    }
  }
  
  const hideDropdownWithDelay = () => {
    setTimeout(() => {
      showDropdown.value = false
    }, 200)
  }
  </script>
  
  <style scoped>
  .autocomplete-container {
    position: relative;
    width: 100%;
    max-width: 600px;
  }
  
  ul {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    list-style: none;
    padding: 0;
    margin-top: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  li {
    padding: 10px;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #f2f2f2;
  }
  
  .text-input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    font-family: "Nunito Sans", sans-serif;
    margin-bottom: 16px;
  }
  
  .input-error {
    border-color: red;
    background-color: #ffe6e6;
  }
  </style>
  