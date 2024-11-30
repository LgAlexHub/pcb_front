<template>
    <div class="flex flex-col">
        <div v-for="(message, index) in props.messages" :key="'msg-col-'+index" class="flex flex-row space-x-2">
            <span class="font-bold">{{ nowToString() }}</span>
            <span class="text-slate-400">{{ message.username }} :</span>
            <span class="text-sky-400 basis-1/2">{{ message.message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    messages: {
        required: true,
        type: Object
    }
});

function nowToString(): string {
    const nowDate = new Date;
    return `${nowDate.getHours()}:${nowDate.getMinutes()}`;
} 

</script>