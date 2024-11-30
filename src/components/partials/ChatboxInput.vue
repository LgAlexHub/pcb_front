<template>
    <form @submit.prevent="onSubmit" class="w-full flex flex-row border bord-slate-300">
        <input type="text" class="basis-3/4 text-black px-2" placeholder="Envoyer votre message"
            v-model="messageInput" id="message_input">
        <button class="text-center flex-1" type="submit">Envoyer</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
    const messageInput = ref('');
    const emits = defineEmits(['onSubmit']);
    function onSubmit(){
        emits('onSubmit', messageInput.value);
        messageInput.value = '';
    }
</script>