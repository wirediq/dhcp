import { EventEmitter } from "events";
import { Socket as NodeSocket, AddressInfo, createSocket } from "dgram";

import { Packet, PacketOptions } from "./packet";
import { DHCPMessageType, BOOTMessageType, DHCPOptions } from "./enum";
import { BROADCAST } from "./const";

export type SocketType = "udp4" | "udp6";

export interface SocketEvent<I> {
    target: I;
}

export interface SocketMessageEvent<I> extends SocketEvent<I> {
    packet: Packet;
}

export interface SocketSendEvent<I> extends SocketMessageEvent<I> { }

export type EventHandler<T> = (e: T) => void;

export type SocketMessageEventHandle<T> = EventHandler<SocketMessageEvent<T>>;
export type SocketSendEventHandle<T> = EventHandler<SocketSendEvent<T>>;


export class Socket extends EventEmitter {

    listenPort: number;
    sendPort: number;

    protected socket: NodeSocket;
    type: SocketType;

    get address() {
        return this.socket.address();
    }

    constructor(type: SocketType = "udp4", inPort: number, outPort: number) {
        super();

        this.socket = createSocket(type);
        this.type = type;
        this.listenPort = inPort;
        this.sendPort = outPort;

        this.socket.on("listening", () => {
            this.socket.setBroadcast(true);
            this.emit("listening");
        });

        this.socket.on("message", this.onMessage.bind(this));
    }

    protected onMessage(msg: string, reinfo: AddressInfo) {
        let buf = new Buffer(msg, "binary");

        let packet = Packet.fromBuffer(buf);

        if ((packet.op === BOOTMessageType.request || packet.op === BOOTMessageType.reply) &&
            packet.options.some(option => option.type === DHCPOptions.DhcpMessageType)) {
            this.emit("dhcp", {target: this, packet});
        }
    }

    close() {
        this.emit("close");
        this.socket.close();
    }

    on(event: string, cb: Function): this;
    on(event: "send", listener: SocketSendEventHandle<this>): this;
    on(event: "dhcp", listener: SocketMessageEventHandle<this>): this;
    on(event: "listening", cb: () => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: string, cb: Function) {
        return super.on.apply(this, arguments);
    }

    once(event: string, cb: Function): this;
    once(event: "send", listener: SocketSendEventHandle<this>): this;
    once(event: "dhcp", listener: SocketMessageEventHandle<this>): this;
    once(event: "listening", cb: () => void): this;
    once(event: "close", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: string, cb: Function) {
        return super.once.apply(this, arguments);
    }

    emit(event: "send", listener: SocketSendEventHandle<this>): boolean;
    emit(event: "dhcp", listener: SocketMessageEventHandle<this>): boolean;
    emit(event: "error", e: Error): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
    emit(event: string | symbol, ...args: any[]): boolean {
        return super.emit.apply(this, arguments);
    }

    bind(address?: string) {
        this.socket.bind(this.listenPort, address);
    }

    send(packet: Packet) {
        this.emit("send", {
            target: this,
            packet
        });
        let buf = packet.toBuffer();
        this.socket.send(buf, 0, buf.length, this.sendPort, BROADCAST);
    }
}