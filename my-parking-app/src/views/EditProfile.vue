<template>
  <div class="profile-page">
    <h1>My profile</h1>

    <!-- MAIN NAVIGATION TABS -->
    <div class="main-nav">
      <button :class="{ active: currentTab === 'profile' }" @click="currentTab = 'profile'">Profile</button>
      <button :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'">Parking History</button>
      <button :class="{ active: currentTab === 'rentalHistory' }" @click="currentTab = 'rentalHistory'">Rental History</button>
      <button :class="{ active: currentTab === 'listings' }" @click="currentTab = 'listings'">My Listings</button>
    </div>

    <!-- PROFILE TAB -->
    <div v-if="currentTab === 'profile'" class="profile-content">
      <!-- LEFT SECTION -->
      <div class="form-left">
        <label>
          <h3>Firstname</h3>
          <input type="text" v-model="firstName" placeholder="Firstname" />
          <p class="validation-error" v-if="submitted && firstName && !/^[A-Za-z]+$/.test(firstName)">
            First name must only contain letters.
          </p>
        </label>

        <label>
          <h3>Lastname</h3>
          <input type="text" v-model="lastName" placeholder="Lastname" />
          <p class="validation-error" v-if="submitted && lastName && !/^[A-Za-z]+$/.test(lastName)">
            Last name must only contain letters.
          </p>
        </label>

        <label>
          <h3>Registered address</h3>
          <input type="text" v-model="address" placeholder="Address" />
          <p class="validation-error" v-if="submitted && address && address.length < 3">
            Address must be at least 3 characters.
          </p>
        </label>

        <h3>Contact info</h3>

        <label>
          <h3>Phone number</h3>
          <input type="tel" v-model="phone" placeholder="+4712341234" />
          <p class="validation-error" v-if="submitted && phone && !/^\+?\d{7,15}$/.test(phone)">
            Phone number must be valid and contain only digits.
          </p>
        </label>

        <label>
          <h3>Mail</h3>
          <input type="email" v-model="email" placeholder="example@hotmail.com" />
          <p class="validation-error" v-if="submitted && email && !/.+@.+\..+/.test(email)">
            Please enter a valid email address.
          </p>
        </label>

        <h3>Change password</h3>

        <input type="password" placeholder="Old password" v-model="oldPassword" :disabled="isGoogleUser" />
        <input type="password" placeholder="New password" v-model="newPassword" :disabled="isGoogleUser" />
        <input type="password" placeholder="Confirm password" v-model="confirmPassword" :disabled="isGoogleUser" />

        <p class="validation-error" v-if="!isGoogleUser && newPassword && newPassword.length < 6">
          New password must be at least 6 characters.
        </p>
        <p class="validation-error" v-if="!isGoogleUser && newPassword && newPassword !== confirmPassword">
          Passwords do not match.
        </p>

        <p v-if="isGoogleUser" class="google-warning">
          You're signed in with Google. To change your password, please visit your Google Account settings.
        </p>

        <button class="submit-btn" @click="updateProfile">Save</button>
      </div>

      <!-- RIGHT SECTION -->
      <div class="form-right">
        <h3>Profile picture</h3>
        <div class="profile-pic-box">
          <img :src="previewUrl || user?.photoURL || defaultAvatar" alt="img" class="profile-pic" />
        </div>

        <input type="file" id="picUpload" @change="onFileChange" :disabled="isGoogleUser" hidden />
        <label for="picUpload" class="upload-btn" :class="{ disabled: isGoogleUser }">
          Change Picture
        </label>

        <p v-if="isGoogleUser" class="google-warning pic-note">
          You're signed in with Google. To change your profile picture, update it in your Google Account.
        </p>
      </div>
    </div>

    <!-- PARKING HISTORY TAB -->
    <div v-if="currentTab === 'history'" class="secondary-tab">
    <h2>Parking History</h2>
    <div v-if="loadingHistory">Loading...</div>
    <div v-else-if="parkingHistory.length === 0">You haven’t booked any spots yet.</div>
    <ul v-else>
  <li v-for="booking in parkingHistory" :key="booking.id">
    <div>
      <strong>{{ booking.address }}</strong><br />
      {{ mapDay(booking.day) }} — {{ booking.startTime }} to {{ booking.endTime }}
    </div>
    <button @click="cancelBooking(booking.id)" class="cancel-btn">Cancel</button>
  </li>
</ul>

  </div>

    <!-- RENTAL HISTORY TAB -->
    <div v-if="currentTab === 'rentalHistory'" class="secondary-tab">
      <h2>Rental History</h2>
      <p>This section will show who has rented your spots. (Feature coming soon!)</p>
    </div>

    <!-- MY LISTINGS TAB -->
    <div v-if="currentTab === 'listings'" class="secondary-tab">  <h2>My Listings</h2>

  <div v-if="loadingListings">Loading your listings...</div>
  <div v-else-if="listings.length === 0">You haven’t listed any spots yet.</div>
  <div v-else class="listing-cards">
    <div v-for="(listing, index) in listings" :key="listing.id" class="listing-card">
  <h3>Listing {{ index + 1 }} - {{ formatDate(listing.createdAt?.toDate?.()) }}</h3>

      <p><strong>Address:</strong> {{ listing.address }}</p>
      <p><strong>Price:</strong> {{ listing.price }} kr ({{ listing.paymentPeriod }})</p>
      <p><strong>Available:</strong> {{ listing.availableWeekdays }} | {{ listing.startTime }}–{{ listing.endTime }}</p>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "@/firebase";
import defaultAvatar from "@/assets/default-user.png";

