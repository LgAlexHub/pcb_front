<template>
    <div class="mx-auto flex-1 flex flex-col w-full justify-evenly h-5/6 px-10">
        <h1 class="text-center text-xl">Welcome Pour con bien !</h1>
        <GameChoice class="h-full" v-on:button-clicked="onChoice" v-if="playState === state.choosing" />
        <Spinner :wait-message="waitMessage ?? 'en attente'" v-if="playState === state.waiting" />
        <Countdown :count-in-seconds="3" :end-callback="() => {playState = state.revealing}" v-if="playState === state.counting" />
        <GameReveal class="h-full" :current-user="user" :reveals="reveals" v-on:continue="retry" v-on:leave="quit" v-if="playState === state.revealing" />
        <h4 class="text-center text-slate-500">{{ props.game ?? 'Aucun id' }}</h4>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

import { receiveEvent, sendEvent } from '../types/GameChannel';
import { User } from '../types/Generic';
import { endpoint } from '../helpers/api';

import Spinner from './Spinner.vue';
import GameChoice from './partials/GameChoice.vue';
import GameReveal from './partials/GameReveal.vue';
import Countdown from './partials/Countdown.vue';
// === props ===
const props = defineProps({
    'game': String
});
// === ref & reactive === 
const socket = ref(null as WebSocket | null);
const user = reactive({} as User);
const waitMessage = ref('En attente du second joueur...');
const playState = ref(null as null|state);

const reveals = ref([] as any[]);
const router = useRouter();

onMounted(() => {
    user.id = new URLSearchParams(window.location.search).get('id');
    const url = endpoint('game/' + props.game, [{ key: 'uid', value: user.id! }])
    socket.value = new WebSocket(url);
    socket.value.onmessage = onNewMessage
    playState.value = state.choosing;
});

function retry() {
    socket.value?.send(JSON.stringify({
        event: 'retry'
    }));
    playState.value = state.waiting;
}

function quit() {
    socket.value?.close();
    router.push('/');
}

function onNewMessage(message: MessageEvent<any>) {
    const messageData = JSON.parse(message.data);
    switch (messageData.event) {
        case sendEvent.askSelectionNumber:
            reveals.value = [];
            playState.value = state.choosing;
            break;
        case sendEvent.reveal:
            onReveal(messageData);
            break;
        default:
            break;
    }

}

function onReveal(json: any) {
    reveals.value = json.answers;
    playState.value = state.counting;
}

function onChoice(choice: number) {
    socket.value?.send(JSON.stringify({
        event: receiveEvent.numberChosen,
        choice: choice
    }));
    playState.value = state.waiting;
}

enum state {
    choosing = 1,
    waiting = 2,
    counting = 3,
    revealing = 4,
};

</script>