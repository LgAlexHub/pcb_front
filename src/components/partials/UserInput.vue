<template>
    <form @submit.prevent="submitUserName"
        class="p-10 lg:border-none lg:mx-20 md:border md:border-slate-800 sm:rounded-lg text-xl mx-2 flex flex-col justify-center items-center">
        <div>
            <label for="username_input" class="rounded px-1">Pseudo :</label>
            <input type="text" placeholder="PatrickTeamSit123..." class="w-full my-4 px-2 py-2 rounded text-black"
                v-model="usernameInput" id="username_input">

        </div>
        <button class="my-2 mx-auto bg-sky-800 rounded px-5 py-2 hover:border-none hover:bg-sky-900"
            type="submit">Choisir un pseudo</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const usernameInput = ref('');
const emits = defineEmits(['onInputValidated']);

function submitUserName() {
    emits('onInputValidated', usernameInput.value);
}
</script>