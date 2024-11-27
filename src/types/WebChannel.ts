import { User } from "./Generic.ts";

/**
 * Use to norm message object
 */
export type AppEvent = {
    event: string,
    // deno-lint-ignore no-explicit-any
    [key:string] : any
};

/**
 * EnhanceWebSocketDecorator to add username
 */
export type UserInfoWebSocket = EnhancedWebsocket & {
    username : string,
};

/**
 * Use to store basic info a user 
 */
export type EnhancedWebsocket = WebSocket & {
    id : string
}

export interface Room {
    u1 : User,
    u2 : User,
    roomId : string,
    accepted? : boolean,
}

export enum sendEvent {
    usersUpdate = 'users-update',
    userRegistrated = 'user-registrated',
    userNewMessage = 'user-new-msg',
    userNewInvite = 'user-new-invite',
    userMoveToGame = 'user-move-room',
    userRefusedInvite = 'invite-refused'
    
}

export enum receiveEvent {
    newChat = 'new-text-chat',
    newInvite = 'new-game-invite',
    handleInvite = 'user-answered-invite',
}
