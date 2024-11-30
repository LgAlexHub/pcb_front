<template>
    <div class="w-full py-2 px-2 text-center flex flex-row gap-2">
        <div v-for="reveal in props.reveals" :key="'reveal-'+reveal.id" class="gap-2 px-2 py-1 basis-1/2 border rounded flex flex-col"
            :class="{
                'bg-sky-900' : currentUser.id === reveal.id,
                'bg-rose-950' : currentUser.id !== reveal.id
            }"
        >
            <p class="font-bold text-lg">{{ reveal.username }}</p>
            <p>a choisi :</p>
            <p class="font-bold">{{ reveal.choice }}</p>
        </div>
    </div>
    <button class="bg-emerald-900 rounded w-full px-2 py-1 text-center my-5" @click="retry">Recommencer</button>
    <button class="bg-amber-900 rounded w-full px-2 py-1 text-center my-5" @click="quit">Partir</button>
</template>

<script setup lang="ts">
    const props = defineProps({
        reveals : {
            required : true, 
            type : Object
        },
        currentUser : {
            required : true,
            type : Object
        }


    });
    const emits = defineEmits(['continue', 'leave']);

    const retry = () => emits('continue');
    const quit = () => emits('leave');


</script>