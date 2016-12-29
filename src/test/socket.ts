
import { Socket } from "../socket";
import { Packet } from "../packet";
import * as assert from "assert";

context("socket", () => {

    it("open", done => {

        let s1 = new Socket("udp4", 1967, 1968);

        s1.on("listening", () => {
            assert.equal(s1.address.port, 1967);
        });

        s1.on("close", () => {
            console.log("Bye");
            done();
        });

        s1.bind();

        setTimeout(s1.close(), 500);

    });

    it("sockets", done => {
        let hex = "01010600c311435d00000000ac110220000000000000000000000000485b3902a59d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000638253633501083d0701485b3902a59d0c064379626f72673c084d53465420352e30370d010f03062c2e2f1f2179f92bfcff";
        let packet = Packet.fromBuffer(new Buffer(hex, "hex"));

        let s1 = new Socket("udp4", 1967, 1968);
        let s2 = new Socket("udp4", 1968, 1967);

        s1.on("listening", () => {
            assert.equal(s1.address.port, 1967);
            s1.send(packet);
        });
        s2.on("listening", () => {
            assert.equal(s2.address.port, 1968);
        });

        s1.on("close", () => {
            console.log("Bye");
            done();
        });
        s2.on("close", () => {
            done();
        });
        s2.on("message", () => {

        });

        s1.bind();
        s2.bind();

        setTimeout(done(), 25000);

    });
});