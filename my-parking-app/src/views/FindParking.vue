<template>
  <div class="find-parking-page">
   <!-- Page Title -->
    <h2 class="page-title">Find Parking</h2>

    <!-- Search Bar -->
    <div class="search-container">
      <input type="text" v-model="searchLocation" placeholder="Enter location..." class="location-input">
      <button @click="searchMap" class="search-button">Search</button>
    </div>

    <div ref="mapContainer" id="map" class="map-container"></div>

    <div v-if="noResults" class="no-results">
    </div>
  <FooterComponent /> <!-- Footer Component -->
  </div>
</template>

// Author: Hedvig
<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'; 
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import FooterComponent from '@/components/Footer.vue'; // Importer FooterComponent for bruk i denne komponenten

const map = ref(null);
const markers = ref([]);
const parkingSpots = ref([]);
const infowindow = ref(null);
const mapContainer = ref(null); 

const searchLocation = ref('');
const noResults = ref(false);

const Maps_API_KEY = 'AIzaSyCfis5H1oNKr-NuNbBXOlwMaMhUY-5Mk5w'; 

//Initialiserer kartet
const initMap = () => {
  if (!mapContainer.value) {
    console.warn("Map container not found (ref 'mapContainer' is null), skipping map initialization.");
    return;
  }

//Sjekker om Maps API er lastet inn, hvis ikke last det inn dynamisk
  if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
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

// Opretter kart og henter registrerte parkeringsplasser
const createMapInstance = () => {
  if (mapContainer.value && window.google && window.google.maps) {
    map.value = new window.google.maps.Map(mapContainer.value, {
      center: { lat: 59.9139, lng: 10.7522 }, 
      zoom: 12,
      mapTypeId: 'roadmap' 
    });
    infowindow.value = new window.google.maps.InfoWindow();
    fetchAndRenderParkingSpots(); 
  } else {
    console.error("Failed to create map instance: map container (ref) is null or Google Maps API not loaded.");
  }
};

// Henter parkeringsplasser fra Firestore og viser dem på kartet som markører
const fetchAndRenderParkingSpots = async (centerLat = null, centerLng = null) => {
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
  parkingSpots.value = [];
  noResults.value = false;

  try {
    const querySnapshot = await getDocs(collection(db, "parkingSpots")); 
    let foundSpots = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.lat && data.lng) {
        parkingSpots.value.push({ id: doc.id, ...data });

        let distance = Infinity;
        if (centerLat !== null && centerLng !== null) {
          //Haversine-formelen (avstandsberegning på jordkloden)
          const R = 6371e3;  // Jordens radius i meter
          const φ1 = centerLat * Math.PI / 180; 
          const φ2 = data.lat * Math.PI / 180;
          const Δφ = (data.lat - centerLat) * Math.PI / 180;
          const Δλ = (data.lng - centerLng) * Math.PI / 180;

          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

          distance = R * c / 1000;  // Resultat i kilometer
        }

        // Hvis ingen senterpunkt er angitt, eller det er innen 2 km
        if (centerLat === null || distance <= 2) { 
          foundSpots++;
          if (window.google && window.google.maps) { 
            const marker = new window.google.maps.Marker({ 
              position: { lat: data.lat, lng: data.lng },
              map: map.value,
              title: data.address || data.title || 'Ukjent lokasjon',
            });

            // Infoboksen som vises når brukeren trykker på en markør
            const contentString = `
              <div class="infobox-content">
                <h4>${data.address || 'Ukjent adresse'}</h4>
                <p><strong>Pris:</strong> ${data.price} kr/${data.paymentPeriod}</p>
                <p><strong>Tilgjengelig:</strong> ${data.availableWeekdays}</p>
                <p><strong>Tid:</strong> ${data.startTime} - ${data.endTime}</p>
                <p><strong>Funksjoner:</strong> 
                  ${data.hasCamera ? 'Kamera, ' : ''}
                  ${data.hasCharger ? 'Lader, ' : ''}
                  ${data.hasHeating ? 'Oppvarmet, ' : ''}
                  ${data.roofChecked ? 'Tak over' : ''}
                </p>
                ${data.dimensions ? `<p><strong>Dimensjoner:</strong> L: ${data.dimensions.length}m, B: ${data.dimensions.width}m ${data.dimensions.height ? `, H: ${data.dimensions.height}m` : ''}</p>` : ''}
                ${data.guidelines ? `<p><strong>Retningslinjer:</strong> ${data.guidelines}</p>` : ''}
                ${data.additionalInfo ? `<p><strong>Ekstra info:</strong> ${data.additionalInfo}</p>` : ''}
              </div>
            `;

            // Åpner infoboks når brukeren trykker på markøren
            marker.addListener("click", () => {
              infowindow.value.setContent(contentString);
              infowindow.value.open(map.value, marker);
            });
            markers.value.push(marker);
          } else {
            console.error("Google Maps is not loaded.");
          }
        }
      }
    });

    // Hvis ingen resultater ble funnet innenfor søkeområdet
    if (centerLat !== null && centerLng !== null && foundSpots === 0) {
      noResults.value = true;
    } else {
      noResults.value = false;
    }
  } catch (error) {
    console.error("Error fetching parking spots: ", error);
  }
};

// Funksjon for å søke etter sted og flytte kartet dit
const searchMap = async () => {
  if (!searchLocation.value.trim()) {
    alert("Please enter a location to search.");
    return;
  }

  if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
    alert("Google Maps is not fully loaded yet. Please wait a moment and try again.");
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: searchLocation.value }, (results, status) => {
    if (status === 'OK' && results.length > 0) {
      const location = results[0].geometry.location;
      map.value.setCenter(location);
      map.value.setZoom(14); 
      fetchAndRenderParkingSpots(location.lat(), location.lng()); 
    } else {
      alert("Could not find the specified location. Please try again. Status: " + status);
      noResults.value = true;
      fetchAndRenderParkingSpots(); 
    }
  });
};

// Starter kartet når siden åpnes
onMounted(() => {
  initMap();
});

// Kjøres hver gang brukeren kommer tilbake til siden
onActivated(() => {
  if (map.value) {
    fetchAndRenderParkingSpots();
  } else {
    initMap();
  }
});

// Infoboksen lukkes når brukeren forlater siden
onDeactivated(() => {
  if (infowindow.value) {
    infowindow.value.close(); 
  }
});
</script>
// Author: Hedvig



<style scoped>
.map-controls {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.map-controls button {
  background-color: white;
  color: #5B8D8A;
  border: 1px solid #5B8D8A;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-controls button.active {
  background-color: #5B8D8A;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map-controls button:hover:not(.active) {
  background-color: #f0f0f0;
} 

.find-parking-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #ABC89D; 
  min-height: 100vh;
  font-family: "Nunito Sans", sans-serif;
  color: #333;
}

.page-title {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  background-color: #FED28D;
}

.map-container {
  width: 90%;
  max-width: 800px;
  height: 500px; 
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.no-results {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  color: #cc0000;
  font-weight: bold;
}

.infobox-content {
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  color: #333;
}

.infobox-content h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #5B8D8A;
  font-size: 16px;
}

.infobox-content p {
  margin-bottom: 4px;
}

</style>
