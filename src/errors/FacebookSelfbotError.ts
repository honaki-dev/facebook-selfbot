export class FacebookSelfbotError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FacebookSelfbotError";
    }
}
