"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
const converters_1 = require("./converters");
const enum_1 = require("./enum");
const option_1 = require("./option");
const Options = __importStar(require("./option"));
/**
 * 0                   1                   2                   3
 * 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |     op (1)    |   htype (1)   |   hlen (1)    |   hops (1)    |
 * +---------------+---------------+---------------+---------------+
 * |                            xid (4)                            |
 * +-------------------------------+-------------------------------+
 * |           secs (2)            |           flags (2)           |
 * +-------------------------------+-------------------------------+
 * |                          ciaddr  (4)                          |
 * +---------------------------------------------------------------+
 * |                          yiaddr  (4)                          |
 * +---------------------------------------------------------------+
 * |                          siaddr  (4)                          |
 * +---------------------------------------------------------------+
 * |                          giaddr  (4)                          |
 * +---------------------------------------------------------------+
 * |                                                               |
 * |                          chaddr  (16)                         |
 * |                                                               |
 * |                                                               |
 * +---------------------------------------------------------------+
 * |                                                               |
 * |                          sname   (64)                         |
 * +---------------------------------------------------------------+
 * |                                                               |
 * |                          file    (128)                        |
 * +---------------------------------------------------------------+
 * |                                                               |
 * |                          options (variable)                   |
 * +---------------------------------------------------------------+
 */
