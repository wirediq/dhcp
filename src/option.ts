import { DHCPOptions, DHCPMessageType } from "./enum";
import { IpConverter, MacConverter } from "./converters";

export abstract class Option<T> {

    type: DHCPOptions;
    name: string;
    value: T;

    protected constructor(type: DHCPOptions, value?: T) {
        this.type = type;
        this.name = DHCPOptions[type];
        if (value !== void 0)
            this.value = value;
    }

    abstract toBuffer(): Buffer;
    abstract fromBuffer(data: Buffer): void;
    static fromBuffer<T extends Option<any>>(this: { new (): T }, data: Buffer) {
        let option = new this();
        option.fromBuffer(data);
        return option;
    }

    static create(messageType: DHCPOptions): typeof Option {
        let res: any = UnknownOption;
        switch (messageType) {
            case DHCPOptions.SubnetMask:
                res = SubnetMaskOption;
                break;
            case DHCPOptions.Gateways:
                res = GatewaysOption;
                break;
            case DHCPOptions.DomainServer:
                res = DomainServerOption;
                break;
            case DHCPOptions.Hostname:
                res = HostnameOption;
                break;
            case DHCPOptions.DomainName:
                res = DomainNameOption;
                break;
            case DHCPOptions.AddressRequest:
                res = AddressRequestOption;
                break;
            case DHCPOptions.AddressTime:
                res = AddressTimeOption;
                break;
            case DHCPOptions.DhcpMessageType:
                res = DHCPMessageTypeOption;
                break;
            case DHCPOptions.DhcpServerId:
                res = DHCPServerIdOption;
                break;
            case DHCPOptions.ParameterList:
                res = ParameterListOption;
                break;
            case DHCPOptions.DhcpMessage:
                res = DhcpMessageOption;
                break;
            case DHCPOptions.DhcpMaxMsgSize:
                res = DhcpMaxMsgSizeOption;
                break;
            case DHCPOptions.RenewalTime:
                res = RenewalTimeOption;
                break;
            case DHCPOptions.RebindingTime:
                res = RebindingTimeOption;
                break;
            case DHCPOptions.ClientId:
                res = ClientIdentifierOption;
                break;
            case DHCPOptions.ClassId:
                res = ClassIdOption;
                break;
            case DHCPOptions.End:
                res = EndOption;
                break;
        }
        return res;
    }
}

export class EndOption extends Option<null> {
    constructor() {
        super(DHCPOptions.End, null);
    }

    toBuffer(): Buffer {
        return new Buffer([255]);
    }
    fromBuffer(data: Buffer) {
        this.value = null;
    }
}


export abstract class Uint8Option extends Option<number> {

    toBuffer() {
        return new Buffer([this.type, 1, this.value]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = data[2];
    }

}

export abstract class Uint16Option extends Option<number> {

    toBuffer() {
        let buf = new Buffer([this.type, 2, 0, 0]);
        buf.writeUInt16BE(this.value, 2);
        return buf;
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = data.readUInt16BE(2);
    }

}

export abstract class Uint32Option extends Option<number> {

    toBuffer() {
        let buf = new Buffer([this.type, 4, 0, 0, 0, 0]);
        buf.writeUInt32BE(this.value, 2);
        return buf;
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = data.readUInt32BE(2);
    }

}

/**
 * DHCP Message Type
 * 
 * @export
 * @class DHCPMessageTypeOption
 * @extends {Uint8Option}
 */
export class DHCPMessageTypeOption extends Uint8Option {
    constructor(type: DHCPMessageType = DHCPMessageType.discover) {
        super(DHCPOptions.DhcpMessageType, type);
    }
}

export abstract class IpAddressOption extends Option<string> {

    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, 4]),
            IpConverter.encode(this.value)
        ]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = IpConverter.decode(data.slice(2));
    }

}

