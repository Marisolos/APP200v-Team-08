<template>
    <div class="register-container">
      <h2 class="page-title">{{ $t('register.title') }}</h2>
  
      <div class="form-section">
        <h3>{{ $t('register.features.title') }}</h3>
        <label>{{ $t('register.features.description') }}</label><br><br>
        <div>
          <label><input class="features" type="checkbox" v-model="form.hasCamera"> {{ $t('register.features.camera') }}</label><br>
          <label><input class="features" type="checkbox" v-model="form.hasCharger"> {{ $t('register.features.charger') }}</label><br>
          <label><input class="features" type="checkbox" v-model="form.hasHeating"> {{ $t('register.features.heating') }}</label><br>
          <label><input class="features" type="checkbox" v-model="form.roofChecked"> {{ $t('register.features.roof') }}</label>
        </div>
      </div>
  
      <div class="form-section">
        <h3>{{ $t('register.dimensions.title') }}</h3>
        <label>{{ $t('register.dimensions.description') }}</label>
        <div class="form-section">

          <label>{{ $t('register.dimensions.length') }}</label><br>
          <input type="text" class="text-input"
          :class="{ 'input-error': errors.length && touched.length }"
          required
          v-model="form.length"
          @input="validateMeasurement('length')"
          @blur="touched.length = true"
          @focus="errors.length = false"
          maxlength="5"
          />

          <label>{{ $t('register.dimensions.width') }}</label><br>
          <input type="text" class="text-input"
          :class="{ 'input-error': errors.width && touched.width }"
          v-model="form.width"
          @input="validateMeasurement('width')"
          @blur="touched.width = true"
          @focus="errors.width = false"
          maxlength="5"
          />

        <label>{{ $t('register.dimensions.height') }}</label><br>
        <input type="text" class="text-input"
          :class="{ 'input-error': errors.height && touched.height }"
          v-model="form.height"
          @input="validateMeasurement('height')"
          @blur="touched.height = true"
          @focus="errors.height = false"
          maxlength="5"
          />
          <div v-if="errors.height && touched.height" class="error-text">
            {{ $t('register.dimensions.height.error') }}
          </div>
        </div>
    </div>

      <div class="form-section">
        <h3>{{ $t('register.access.title') }}</h3>
        <div style="margin-bottom: 16px;">
          <label>{{ $t('register.access.description') }}</label><br>
          <select class="text-input" v-model="form.accessType">
            <option>{{ $t('register.access.open') }}</option>
            <option>{{ $t('register.access.key') }}</option>
            <option>{{ $t('register.access.code') }}</option>
          </select>
        </div>
    </div>
  
    <div class="form-section">
  <h3>{{ $t('register.availability.title') }}</h3>
  <p>{{ $t('register.availability.description') }}<br>{{ $t('register.availability.description2') }}</p>
  <div class="horizontal-group" style="flex-wrap: wrap;">
    <label><input type="checkbox" value="monday" v-model="form.selectedDays"> {{ $t('monday') }}</label>
    <label><input type="checkbox" value="tuesday" v-model="form.selectedDays"> {{ $t('tuesday') }}</label>
    <label><input type="checkbox" value="wednesday" v-model="form.selectedDays"> {{ $t('wednesday') }}</label>
    <label><input type="checkbox" value="thursday" v-model="form.selectedDays"> {{ $t('thursday') }}</label>
    <label><input type="checkbox" value="friday" v-model="form.selectedDays"> {{ $t('friday') }}</label>
    <label><input type="checkbox" value="saturday" v-model="form.selectedDays"> {{ $t('saturday') }}</label>
    <label><input type="checkbox" value="sunday" v-model="form.selectedDays"> {{ $t('sunday') }}</label>
      <div v-if="errors.selectedDays && touched.selectedDays" class="error-text">
        {{ $t('register.availability.error') }}
      </div>
  </div>

  <div style="margin-top: 16px;">
    <label>{{ $t('register.availability.repeat') }}</label><br>
    <select class="text-input" v-model="form.repeatPattern">
      <option value="everyWeek">{{ $t('register.availability.everyWeek') }}</option>
      <option value="everyOtherWeek">{{ $t('register.availability.everyOtherWeek') }}</option>
      <option value="firstWeekOfTheMonth">{{ $t('register.availability.firstWeekOfTheMonth') }}</option>
      <option value="lastWeekOfTheMonth">{{ $t('register.availability.lastWeekOfTheMonth') }}</option>
    </select>
  </div>

  <div style="margin-top: 16px;">
        <label>{{ $t('register.availability.timeRange') }}</label><br>
        <div class="horizontal-group">
            <input type="time" v-model="form.startTime" class="text-input">
            <input type="time" v-model="form.endTime" class="text-input">
        </div>
    </div>

        <div class="right" style="margin-top: 16px;">
            <button class="search-button" @click="addRule">{{ $t('register.availability.addRule') }}</button>
        </div>
    </div>

        <div class="form-section">
        <h4>{{ $t('register.availability.addedRules') }}</h4>
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
    <button class="search-button" style="padding: 10px 31px;">{{ $t('register.back') }}</button>
  </router-link>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
    </div>
    <span class="progress-text">{{ $t('register.page', { current: currentStep, total: totalSteps }) }}</span>
  </div>
  <button class="search-button" @click="validateAndGoToNextPage">{{ $t('register.next') }}</button>
</div>
</div>
  </template>
  
  
  <script>
  import { useRegisterFormStore } from '@/stores/registerForm'

  export default {
    name: "RegisterParking2",
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

      mounted() {
      this.form.allDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ];
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
    alert(this.$t("register.availability.error"));
    return;
  }

  const allDays = this.form.allDays;
  const selectedDays = this.form.selectedDays;
  const selectedSet = new Set(selectedDays);
  const unselectedDays = allDays.filter(day => !selectedSet.has(day));

  let daysDescription = "";
  if (selectedSet.size === allDays.length) {
    daysDescription = this.$t("register.availability.everyDay");
  } else if (unselectedDays.length <= 2) {
    const translated = unselectedDays.map(day => this.$t(day)).join(", ");
    daysDescription = `${this.$t("register.availability.everyDayExcept")} ${translated})`;
  } else {
    const sortedSelected = allDays.filter(day => selectedSet.has(day));
    daysDescription = sortedSelected.map(day => this.$t(day)).join(", ");
  }

  this.form.daysDescription = daysDescription;

  const repeatTranslated = this.$t(`register.availability.${this.form.repeatPattern}`);
  const rule = `${repeatTranslated} · ${daysDescription} · ${this.form.startTime} - ${this.form.endTime}`;
  this.form.rules.push(rule);

  this.errors.selectedDays = false;
  this.touched.selectedDays = false;

  // Reset fields
  this.form.selectedDays = [];
  this.form.repeatPattern = "";
  this.form.startTime = "08:00";
  this.form.endTime = "16:00";
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
        this.form.progressLevel = 3;
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
  width: 66.66%; 
}

.select-tid {
  width: 33.33%; 
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