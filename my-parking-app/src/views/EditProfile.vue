<template>
  <div class="profile-page">
    <h1>My profile</h1>

    <!-- === MAIN NAVIGATION TABS === -->
    <div class="main-nav">
      <button :class="{ active: currentTab === 'profile' }" @click="currentTab = 'profile'">Profile</button>
      <button :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'">Parking History</button>
      <button :class="{ active: currentTab === 'rentalHistory' }" @click="currentTab = 'rentalHistory'">Rental History</button>
      <button :class="{ active: currentTab === 'listings' }" @click="currentTab = 'listings'">My Listings</button>
    </div>

    <!-- === PROFILE TAB === -->
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
          <input type="email" v-model="email" placeholder="example@hotmail.com" :disabled="isGoogleUser" />
          <p class="validation-error" v-if="submitted && email && !/.+@.+\..+/.test(email)">
            Please enter a valid email address.
          </p>
        </label>

        <p v-if="isGoogleUser" class="google-warning">You're signed in with Google.</p>

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

        <button
  type="button"
  class="submit-btn"
  @click="updateProfile"
  :disabled="updatingProfile"
>
  {{ updatingProfile ? "Saving..." : "Save" }}
</button>

      </div>

      <!-- RIGHT SECTION -->
      <div class="form-right">
        <h3>Profile picture</h3>
        <div class="profile-pic-box">
          <img :src="previewUrl || user?.photoURL || defaultAvatar" alt="Profile picture" class="profile-pic" />
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

    <!-- === PARKING HISTORY TAB === -->
    <div v-if="currentTab === 'history'" class="secondary-tab">
      <h2>Parking History</h2>
      <div v-if="loadingHistory">Loading your parking history...</div>
      <div v-else-if="parkingHistory.length === 0">You haven’t booked any spots yet.</div>
      <div v-else>
        <div v-for="booking in parkingHistory" :key="booking.id" class="listing-card">
          <p><strong>Address:</strong> {{ booking.address }}</p>
          <p><strong>Booked:</strong> {{ formatDate(booking.createdAt?.toDate?.()) }}</p>
          <p><strong>Time:</strong> {{ booking.startTime }}–{{ booking.endTime }} on {{ booking.day }}</p>
          <button class="cancel-btn" @click="cancelBooking(booking.id)">Cancel</button>
        </div>
      </div>
    </div>

    <!-- === RENTAL HISTORY TAB === -->
    <div v-if="currentTab === 'rentalHistory'" class="secondary-tab">
      <h2>Rental History</h2>
      <div v-if="loadingRentalHistory">Loading rental history...</div>
      <div v-else-if="rentalHistory.length === 0">No rentals yet.</div>
      <div v-else>
        <div v-for="rental in rentalHistory" :key="rental.id" class="listing-card">
          <p><strong>Rented to:</strong> {{ rental.renterName || rental.renterId }}</p>
          <p><strong>Address:</strong> {{ rental.address }}</p>
          <p><strong>Booked:</strong> {{ formatDate(rental.timestamp) }}</p>
          <p><strong>Time:</strong> {{ rental.startTime }}–{{ rental.endTime }} on {{ rental.day }}</p>
        </div>
      </div>
    </div>

    <!-- === MY LISTINGS TAB === -->
    <div v-if="currentTab === 'listings'" class="secondary-tab">
      <h2>My Listings</h2>
      <div v-if="loadingListings">Loading your listings...</div>
      <div v-else-if="listings.length === 0">You haven’t listed any spots yet.</div>
      <div v-else class="listing-cards">
        <div v-for="(listing, index) in listings" :key="listing.id" class="listing-card">
          <h3>Listing {{ index + 1 }}</h3>
          <p class="published-date">Published on: {{ formatDate(listing.createdAt?.toDate?.()) }}</p>
          <p><strong>Address:</strong> {{ listing.address }}</p>
          <p><strong>Price:</strong> {{ listing.price }} kr /hour</p>
          <p><strong>Available:</strong> {{ mapWeekdays(listing.availableWeekdays) }} | {{ listing.startTime }}–{{ listing.endTime }}</p>

          <button class="submit-btn" @click="openEditModal(listing)">Edit</button>

          <!-- === EDIT LISTING MODAL === -->
          <div v-if="editingListing?.id === listing.id" class="edit-modal">
            <h3>Edit Listing</h3>

            <label>Available Days:</label>
            <div class="weekdays-checkboxes">
              <label v-for="day in allWeekdays" :key="day.value">
                <input type="checkbox" :value="day.value" v-model="editForm.availableWeekdays" />
                {{ day.label }}
              </label>
            </div>

            <label>Address:
              <input v-model="editForm.address" />
            </label>
            <label>Price:
              <input type="number" v-model="editForm.price" />
            </label>
            <label>Start Time:
              <input type="time" v-model="editForm.startTime" />
            </label>
            <label>End Time:
              <input type="time" v-model="editForm.endTime" />
            </label>

            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <button class="submit-btn" @click="saveEdit">Save</button>
              <button class="delete-btn" @click="deleteListing(listing.id)">Delete</button>
              <button class="cancel-btn" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc as docRef,
  setDoc,
  doc,
  updateDoc,
  deleteDoc
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
      updatingProfile: false,
      loadingRentalHistory: false,

      listings: [],
      loadingListings: false,
      editingListing: null,
      allWeekdays: [
        { label: "Mon", value: "M" },
        { label: "Tue", value: "T" },
        { label: "Wed", value: "W" },
        { label: "Thu", value: "Th" },
        { label: "Fri", value: "F" },
        { label: "Sat", value: "Sa" },
        { label: "Sun", value: "Su" }
      ],
      editForm: {
        address: '',
        price: '',
        startTime: '',
        endTime: '',
        availableWeekdays: []
      },
      rentalHistory: [],
      parkingHistory: [],
      loadingHistory: false
    };
  },
  
