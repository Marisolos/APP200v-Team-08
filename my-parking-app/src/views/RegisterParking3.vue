<template>
    <div class="register-container">
      <h2 class="page-title">Registrer parkeringsplass</h2>
  
      <!-- Bildeopplasting -->
      <div class="form-section">
        <h3>Pictures</h3>
        <label>Upload some pictures of the parking spot</label>
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
                Velg bilder (maks 4)
            </button>
          <p v-if="form.images.length >= 4">Maksimalt 4 bilder tillatt.</p>
        </div>
        <div class="image-preview-container">
          <div
            class="image-preview"
            v-for="(image, index) in form.images"
            :key="image.id"
          >
            <img :src="image.url" :alt="'Bilde ' + (index + 1)" />
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
        <h3 for="guidelines">Rules</h3>
        <label>Let your guests know which rules they have to follow</label>
        <textarea
          id="guidelines"
          v-model="form.guidelines"
          maxlength="500"
          placeholder="Skriv inn retningslinjer her..."
        ></textarea>
        <p>{{ form.guidelines.length }}/500 tegn brukt</p>
      </div>
  
      <!-- Ekstra informasjon -->
      <div class="form-section">
        <h3 for="additionalInfo">Additional info</h3>
        <label>Is there anything else you'd like to tell your guests?</label>
        <textarea
          id="additionalInfo"
          v-model="form.additionalInfo"
          maxlength="500"
          placeholder="Skriv inn ekstra informasjon her..."
        ></textarea>
        <p>{{ form.additionalInfo.length }}/500 tegn brukt</p>
      </div>
  
      <div class="form-section right" style="display: flex; align-items: center; justify-content: space-between;">
        <div class="progress-container">
            <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
            </div> <span class="progress-text">Side {{ currentStep }} av {{ totalSteps }}</span>
        </div>
        <router-link to="/register-parking-4">
            <button class="search-button">Neste side →</button>
        </router-link>
    </div>
  <FooterComponent /> <!-- Footer Component -->
</div>
</template>
  
  <script setup>
  import { useRegisterFormStore } from '@/stores/registerForm'
  import { ref } from 'vue'
  import FooterComponent from "@/components/Footer.vue"; // Importer FooterComponent for bruk i denne komponenten

  const currentStep = 3;
  const totalSteps = 4;

  const isDraggingOver = ref(false)
  const form = useRegisterFormStore()
  const fileInput = ref(null)
  
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
    if (form.images.length >= 4) return
    Array.from(files).forEach((file) => {
      if (
        form.images.length < 4 &&
        file.type.startsWith("image/") &&
        !form.images.some((img) => img.name === file.name)
      ) {
        const reader = new FileReader()
        reader.onload = (e) => {
          form.images.push({
            id: Date.now() + Math.random(),
            name: file.name,
            url: e.target.result,
          })
        }
        reader.readAsDataURL(file)
      }
    })
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
  border-color: #B3C3AF;
  background-color: #f9fdf7;
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
</style>