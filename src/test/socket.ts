
import { Socket } from "../socket";
import { Packet } from "../packet";
import * as assert from "assert";

context("socket", () => {

    it("open", done => {
        let s1 = new Socket("udp4", 1967, 1968);

        s1.on("listening", () => {
            assert.equal(s1.address.port, 1967);
            s1.close();
            done();
        });

        s1.bind();
    });

    it("default constructor", () => {
        let s1 = new Socket();
        assert.equal(s1.listenPort, 67);
        assert.equal(s1.sendPort, 68);
        assert.equal(s1.type, "udp4");
    });

    context("send sockets", () => {

        let s1 = new Socket("udp4", 1967, 1968);
        let s2 = new Socket("udp4", 1968, 1967);

        before(done => {
            s1.bind();
            s2.bind();

            let refCount = 2;

            function listening() {
                refCount--;
                if (!refCount) {
                    done();
                }
            }

            s1.on("listening", listening);
            s2.on("listening", listening);
        });

        after(done => {

            let refCount = 2;

            function close() {
                refCount--;
                if (!refCount) {
                    done();
                }
            }

            s1.on("close", close);
            s2.on("close", close);

            s1.close();
            s2.close();
        });

        it("port", () => {
            assert.equal(s1.address.port, 1967);
            assert.equal(s2.address.port, 1968);
        });



        it("send request", done => {
            let hex = "01010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501083d0701485b3902a59d0c064379626f72673c084d53465420352e30370d010f03062c2e2f1f2179f92bfcff";
            let packet = Packet.fromBuffer(new Buffer(hex, "hex"));

            s1.send(packet);

            s2.once("dhcp", e => {
                assert.equal(e.target, s2);
                assert.equal(e.packet.toBuffer().toString("hex"), hex);
                done();
            });
        });

        it("send reply", done => {
            let hex = "02010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501083d0701485b3902a59d0c064379626f72673c084d53465420352e30370d010f03062c2e2f1f2179f92bfcff";
            let packet = Packet.fromBuffer(new Buffer(hex, "hex"));
            s1.send(packet);

            s2.once("dhcp", e => {
                assert.equal(e.target, s2);
                assert.equal(e.packet.toBuffer().toString("hex"), hex);
                done();
            });
        });

        it("send reply", () => {
            let hex = "02010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501083d0701485b3902a59d0c064379626f72673c084d53465420352e30370d010f03062c2e2f1f2179f92bfcff";
            let packet = Packet.fromBuffer(new Buffer(hex, "hex"));
            packet.op = 3;
            s1.send(packet);
        });

        it("on error", done => {
            let s3 = new Socket("udp4", 1967, 1968);
            s3.on("error", e => {
                assert.equal(e.name, "Error");
                done();
            });
            s3.bind();
        });
    });
});