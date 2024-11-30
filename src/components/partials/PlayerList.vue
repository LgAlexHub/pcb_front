<template>
    <div class="flex flex-col">
        <div class="flex flex-row border-b border-grey-300" v-for="(user, index) in users"
            :key="'user_list_item_' + index">
            <p class="text-center truncate flex-1">
                {{ user.username }}
            </p>
           
            <button @click="onInviteClicked(user.id!)" :disabled="user.id === props.currentUser.id" :class="{
                'bg-lime-600 hover:bg-lime-400': user.id !== props.currentUser.id,
                'bg-lime-800': user.id === props.currentUser.id
            }" class="bg-lime-600 px-1 basis-1/4">
                {{ user.id === props.currentUser.id ? '(Moi)' : 'Inviter' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

const emits = defineEmits(['invite-user']);

const props = defineProps({
    users: {
        required: true,
        type: Object
    },
    currentUser: {
        required: true,
        type: Object
    }
});

function onInviteClicked(userId : string){
    emits('invite-user', userId);
}

</script>