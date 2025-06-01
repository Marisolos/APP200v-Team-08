<template>
  <div class="register-container">
    <h2 class="page-title">{{ $t('register.title') }}</h2>

    <div class="form-section center">
      <label><strong>{{ $t('register.useSavedAddress.question') }}</strong></label><br>
      <label><input type="radio" name="useSavedAddress" checked>{{ $t('register.useSavedAddress.yes') }}</label>
      <label style="margin-left: 16px;"><input type="radio" name="useSavedAddress">{{ $t('register.useSavedAddress.no') }}</label>
    </div>

    <div class="form-section">
      <label>{{ $t('register.address.label') }}</label>
      <AddressAutocomplete 
      @blur="touched.adresse = true"
      @focus="errors.adresse = false"
      :errors="errors"
      :touched="touched"
      @postcode-updated="hentPoststed"/>
      <span v-if="errors.adresse && touched.adresse" class="error-text">
        {{ errors.adresseMessage || $t('register.address.error') }}
      </span>
    </div>

    <div class="form-section">
      <label>{{ $t('register.postcode.label') }}</label>
      <div class="horizontal-group">
        <input
          type="text"
          :placeholder="$t('register.postcode.placeholder')"
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
          :placeholder="$t('register.postplace.placeholder')"
          v-model="form.poststed"
          readonly
          class="text-input readonly"
        />
      </div>
      <span v-if="errors.postnummer && touched.postnummer" class="error-text">{{ $t('register.postcode.error') }}</span>
    </div>

    <div class="form-section">
      <label>{{ $t('register.price.label') }}</label>
      <div class="price-group">
        <div class="price-wrapper">
          <input type="text" v-model="form.pris" @input="validerPris" @blur="touched.pris = true" @focus="errors.pris = false"
                 class="text-input no-spinner"
                 :class="{ 'input-error': errors.pris && touched.pris }"
                 placeholder="Sum" />
          <span class="price-label">kr</span>
        </div>
        <select class="text-input select-tid" v-model="form.betalingsperiode">
          <option>{{ $t('register.price.perHour') }}</option>
          <option>{{ $t('register.price.perDay') }}</option>
          <option>{{ $t('register.price.perWeek') }}</option>
          <option>{{ $t('register.price.perMonth') }}</option>
        </select>
      </div>
      <span v-if="errors.pris && touched.pris" class="error-text">{{ $t('register.price.error') }}</span>
    </div>

    <div class="form-section" style="position: relative; display: flex; align-items: center; justify-content: flex-end; min-height: 80px;">
      <div style="position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px;">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <span class="progress-text">{{ $t('register.page', { current: currentStep, total: totalSteps }) }}</span>
    <button class="search-button" @click="validateAndGoToNextPage">{{ $t('register.next') }}</button>
  </div>
  </div>
</template>

<script>
import { useRegisterFormStore } from '@/stores/registerForm'
import postnummerData from '@/assets/postnummer.json'
import AddressAutocomplete from '@/components/AddressAutocomplete.vue'
import { watch } from 'vue'

export default {
  name: 'RegisterParking1',
  components:
  { AddressAutocomplete},
  data() {
    const form = useRegisterFormStore()

    watch(() => form.adresse, (nyVerdi) => {
      if (!nyVerdi || nyVerdi.trim().length < 3) {
        form.lat = null
        form.lng = null
        form.postnummer = ''
        form.poststed = ''
      }
    })

    return {
      form,
      errors: {
        adresse: false,
        adresseMessage: '',
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
    }
  },
  methods: {
    hentPoststed() {
      this.form.postnummer = this.form.postnummer.replace(/\D/g, '').slice(0, 4)
      const sted = postnummerData[this.form.postnummer]
      this.form.poststed = sted || ''
    },
    validerPris() {
      this.form.pris = this.form.pris.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
    },
    async validateAndGoToNextPage() {
      this.errors.adresse = !this.form.adresse || this.form.adresse.trim().length < 3
      this.errors.postnummer = !this.form.postnummer || !this.form.poststed
      this.errors.pris = !this.form.pris

      this.touched.adresse = true
      this.touched.postnummer = true
      this.touched.pris = true

      if (!this.errors.adresse && !this.errors.postnummer && !this.errors.pris) {
        const erGyldigAdresse = await this.validateAdresseMedNominatim()
        if (!erGyldigAdresse) {
          this.errors.adresse = true
          this.errors.adresseMessage = this.$t('register.address.invalid')
          return
        }
        this.form.progressLevel = 2;
        this.$router.push('/register-parking-2')
      }
    },
    async validateAdresseMedNominatim() {
      const query = `${this.form.adresse} ${this.form.postnummer} ${this.form.poststed}`
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`

      try {
        const res = await fetch(url)
        const data = await res.json()

        if (!data.length || !data[0].address) return false

        const found = data[0].address
        const input = this.form.adresse.trim().toLowerCase()
        const foundRoad = found.road?.toLowerCase() || ''
        const foundHouse = found.house_number?.toLowerCase() || ''

        const normalizedFound = `${foundRoad} ${foundHouse}`.trim()

        return input === normalizedFound
      } catch (err) {
        console.error('Validering feilet:', err)
        return false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
  background-color: #ABC89D;
  min-height: 100vh;
  font-family: "Nunito Sans", sans-serif;
}

.page-title {
  font-size: 36px;
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