export default {
  name: "EditProfile",
  data() {
    return {
      user: null,
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      photoFile: null,
      previewUrl: null,
      defaultAvatar,
      isGoogleUser: false,
      submitted: false,
      currentTab: "profile",

      listings: [],
      loadingListings: false,
      parkingHistory: [],
      loadingHistory: false
    };
  },
  mounted() {
    const auth = getAuth();
    this.user = auth.currentUser;

    if (this.user) {
      const providerData = this.user.providerData[0];
      this.isGoogleUser = providerData.providerId === "google.com";

      this.firstName = this.user.displayName?.split(" ")[0] || "";
      this.lastName = this.user.displayName?.split(" ")[1] || "";
      this.email = this.user.email || "";

      this.fetchListings();
      this.fetchParkingHistory();
    }
  },
  methods: {

    async fetchListings() {
      if (!this.user) return;
      this.loadingListings = true;
      try {
        const q = query(
          collection(db, "listings"),
          where("ownerId", "==", this.user.uid)
        );

        const querySnapshot = await getDocs(q);
        this.listings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        this.loadingListings = false;
      }
    },

    async fetchParkingHistory() {
      if (!this.user) return;
      this.loadingHistory = true;
      try {
        const q = query(
          collection(db, "bookings"),
          where("renterId", "==", this.user.uid)
        );
        const snapshot = await getDocs(q);
        this.parkingHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error("Error fetching parking history:", err);
      } finally {
        this.loadingHistory = false;
      }
    },

    async cancelBooking(bookingId) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        this.parkingHistory = this.parkingHistory.filter(b => b.id !== bookingId);
      } catch (err) {
        console.error("Error canceling booking:", err);
      }
    },

  mapDay(day) {
    const days = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
      Sa: "Saturday",
      Su: "Sunday"
    };
    return days[day] || day;
  }
},

    formatDate(date) {
      if (!date) return "";
      return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "medium"
      }).format(date);
    },

    onFileChange(e) {
      if (this.isGoogleUser) return;
      const file = e.target.files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }
      this.photoFile = file;
      if (file) this.previewUrl = URL.createObjectURL(file);
    },

    async updateProfile() {
      this.submitted = true;

      const nameValid = /^[A-Za-z]+$/;
      const phoneValid = /^\+?\d{7,15}$/;
      const emailValid = /.+@.+\..+/;

      if (
        (this.firstName && !nameValid.test(this.firstName)) ||
        (this.lastName && !nameValid.test(this.lastName)) ||
        (this.phone && !phoneValid.test(this.phone)) ||
        (this.email && !emailValid.test(this.email)) ||
        (this.address && this.address.length < 3)
      ) {
        return;
      }

      if (!this.isGoogleUser && this.newPassword && this.newPassword.length < 6) {
        return;
      }

      if (!this.isGoogleUser && this.newPassword && this.newPassword !== this.confirmPassword) {
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      const displayName = `${this.firstName} ${this.lastName}`;
      const updates = { displayName };

      try {
        if (this.photoFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            updates.photoURL = reader.result;
            await updateProfile(user, updates);
            alert("Profile updated!");
          };
          reader.readAsDataURL(this.photoFile);
        } else {
          await updateProfile(user, updates);
          alert("Profile updated!");
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      }
    }
  }

</script>


<style scoped>
.profile-page {
  background-color: #ABC89D;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: "Nunito Sans", sans-serif;
  color: #2c3e50;
}

h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
}

/* UPDATED MAIN NAVIGATION BUTTONS */
.main-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 20px;
}

.main-nav button {
  padding: 10px 20px;
  font-weight: bold;
  background-color: #ffffff;
  color: #2c3e50;
  border: 1px solid #d0e3cf;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.main-nav button:hover {
  background-color: #f0f5f2;
}

.main-nav button.active {
  background-color: #94B88A;
  color: #ffffff;
  border-color: #94B88A;
}

.secondary-tab {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  max-width: 1100px;
  margin: auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.form-left,
.form-right {
  flex: 1 1 450px;
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  margin-bottom: 10px;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #AFCDBB;
  outline: none;
}

label h3 {
  margin-bottom: 5px;
  font-size: 16px;
}

.profile-pic-box {
  width: 100%;
  max-width: 300px;
  height: 220px;
  background: #ffffff;
  border: 2px dashed #AFCDBB;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 15px;
}

.profile-pic {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.upload-btn {
  background-color: #fcab64;
  color: white;
  padding: 10px 20px;
  margin-top: 5px;
  border: none;
  border-radius: 8px;
  width: fit-content;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.upload-btn:hover {
  background-color: #f19133;
}

.upload-btn.disabled {
  background-color: #ccc;
  pointer-events: none;
}

.submit-btn {
  background-color: #fcd29f;
  color: #333;
  font-weight: bold;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background-color: #fcab64;
  color: white;
}

.google-warning {
  color: #8b0000;
  font-size: 14px;
  margin-top: 8px;
  font-style: italic;
  max-width: 300px;
}

.pic-note {
  margin-top: 10px;
}

.validation-error {
  color: crimson;
  font-size: 13px;
  margin-top: -5px;
  margin-bottom: 10px;
}
.listing-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.listing-card {
  text-align: left;
  background: #f9f9f9;
  border: 1px solid #d0e3cf;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.05);
}

.cancel-btn {
  margin-left: 15px;
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.cancel-btn:hover {
  background-color: #c0392b;
}

.secondary-tab ul {
  text-align: left;
  padding-left: 0;
  list-style: none;
  max-width: 700px;
  margin: 0 auto;
}

.secondary-tab li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 15px 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.secondary-tab h2 {
  margin-bottom: 30px; /* Adjust the value as needed */
}


</style>