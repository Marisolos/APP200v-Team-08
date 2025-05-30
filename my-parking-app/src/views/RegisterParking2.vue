<template>
    <div class="register-container">
      <h2 class="page-title">Registrer parkeringsplass</h2>
  
      <div class="form-section">
        <h3>Features</h3>
        <label>Select the relevant features for your parking spot.</label><br><br>
        <div>
          <label><input class="features" type="checkbox" v-model="form.hasCamera"> Video surveillance</label><br>
          <label><input class="features" type="checkbox" v-model="form.hasCharger"> EV charging</label><br>
          <label><input class="features" type="checkbox" v-model="form.hasHeating"> Heating</label><br>
          <label><input class="features" type="checkbox" v-model="form.roofChecked"> Roof</label>
        </div>
      </div>
  
      <div class="form-section">
        <h3>Dimensions</h3>
        <label>Let your guests know how much space you have to offer.</label>
        <div class="form-section">

          <label>Length (m)</label><br>
          <input type="text" class="text-input"
          :class="{ 'input-error': errors.length && touched.length }"
          required
          placeholder="Length"
          v-model="form.length"
          @input="validateMeasurement('length')"
          @blur="touched.length = true"
          @focus="errors.length = false"
          maxlength="5"
          />

          <label>Width (m)</label><br>
          <input type="text" class="text-input"
          :class="{ 'input-error': errors.width && touched.width }"
          placeholder="Width"
          v-model="form.width"
          @input="validateMeasurement('width')"
          @blur="touched.width = true"
          @focus="errors.width = false"
          maxlength="5"
          />

        <label>Height (m)</label><br>
        <input type="text" class="text-input"
          :class="{ 'input-error': errors.height && touched.height }"
          placeholder="Height"
          v-model="form.height"
          @input="validateMeasurement('height')"
          @blur="touched.height = true"
          @focus="errors.height = false"
          maxlength="5"
          />
          <div v-if="errors.height && touched.height" class="error-text">
            Du må fylle ut høyde hvis du har krysset av for tak.
          </div>
        </div>
    </div>

      <div class="form-section">
        <h3>Access type</h3>
        <div style="margin-bottom: 16px;">
          <label>Choose which way best describes how you access the parking spot.</label><br>
          <select class="text-input" v-model="form.accessType">
            <option>Open access</option>
            <option>Key</option>
            <option>Code</option>
          </select>
        </div>
    </div>
  
    <div class="form-section">
  <h3>Availability</h3>
  <p>Select available days and repeat the pattern.<br>You can add up to 4 sets of Availability patterns:</p>
  <div class="horizontal-group" style="flex-wrap: wrap;">
    <label><input type="checkbox" value="Monday" v-model="form.selectedDays"> Monday</label>
    <label><input type="checkbox" value="Tuesday" v-model="form.selectedDays"> Tuesday</label>
    <label><input type="checkbox" value="Wednesday" v-model="form.selectedDays"> Wednesday</label>
    <label><input type="checkbox" value="Thursday" v-model="form.selectedDays"> Thursday</label>
    <label><input type="checkbox" value="Friday" v-model="form.selectedDays"> Friday</label>
    <label><input type="checkbox" value="Saturday" v-model="form.selectedDays"> Saturday</label>
    <label><input type="checkbox" value="Sunday" v-model="form.selectedDays"> Sunday</label>
    <div v-if="errors.selectedDays && touched.selectedDays" class="error-text">
        Du må legge til minst en utleiesekvens.
      </div>
  </div>

  <div style="margin-top: 16px;">
    <label>Repeat pattern</label><br>
    <select class="text-input" v-model="form.repeatPattern">
      <option value="Every week">Every week</option>
      <option value="Every other week">Every other week</option>
      <option value="First week of the month">First week of the month</option>
      <option value="Last week of the month">Last week of the month</option>
    </select>
  </div>

  <div style="margin-top: 16px;">
        <label>Time range</label><br>
        <div class="horizontal-group">
            <input type="time" v-model="form.startTime" class="text-input">
            <input type="time" v-model="form.endTime" class="text-input">
        </div>
    </div>

        <div class="right" style="margin-top: 16px;">
            <button class="search-button" @click="addRule">+ Add rule</button>
        </div>
    </div>

        <div class="form-section">
        <h4>Added rules:</h4>
        <div v-for="(rule, index) in form.rules" :key="index" style="background: #f3f3f3; padding: 12px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>{{ rule }}</span>
            <span>
                <button @click="editRule(index)" style="margin-right: 8px;">✏️</button>
                <button @click="deleteRule(index)">🗑️</button>
            </span>
        </div>
    </div>
    <div class="form-section nav-footer">
  <router-link to="/register-parking-1">
    <button class="search-button" style="padding: 10px 31px;">← Tilbake</button>
  </router-link>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
    </div>
    <span class="progress-text">Side {{ currentStep }} av {{ totalSteps }}</span>
  </div>
  <button class="search-button" @click="validateAndGoToNextPage">Neste side →</button>