async mounted() {
  const auth = getAuth();
  this.user = auth.currentUser;

  if (this.user) {
    const providerData = this.user.providerData[0];
    this.isGoogleUser = providerData.providerId === "google.com";

    this.firstName = this.user.displayName?.split(" ")[0] || "";
    this.lastName = this.user.displayName?.split(" ")[1] || "";
    this.email = this.user.email || "";

    // Load phone and address from Firestore
    try {
      const userDocRef = docRef(db, "users", this.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        this.address = userData.address || "";
        this.phone = userData.phone || "";
      }
    } catch (err) {
      console.warn("Failed to load user extra fields:", err);
    }

    this.fetchListings();
    this.fetchParkingHistory();
    this.fetchRentalHistory();
  }
},

methods: {
  async updateProfile() {
    this.submitted = true;
    this.updatingProfile = true;

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
      this.updatingProfile = false;
      return;
    }

    if (!this.isGoogleUser && this.newPassword && this.newPassword.length < 6) {
      this.updatingProfile = false;
      return;
    }

    if (!this.isGoogleUser && this.newPassword && this.newPassword !== this.confirmPassword) {
      this.updatingProfile = false;
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const displayName = `${this.firstName} ${this.lastName}`;
    const updates = { displayName };

    try {
      if (!this.isGoogleUser && this.oldPassword && this.newPassword) {
        const credential = EmailAuthProvider.credential(this.email, this.oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, this.newPassword);
      }

      if (!this.isGoogleUser && this.email !== user.email) {
        await updateEmail(user, this.email);
      }

      if (this.photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            updates.photoURL = reader.result;
            await updateProfile(user, updates);
            alert("Profile updated!");
          } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile.");
          } finally {
            this.updatingProfile = false;
          }
        };
        reader.readAsDataURL(this.photoFile);
        return;
      } else {
        await updateProfile(user, updates);
        alert("Profile updated!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      try {
        const userDocRef = docRef(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, {
            address: this.address,
            phone: this.phone
          });
        } else {
          await setDoc(userDocRef, {
            address: this.address,
            phone: this.phone,
            uid: user.uid,
            createdAt: new Date()
          });
        }
      } catch (err) {
        console.error("Error writing user info to Firestore:", err);
        alert("Failed to save address/phone.");
      }

      this.updatingProfile = false;
    }
  },

  async cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      this.parkingHistory = this.parkingHistory.filter(b => b.id !== bookingId);
    } catch (err) {
      console.error("Error canceling booking:", err);
    }
  },

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

  async deleteListing(listingId) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "listings", listingId));
      this.listings = this.listings.filter(listing => listing.id !== listingId);
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Could not delete the listing.");
    }
  },

  openEditModal(listing) {
    this.editingListing = listing;
    this.editForm = {
      address: listing.address || '',
      price: listing.price || '',
      startTime: listing.startTime || '',
      endTime: listing.endTime || '',
      availableWeekdays: listing.availableWeekdays || []
    };
  },

  cancelEdit() {
    this.editingListing = null;
  },

  async saveEdit() {
    if (!this.editingListing?.id) return;
    try {
      const docRef = doc(db, "listings", this.editingListing.id);
      await updateDoc(docRef, { ...this.editForm });
      Object.assign(this.editingListing, this.editForm);
      this.editingListing = null;
    } catch (err) {
      console.error("Failed to update listing:", err);
      alert("Could not save changes.");
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

  async fetchRentalHistory() {
    if (!this.user) return;
    this.loadingRentalHistory = true;
    try {
      const q = query(
        collection(db, "rentalHistory"),
        where("ownerId", "==", this.user.uid)
      );
      const snapshot = await getDocs(q);
      const records = await Promise.all(
        snapshot.docs.map(async doc => {
          const data = doc.data();
          let renterName = "Unknown";
          try {
            const userDoc = await getDoc(doc(db, "users", data.renterId));
            if (userDoc.exists()) {
              const userInfo = userDoc.data();
              renterName = userInfo.displayName || userInfo.firstName || userInfo.email || data.renterId;
            }
          } catch (err) {
            console.warn("Failed to fetch renter info:", err);
          }
          return {
            id: doc.id,
            ...data,
            renterName
          };
        })
      );
      this.rentalHistory = records;
    } catch (err) {
      console.error("Error fetching rental history:", err);
    } finally {
      this.loadingRentalHistory = false;
    }
  },

  onFileChange(e) {
    if (this.isGoogleUser) return;
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB.");
      return;
    }
    this.photoFile = file;
    this.previewUrl = URL.createObjectURL(file);
  },

  mapWeekdays(codes) {
    const dayMap = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      Th: "Thursday",
      F: "Friday",
      Sa: "Saturday",
      Su: "Sunday"
    };

    if (typeof codes === 'string') {
      codes = codes.split(',').map(code => code.trim());
    }

    if (!Array.isArray(codes)) return '';
    return codes.map(code => dayMap[code] || code).join(', ');
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
  },

  formatDate(date) {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date.toDate ? date.toDate() : date);
  }
}
}
</script>


