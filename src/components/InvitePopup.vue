<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <!-- Overlay semi-transparent -->
      <div 
        class="absolute inset-0 bg-black opacity-50" 
        @click="handleNo"
      ></div>
      
      <!-- Contenu Modal -->
      <div class="relative w-auto max-w-md mx-auto my-6">
        <div class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <!-- Titre -->
          <div class="flex items-start justify-between p-5 border-b border-solid rounded-t bg-slate-900">
            <h3 class="text-xl font-semibold">
              {{ title }}
            </h3>
            <button 
              class="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              @click="handleNo"
            >
              ×
            </button>
          </div>
          
          <!-- Corps du message -->
          <div class="relative flex-auto p-6">
            <p class="my-4 text-lg leading-relaxed text-black text-center">
              {{ message.username }} vous a invité à jouer, acceptez-vous ?
            </p>
          </div>
          
          <!-- Boutons -->
          <div class="flex bg-sky-800 items-center justify-end p-6 border-t border-solid rounded-b">
            <button
              class="px-6 py-2 mb-1 mr-4 bg-white rounded text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              @click="handleNo"
            >
              Non
            </button>
            <button
              class="px-6 py-2 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none text-emerald-500 bg-white hover:shadow-lg focus:outline-none"
              type="button"
              @click="handleYes"
            >
              Oui
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Confirmation'
    },
    message: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['yes', 'no'])
  
  const handleYes = () => {
    emit('yes')
    closeModal()
  }
  
  const handleNo = () => {
    emit('no')
    closeModal()
  }
  </script>