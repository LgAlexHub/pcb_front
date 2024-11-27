import { EnhancedWebsocket } from "./WebChannel.ts";

export enum sendEvent {
    askSelectionNumber = 'ask-number',
    reveal = 'reveal-choice'
};

export enum receiveEvent {
    numberChosen = 'number-picked',
}

export type GameInfoWebSocket = EnhancedWebsocket & {
    choice : number | undefined,
};