</div>

  <FooterComponent /> <!-- Footer Component -->
</div>
  </template>
  
  
  <script>
  import { useRegisterFormStore } from '@/stores/registerForm'
import FooterComponent from '@/components/Footer.vue' // Import the Footer component

  export default {
    name: "RegisterParking2",
    components: {
      FooterComponent // Register the Footer component
    },
    data() {
  return {
    currentStep: 2,
    totalSteps: 4,
    errors: {
      length: false,
      width: false,
      selectedDays: false,
      height: false
    },
    touched: {
      length: false,
      width: false,
      selectedDays: false,
      height: false
      }
    };
  },
    setup() {
        const form = useRegisterFormStore()
        return { form }
        },

    methods: {
    validateMeasurement(field) {
      let value = this.form[field];
      // Replace commas with dots for standard decimal notation
      value = value.replace(',', '.');
      // Remove invalid characters (anything that's not a digit or a dot)
      value = value.replace(/[^0-9.]/g, '');
      // Ensure only one dot is present
      const parts = value.split('.');
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join('')}`;
      }
      // Limit to one decimal place
      if (parts[1] && parts[1].length > 1) {
        parts[1] = parts[1].slice(0, 1);
        value = parts.join('.');
      }
      // Replace dot back with comma for display
      value = value.replace('.', ',');
      this.form[field] = value;
      // 
      value = value.replace(/^0+(?=\d)/, "");

      if (value.length > 1) {
        value = value.replace(/^0+(?=\d)/, '');
      }
      this.form[field] = value;
    },
    
    addRule() {
    if (
        this.form.selectedDays.length === 0 ||
        !this.form.repeatPattern ||
        !this.form.startTime ||
        !this.form.endTime
    ) {
        alert('Please select all fields before adding a rule.');
        return;
    }

    const allDays = this.form.allDays;
    const selectedDays = this.form.selectedDays;

    const selectedSet = new Set(selectedDays);
    const unselectedDays = allDays.filter(day => !selectedSet.has(day));

    this.form.daysDescription = '';
    if (selectedSet.size === allDays.length) {
        this.form.daysDescription = 'Every day';
    } else if (unselectedDays.length <= 2) {
        this.form.daysDescription = `Every day (except ${unselectedDays.join(', ')})`;
    } else {
        const sortedSelected = allDays.filter(day => selectedSet.has(day));
        this.form.daysDescription = sortedSelected.join(', ');
    }

    const rule = `${this.form.repeatPattern} · ${this.form.daysDescription} · ${this.form.startTime}–${this.form.endTime}`;
    this.form.rules.push(rule);
    console.log(this.form.rules);

    // Reset fields
    this.form.selectedDays = [];
    this.form.repeatPattern = '';
    this.form.startTime = '08:00';
    this.form.endTime = '16:00';
    },

    editRule(index) {
        const rule = this.form.rules[index];
        const parts = rule.split(' · ');
        this.form.repeatPattern = parts[0];
        this.form.selectedDays = parts[1].split(', ');
        const times = parts[2].split('–');
        this.form.startTime = times[0];
        this.form.endTime = times[1];
        this.form.rules.splice(index, 1);
    },

    deleteRule(index) {
        this.form.rules.splice(index, 1);
    },

    validateAndGoToNextPage() {
      this.errors.length = !this.form.length;
      this.errors.width = !this.form.width;
      this.errors.selectedDays = this.form.rules.length === 0;
      this.errors.height = this.form.roofChecked && !this.form.height;

      this.touched.length = true;
      this.touched.width = true;
      this.touched.selectedDays = true;
      this.touched.height = true;

      if (!this.errors.length && !this.errors.width && !this.errors.selectedDays && !this.errors.height) {
        this.$router.push('/register-parking-3');
      }
    }

  },
};
  </script>

<style scoped>
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

.error-text {
  color: red;
  margin-bottom: 6px;
  margin-right: auto;
}

.input-error {
  border-color: red;
  background-color: #ffe6e6;
}

</style>