/// <reference types="node" />
import { DHCPMessageType, DHCPOptions } from "./enum";
export declare abstract class Option<T> {
    static fromBuffer<T extends Option<any>>(this: {
        new (): T;
    }, data: Buffer): T;
    static create(messageType: DHCPOptions): typeof Option;
    type: DHCPOptions;
    name: string;
    value: T;
    protected constructor(type: DHCPOptions, value?: T);
    abstract toBuffer(): Buffer;
    abstract fromBuffer(data: Buffer): void;
}
export declare class EndOption extends Option<null> {
    constructor();
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class Uint8Option extends Option<number> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class Uint16Option extends Option<number> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class Uint32Option extends Option<number> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
/**
 * DHCP Message Type
 *
 * @export
 * @class DHCPMessageTypeOption
 * @extends {Uint8Option}
 */
export declare class DHCPMessageTypeOption extends Uint8Option {
    constructor(type?: DHCPMessageType);
}
export declare abstract class IpAddressOption extends Option<string> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class NumberListOption extends Option<number[]> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class BufferOption extends Option<Buffer> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class Utf8Option extends Option<string> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare class ParameterListOption extends NumberListOption {
    constructor(data?: number[]);
}
export declare class DhcpMessageOption extends BufferOption {
    constructor(data?: Buffer);
}
export declare class DhcpMaxMsgSizeOption extends Uint16Option {
    constructor(data?: number);
}
export declare class HostnameOption extends Utf8Option {
    constructor(data?: string);
}
export declare class DomainNameOption extends Utf8Option {
    constructor(data?: string);
}
export declare class AddressRequestOption extends IpAddressOption {
    constructor(data?: string);
}
export declare class DHCPServerIdOption extends IpAddressOption {
    constructor(data?: string);
}
export declare class SubnetMaskOption extends IpAddressOption {
    constructor(data?: string);
}
export declare class AddressTimeOption extends Uint32Option {
    constructor(data?: number);
}
export declare class RenewalTimeOption extends Uint32Option {
    constructor(data?: number);
}
export declare class RebindingTimeOption extends Uint32Option {
    constructor(data?: number);
}
export declare class TftpServerOption extends Utf8Option {
    constructor(data?: string);
}
export declare class BootFileOption extends Utf8Option {
    constructor(data?: string);
}
export interface ClientIdentifier {
    htype: number;
    chaddr: string;
}
export declare class ClientIdentifierOption extends Option<ClientIdentifier> {
    constructor(data?: ClientIdentifier);
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare abstract class IpAddressListOption extends Option<string[]> {
    toBuffer(): Buffer;
    fromBuffer(data: Buffer): void;
}
export declare class GatewaysOption extends IpAddressListOption {
    constructor(data?: string[]);
}
export declare class DomainServerOption extends IpAddressListOption {
    constructor(data?: string[]);
}
export declare class ClassIdOption extends BufferOption {
    constructor(data?: Buffer);
}
export declare class UnknownOption extends BufferOption {
}
