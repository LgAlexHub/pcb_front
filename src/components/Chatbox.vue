<template>
    <div class="mx-auto flex-1 flex flex-col w-full px-10">
        <h1 class="text-7xl text-lime-100 font-bold my-4 text-center">
            Pour combien ?
        </h1>
        <template v-if="!socket">
            <form @submit.prevent="submitUserName" class="border-2 border-sky-300 flex flex-row">
                <label for="username_input" class="flex-1">Pseudo :</label>
                <input type="text" placeholder="PatrickTeamSit123..." class="basis-3/4 text-center text-black"
                    v-model="currentUser.username" id="username_input">
                <button class="text-center flex-1" type="submit">Choisir un pseudo</button>
            </form>
        </template>
        <template v-else>
            <div class="border rounded border-grey-300 basis-3/4">
                <div class="flex lg:flex-row flex-col h-full">
                    <div class="flex-1 border-r">
                        <h4 class="flex-1 text-center border-b">Chatbox</h4>
                        <form @submit.prevent="onSubmit" class="border-2 border-sky-300 flex flex-row">
                            <input type="text" class="basis-3/4 text-black px-2" placeholder="Envoyer votre message" v-model="messageInpuptText" id="message_input">
                            <button class="text-center flex-1" type="submit">Envoyer</button>
                        </form>
                        <div class="flex flex-col">
                            <div class="" v-for="(msg, index) in messages" :key="'msg_col_' + index">
                                <p>
                                    <span class="font-bold">{{ nowToString() }} |</span>
                                    <span class="text-slate-400"> {{ msg.username }}|</span>
                                    <span class="text-sky-400"> {{ msg.message }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h4 class="flex-1 text-center border-b">User online</h4>
                        <div class="flex flex-col">
                            <div class="flex flex-row border-b border-grey-300" v-for="(user, index) in onlineUsers"
                                :key="'user_list_item_' + index">
                                <p class="flex-1 align-middle px-2 py-1">
                                    <span class="font-bold">Pseudo: </span>
                                    {{
                                        user.username
                                    }}
                                </p>
                                <p class="flex-1 align-middle px-2 py-1">
                                    <span class="font-bold">id: </span>
                                    #{{
                                        user.id
                                    }}
                                </p>
                                <div v-if="invites.includes(user.id!)" class="flex-1 pt-1 align-middle flex py-1 flex-row space-x-1">
                                    <p>
                                        Game ? 
                                    </p>
                                    <button @click="handleInvite(user.id!, true)" class="rounded-xl bg-lime-300 hover:bg-lime-200 text-white px-1 font-bold">Go</button>
                                    <button @click="handleInvite(user.id!)" class="rounded-xl bg-red-300 hover:bg-red-200 text-white px-1 font-bold"> No</button>
                                </div>
                                <button @click="onInviteClicked(user.id!)" :disabled="user.id === currentUser.id" :class="{
                                    'bg-lime-600 hover:bg-lime-400': user.id !== currentUser.id,
                                    'bg-lime-800': user.id === currentUser.id
                                }" class="bg-lime-600 px-1">
                                    {{ user.id === currentUser.id ? '(Moi)' : 'Inviter' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
export default {
    name : 'Chatbox'
}</script>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import { receiveEvent, sendEvent } from '../types/WebChannel';
import { User, UserMessage } from '../types/Generic';
import { useRouter } from 'vue-router';

const currentUser = reactive({
    username: null,
    id: null
}) as User;
const router = useRouter();
const onlineUsers = ref([] as User[]);
const messages = ref([] as UserMessage[]);
const messageInpuptText = ref('');
const invites = ref([] as string[]);
const socket = ref(null as WebSocket | null);

const nowToString = () => {
    const date = new Date;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

const submitUserName = () => {
    const url = new URL(`https://slow-tuna-53.deno.dev/chaussette_du_web?username=${currentUser.username}`);
    url.protocol.replace('http', 'ws');
    socket.value = new WebSocket(url);
    socket.value.onmessage = onSocketNewMessage;
}

const handleInvite = (from:string, answer = false) => {
   socket.value?.send(JSON.stringify({
        event : receiveEvent.handleInvite,
        from : from,
        answer
    }));
   if (!answer){
       invites.value.splice(invites.value.findIndex((invite) => invite === from), 1);
   }
}

const onSubmit = () => {
    if (!messageInpuptText) {
        return;
    }

    socket.value?.send(JSON.stringify({
        event: receiveEvent.newChat,
        message: messageInpuptText.value
    }));
};

const onInviteClicked = (userId: string) => {
    socket.value?.send(JSON.stringify({
        event: receiveEvent.newInvite,
        targetUser: userId
    }));
}

const onReceiveInvite = (json:any) => {
    if (!invites.value.includes(json.from as string)){
        invites.value.push(json.from as string);
    }
}

const onMoveToGame = (json : any) => {
    socket.value?.close();
    router.push('/game/'+json.roomId+'?id='+currentUser.id);
}

const onSocketNewMessage = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data);
    switch (data.event) {
        case sendEvent.usersUpdate:
            onlineUsers.value = data.usernames
            break;
        case sendEvent.userNewMessage:
            messages.value.push({
                username: data.user,
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