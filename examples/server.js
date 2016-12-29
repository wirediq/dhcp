"use strict";
let { BOOTMessageType, Server } = require("../");

let s = new Server({
    serverId: "192.168.1.1",
    gateways: ["192.168.1.1"],
    domainServer: ["192.168.1.1"],
});

s.on("listening", () => {
    console.log("Server start", s.address);
});

let ips = {};

s.on("discover", e => {
    console.log("DISCOVER");

    let pkt = e.packet;

    // Назначение IP по MAC адресу
    let ip = "0.0.0.0";
    if (pkt.op === BOOTMessageType.request) {
        if (!(pkt.chaddr in ips))
            ip = ips[pkt.chaddr] = `192.168.1.${Object.keys(ips).length + 2}`;
        else
            ip = ips[pkt.chaddr];
    }

    let offer = s.createOffer(pkt);

    offer.yiaddr = ip;

    s.send(offer);
});
s.on("request", e => {
    console.log("REQUEST");
    let ack = s.createAck(e.packet);

    ack.yiaddr = ips[e.packet.chaddr];

    s.send(ack);
});
s.on("release", e => {
    console.log("RELEASE");
    delete ips[e.packet.chaddr];
});

s.bind();