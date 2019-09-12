"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
const enum_1 = require("./enum");
class Option {
    constructor(type, value) {
        this.type = type;
        this.name = enum_1.DHCPOptions[type];
        if (value !== void 0) {
            this.value = value;
        }
    }
    static fromBuffer(data) {
        const option = new this();
        option.fromBuffer(data);
        return option;
    }
    static create(messageType) {
        let res = UnknownOption;
        switch (messageType) {
            case enum_1.DHCPOptions.SubnetMask:
                res = SubnetMaskOption;
                break;
            case enum_1.DHCPOptions.Gateways:
                res = GatewaysOption;
                break;
            case enum_1.DHCPOptions.DomainServer:
                res = DomainServerOption;
                break;
            case enum_1.DHCPOptions.Hostname:
                res = HostnameOption;
                break;
            case enum_1.DHCPOptions.DomainName:
                res = DomainNameOption;
                break;
            case enum_1.DHCPOptions.AddressRequest:
                res = AddressRequestOption;
                break;
            case enum_1.DHCPOptions.AddressTime:
                res = AddressTimeOption;
                break;
            case enum_1.DHCPOptions.DhcpMessageType:
                res = DHCPMessageTypeOption;
                break;
            case enum_1.DHCPOptions.DhcpServerId:
                res = DHCPServerIdOption;
                break;
            case enum_1.DHCPOptions.ParameterList:
                res = ParameterListOption;
                break;
            case enum_1.DHCPOptions.DhcpMessage:
                res = DhcpMessageOption;
                break;
            case enum_1.DHCPOptions.DhcpMaxMsgSize:
                res = DhcpMaxMsgSizeOption;
                break;
            case enum_1.DHCPOptions.RenewalTime:
                res = RenewalTimeOption;
                break;
            case enum_1.DHCPOptions.RebindingTime:
                res = RebindingTimeOption;
                break;
            case enum_1.DHCPOptions.ClientId:
                res = ClientIdentifierOption;
                break;
            case enum_1.DHCPOptions.ClassId:
                res = ClassIdOption;
                break;
            case enum_1.DHCPOptions.TftpServer:
                res = TftpServerOption;
                break;
            case enum_1.DHCPOptions.BootFile:
                res = BootFileOption;
                break;
            case enum_1.DHCPOptions.End:
                res = EndOption;
                break;
        }
        return res;
    }
}
exports.Option = Option;
class EndOption extends Option {
    constructor() {
        super(enum_1.DHCPOptions.End, null);
    }
    toBuffer() {
        return new Buffer([255]);
    }
    fromBuffer(data) {
        this.value = null;
    }
}
exports.EndOption = EndOption;
class Uint8Option extends Option {
    toBuffer() {
        return new Buffer([this.type, 1, this.value]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data[2];
    }
}
exports.Uint8Option = Uint8Option;
class Uint16Option extends Option {
    toBuffer() {
        const buf = new Buffer([this.type, 2, 0, 0]);
        buf.writeUInt16BE(this.value, 2);
        return buf;
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.readUInt16BE(2);
    }
}
exports.Uint16Option = Uint16Option;
class Uint32Option extends Option {
    toBuffer() {
        const buf = new Buffer([this.type, 4, 0, 0, 0, 0]);
        buf.writeUInt32BE(this.value, 2);
        return buf;
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.readUInt32BE(2);
    }
}
exports.Uint32Option = Uint32Option;
/**
 * DHCP Message Type
 *
 * @export
 * @class DHCPMessageTypeOption
 * @extends {Uint8Option}
 */
class DHCPMessageTypeOption extends Uint8Option {
    constructor(type = enum_1.DHCPMessageType.discover) {
        super(enum_1.DHCPOptions.DhcpMessageType, type);
    }
}
exports.DHCPMessageTypeOption = DHCPMessageTypeOption;
class IpAddressOption extends Option {
    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, 4]),
            converters_1.IpConverter.encode(this.value),
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = converters_1.IpConverter.decode(data.slice(2));
    }
}
exports.IpAddressOption = IpAddressOption;
class NumberListOption extends Option {
    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, this.value.length]),
            new Buffer(this.value),
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        const buf = data.slice(2);
        const value = [];
        for (let i = 0; i < buf.length; i++) {
            value.push(buf[i]);
        }
        this.value = value;
    }
}
exports.NumberListOption = NumberListOption;
class BufferOption extends Option {
    toBuffer() {
        return Buffer.concat([
            new Buffer([this.type, this.value.length]),
            this.value,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.slice(2);
    }
}
exports.BufferOption = BufferOption;
class Utf8Option extends Option {
    toBuffer() {
        const text = new Buffer(this.value, "utf8");
        return Buffer.concat([
            new Buffer([this.type, text.byteLength]),
            text,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = data.slice(2).toString("utf8");
    }
}
exports.Utf8Option = Utf8Option;
class ParameterListOption extends NumberListOption {
    constructor(data) {
        super(enum_1.DHCPOptions.ParameterList, data);
    }
}
exports.ParameterListOption = ParameterListOption;
class DhcpMessageOption extends BufferOption {
    constructor(data) {
        super(enum_1.DHCPOptions.DhcpMessage, data);
    }
}
exports.DhcpMessageOption = DhcpMessageOption;
class DhcpMaxMsgSizeOption extends Uint16Option {
    constructor(data) {
        super(enum_1.DHCPOptions.DhcpMaxMsgSize, data);
    }
}
exports.DhcpMaxMsgSizeOption = DhcpMaxMsgSizeOption;
class HostnameOption extends Utf8Option {
    constructor(data) {
        super(enum_1.DHCPOptions.Hostname, data);
    }
}
exports.HostnameOption = HostnameOption;
class DomainNameOption extends Utf8Option {
    constructor(data) {
        super(enum_1.DHCPOptions.DomainName, data);
    }
}
exports.DomainNameOption = DomainNameOption;
class AddressRequestOption extends IpAddressOption {
    constructor(data) {
        super(enum_1.DHCPOptions.AddressRequest, data);
    }
}
exports.AddressRequestOption = AddressRequestOption;
class DHCPServerIdOption extends IpAddressOption {
    constructor(data) {
        super(enum_1.DHCPOptions.DhcpServerId, data);
    }
}
exports.DHCPServerIdOption = DHCPServerIdOption;
class SubnetMaskOption extends IpAddressOption {
    constructor(data) {
        super(enum_1.DHCPOptions.SubnetMask, data);
    }
}
exports.SubnetMaskOption = SubnetMaskOption;
class AddressTimeOption extends Uint32Option {
    constructor(data) {
        super(enum_1.DHCPOptions.AddressTime, data);
    }
}
exports.AddressTimeOption = AddressTimeOption;
class RenewalTimeOption extends Uint32Option {
    constructor(data) {
        super(enum_1.DHCPOptions.RenewalTime, data);
    }
}
exports.RenewalTimeOption = RenewalTimeOption;
class RebindingTimeOption extends Uint32Option {
    constructor(data) {
        super(enum_1.DHCPOptions.RebindingTime, data);
    }
}
exports.RebindingTimeOption = RebindingTimeOption;
class TftpServerOption extends Utf8Option {
    constructor(data) {
        super(enum_1.DHCPOptions.TftpServer, data);
    }
}
exports.TftpServerOption = TftpServerOption;
class BootFileOption extends Utf8Option {
    constructor(data) {
        super(enum_1.DHCPOptions.BootFile, data);
    }
}
exports.BootFileOption = BootFileOption;
class ClientIdentifierOption extends Option {
    constructor(data) {
        super(enum_1.DHCPOptions.ClientId, data);
    }
    toBuffer() {
        const chaddr = converters_1.MacConverter.encode(this.value.chaddr);
        return Buffer.concat([
            new Buffer([this.type, chaddr.byteLength + 1, this.value.htype]),
            chaddr,
        ]);
    }
    fromBuffer(data) {
        this.type = data[0];
        this.value = {
            htype: data[2],
            chaddr: converters_1.MacConverter.decode(data.slice(3)),
        };
    }
}
exports.ClientIdentifierOption = ClientIdentifierOption;
class IpAddressListOption extends Option {
    toBuffer() {
        let buffers = this.value.map((addr) => converters_1.IpConverter.encode(addr));
        buffers = [new Buffer([this.type, this.value.length * 4])].concat(buffers);
        return Buffer.concat(buffers);
    }
    fromBuffer(data) {
        const res = [];
        data = data.slice(2);
        const count = data.length / 4;
        for (let i = 0; i < count; i++) {
            res.push(converters_1.IpConverter.decode(data.slice(i * 4, i * 4 + 4)));
        }
        this.value = res;
    }
}
exports.IpAddressListOption = IpAddressListOption;
class GatewaysOption extends IpAddressListOption {
    constructor(data) {
        super(enum_1.DHCPOptions.Gateways, data);
    }
}
exports.GatewaysOption = GatewaysOption;
class DomainServerOption extends IpAddressListOption {
    constructor(data) {
        super(enum_1.DHCPOptions.DomainServer, data);
    }
}
exports.DomainServerOption = DomainServerOption;
class ClassIdOption extends BufferOption {
    constructor(data) {
        super(enum_1.DHCPOptions.ClassId, data);
    }
}
exports.ClassIdOption = ClassIdOption;
class UnknownOption extends BufferOption {
}
exports.UnknownOption = UnknownOption;
