
import { Server, DHCPMessageTypeOption, DHCPMessageType } from "../index";
import { Packet } from "../packet";
import * as assert from "assert";

describe("Server", () => {
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

        it("without settings", () => {
            let settings = {
                serverId: "192.168.1.4"
            };
            let s = new Server(settings);
            assert.equal(s.serverId, "192.168.1.4");
            assert.equal(s.ipAddress.min, 10);
            assert.equal(s.ipAddress.max, 244);
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

        it("type string server settings", () => {
            let s = new Server("192.168.1.1");
            assert.equal(s.serverId, "192.168.1.1");
        });

        it("createOffer", () => {
            let s = new Server("192.168.1.1");
            let pkt = new Packet();
            s.createOffer(pkt);
            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways, []);
            assert.equal(s.domainServer, []);

            s.gateways = ["gateways"];
            s.domainServer = ["domainServer"];
            s.createOffer(pkt);
            assert.equal(s.serverId, "192.168.1.1");
            assert.equal(s.gateways, ["gateways"]);
            assert.equal(s.domainServer, ["domainServer"]);

            // pkt.chaddr = "a1:a2:a3:a4:a5:a6";
            // pkt.options.push(new DHCPMessageTypeOption(DHCPMessageType.decline));
            // console.log(pkt.toBuffer().toString("hex"));
        });
        it("createAck", () => {
            let s = new Server("192.168.1.1");
            let pkt = new Packet();
            s.createAck(pkt);
        });

        it("createNak", () => {
            let s = new Server("192.168.1.1");
            let pkt = new Packet();
            s.createNak(pkt);
        });

    });
});