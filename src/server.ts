import { Packet, Socket, SocketMessageEvent, SocketMessageEventHandle, SocketSendEventHandle } from "./";
import { DHCPOptions, DHCPMessageType } from "./";
import { AddressTimeOption, DHCPServerIdOption, BOOTMessageType, DHCPMessageTypeOption, GatewaysOption, SubnetMaskOption, DomainServerOption, RenewalTimeOption } from "./";
import { Option, RebindingTimeOption, ClassIdOption, DomainNameOption } from "./";

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

export class Server extends Socket {

    serverId: string;
    ipAddress = {
        min: 10,
        max: 244,
    };
    netmask = "255.255.255.0";
    addressTime = 86400; // 1 day
    domainServer: string[] = [];
    gateways: string[] = [];

    constructor(serverId: string);
    constructor(options: ServerOptions);
    constructor(param: ServerOptions | string) {
        super("udp4", 67, 68);

        if (typeof param === "string") {
            this.serverId = param;
        }
        else {
            this.serverId = param.serverId;
            if (param.ipAddress) {
                if (param.ipAddress.min) this.ipAddress.min = param.ipAddress.min;
                if (param.ipAddress.max) this.ipAddress.max = param.ipAddress.max;
            }
            if (param.netmask) this.netmask = param.netmask;
            if (param.addressTime) this.addressTime = param.addressTime;
            if (param.domainServer) this.domainServer = param.domainServer;
            if (param.gateways) this.gateways = param.gateways;
        }

        this.on("dhcp", e => {
            const packet = e.packet;
            if (packet.op === BOOTMessageType.request) {
                let event: SocketMessageEvent<this> = {
                    packet, target: this
                };
                this.emit(DHCPMessageType[packet.type], event);
            }

        });
    }

    on(event: string, cb: Function): this;
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
    on(event: string, cb: Function) {
        return super.on.apply(this, arguments);
    }

    once(event: string, cb: Function): this;
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
    once(event: string, cb: Function) {
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
    createOffer(request: Packet) {
        let p = new Packet();
        p.op = BOOTMessageType.reply;
        p.giaddr = request.giaddr;
        p.xid = request.xid;
        p.flags = request.flags;
        p.chaddr = request.chaddr;

        p.options.push(new DHCPMessageTypeOption(DHCPMessageType.offer));   // #53
        p.options.push(new SubnetMaskOption(this.netmask));                 // #1
        if (this.gateways.length)
            p.options.push(new GatewaysOption(this.gateways));              // #3
        if (this.domainServer.length)
            p.options.push(new DomainServerOption(this.domainServer));      // #6
        p.options.push(new AddressTimeOption(this.addressTime));            // #51
        p.options.push(new DHCPServerIdOption(this.serverId));              // #54
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
    createAck(pocket: Packet) {
        let p = new Packet();
        p.op = BOOTMessageType.reply;
        p.xid = pocket.xid;
        p.ciaddr = pocket.giaddr;
        p.giaddr = pocket.giaddr;
        p.flags = pocket.flags;
        p.chaddr = pocket.chaddr;

        p.options.push(new DHCPMessageTypeOption(DHCPMessageType.ack));     // #53
        p.options.push(new SubnetMaskOption(this.netmask));                 // #1
        if (this.gateways.length)
            p.options.push(new GatewaysOption(this.gateways));              // #3
        if (this.domainServer.length)
            p.options.push(new DomainServerOption(this.domainServer));      // #6
        if (pocket.type === DHCPMessageType.request)
            p.options.push(new AddressTimeOption(this.addressTime));        // #51
        p.options.push(new DHCPServerIdOption(this.serverId));              // #54
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
    createNak(pocket: Packet) {
        let p = new Packet();
        p.op = BOOTMessageType.reply;
        p.xid = pocket.xid;
        p.giaddr = pocket.giaddr;

        p.options.push(new DHCPMessageTypeOption(DHCPMessageType.nak));     // #53
        p.options.push(new DHCPServerIdOption(this.serverId));              // #54
        return p;
    }

}