function stripBinNull(str) {
    const pos = str.indexOf("\u0000");
    let res = str;
    if (pos !== -1) {
        res = str.substr(0, pos);
    }
    return res;
}
class Packet {
    constructor() {
        this.op = enum_1.BOOTMessageType.request;
        this.htype = 1;
        this.hlen = 6;
        this.hops = 0;
        this.xid = 0;
        this.secs = 0;
        this.flags = 0;
        this.ciaddr = const_1.DEFAULT_IP;
        this.yiaddr = const_1.DEFAULT_IP;
        this.siaddr = const_1.DEFAULT_IP;
        this.giaddr = const_1.DEFAULT_IP;
        this.chaddr = const_1.DEFAULT_MAC;
        this.sname = "";
        this.file = "";
        this.options = [];
    }
    /**
     * Creates new DHCP Packet from Buffer
     *
     * @static
     * @param {Buffer} buffer
     * @returns
     *
     * @memberOf Packet
     */
    static fromBuffer(buffer) {
        const packet = new Packet();
        packet.fromBuffer(buffer);
        return packet;
    }
    /**
     * Returns DHCPMessageType of DHCP packet
     *
     * @readonly
     * @type {number}
     * @memberOf Packet
     */
    get type() {
        let dhcpType = 0;
        this.options.some((option) => {
            if (option.type === enum_1.DHCPOptions.DhcpMessageType) {
                dhcpType = option.value;
            }
            return !!dhcpType;
        });
        return dhcpType;
    }
    /**
     * Encodes DHCP packet to Buffer
     *
     * @returns {Buffer}
     *
     * @memberOf Packet
     */
    toBuffer() {
        const buffer = new Buffer(512);
        buffer.fill(0);
        buffer[0] = this.op;
        buffer[1] = this.htype;
        buffer[2] = this.hlen;
        buffer[3] = this.hops;
        buffer.writeUIntBE(this.xid, 4, 4);
        buffer.writeUIntBE(this.secs, 8, 2);
        buffer.writeUIntBE(this.flags, 10, 2);
        buffer.write(converters_1.IpConverter.encode(this.ciaddr).toString("binary"), 12, 16, "binary");
        buffer.write(converters_1.IpConverter.encode(this.yiaddr).toString("binary"), 16, 20, "binary");
        buffer.write(converters_1.IpConverter.encode(this.siaddr).toString("binary"), 20, 24, "binary");
        buffer.write(converters_1.IpConverter.encode(this.giaddr).toString("binary"), 24, 28, "binary");
        const chaddr = converters_1.MacConverter.encode(this.chaddr, this.hlen).toString("binary");
        buffer.write(chaddr, 28, chaddr.length, "binary");
        buffer.write(this.sname, 44, 64, "ascii");
        buffer.write(this.file, 108, 128, "ascii");
        // this.options.sort((a, b) => a.type > b.type ? 1 : a.type < b.type ? -1 : 0);
        const lastOption = this.options[this.options.length - 1];
        if (lastOption && lastOption.type !== enum_1.DHCPOptions.End) {
            this.options.push(new Options.EndOption());
        }
        buffer.write(new Buffer([99, 130, 83, 99]).toString("binary"), 236, 4, "binary"); // magic cookie RFC2132
        const options = this.options.map((option) => option.toBuffer());
        const raw = Buffer.concat(options).toString("binary");
        buffer.write(raw, 240, raw.length, "binary");
        return buffer.slice(0, 240 + raw.length);
    }
    /**
     * Decodes Buffer to DHCP Packet
     *
     * @param {Buffer} buffer
     *
     * @memberOf Packet
     */
    fromBuffer(buffer) {
        this.op = buffer[0];
        this.htype = buffer[1];
        this.hlen = buffer[2];
        this.hops = buffer[3];
        this.xid = buffer.readUIntBE(4, 4);
        this.secs = buffer.readUIntBE(8, 2);
        this.flags = buffer.readUIntBE(10, 2);
        this.ciaddr = converters_1.IpConverter.decode(buffer.slice(12, 16));
        this.yiaddr = converters_1.IpConverter.decode(buffer.slice(16, 20));
        this.siaddr = converters_1.IpConverter.decode(buffer.slice(20, 24));
        this.giaddr = converters_1.IpConverter.decode(buffer.slice(24, 28));
        this.chaddr = converters_1.MacConverter.decode(buffer.slice(28, 28 + this.hlen));
        this.sname = stripBinNull(buffer.toString("ascii", 44, 108));
        this.file = stripBinNull(buffer.toString("ascii", 108, 236));
        const optionsBuffer = buffer.slice(240);
        let pos = 0;
        let loop = true;
        while (loop) {
            if (optionsBuffer[pos] === 255 || pos >= optionsBuffer.length) { // End
                this.options.push(new Options.EndOption());
                loop = false;
            }
            else {
                const tag = optionsBuffer[pos];
                const len = optionsBuffer[pos + 1];
                const data = optionsBuffer.slice(pos, pos + 2 + len);
                const OptionClass = option_1.Option.create(tag);
                const option = OptionClass.fromBuffer(data);
                this.options.push(option);
                pos += len + 2;
            }
        }
    }
    /**
     * Converts DHCP Packet to String
     *
     * @returns
     *
     * @memberOf Packet
     */
    toString() {
        const str = [];
        str.push(`DHCP: ${enum_1.DHCPMessageType[this.type] || "UNKNOWN"}`);
        str.push(`=====================================`);
        str.push(`Message type (op): ${enum_1.BOOTMessageType[this.op]}`);
        str.push(`Hardware address type (htype): ${this.htype}`);
        str.push(`hops: ${this.hops}`);
        str.push(`Transaction ID (xid): ${this.xid}`);
        str.push(`Seconds (secs): ${this.secs}`);
        str.push(`Flags: ${this.flags}`);
        str.push(`Client IP (ciaddr): ${this.ciaddr}`);
        str.push(`Your IP (yiaddr): ${this.yiaddr}`);
        str.push(`Server IP (siaddr): ${this.siaddr}`);
        str.push(`Relay agent IP (giaddr): ${this.giaddr}`);
        str.push(`Client hardware address (chaddr): ${this.chaddr}`);
        str.push(`Server host name (sname): ${this.sname}`);
        str.push(`Boot file name (file): ${this.file}`);
        str.push(`Options:`);
        this.options.map((option) => {
            let item = "UNKNOWN";
            const val = option.value;
            if (Buffer.isBuffer(val)) {
                item = val.toString("hex");
            }
            else if (Array.isArray(val)) {
                item = `[${val.join(", ")}]`;
            }
            else if (typeof val === "object") {
                item = JSON.stringify(val);
            }
            else {
                item = `${val}`;
            }
            str.push(`  ${enum_1.DHCPOptions[option.type]}(${option.type}): ${item}`);
        });
        return str.join("\n");
    }
    /**
     * Returns first DHCP Option matched to type
     * - if Option not found returns null
     *
     * @param {DHCPOptions} type
     * @returns
     *
     * @memberOf Packet
     */
    find(type) {
        let res = null;
        const options = this.options.filter((o) => o.type === type);
        if (options.length) {
            res = options[0];
        }
        return res;
    }
}
exports.Packet = Packet;
