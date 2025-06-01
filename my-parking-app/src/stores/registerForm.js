// stores/registerForm.js
import { defineStore } from 'pinia'

export const useRegisterFormStore = defineStore('registerForm', {
  state: () => ({
    adresse: '',
    description: '',
    pris: '',
    postnummer: '',
    poststed: '',
    betalingsperiode: 'per time',
    availabilityStart: '',
    availabilityEnd: '',
    availableDays: [],
    dailyStartTime: '',
    dailyEndTime: '',
    hasCharger: false,
    hasCamera: false,
    hasHeating: false,
    roofChecked: false,
    accessType: 'Open access',
    startTime: '08:00',
    endTime: '16:00',
    repeatPattern: 'Every week',
    length: '',
    width: '',
    height: '',
    rules: [],
    selectedDays: [],
    allDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    images: [],
    guidelines: "",
    additionalInfo: "",
    daysDescription: "",
    progressLevel: 1
  }),
  persist: true,
})