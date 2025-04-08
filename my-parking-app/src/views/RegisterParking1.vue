<template>
  <div class="register-container">
    <h2 class="page-title">Registrer parkeringsplass</h2>

    <div class="form-section center">
      <label><strong>📍 Bruk lagret adresse fra profilen?</strong></label><br>
      <label><input type="radio" name="useSavedAddress" checked> Ja, bruk lagret adresse</label>
      <label style="margin-left: 16px;"><input type="radio" name="useSavedAddress"> Nei, jeg vil skrive inn en ny adresse</label>
    </div>

    <div class="form-section">
      <label>Adresse</label>
      <span v-if="errors.adresse && touched.adresse" class="error-text"> // må fylles ut</span>
      <input type="text" class="text-input" :class="{ 'input-error': errors.adresse && touched.adresse }"
             placeholder="Adresse" v-model="form.adresse" @blur="touched.adresse = true" @focus="errors.adresse = false"/>
    </div>

    <div class="form-section">
      <label>Postnummer / Poststed</label>
      <span v-if="errors.postnummer && touched.postnummer" class="error-text"> // må fylles ut</span>
      <div class="horizontal-group">
        <input
          type="text"
          placeholder="Postnummer"
          v-model="form.postnummer"
          @input="hentPoststed"
          @blur="touched.postnummer = true"
          @focus="errors.postnummer = false"
          maxlength="4"
          inputmode="numeric"
          class="text-input"
          :class="{ 'input-error': errors.postnummer && touched.postnummer }"
        />
        <input
          type="text"
          placeholder="Poststed"
          v-model="form.poststed"
          readonly
          class="text-input readonly"
        />
      </div>
    </div>

    <div class="form-section">
      <label>Pris</label>
      <span v-if="errors.pris && touched.pris" class="error-text"> // må fylles ut</span>
      <div class="price-group">
        <div class="price-wrapper">
          <input type="text" v-model="form.pris" @input="validerPris" @blur="touched.pris = true" @focus="errors.pris = false"
                 class="text-input no-spinner"
                 :class="{ 'input-error': errors.pris && touched.pris }"
                 placeholder="Sum" />
          <span class="price-label">kr</span>
        </div>
        <select class="text-input select-tid" v-model="form.betalingsperiode">
          <option>per time</option>
          <option>per dag</option>
          <option>per uke</option>
          <option>per måned</option>
        </select>
      </div>
    </div>

    <div class="form-section right" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div> <span class="progress-text">Side {{ currentStep }} av {{ totalSteps }}</span>
      </div>
      <router-link to="/register-parking-2">
        <button class="search-button" @click="validateAndGoToNextPage">Neste side →</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useRegisterFormStore } from '@/stores/registerForm'
import postnummerData from "@/assets/postnummer.json";

export default {
  name: "RegisterParking1",
  data() {
    return {
      form: useRegisterFormStore(),
      errors: {
        adresse: false,
        postnummer: false,
        pris: false
      },
      touched: {
        adresse: false,
        postnummer: false,
        pris: false
      },
      currentStep: 1,
      totalSteps: 4
    };
  },
  methods: {
    hentPoststed() {
    this.form.postnummer = this.form.postnummer.replace(/\D/g, "").slice(0, 4);
    const sted = postnummerData[this.form.postnummer];
    this.form.poststed = sted || "";
  },
    validerPris() {
      this.form.pris = this.form.pris.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    },
    validateAndGoToNextPage() {
      this.errors.adresse = !this.form.adresse;
      this.errors.postnummer = !this.form.postnummer || !this.form.poststed; //HER ER ERROR MAYBE?
      this.errors.pris = !this.form.pris;
      

      this.touched.adresse = true;
      this.touched.postnummer = true;
      this.touched.pris = true;

      if (!this.errors.adresse && !this.errors.postnummer && !this.errors.pris) {
        this.$router.push('/register-parking-2');
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  background-color: #B3C4AF;
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

.input-error {
  border-color: red;
  background-color: #ffe6e6;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-bottom: 6px;
  margin-right: auto;
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
  width: 66.66%;
}

.select-tid {
  width: 33.33%;
}

.price-label {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-80%); /* Endret fra -50% til -55% */
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
