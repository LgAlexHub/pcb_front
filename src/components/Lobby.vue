<template>
    <div class="mx-auto h-full w-full">
        <InvitePopup v-if="invites.length > 0" :is-open="invites.length > 0" title="Invitation" :message="popUpMessage"  v-on:yes="handleInvite(invites[0], true)" v-on:no="handleInvite(invites[0], false)" />
        <template v-if="!socket">
          <UserInput v-on:on-input-validated="submitUserName" />
        </template>
        <template v-else>
            <div class="flex md:flex-row flex-col h-full">
                <div class="basis-3/4 border-r">
                    <Chatbox :messages="messages" class="h-3/4" />
                    <ChatboxInput @on-submit="onSubmit" class="h-1/4" />
                </div>
                <div class="h-full flex-1 sm:border-t">
                    <h4 class="flex-1 text-center border-b">Personnes en ligne</h4>
                    <PlayerList :current-user="currentUser" :users="onlineUsers" v-on:invite-user="onInviteClicked" />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router';

import { User, UserMessage } from '../types/Generic';
import { receiveEvent, sendEvent } from '../types/WebChannel';
import { endpoint } from '../api';

import ChatboxInput from './partials/ChatboxInput.vue';
import UserInput from './partials/UserInput.vue';
import Chatbox from './partials/Chatbox.vue';
import PlayerList from './partials/PlayerList.vue';
import InvitePopup from './InvitePopup.vue';

const currentUser = reactive({
    username: null,
    id: null
}) as User;

const router = useRouter();
const onlineUsers = ref([] as User[]);
const messages = ref([] as UserMessage[]);
const invites = ref([] as string[]);
const socket = ref(null as WebSocket | null);

const popUpMessage = computed(() => {
    if (invites.value.length < 1) {
        return '';
    }
    return onlineUsers.value.find((user) => user.id === invites.value[0]);
});

const submitUserName = (payloadInput : string) => {
    const url = endpoint('chaussette_du_web', [ {key : 'username', value : payloadInput}], 'ws');
    try {
        socket.value = new WebSocket(url.toString());
        socket.value.onmessage = onSocketNewMessage;
    } catch (error) {
        console.error(error);
    }
}

const handleInvite = (from: string, answer = false) => {
    socket.value?.send(JSON.stringify({
        event: receiveEvent.handleInvite,
        from: from,
        answer
    }));
    if (!answer) {
        invites.value.splice(invites.value.findIndex((invite) => invite === from), 1);
    }
}

const onSubmit = (textPayload:string) => {
    if (!textPayload) {
        return;
    }

    socket.value?.send(JSON.stringify({
        event: receiveEvent.newChat,
        message: textPayload
    }));
};

const onInviteClicked = (userId: string) => {
    socket.value?.send(JSON.stringify({
        event: receiveEvent.newInvite,
        targetUser: userId
    }));
}

const onReceiveInvite = (json: any) => {
    if (!invites.value.includes(json.from as string)) {
        invites.value.push(json.from as string);
    }
}

const onMoveToGame = (json: any) => {
    socket.value?.close();
    router.push('/game/' + json.roomId + '?id=' + currentUser.id);
}

const onSocketNewMessage = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data);
    switch (data.event) {
        case sendEvent.usersUpdate:
            onlineUsers.value = data.usernames
            break;
        case sendEvent.userNewMessage:
            messages.value.push({
                username: data.username,
                message: data.message,
            });
            break;
        case sendEvent.userNewInvite:
            onReceiveInvite(data);
            break;
        case sendEvent.userRegistrated:
            currentUser.id = data.id;
            break;
        case sendEvent.userMoveToGame:
            onMoveToGame(data);
            break;
        case sendEvent.userRefusedInvite:
            // TODO
            break;
        default:
            break;
    }
}


</script>