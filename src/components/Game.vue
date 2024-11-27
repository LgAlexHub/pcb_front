<template>
    <div class="mx-auto flex-1 flex flex-col w-full px-10">
        <h1 class="text-center">Welcome Pour con bien !</h1>
        <h4 class="text-center">id {{ props.game ?? 'Aucun id' }}</h4>
        <div class="grid grid-cols-3 gap-4" v-if="isChoosing">
            <button v-for="n in 9" @click="onChoice(n)" class="text-center bg-slate-400 rounded" :key="'bt-choice-'+n">
                {{ n }}
            </button>
        </div>
        <div v-if="isWaiting">
            <Spinner :wait-message="waitMessage ?? 'en attente'" />
        </div>
        <div v-if="reveals.length === 2">
            <div class="border-2 rounded-lg border-slate-700 bg-slate-400 py-2 px-2 text-center">
                <p v-for="reveal in reveals" :key="'reveal-'+reveal.id" :class="{'font-semibold' : reveal.id === user.id}">
                   {{ reveal.id === user.id ? ('MOI') : '' }} [#{{ reveal.id }}]{{ reveal.username }} a choisi : {{ reveal.choice }}
                </p>
            </div>
            <button class="bg-lime-300 rounded w-full px-2 py-1 text-center my-5" @click="retry">retry</button>
            <button class="bg-red-300 rounded w-full px-2 py-1 text-center my-5" @click="quit">quit</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import  Spinner from './Spinner.vue';
import { onMounted, reactive, ref } from 'vue';
import { User } from '../types/Generic';
import { receiveEvent, sendEvent } from '../types/GameChannel';
import { useRouter } from 'vue-router';
// === props ===
const props = defineProps({
    'game': String
});
// === ref & reactive === 
const socket = ref(null as WebSocket | null);
const user = reactive({} as User);
const waitMessage = ref('En attente du second joueur...');
const isWaiting = ref(true);
const isChoosing = ref(false);
const reveals = ref([] as any[]);
const router = useRouter();

onMounted(() => {
    user.id = new URLSearchParams(window.location.search).get('id');
    const url = new URL(`https://slow-tuna-53.deno.dev/game/${props.game!}?uid=${user.id!}`);
    url.protocol.replace('http', 'ws');
    socket.value = new WebSocket(url);
    socket.value.onmessage = onNewMessage
});

function retry(){
    socket.value?.send(JSON.stringify({
        event : 'retry'
    }));
    isWaiting.value = true;
}

function quit(){
    socket.value?.close();
    router.push('/');
}

function onNewMessage(message: MessageEvent<any>){
    const messageData = JSON.parse(message.data);
    switch (messageData.event) {
        case sendEvent.askSelectionNumber:
            reveals.value = [];
            isWaiting.value = false;
            isChoosing.value = true
            break;
        case sendEvent.reveal:
            onReveal(messageData);
        break;
        default:
            break;
    }

}

function onReveal(json:any){
    reveals.value = json.answers;
    isWaiting.value = false;
}

function onChoice(choice : number ){
    socket.value?.send(JSON.stringify({
        event : receiveEvent.numberChosen,
        choice : choice
    }));
    isChoosing.value = false;
    isWaiting.value = true;
}

</script>