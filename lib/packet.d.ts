/// <reference types="node" />
import { AddressInfo } from "net";
import { BOOTMessageType, DHCPOptions } from "./enum";
import { Option } from "./option";
export declare type PacketOptions = Array<Option<any>>;
export declare class Packet {
    /**
     * Creates new DHCP Packet from Buffer
     *
     * @static
     * @param {Buffer} buffer
     * @returns
     *
     * @memberOf Packet
     */
    static fromBuffer(buffer: Buffer): Packet;
    op: BOOTMessageType;
    htype: number;
    hlen: number;
    hops: number;
    xid: number;
    secs: number;
    flags: number;
    ciaddr: string;
    yiaddr: string;
    siaddr: string;
    giaddr: string;
    chaddr: string;
    sname: string;
    file: string;
    options: PacketOptions;
    reinfo?: AddressInfo;
    /**
     * Returns DHCPMessageType of DHCP packet
     *
     * @readonly
     * @type {number}
     * @memberOf Packet
     */
    readonly type: number;
    /**
     * Encodes DHCP packet to Buffer
     *
     * @returns {Buffer}
     *
     * @memberOf Packet
     */
    toBuffer(): Buffer;
    /**
     * Decodes Buffer to DHCP Packet
     *
     * @param {Buffer} buffer
     *
     * @memberOf Packet
     */
    fromBuffer(buffer: Buffer): void;
    /**
     * Converts DHCP Packet to String
     *
     * @returns
     *
     * @memberOf Packet
     */
    toString(): string;
    /**
     * Returns first DHCP Option matched to type
     * - if Option not found returns null
     *
     * @param {DHCPOptions} type
     * @returns
     *
     * @memberOf Packet
     */
    find(type: DHCPOptions): Option<any> | null;
}
