export default class Observable {
    handlers: { event: string, callback: Function }[];

    constructor () {
        this.handlers = [];
    }

    register (event: string, callback: Function) {
        this.handlers.push({ event, callback });
    }

    notify (event: string, data: any) {
        for (const handler of this.handlers) {
            if (handler.event === event) {
                handler.callback(data);
            }
        }
    }
}
