
import { Server, DHCPMessageTypeOption, DHCPMessageType } from "../index";
import { Socket } from "../socket";
import { Packet } from "../packet";
import * as assert from "assert";

describe("Server", () => {

    let pkt = new Packet();
    let hex = "0101060074c6d3c9000000000000000000000000000000000000000054a050e7dfd700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501033d070154a050e7dfd73204ac1102833604ac1102030c084b6972696c6c5043510b0000004b6972696c6c50433c084d53465420352e30370d0103060f1f212b2c2e2f79f9fcff";
    let s = new Server("192.168.1.1");


    context("create server", () => {
        it("with settings", () => {
            let settings = {
                serverId: "192.168.1.1",
                gateways: ["192.168.1.1"],
                domainServer: ["192.168.1.1"],
                ipAddress: {
                    min: 35,
                    max: 200,
                },
                netmask: "255.255.255.15",
                addressTime: 86400
            };
            let s = new Server(settings);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.ipAddress.min, 35);
            assert.equal(s.ipAddress.max, 200);
            assert.equal(s.netmask, "255.255.255.15");
        });

        it("without min or max ipAddress", () => {
            let settings = {
                serverId: "192.168.1.4",
                ipAddress: {
                },
            };
            let s = new Server(settings);

            assert.equal(s.serverId, "192.168.1.4");
            assert.equal(s.ipAddress.min, 10);
            assert.equal(s.ipAddress.max, 244);
        });

        it("on dhcp", done => {
            s.listenPort = 1967;
            s.sendPort = 1968;

            let s2 = new Server("192.168.1.1");
            s2.listenPort = 1968;
            s2.sendPort = 1967;

            s2.on("dhcp", e => {
                assert.equal(e.target, s2);
                assert.equal(e.packet.toBuffer().toString("hex"), hex);
                done();
            });

            s.bind();
            s2.bind();

            let pkt = Packet.fromBuffer(new Buffer(hex, "hex"));
            s.send(pkt);
        });

    });
    context("Creates DHCP Packet", () => {
        s.gateways = ["192.168.1.1"];
        s.domainServer = ["192.168.1.1"];
        it("createOffer", () => {
            // let s = new Server("192.168.1.1");
            // let pkt = new Packet();

            s.createOffer(pkt);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.join(), "192.168.1.1");
            assert.equal(s.domainServer.join(), "192.168.1.1");

            // pkt.chaddr = "a1:a2:a3:a4:a5:a6";
            // pkt.options.push(new DHCPMessageTypeOption(DHCPMessageType.decline));
            // console.log(pkt.toBuffer().toString("hex"));
        });
        it("createOffer empty gateways & domainServer", () => {
            let s = new Server("192.168.1.1");
            s.createOffer(pkt);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.length, 0);
            assert.equal(s.domainServer.length, 0);
        });

        it("createAck", () => {
            s.createAck(pkt);

            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.join(), "192.168.1.1");
            assert.equal(s.domainServer.join(), "192.168.1.1");
        });

        it("createAck empty gateways & domainServer & type = request", () => {
            let s = new Server("192.168.1.1");
            let pkt = Packet.fromBuffer(new Buffer(hex, "hex"));
            s.createAck(pkt);
            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways.length, 0);
            assert.equal(s.domainServer.length, 0);
            assert.equal(pkt.type, 3);
        });

        it("createNak", () => {
            let s = new Server("192.168.1.1");
            s.createNak(pkt);
        });
    });
});