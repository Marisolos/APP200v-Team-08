<template>
    <div class="register-container">
      <h2 class="page-title">{{ $t('register.title') }}</h2>
  
      <!-- Bildeopplasting -->
      <div class="form-section">
        <h3>{{ $t('register.images.title') }}</h3>
        <label>{{ $t('register.images.description') }}</label>
        <div class="upload-container" :class="{ 'dragging': isDraggingOver }" @dragover.prevent="handleDragOver" @dragleave="isDraggingOver = false" @drop="handleDrop">
          <input
            type="file"
            multiple
            accept="image/*"
            @change="handleFiles"
            ref="fileInput"
            style="display: none"
          />
            <button class="upload-button" @click="triggerFileInput" :disabled="form.images.length >= 4">
                {{ $t('register.images.button') }}
            </button>
          <p v-if="form.images.length >= 4">{{ $t('register.images.tooMany') }}</p>
        </div>
        <p v-if="errors.images && touched.images" style="color: red; margin-top: 8px;">
          {{ $t('register.images.validation') }}
        </p>
        <div class="image-preview-container">
          <div
            class="image-preview"
            v-for="(image, index) in form.images"
            :key="image.id"
          >
            <img :src="getPreviewUrl(image)" :alt="'Bilde ' + (index + 1)" />
            <div class="image-actions">
              <button @click="moveImage(index, -1)" :disabled="index === 0">⬅️</button>
              <button @click="moveImage(index, 1)" :disabled="index === form.images.length - 1">➡️</button>
              <button @click="removeImage(index)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Retningslinjer -->
      <div class="form-section">
        <h3 for="guidelines">{{ $t('register.rules.title') }}</h3>
        <label>{{ $t('register.rules.description') }}</label>
        <textarea
          id="guidelines"
          v-model="form.guidelines"
          maxlength="500"
          :placeholder="$t('register.guidelines.placeholder')"
        ></textarea>
        <p>{{ $t('register.guidelines.count', { count: form.guidelines.length }) }}</p>
      </div>
  
      <!-- Ekstra informasjon -->
      <div class="form-section">
        <h3 for="additionalInfo">{{ $t('register.additionalInfo.title') }}</h3>
        <label>{{ $t('register.additionalInfo.description') }}</label>
        <textarea
          id="additionalInfo"
          v-model="form.additionalInfo"
          maxlength="500"
          :placeholder="$t('register.additionalInfo.placeholder')"
        ></textarea>
        <p>{{ $t('register.additionalInfo.count', { count: form.additionalInfo.length }) }}</p>
      </div>

    <div v-if="showConfirmCheckbox" :class="['form-section', { 'warning-box': !confirmEmptyTextAccepted }]">
      <label :style="{ color: !confirmEmptyTextAccepted ? 'red' : '#333' }">
        <input type="checkbox" v-model="confirmEmptyTextAccepted" />
        {{ $t('register.rulesAndAdditionalInfo.confirmation') }}
      </label>
    </div>
<<<<<<< HEAD
=======
  
      <div class="form-section nav-footer">
  <router-link to="/register-parking-2">
    <button class="search-button" style="padding: 10px 31px;">{{ $t('register.back') }}</button>
  </router-link>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
    </div>
    <span class="progress-text">{{ $t('register.page', { current: currentStep, total: totalSteps }) }}</span>
  </div>
  <button class="search-button" @click="validateAndGoToNextPage">{{ $t('register.next') }}</button>
</div>
>>>>>>> 6d899375ad8e16491b61e96c7e310840fc5f4d61
</div>
</template>
  
  <script setup>
  import { useRegisterFormStore } from '@/stores/registerForm'
  import { ref } from 'vue'
<<<<<<< HEAD

=======
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const errors = ref({ images: false })
  const touched = ref({ images: false })
