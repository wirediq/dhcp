import { DEFAULT_IP, DEFAULT_MAC, IP_SPLITTER, MAC_SPLITTER } from "./const";

export const IpConverter = {
    encode(data: string): Buffer {
        if (!data)
            data = DEFAULT_IP;
        let octets = data.split(IP_SPLITTER);
        let buffer = new Buffer(octets.length);
        octets.forEach((octet, index) => buffer[index] = Number(octet));
        return buffer;
    },
    decode(data: Buffer): string {
        let res: string[] = [];
        for (let i = 0; i < data.length; i++)
            res.push(data[i].toString());
        return res.join(IP_SPLITTER);
    }
};

export const MacConverter = {
    encode(data: string, len?: number): Buffer {
        if (len) {
            let regex = new RegExp("^([0-9a-f]{2}[:-]){" + (len - 1) + "}([0-9a-f]{2})", "i");
            if (!regex.test(data))
                throw new Error("Wrong MAC incoming data");
        }
        if (!data)
            data = DEFAULT_IP;
        let octets = data.replace(new RegExp(MAC_SPLITTER, "g"), "");
        let buffer = new Buffer(octets, "hex");

        return buffer;
    },
    decode(data: Buffer, len?: number): string {
        let res: string[] = [];
        for (let i = 0; i < data.length; i++)
            res.push(new Buffer([data[i]]).toString("hex").toUpperCase());
        if (len)
            res = res.slice(0, len);
        return res.join(MAC_SPLITTER);
    }
};