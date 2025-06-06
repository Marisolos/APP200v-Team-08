<!-- Author: Hedvig -->
<template>
  <div class="find-parking-page">
    <!-- Page title -->
    <h2 class="page-title">{{ $t('findParking.title') }}</h2>

    <!-- Input field and search button -->
    <div class="search-container">
      <input type="text" v-model="searchLocation" :placeholder="$t('findParking.placeholder')" class="location-input">
      <button @click="searchMap" class="search-button">{{ $t('findParking.search') }}</button>
    </div>

    <!-- Map container -->
    <div ref="mapContainer" id="map" class="map-container"></div>

    <!-- Message shown if no parking spots found -->
    <div v-if="noResults" class="no-results">
      {{ $t('findParking.noResults') }}
    </div>
  </div>
</template>

<script setup>
/* global google */

import { ref, onMounted, onActivated, onDeactivated } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()



const map = ref(null); //Google Map instance
const markers = ref([]); //All map markers
const parkingSpots = ref([]); //Parking spot data from database
const infowindow = ref(null); //Info window shown on marker click
const mapContainer = ref(null); //DOM reference to map container
const searchLocation = ref(''); //Search input value
const noResults = ref(false); //Flag for no results found
const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const Maps_API_KEY = 'AIzaSyCfis5H1oNKr-NuNbBXOlwMaMhUY-5Mk5w'; //Google Maps API key

//Initializes the map, loads API script if necessary
const initMap = () => {
  if (!mapContainer.value) return;
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    window.initMapCallback = createMapInstance;
    document.head.appendChild(script);
  } else {
    createMapInstance();
  }
};

//Creates the map instance and fetches parking spots
const createMapInstance = () => {
  map.value = new google.maps.Map(mapContainer.value, {
    center: { lat: 59.9139, lng: 10.7522 }, // Default center (Oslo)
    zoom: 12,
    mapTypeId: 'roadmap'
  });
  infowindow.value = new google.maps.InfoWindow();
  fetchAndRenderParkingSpots();
};

//Fetches parking spots and adds them to the map
const fetchAndRenderParkingSpots = async (centerLat = null, centerLng = null) => {
  //Remove existing markers
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
  parkingSpots.value = [];
  noResults.value = false;

  const querySnapshot = await getDocs(collection(db, "parkingSpots"));
  let foundSpots = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.lat || !data.lng) return;

    parkingSpots.value.push({ id: doc.id, ...data });

    //Calculate distance from center if coordinates are provided
    let distance = Infinity;
    if (centerLat && centerLng) {
      const R = 6371e3; // Earth radius in meters
      const φ1 = centerLat * Math.PI / 180;
      const φ2 = data.lat * Math.PI / 180;
      const Δφ = (data.lat - centerLat) * Math.PI / 180;
      const Δλ = (data.lng - centerLng) * Math.PI / 180;
      const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance = R * c / 1000; // Convert to kilometers
    }

    //If no location specified or within 2km, add marker
    if (!centerLat || distance <= 2) {
      foundSpots++;
      const marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        map: map.value,
        title: data.address
      });

      //Show info window on marker click
