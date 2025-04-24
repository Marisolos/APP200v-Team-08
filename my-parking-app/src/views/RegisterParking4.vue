<template>
  <div class="register-container">
    <h2 class="page-title">Preview</h2>

    <!-- Bilder -->
    <div class="form-section">
      <h3>Overview</h3>
      <div class="image-preview-container">
        <div v-for="(image, index) in form.images" :key="index" :class="['image-preview', { 'large': index === 0 }]">
          <img :src="image.url" :alt="'Bilde ' + (index + 1)" />
        </div>
      </div>
      <br>
      <h3></h3>
      <p><strong>Address:</strong> {{ form.adresse }} {{ form.postnummer }} {{ form.poststed }}</p>
      <p><strong>Price:</strong> {{ form.pris }} kr {{ form.betalingsperiode }}</p>
    </div>

    <!-- Tilgjengelighet -->
    <div class="form-section">
      <h3>Available</h3>
      <p><strong>Weekdays:</strong> {{ form.daysDescription }}</p>
      <p><strong>Time:</strong> {{ form.startTime }} - {{ form.endTime }}</p>
      <p><strong>Repeats:</strong> {{ form.repeatPattern }}</p>
      <div v-if="form.rules.length">
        <h4>Availability:</h4>
        <ul>
          <li v-for="(rule, index) in form.rules" :key="index">{{ rule }}</li>
        </ul>
      </div>
    </div>

    <!-- Funksjoner og dimensjoner -->
    <div class="form-section">
      <h3>Features</h3>
      <ul>
        <li v-if="form.hasCamera">Kameraovervåking</li>
        <li v-if="form.hasCharger">Elbillader</li>
        <li v-if="form.hasHeating">Oppvarmet</li>
        <li v-if="form.roofChecked">Tak over</li>
      </ul>

      <h3>Dimensions</h3>
      <p><strong>Length:</strong> {{ form.length }} m</p>
      <p><strong>Width:</strong> {{ form.width }} m</p>
      <p v-if="form.roofChecked"><strong>Høyde:</strong> {{ form.height }} m</p>
    </div>

    <!-- Tilgang og regler -->
    <div class="form-section">
      <h3>Access</h3>
      <p>{{ form.accessType }}</p>
    </div>

    <div class="form-section" v-if="form.guidelines">
      <h3>Retningslinjer</h3>
      <p>{{ form.guidelines }}</p>
    </div>

    <div class="form-section" v-if="form.additionalInfo">
      <h3>Ekstra informasjon</h3>
      <p>{{ form.additionalInfo }}</p>
    </div>

    <!-- Progress and Publiser Button -->
    <div class="form-section right" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <span class="progress-text">Side {{ currentStep }} av {{ totalSteps }}</span>
      </div>
      <button class="search-button" @click="publishListing">Publiser</button>
    </div>
  </div>
</template>

<script setup>
import { useRegisterFormStore } from '@/stores/registerForm'
import { db } from '@/firebase'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, serverTimestamp, getDocs, query, where } from 'firebase/firestore'


const form = useRegisterFormStore()
const currentStep = 4;
const totalSteps = 4;

const publishListing = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to publish a listing.");
    return;
  }

  const listingAddress = `${form.adresse} ${form.postnummer} ${form.poststed}`;

  // Step 1: Check for duplicate
  const listingsRef = collection(db, "listings");
  const q = query(
    listingsRef,
    where("ownerId", "==", user.uid),
    where("address", "==", listingAddress)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    alert("You already have a listing with this address.");
    return;
  }

  // Step 2: Add title
  const listingNumber = Math.floor(Math.random() * 100000);
  const timestamp = new Date().toLocaleString();
  const listingTitle = `Listing ${listingNumber} - ${timestamp}`;

  // Step 3: Save to Firestore
  try {
    await addDoc(listingsRef, {
      title: listingTitle,
      ownerId: user.uid,
      address: listingAddress,
      price: form.pris,
      paymentPeriod: form.betalingsperiode,
      availableWeekdays: form.daysDescription,
      startTime: form.startTime,
      endTime: form.endTime,
      repeatPattern: form.repeatPattern,
      rules: form.rules,
      hasCamera: form.hasCamera,
      hasCharger: form.hasCharger,
      hasHeating: form.hasHeating,
      roofChecked: form.roofChecked,
      dimensions: {
        length: form.length,
        width: form.width,
        height: form.roofChecked ? form.height : null
      },
      accessType: form.accessType,
      guidelines: form.guidelines || "",
      additionalInfo: form.additionalInfo || "",
      createdAt: serverTimestamp()
    });

    alert("Listing published!");
  } catch (err) {
    console.error("Error publishing listing:", err);
    alert("Failed to publish listing.");
  }
};


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

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.image-preview {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview.large {
  width: 240px;
  height: 240px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
</style>
