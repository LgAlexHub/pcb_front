export type UserMessage = {
    username: string,
    message: string
}

export interface User {
    id: string | undefined | null,
    username: string | undefined | null
};