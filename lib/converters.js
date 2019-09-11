"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
exports.IpConverter = {
    encode(data) {
        if (!data) {
            data = const_1.DEFAULT_IP;
        }
        const octets = data.split(const_1.IP_SPLITTER);
        const buffer = new Buffer(octets.length);
        octets.forEach((octet, index) => buffer[index] = Number(octet));
        return buffer;
    },
    decode(data) {
        const res = [];
        for (let i = 0; i < data.length; i++) {
            res.push(data[i].toString());
        }
        return res.join(const_1.IP_SPLITTER);
    },
};
exports.MacConverter = {
    encode(data, len) {
        if (len) {
            const regex = new RegExp("^([0-9a-f]{2}[:-]){" + (len - 1) + "}([0-9a-f]{2})", "i");
            if (!regex.test(data)) {
                throw new Error("Wrong MAC incoming data");
            }
        }
        if (!data) {
            data = const_1.DEFAULT_IP;
        }
        const octets = data.replace(new RegExp(const_1.MAC_SPLITTER, "g"), "");
        const buffer = new Buffer(octets, "hex");
        return buffer;
    },
    decode(data, len) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            res.push(new Buffer([data[i]]).toString("hex").toUpperCase());
        }
        if (len) {
            res = res.slice(0, len);
        }
        return res.join(const_1.MAC_SPLITTER);
    },
};