>>>>>>> 6d899375ad8e16491b61e96c7e310840fc5f4d61
  const currentStep = 3;
  const totalSteps = 4;
  const isDraggingOver = ref(false)
  const form = useRegisterFormStore()
  const fileInput = ref(null)
  const confirmEmptyTextAccepted = ref(false)
  const showConfirmCheckbox = ref(false)

  
  function triggerFileInput() {
    fileInput.value.click()
  }
  
  function handleFiles(event) {
    const files = event.target.files
    processFiles(files)
  }
  
  function handleDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  isDraggingOver.value = false
  const files = event.dataTransfer.files
  processFiles(files)
}

  
  function processFiles(files) {
  if (form.images.length >= 4) return;

  Array.from(files).forEach((file) => {
    if (
      form.images.length < 4 &&
      file.type.startsWith("image/") &&
      !form.images.some((img) => img.name === file.name)
    ) {
      form.images.push({
    file,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
    type: file.type,
    }) // Lagrer File-objekt
      errors.value.images = false
      touched.value.images = false
      console.log("Lagt til bilde:", file.name, file);
      console.log("form.images nå:", form.images);
    }
  });
}

  
  function moveImage(index, direction) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= form.images.length) return
    const movedItem = form.images.splice(index, 1)[0]
    form.images.splice(newIndex, 0, movedItem)
  }
  
  function removeImage(index) {
    form.images.splice(index, 1)
  }

    function handleDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    isDraggingOver.value = true
    }

  console.log(form);

  function getPreviewUrl(image) {
  return image.previewUrl || image.url || '';
}

function validateAndGoToNextPage() {

  // Bildevalidering
  errors.value.images = form.images.length === 0
  touched.value.images = true

  // Tekstvalidering
  const guidelinesEmpty = !form.guidelines.trim()
  const additionalInfoEmpty = !form.additionalInfo.trim()
  const requiresConfirmation = (guidelinesEmpty || additionalInfoEmpty) && !confirmEmptyTextAccepted.value
  showConfirmCheckbox.value = (guidelinesEmpty || additionalInfoEmpty)

  // Hvis noen av kravene ikke er oppfylt, stopp
  if (errors.value.images || requiresConfirmation) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Alt OK – gå videre
  form.progressLevel = 4;
  router.push('/register-parking-4')
}

</script>
  
  
  <style scoped>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    background-color: #ABC89D;
    min-height: 100vh;
    font-family: "Nunito Sans", sans-serif;
  }
  
  .page-title {
    font-size: 28px;
    color: #ffffff;
    margin-bottom: 20px;
  }
  
  .form-section {
    background-color: white;
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 16px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 700px;
  }
  
  .upload-container {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 16px;
        border-radius: 10px; /* Legg til denne linjen */
        transition: 0.2s ease;
    }
  
  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .image-preview {
    position: relative;
  }
  
  .image-preview img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .image-actions {
    position: absolute;
    top: 5px;
    left: 5px;
    display: flex;
    gap: 5px;
  }
  
  .image-actions button {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 2px 5px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    font-family: "Nunito Sans", sans-serif;
    resize: none;
  }
  
  p {
    font-size: 14px;
    color: #666;
  }

  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 20px;
    background-color: #ABC89D;
    min-height: 100vh;
    font-family: "Nunito Sans", sans-serif;
  }
  
  .page-title {
    font-size: 28px;
    color: #ffffff;
    margin-bottom: 20px;
  }
  
  .form-section {
    background-color: white;
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 16px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 700px;
  }
  
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
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
  
  .text-input.readonly {
    background-color: #f5f5f5;
  }
  
  .horizontal-group {
    display: flex;
    gap: 12px;
  }
  
  .price-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .price-wrapper {
    position: relative;
    width: 66.66%; /* 2/3 av bredden */
  }
  
  .select-tid {
    width: 33.33%; /* 1/3 av bredden */
  }
  
  .price-label {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }
  
  .no-spinner::-webkit-outer-spin-button,
  .no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .no-spinner {
    -moz-appearance: textfield;
    padding-right: 32px;
  }
  
  .search-button {
    background-color: #5B8D8A;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 16px;
    font-family: "Nunito Sans", sans-serif;
    cursor: pointer;
    transition: 0.3s;
  }
  .search-button:hover {
    background-color: #FED28D;
  }
  
  .features{
  
      margin-bottom: 24px;
  }

  .upload-button {
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Nunito Sans", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.upload-button:hover {
  border-color: #aaa;
  background-color: #f5f5f5;
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-container.dragging {
  border-color: #ABC89D;
  background-color: #fff5e4;
  border-radius: 10px; /* Samme her for sikkerhets skyld */
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: auto;
}

.progress-bar {
  width: 100px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #5B8D8A;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #333;
}

.nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-footer .progress-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.warning-box {
  background-color: #fff9f9;
}

</style>