marker.addListener("click", () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isOwner = currentUser && currentUser.uid === data.ownerId;

  const detailsContent = `
    <div class="infobox-content">
      <h4>${data.address}</h4>
      <p><strong>${t('findParking.price')}:</strong> ${data.price} kr/${data.paymentPeriod}</p>
      <p><strong>${t('findParking.available')}:</strong> ${data.availableWeekdays}</p>
      <p><strong>${t('findParking.time')}:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>${t('findParking.features')}:</strong>
        ${data.hasCamera ? t('findParking.camera') + ', ' : ''}
        ${data.hasCharger ? t('findParking.charger') + ', ' : ''}
        ${data.hasHeating ? t('findParking.heated') + ', ' : ''}
        ${data.roofChecked ? t('findParking.roof') : ''}
      </p>
      ${data.dimensions ? `
        <p><strong>${t('findParking.dimensions')}:</strong> 
          ${t('findParking.length')}: ${data.dimensions.length}m, 
          ${t('findParking.width')}: ${data.dimensions.width}m
          ${data.dimensions.height ? `, ${t('findParking.height')}: ${data.dimensions.height}m` : ''}
        </p>` : ''}

      ${data.guidelines ? `<p><strong>${t('findParking.guidelines')}:</strong> ${data.guidelines}</p>` : ''}
      ${data.additionalInfo ? `<p><strong>${t('findParking.additionalInfo')}:</strong> ${data.additionalInfo}</p>` : ''}

      ${isOwner 
        ? `<p style="color:#b22222; font-style:italic; margin-top:10px;">${t('listings.owner.notice') || 'You own this listing'}</p>` 
        : `<button id="open-booking-form" class="infobox-book-btn">Book</button>`}
    </div>`;

  infowindow.value.setContent(detailsContent);
  infowindow.value.open(map.value, marker);

  // Add booking form only if not the owner
  if (!isOwner) {
    google.maps.event.addListenerOnce(infowindow.value, 'domready', () => {
      document.getElementById('open-booking-form')?.addEventListener('click', () => {
        const bookingForm = `
          <div class="infobox-content">
            <h4>Book ${data.address}</h4>
            <label>${t('findParking.day')}:
              <select id="booking-day">
                <option value="">${t('findParking.selectDay')}</option>
                ${allDays.map(day => `<option value="${day}">${day}</option>`).join("")}
              </select>
            </label>
            <label>${t('findParking.startTime')}: <input type="time" id="booking-start" value="${data.startTime}" /></label>
            <label>${t('findParking.endTime')}: <input type="time" id="booking-end" value="${data.endTime}" /></label>
            <div style="margin-top:10px;">
              <button id="confirm-booking" class="infobox-book-btn">${t('findParking.confirm')}</button>
              <button id="cancel-booking" class="infobox-cancel-btn">${t('findParking.cancel')}</button>
            </div>
          </div>`;

        infowindow.value.setContent(bookingForm);

        google.maps.event.addListenerOnce(infowindow.value, 'domready', () => {
          document.getElementById('cancel-booking')?.addEventListener('click', () => infowindow.value.close());

          document.getElementById('confirm-booking')?.addEventListener('click', async () => {
            const day = document.getElementById('booking-day')?.value;
            const start = document.getElementById('booking-start')?.value;
            const end = document.getElementById('booking-end')?.value;

            if (!day || !start || !end) return alert("Please fill in all fields.");
            const user = getAuth().currentUser;
            if (!currentUser) return alert("You must be logged in to book.");
            if (currentUser.uid === data.ownerId) return alert("You cannot book your own listing.");


            const bookingsRef = collection(db, "bookings");
            const q = query(bookingsRef, where("listingId", "==", doc.id), where("day", "==", day));
            const snapshot = await getDocs(q);

            const hasConflict = snapshot.docs.some(doc => {
              const existing = doc.data();
              return start < existing.endTime && end > existing.startTime;
            });

            if (hasConflict) return alert("This time slot is already booked.");

            await addDoc(bookingsRef, {
              renterId: user.uid,
              listingId: doc.id,
              address: data.address,
              price: data.price,
              day,
              startTime: start,
              endTime: end,
              createdAt: new Date()
            });

            await addDoc(collection(db, "rentalHistory"), {
              ownerId: data.ownerId,
              renterId: user.uid,
              listingId: doc.id,
              address: data.address,
              price: data.price,
              day,
              startTime: start,
              endTime: end,
              timestamp: serverTimestamp()
            });

            alert("Booking successful!");
            infowindow.value.close();
          });
        });
      });
    });
  }
});


      markers.value.push(marker);
    }
  });

  //Show "no results" message if applicable
  noResults.value = centerLat !== null && foundSpots === 0;
};

//Searches for a location using the Geocoder API
const searchMap = () => {
  if (!searchLocation.value.trim()) return alert("Please enter a location to search.");
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: searchLocation.value }, (results, status) => {
    if (status === 'OK' && results.length > 0) {
      const location = results[0].geometry.location;
      map.value.setCenter(location);
      map.value.setZoom(14);
      fetchAndRenderParkingSpots(location.lat(), location.lng());
    } else {
      alert("Could not find the specified location.");
      noResults.value = true;
    }
  });
};

//Lifecycle hooks
onMounted(() => initMap()); //Initialize map when component mounts
onActivated(() => map.value ? fetchAndRenderParkingSpots() : initMap()); //Refresh map if re-activated
onDeactivated(() => infowindow.value?.close()); //Close infowindow when component is deactivated
</script>

<style scoped>
.find-parking-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #ABC89D;
  min-height: 100vh;
  font-family: "Nunito Sans", sans-serif;
}
.page-title {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 20px;
}
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 90%;
  max-width: 600px;
}
.location-input {
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}
.search-button {
  background-color: #5B8D8A;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}
.search-button:hover {
  background-color: #FED28D;
}
.map-container {
  width: 90%;
  max-width: 800px;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}
.no-results {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  color: #cc0000;
  font-weight: bold;
}
</style>