export abstract class NumberListOption extends Option<number[]> {

    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, this.value.length]),
            new Buffer(this.value)
        ]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        let buf = data.slice(2);
        let value: number[] = [];
        for (let i = 0; i < buf.length; i++) {
            value.push(buf[i]);
        }
        this.value = value;
    }

}

export abstract class BufferOption extends Option<Buffer> {

    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, this.value.length]),
            this.value
        ]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = data.slice(2);
    }

}
export abstract class Utf8Option extends Option<string> {

    toBuffer() {
        let text = new Buffer(this.value, "utf8");
        return Buffer.concat([
            new Buffer([this.type, text.byteLength]),
            text
        ]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = data.slice(2).toString("utf8");
    }

}

export class ParameterListOption extends NumberListOption {
    constructor(data?: number[]) {
        super(DHCPOptions.ParameterList, data);
    }
}
export class DhcpMessageOption extends BufferOption {
    constructor(data?: Buffer) {
        super(DHCPOptions.DhcpMessage, data);
    }
}
export class DhcpMaxMsgSizeOption extends Uint16Option {
    constructor(data?: number) {
        super(DHCPOptions.DhcpMaxMsgSize, data);
    }
}

export class HostnameOption extends Utf8Option {
    constructor(data?: string) {
        super(DHCPOptions.Hostname, data);
    }
}

export class DomainNameOption extends Utf8Option {
    constructor(data?: string) {
        super(DHCPOptions.DomainName, data);
    }
}

export class AddressRequestOption extends IpAddressOption {
    constructor(data?: string) {
        super(DHCPOptions.AddressRequest, data);
    }
}

export class DHCPServerIdOption extends IpAddressOption {
    constructor(data?: string) {
        super(DHCPOptions.DhcpServerId, data);
    }
}

export class SubnetMaskOption extends IpAddressOption {
    constructor(data?: string) {
        super(DHCPOptions.SubnetMask, data);
    }
}

export class AddressTimeOption extends Uint32Option {
    constructor(data?: number) {
        super(DHCPOptions.AddressTime, data);
    }
}
export class RenewalTimeOption extends Uint32Option {
    constructor(data?: number) {
        super(DHCPOptions.RenewalTime, data);
    }
}
export class RebindingTimeOption extends Uint32Option {
    constructor(data?: number) {
        super(DHCPOptions.RebindingTime, data);
    }
}

export type ClientIdentifier = {
    htype: number;
    chaddr: string;
}
export class ClientIdentifierOption extends Option<ClientIdentifier> {
    constructor(data?: ClientIdentifier) {
        super(DHCPOptions.ClientId, data);
    }

    toBuffer() {
        let chaddr = MacConverter.encode(this.value.chaddr);
        return Buffer.concat([
            new Buffer([this.type, chaddr.byteLength + 1, this.value.htype]),
            chaddr
        ]);
    }

    fromBuffer(data: Buffer) {
        this.type = data[0];
        this.value = {
            htype: data[2],
            chaddr: MacConverter.decode(data.slice(3))
        };
    }
}

export abstract class IpAddressListOption extends Option<string[]> {
    toBuffer() {
        let buffers = this.value.map(addr => IpConverter.encode(addr));
        buffers = [new Buffer([this.type, this.value.length * 4])].concat(buffers);
        return Buffer.concat(buffers);
    }

    fromBuffer(data: Buffer) {
        let res: string[] = [];
        data = data.slice(2);
        let count = data.length / 4;
        for (let i = 0; i < count; i++) {
            res.push(IpConverter.decode(data.slice(i * 4, i * 4 + 4)));
        }
        this.value = res;
    }
}

export class GatewaysOption extends IpAddressListOption {
    constructor(data?: string[]) {
        super(DHCPOptions.Gateways, data);
    }
}
export class DomainServerOption extends IpAddressListOption {
    constructor(data?: string[]) {
        super(DHCPOptions.DomainServer, data);
    }
}
export class ClassIdOption extends BufferOption {
    constructor(data?: Buffer) {
        super(DHCPOptions.ClassId, data);
    }
}
export class UnknownOption extends BufferOption {
}