<template>
  <div class="register-container">
    <h2 class="page-title">{{ $t('register.preview.title') }}</h2>

    <!-- Bilder -->
    <div class="form-section">
      <h3>{{ $t('register.preview.overview') }}</h3>
      <div v-if="form.images && form.images.length" class="image-preview-container">
        <div v-for="(image, index) in form.images" :key="index" :class="['image-preview', { 'large': index === 0 }]">
          <img :src="getImageUrl(image)" :alt="'Bilde ' + (index + 1)" />
        </div>
      </div>
      <br>
      <h3></h3>
      <p><strong>{{ $t('register.preview.address') }}</strong> {{ form.adresse }} {{ form.postnummer }} {{ form.poststed }}</p>
      <p><strong>{{ $t('register.preview.price') }}</strong> {{ form.pris }} kr {{ form.betalingsperiode }}</p>
    </div>

    <!-- Tilgjengelighet -->
    <div class="form-section">
      <h3>{{ $t('register.preview.available') }}</h3>
      <p><strong>{{ $t('register.preview.weekdays') }}</strong> {{ form.daysDescription }}</p>
      <p><strong>{{ $t('register.preview.time') }}</strong> {{ form.startTime }} - {{ form.endTime }}</p>
      <p><strong>{{ $t('register.preview.repeats') }}</strong> {{ form.repeatPattern }}</p>
      <div v-if="form.rules.length">
        <h4>{{ $t('register.preview.availability') }}</h4>
        <ul>
          <li v-for="(rule, index) in form.rules" :key="index">{{ rule }}</li>
        </ul>
      </div>
    </div>

    <!-- Funksjoner og dimensjoner -->
    <div class="form-section">
      <h3>{{ $t('register.preview.features') }}</h3>
      <ul>
        <li v-if="form.hasCamera">Kameraovervåking</li>
        <li v-if="form.hasCharger">Elbillader</li>
        <li v-if="form.hasHeating">Oppvarmet</li>
        <li v-if="form.roofChecked">Tak over</li>
      </ul>

      <h3>{{ $t('register.preview.dimensions') }}</h3>
      <p><strong>{{ $t('register.preview.length') }}</strong> {{ form.length }} m</p>
      <p><strong>{{ $t('register.preview.width') }}</strong> {{ form.width }} m</p>
      <p v-if="form.roofChecked"><strong>{{ $t('register.preview.height') }}</strong> {{ form.height }} m</p>
    </div>

    <!-- Tilgang og regler -->
    <div class="form-section">
      <h3>{{ $t('register.preview.access') }}</h3>
      <p>{{ form.accessType }}</p>
    </div>

    <div class="form-section" v-if="form.guidelines">
      <h3>{{ $t('register.preview.guidelines') }}</h3>
      <p>{{ form.guidelines }}</p>
    </div>

    <div class="form-section" v-if="form.additionalInfo">
      <h3>{{ $t('register.preview.additionalInfo') }}</h3>
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
import { useRegisterFormStore } from '@/stores/registerForm';
import { db } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

const form = useRegisterFormStore();
const router = useRouter();
const currentStep = 4;
const totalSteps = 4;

const Maps_API_KEY = 'AIzaSyCfis5H1oNKr-NuNbBXOlwMaMhUY-5Mk5w'; //API-key for Google Maps

const publishListing = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to publish a listing.");
    return;
  }

  const listingAddress = `${form.adresse}, ${form.postnummer} ${form.poststed}`;

//Author: Hedvig
// Initialize variables to store latitude and longitude
  let lat = null;
  let lng = null;

const storage = getStorage();
const uploadedImageUrls = [];

  for (const image of form.images) {
  if (image.file instanceof File) {
    const storageRef = ref(storage, `listingImages/${user.uid}/${Date.now()}-${image.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, image.file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (downloadURL) {
        uploadedImageUrls.push({ url: downloadURL });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Bildeopplasting feilet.");
      return;
    }
  } else if (image.url) {
    uploadedImageUrls.push(image); // Hvis bildet allerede er lastet opp
  }
}


// Check that the address is not empty or just whitespace
  if (listingAddress.trim()) {
    
    // Encode the address so it can be safely used in a URL
    const encodedAddress = encodeURIComponent(listingAddress);
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${Maps_API_KEY}`;

    try {
      const res = await fetch(geocodingUrl); // Send a request to the Google Maps Geocoding API
      const data = await res.json(); // Parse the response as JSON

    // Check if the API response was successful and contains results
      if (data.status === 'OK' && data.results.length > 0) {
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
      } else {
        //If geocoding was not successful
        alert(`Could not find coordinates for "${listingAddress}".`);
        console.error("Geocoding failed:", data.status, data.error_message || "");
        return;
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch call
      console.error("Error during geocoding:", error);
      alert("Failed to geocode address.");
      return;
    }
  } else {
    // Alert if the address field is empty or invalid
    alert("Address information is missing.");
    return;
  }

//Check for duplicate 
  const listingsRef = collection(db, "listings");
  const qListings = query(
    listingsRef,
    where("ownerId", "==", user.uid),
    where("address", "==", listingAddress)
  );
  const querySnapshotListings = await getDocs(qListings);

  if (!querySnapshotListings.empty) {
    alert("You already have a listing with this address.");
    return;
  }

  const parkingSpotsCollectionRef = collection(db, "parkingSpots");
  const q = query(
    parkingSpotsCollectionRef,
    where("ownerId", "==", user.uid),
    where("address", "==", listingAddress)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    alert("You already have a listing with this address.");
    return;
  }
//Author: Hedvig


//Add title
  const listingNumber = Math.floor(Math.random() * 100000);
  const timestamp = new Date().toLocaleString();
  const listingTitle = `Listing ${listingNumber} - ${timestamp}`;


console.log("form.images:", form.images);
console.log("uploadedImageUrls:", uploadedImageUrls);
const cleanedImageUrls = uploadedImageUrls.filter(img => img && typeof img.url === 'string' && img.url.startsWith('http'));
form.images = cleanedImageUrls;
console.log("cleanedImageUrls:", cleanedImageUrls);



//Save to Firestore
  const commonListingData = {
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
    images: cleanedImageUrls,
    roofChecked: form.roofChecked,
    dimensions: {
      length: form.length,
      width: form.width,
      height: form.roofChecked ? form.height : null
    },
    accessType: form.accessType,
    guidelines: form.guidelines || "",
    additionalInfo: form.additionalInfo || "",
    createdAt: serverTimestamp(),
  };

console.log("commonListingData som lagres:", commonListingData);

//Author: Hedvig
  try {
    await addDoc(parkingSpotsCollectionRef, {
      ...commonListingData,
      lat: lat,
      lng: lng,
    });

    await addDoc(listingsRef, commonListingData);
//Author: Hedvig

    alert("Listing published!");
    form.progressLevel = 5;
    form.$reset();
    router.push('/listings');
  } catch (err) {
    console.error("Error publishing listing:", err);
    alert("Failed to publish listing.");
  }
};

function getImageUrl(image) {
  if (image.previewUrl) return image.previewUrl; // vis preview før opplasting
  if (image.url && typeof image.url === 'string' && image.url.startsWith('http')) {
    return image.url;
  }
  return '';
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
</style>
