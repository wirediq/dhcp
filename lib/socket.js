"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
const events_1 = require("events");
const const_1 = require("./const");
const enum_1 = require("./enum");
const packet_1 = require("./packet");
class Socket extends events_1.EventEmitter {
    constructor(type = "udp4", inPort = 67, outPort = 68) {
        super();
        this.socket = dgram_1.createSocket(type);
        this.type = type;
        this.listenPort = inPort;
        this.sendPort = outPort;
        this.socket.on("listening", () => {
            this.socket.setBroadcast(true);
            this.emit("listening");
        });
        this.socket.on("error", (err) => {
            this.emit("error", err);
        });
        this.socket.on("message", this.onMessage.bind(this));
    }
    get address() {
        return this.socket.address();
    }
    close() {
        this.emit("close");
        this.socket.close();
    }
    on() {
        return super.on.apply(this, arguments);
    }
    once() {
        return super.once.apply(this, arguments);
    }
    emit() {
        return super.emit.apply(this, arguments);
    }
    bind(address) {
        this.socket.bind(this.listenPort, address);
    }
    send(packet, address = const_1.BROADCAST, sendPort) {
        this.emit("send", {
            target: this,
            packet,
            address,
            sendPort,
        });
        const buf = packet.toBuffer();
        if (typeof sendPort !== "number") {
            sendPort = this.sendPort;
        }
        this.socket.send(buf, 0, buf.length, sendPort, address);
    }
    onMessage(msg, reinfo) {
        const buf = new Buffer(msg, "binary");
        const packet = packet_1.Packet.fromBuffer(buf);
        packet.reinfo = reinfo;
        if ((packet.op === enum_1.BOOTMessageType.request || packet.op === enum_1.BOOTMessageType.reply) &&
            packet.options.some((option) => option.type === enum_1.DHCPOptions.DhcpMessageType)) {
            this.emit("dhcp", { target: this, packet });
        }
    }
}
exports.Socket = Socket;
