"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const _2 = require("./");
const _3 = require("./");
class Server extends _1.Socket {
    constructor(param) {
        super("udp4", 67, 68);
        this.ipAddress = {
            min: 10,
            max: 244,
        };
        this.netmask = "255.255.255.0";
        this.addressTime = 86400; // 1 day
        this.domainServer = [];
        this.gateways = [];
        if (typeof param === "string") {
            this.serverId = param;
        }
        else {
            this.serverId = param.serverId;
            if (param.ipAddress) {
                if (param.ipAddress.min) {
                    this.ipAddress.min = param.ipAddress.min;
                }
                if (param.ipAddress.max) {
                    this.ipAddress.max = param.ipAddress.max;
                }
            }
            if (param.netmask) {
                this.netmask = param.netmask;
            }
            if (param.addressTime) {
                this.addressTime = param.addressTime;
            }
            if (param.domainServer) {
                this.domainServer = param.domainServer;
            }
            if (param.gateways) {
                this.gateways = param.gateways;
            }
        }
        this.on("dhcp", (e) => {
            const packet = e.packet;
            if (packet.op === _3.BOOTMessageType.request) {
                const event = {
                    packet, target: this,
                };
                this.emit(_2.DHCPMessageType[packet.type], event);
            }
        });
    }
    on() {
        return super.on.apply(this, arguments);
    }
    once() {
        return super.once.apply(this, arguments);
    }
    /**
     * Creates DHCP Offer Packet
     *
     * @param {Packet} request
     * @returns
     *
     * @memberOf Server
     */
    createOffer(request) {
        const p = new _1.Packet();
        p.op = _3.BOOTMessageType.reply;
        p.giaddr = request.giaddr;
        p.xid = request.xid;
        p.flags = request.flags;
        p.chaddr = request.chaddr;
        p.options.push(new _3.DHCPMessageTypeOption(_2.DHCPMessageType.offer)); // #53
        p.options.push(new _3.SubnetMaskOption(this.netmask)); // #1
        if (this.gateways.length) {
            p.options.push(new _3.GatewaysOption(this.gateways));
        } // #3
        if (this.domainServer.length) {
            p.options.push(new _3.DomainServerOption(this.domainServer));
        } // #6
        p.options.push(new _3.AddressTimeOption(this.addressTime)); // #51
        p.options.push(new _3.DHCPServerIdOption(this.serverId)); // #54
        return p;
    }
    /**
     * Creates DHCP Ack Packet
     *
     * @param {Packet} pocket
     * @returns
     *
     * @memberOf Server
     */
    createAck(pocket) {
        const p = new _1.Packet();
        p.op = _3.BOOTMessageType.reply;
        p.xid = pocket.xid;
        p.ciaddr = pocket.giaddr;
        p.giaddr = pocket.giaddr;
        p.flags = pocket.flags;
        p.chaddr = pocket.chaddr;
        p.options.push(new _3.DHCPMessageTypeOption(_2.DHCPMessageType.ack)); // #53
        p.options.push(new _3.SubnetMaskOption(this.netmask)); // #1
        if (this.gateways.length) {
            p.options.push(new _3.GatewaysOption(this.gateways));
        } // #3
        if (this.domainServer.length) {
            p.options.push(new _3.DomainServerOption(this.domainServer));
        } // #6
        if (pocket.type === _2.DHCPMessageType.request) {
            p.options.push(new _3.AddressTimeOption(this.addressTime));
        } // #51
        p.options.push(new _3.DHCPServerIdOption(this.serverId)); // #54
        return p;
    }
    /**
     * Creates DHCP Nak Packet
     *
     * @param {Packet} pocket
     * @returns
     *
     * @memberOf Server
     */
    createNak(pocket) {
        const p = new _1.Packet();
        p.op = _3.BOOTMessageType.reply;
        p.xid = pocket.xid;
        p.giaddr = pocket.giaddr;
        p.options.push(new _3.DHCPMessageTypeOption(_2.DHCPMessageType.nak)); // #53
        p.options.push(new _3.DHCPServerIdOption(this.serverId)); // #54
        return p;
    }
}
exports.Server = Server;
