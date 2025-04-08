<template>
  <div class="edit-profile-container">
    <h2>Edit Profile</h2>

    <form @submit.prevent="updateProfile">
      <label for="displayName">Display Name:</label>
      <input type="text" v-model="displayName" id="displayName" />

      <label for="photo">Profile Picture:</label>
      <input type="file" @change="onFileChange" id="photo" />

      <button type="submit">Update Profile</button>
    </form>

    <div class="preview" v-if="previewUrl">
      <h4>New Profile Picture Preview:</h4>
      <img :src="previewUrl" alt="Preview" class="preview-img" />
    </div>
  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";

export default {
  name: "EditProfile",
  data() {
    return {
      user: null,
      displayName: "",
      photoFile: null,
      previewUrl: null
    };
  },
  mounted() {
    const auth = getAuth();
    this.user = auth.currentUser;
    if (this.user) {
      this.displayName = this.user.displayName || "";
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.photoFile = file;

      if (file) {
        this.previewUrl = URL.createObjectURL(file);
      }
    },
    async updateProfile() {
      try {
        const updates = {};
        const user = this.user;

        if (user.displayName !== this.displayName) {
          updates.displayName = this.displayName;
        }

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
};
</script>

<style scoped>
.edit-profile-container {
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  font-family: "Nunito Sans", sans-serif;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  margin: 10px 0 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #5c946e;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}

button:hover {
  background-color: #4d7c5c;
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
