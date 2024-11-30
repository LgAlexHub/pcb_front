<template>
    <div class="grid grid-cols-3 basis-1/4 gap-4">
        <button v-for="n in 9" @click="onChoice(n)" class="text-center bg-slate-400 rounded" :key="'bt-choice-' + n">
            {{ n }}
        </button>
    </div>
</template>

<script setup lang="ts">
    const emits = defineEmits(['buttonClicked']);

    function onChoice(n: number){
        emits('buttonClicked', n);
    }
</script>