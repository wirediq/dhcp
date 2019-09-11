import { Packet, Socket, SocketMessageEvent, SocketMessageEventHandle, SocketSendEventHandle } from "./";
export interface ServerOptions {
    serverId: string;
    ipAddress?: {
        min?: number;
        max?: number;
    };
    netmask?: string;
    addressTime?: number;
    domainServer?: string[];
    gateways?: string[];
}
export declare class Server extends Socket {
    serverId: string;
    ipAddress: {
        min: number;
        max: number;
    };
    netmask: string;
    addressTime: number;
    domainServer: string[];
    gateways: string[];
    constructor(serverId: string);
    constructor(options: ServerOptions);
    on(event: string, cb: (...args: any[]) => void): this;
    on(event: "discover", listener: SocketMessageEventHandle<this>): this;
    on(event: "inform", listener: SocketMessageEventHandle<this>): this;
    on(event: "request", listener: SocketMessageEventHandle<this>): this;
    on(event: "release", listener: SocketMessageEventHandle<this>): this;
    on(event: "decline", listener: SocketMessageEventHandle<this>): this;
    on(event: "dhcp", listener: SocketMessageEventHandle<this>): this;
    on(event: "send", listener: SocketSendEventHandle<this>): this;
    on(event: "listening", cb: () => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    once(event: string, cb: (...args: any[]) => void): this;
    once(event: "listening", cb: () => void): this;
    once(event: "discover", listener: (e: SocketMessageEvent<this>) => void): this;
    once(event: "inform", listener: (e: SocketMessageEvent<this>) => void): this;
    once(event: "request", listener: (e: SocketMessageEvent<this>) => void): this;
    once(event: "release", listener: (e: SocketMessageEvent<this>) => void): this;
    once(event: "decline", listener: (e: SocketMessageEvent<this>) => void): this;
    once(event: "send", listener: SocketSendEventHandle<this>): this;
    once(event: "close", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: "dhcp", cb: (packet: Packet) => void): this;
    /**
     * Creates DHCP Offer Packet
     *
     * @param {Packet} request
     * @returns
     *
     * @memberOf Server
     */
    createOffer(request: Packet): Packet;
    /**
     * Creates DHCP Ack Packet
     *
     * @param {Packet} pocket
     * @returns
     *
     * @memberOf Server
     */
    createAck(pocket: Packet): Packet;
    /**
     * Creates DHCP Nak Packet
     *
     * @param {Packet} pocket
     * @returns
     *
     * @memberOf Server
     */
    createNak(pocket: Packet): Packet;
}
