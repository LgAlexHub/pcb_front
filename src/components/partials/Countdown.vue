<template>
    <div class="flex h-1/2 justify-center items-center relative">
        <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#e0e0e0" 
                stroke-width="10"
            />
            <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#4CAF50" 
                stroke-width="10"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                transform="rotate(-90 50 50)"
                class="transition-all duration-1000 ease-linear"
            />
        </svg>
        <p class="text-3xl z-10 relative">{{ currentCount }}</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';

const props = defineProps({
    countInSeconds: {
        required: true,
        type: Number
    },
    endCallback: {
        required: true,
        type: Function
    }
});

const currentCount = ref(0);
const elapsedSeconds = ref(0);

// Calculer la circonstance du cercle
const circumference = 2 * Math.PI * 45;

// Calculer le offset du cercle en fonction des secondes écoulées
const progressOffset = computed(() => {
    const progress = elapsedSeconds.value / props.countInSeconds;
    return circumference * (1 - progress);
});

function countdown() {
    if (currentCount.value > 0) {
        setTimeout(() => {
            currentCount.value -= 1;
            elapsedSeconds.value += 1;
            countdown();
        }, 1000);
    }
}

// Utiliser un watcher pour gérer précisément la fin du compte à rebours
watch(currentCount, (newValue) => {
    if (newValue === 0) {
        // Attendre la dernière transition du cercle avant d'appeler le callback
        setTimeout(() => {
            props.endCallback();
        }, 1000);
    }
});

onMounted(() => {
    currentCount.value = props.countInSeconds;
    elapsedSeconds.value = 0;
    countdown();
});
</script>

<style scoped>
.transition-all {
    transition: stroke-dashoffset 1s linear;
}
</style>