<style scoped>
/* ==== Base Layout ==== */
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
  margin-bottom: 20px;
  color: white;
}

/* ==== Navigation Tabs ==== */
.main-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
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

/* ==== Profile and Tab Content ==== */
.secondary-tab {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.secondary-tab h2 {
  margin-bottom: 30px;
}

.secondary-tab ul {
  list-style: none;
  padding-left: 0;
  text-align: left;
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

/* ==== Inputs & Labels ==== */
label h3 {
  margin-bottom: 5px;
  font-size: 16px;
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

/* ==== Profile Picture ==== */
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

/* ==== Listing Cards ==== */
.listing-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.listing-card {
  background: #f9f9f9;
  border: 1px solid #d0e3cf;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

/* ==== Buttons ==== */
.submit-btn,
.cancel-btn,
.delete-btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  margin-top: 10px;
}

.submit-btn {
  background-color: #5B8D8A;
  color: white;
}

.submit-btn:hover {
  background-color: #FED28D;
  color: #333;
}

.cancel-btn {
  margin-left: 15px;
  background-color: #e74c3c;
  color: white;
  font-size: 14px;
  border-radius: 6px;
  padding: 6px 12px;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.delete-btn {
  background-color: #FED28D;
  color: #333;
}

.delete-btn:hover {
  background-color: #5B8D8A;
  color: white;
}

/* ==== Edit Modal ==== */
.edit-modal {
  background: #ffffff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.edit-modal label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #333;
}

.edit-modal input {
  margin-top: 5px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.edit-modal button {
  width: fit-content;
}

/* ==== Weekday Checkboxes ==== */
.weekdays-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.weekdays-checkboxes label {
  display: flex;
  align-items: center;
  background: #f0f5f2;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s ease;
}

.weekdays-checkboxes input {
  margin-right: 6px;
}

/* ==== Other Utility Classes ==== */
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
</style>
