/// <reference types="node" />
import { Socket as NodeSocket } from "dgram";
import { EventEmitter } from "events";
import { AddressInfo } from "net";
import { Packet } from "./packet";
export declare type SocketType = "udp4" | "udp6";
export interface SocketEvent<I> {
    target: I;
}
export interface SocketMessageEvent<I> extends SocketEvent<I> {
    packet: Packet;
}
export interface SocketSendEvent<I> extends SocketMessageEvent<I> {
}
export declare type EventHandler<T> = (e: T) => void;
export declare type SocketMessageEventHandle<T> = EventHandler<SocketMessageEvent<T>>;
export declare type SocketSendEventHandle<T> = EventHandler<SocketSendEvent<T>>;
export declare class Socket extends EventEmitter {
    listenPort: number;
    sendPort: number;
    type: SocketType;
    protected socket: NodeSocket;
    readonly address: AddressInfo;
    constructor(type?: SocketType, inPort?: number, outPort?: number);
    close(): void;
    on(event: string, cb: (...args: any[]) => void): this;
    on(event: "send", listener: SocketSendEventHandle<this>): this;
    on(event: "dhcp", listener: SocketMessageEventHandle<this>): this;
    on(event: "listening", cb: () => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    once(event: string, cb: (...args: any[]) => void): this;
    once(event: "send", listener: SocketSendEventHandle<this>): this;
    once(event: "dhcp", listener: SocketMessageEventHandle<this>): this;
    once(event: "listening", cb: () => void): this;
    once(event: "close", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    emit(event: "send", listener: SocketSendEventHandle<this>): boolean;
    emit(event: "dhcp", listener: SocketMessageEventHandle<this>): boolean;
    emit(event: "error", e: Error): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
    bind(address?: string): void;
    send(packet: Packet, address?: string, sendPort?: number): void;
    protected onMessage(msg: string, reinfo: AddressInfo): void;
}
