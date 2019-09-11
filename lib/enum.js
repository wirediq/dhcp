"use strict";
/**
 *   Tag     Name          Data Length    Meaning
 *   ---     ----          -----------    -------
 *    0      Pad               0          None
 *    1      Subnet Mask       4          Subnet Mask Value
 *    2      Time Offset       4          Time Offset in
 *                                        Seconds from UTC
 *    3      Gateways          N          N/4 Gateway addresses
 *    4      Time Server       N          N/4 Timeserver addresses
 *    5      Name Server       N          N/4 IEN-116 Server addresses
 *    6      Domain Server     N          N/4 DNS Server addresses
 *    7      Log Server        N          N/4 Logging Server addresses
 *    8      Quotes Server     N          N/4 Quotes Server addresses
 *    9      LPR Server        N          N/4 Printer Server addresses
 *   10      Impress Server    N          N/4 Impress Server addresses
 *   11      RLP Server        N          N/4 RLP Server addresses
 *   12      Hostname          N          Hostname string
 *   13      Boot File Size    2          Size of boot file in 512 byte
 *                                        chunks
 *   14      Merit Dump File              Client to dump and name
 *                                        the file to dump it to
 *   15      Domain Name       N          The DNS domain name of the
 *                                        client
 *   16      Swap Server       N          Swap Server addeess
 *   17      Root Path         N          Path name for root disk
 *   18      Extension File    N          Path name for more BOOTP info
 *
 *   19      Forward On/Off    1          Enable/Disable IP Forwarding
 *   20      SrcRte On/Off     1          Enable/Disable Source Routing
 *   21      Policy Filter     N          Routing Policy Filters
 *   22      Max DG Assembly   2          Max Datagram Reassembly Size
 *   23      Default IP TTL    1          Default IP Time to Live
 *   24      MTU Timeout       4          Path MTU Aging Timeout
 *   25      MTU Plateau       N          Path MTU  Plateau Table
 *   26      MTU Interface     2          Interface MTU Size
 *   27      MTU Subnet        1          All Subnets are Local
 *   28      Broadcast Address 4          Broadcast Address
 *   29      Mask Discovery    1          Perform Mask Discovery
 *   30      Mask Supplier     1          Provide Mask to Others
 *   31      Router Discovery  1          Perform Router Discovery
 *   32      Router Request    4          Router Solicitation Address
 *   33      Static Route      N          Static Routing Table
 *   34      Trailers          1          Trailer Encapsulation
 *   35      ARP Timeout       4          ARP Cache Timeout
 *   36      Ethernet          1          Ethernet Encapsulation
 *   37      Default TCP TTL   1          Default TCP Time to Live
 *   38      Keepalive Time    4          TCP Keepalive Interval
 *   39      Keepalive Data    1          TCP Keepalive Garbage
 *   40      NIS Domain        N          NIS Domain Name
 *   41      NIS Servers       N          NIS Server Addresses
 *   42      NTP Servers       N          NTP Server Addresses
 *   43      Vendor Specific   N          Vendor Specific Information
 *   44      NETBIOS Name Srv  N          NETBIOS Name Servers
 *   45      NETBIOS Dist Srv  N          NETBIOS Datagram Distribution
 *   46      NETBIOS Note Type 1          NETBIOS Note Type
 *   47      NETBIOS Scope     N          NETBIOS Scope
 *   48      X Window Font     N          X Window Font Server
 *   49      X Window Manmager N          X Window Display Manager
 *   50      Address Request   4          Requested IP Address
 *   51      Address Time      4          IP Address Lease Time
 *   52      Overload          1          Overloaf "sname" or "file"
 *   53      DHCP Msg Type     1          DHCP Message Type
 *   54      DHCP Server Id    4          DHCP Server Identification
 *   55      Parameter List    N          Parameter Request List
 *   56      DHCP Message      N          DHCP Error Message
 *   57      DHCP Max Msg Size 2          DHCP Maximum Message Size
 *   58      Renewal Time      4          DHCP Renewal (T1) Time
 *   59      Rebinding Time    4          DHCP Rebinding (T2) Time
 *   60      Class Id          N          Class Identifier
 *   61      Client Id         N          Client Identifier
 *   62      Netware/IP Domain N          Netware/IP Domain Name
 *   63      Netware/IP Option N          Netware/IP sub Options
 *
 *   64-127  Unassigned
 *   128-154 Reserved
 *
 *   255     End               0          None
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DHCPOptions;
(function (DHCPOptions) {
    /**
     * None
     * Size: 0
     */
    DHCPOptions[DHCPOptions["Pad"] = 0] = "Pad";
    /**
     * Subnet Mask Value
     * Size: 4
     */
    DHCPOptions[DHCPOptions["SubnetMask"] = 1] = "SubnetMask";
    /**
     * Time Offset in Seconds from UTC
     * Size: 4
     */
    DHCPOptions[DHCPOptions["TimeOffset"] = 2] = "TimeOffset";
    /**
     * N/4 Gateway addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["Gateways"] = 3] = "Gateways";
    /**
     * N/4 Timeserver addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["TimeServer"] = 4] = "TimeServer";
    /**
     * N/4 IEN-116 Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["NameServer"] = 5] = "NameServer";
    /**
     * N/4 DNS Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["DomainServer"] = 6] = "DomainServer";
    /**
     * N/4 Logging Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["LogServer"] = 7] = "LogServer";
    /**
     * N/4 Quotes Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["QuotesServer"] = 8] = "QuotesServer";
    /**
     * N/4 Printer Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["LPRServer"] = 9] = "LPRServer";
    /**
     * N/4 Impress Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["ImpressServer"] = 10] = "ImpressServer";
    /**
     * N/4 RLP Server addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["RLPServer"] = 11] = "RLPServer";
    /**
     * Hostname string
     * Size: N
     */
    DHCPOptions[DHCPOptions["Hostname"] = 12] = "Hostname";
    /**
     * Size of boot file in 512 byte chunks
     * Size: 2
     */
    DHCPOptions[DHCPOptions["BootFileSize"] = 13] = "BootFileSize";
    /**
     * Client to dump and name the file to dump it to
     * Size: N
     */
    DHCPOptions[DHCPOptions["MeritDumpFile"] = 14] = "MeritDumpFile";
    /**
     * The DNS domain name of the client
     * Size: N
     */
    DHCPOptions[DHCPOptions["DomainName"] = 15] = "DomainName";
    /**
     * Swap Server addeess
     * Size: N
     */
    DHCPOptions[DHCPOptions["SwapServer"] = 16] = "SwapServer";
    /**
     * Path name for root disk
     * Size: N
     */
    DHCPOptions[DHCPOptions["RootPath"] = 17] = "RootPath";
    /**
     * Path name for more BOOTP info
     * Size: N
     */
    DHCPOptions[DHCPOptions["ExtensionFile"] = 18] = "ExtensionFile";
    /**
     * Enable/Disable IP Forwarding
     * Size: 1
     */
    DHCPOptions[DHCPOptions["Forward"] = 19] = "Forward";
    /**
     * Enable/Disable Source Routing
     * Size: 1
     */
    DHCPOptions[DHCPOptions["SrcRte"] = 20] = "SrcRte";
    /**
     * Routing Policy Filters
     * Size: N
     */
    DHCPOptions[DHCPOptions["PolicyFilter"] = 21] = "PolicyFilter";
    /**
     * Max Datagram Reassembly Size
     * Size: 2
     */
    DHCPOptions[DHCPOptions["MaxDGAssembly"] = 22] = "MaxDGAssembly";
    /**
     * Default IP Time to Live
     * Size: 1
     */
    DHCPOptions[DHCPOptions["DefaultIpTtl"] = 23] = "DefaultIpTtl";
    /**
     * Path MTU Aging Timeout
     * Size: 4
     */
    DHCPOptions[DHCPOptions["MtuTimeout"] = 24] = "MtuTimeout";
    /**
     * Path MTU  Plateau Table
     * Size: N
     */
    DHCPOptions[DHCPOptions["MtuPlateau"] = 25] = "MtuPlateau";
    /**
     * Interface MTU Size
     * Size: 2
     */
    DHCPOptions[DHCPOptions["MtuInterface"] = 26] = "MtuInterface";
    /**
     * All Subnets are Local
     * Size: 1
     */
    DHCPOptions[DHCPOptions["MtuSubnet"] = 27] = "MtuSubnet";
    /**
     * Broadcast Address
     * Size: 4
     */
    DHCPOptions[DHCPOptions["BroadcastAddress"] = 28] = "BroadcastAddress";
    /**
     * Perform Mask Discovery
     * Size: 1
     */
    DHCPOptions[DHCPOptions["MaskDiscovery"] = 29] = "MaskDiscovery";
    /**
     * Provide Mask to Others
     * Size: 1
     */
    DHCPOptions[DHCPOptions["MaskSupplier"] = 30] = "MaskSupplier";
    /**
     * Perform Router Discovery
     * Size: 1
     */
    DHCPOptions[DHCPOptions["RouterDiscovery"] = 31] = "RouterDiscovery";
    /**
     * Router Solicitation Address
     * Size: 4
     */
    DHCPOptions[DHCPOptions["RouterRequest"] = 32] = "RouterRequest";
    /**
     * Static Routing Table
     * Size: N
     */
    DHCPOptions[DHCPOptions["StaticRoute"] = 33] = "StaticRoute";
    /**
     * Trailer Encapsulation
     * Size: 1
     */
    DHCPOptions[DHCPOptions["Trailers"] = 34] = "Trailers";
    /**
     * ARP Cache Timeout
     * Size: 4
     */
    DHCPOptions[DHCPOptions["ArpTimeout"] = 35] = "ArpTimeout";
    /**
     * Ethernet Encapsulation
     * Size: 1
     */
    DHCPOptions[DHCPOptions["Ethernet"] = 36] = "Ethernet";
    /**
     * Default TCP Time to Live
     * Size: 1
     */
    DHCPOptions[DHCPOptions["DefaultTcpTtl"] = 37] = "DefaultTcpTtl";
    /**
     * TCP Keepalive Interval
     * Size: 4
     */
    DHCPOptions[DHCPOptions["KeepaliveTime"] = 38] = "KeepaliveTime";
    /**
     * TCP Keepalive Garbage
     * Size: 1
     */
    DHCPOptions[DHCPOptions["KeepaliveData"] = 39] = "KeepaliveData";
    /**
     * NIS Domain Name
     * Size: N
     */
    DHCPOptions[DHCPOptions["NisDomain"] = 40] = "NisDomain";
    /**
     * NIS Server Addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["NisServers"] = 41] = "NisServers";
    /**
     * NTP Server Addresses
     * Size: N
     */
    DHCPOptions[DHCPOptions["NtpServers"] = 42] = "NtpServers";
    /**
     * Vendor Specific Information
     * Size: N
     */
    DHCPOptions[DHCPOptions["VendorSpecific"] = 43] = "VendorSpecific";
    /**
     * NETBIOS Name Servers
     * Size: N
     */
    DHCPOptions[DHCPOptions["NetbiosNameSrv"] = 44] = "NetbiosNameSrv";
    /**
     * NETBIOS Datagram Distribution
     * Size: N
     */
    DHCPOptions[DHCPOptions["NetbiosDistSrv"] = 45] = "NetbiosDistSrv";
    /**
     * NETBIOS Note Type
     * Size: 1
     */
    DHCPOptions[DHCPOptions["NetbiosNoteType"] = 46] = "NetbiosNoteType";
    /**
     * NETBIOS Scope
     * Size: N
     */
    DHCPOptions[DHCPOptions["NetbiosScope"] = 47] = "NetbiosScope";
    /**
     * X Window Font Server
     * Size: N
     */
    DHCPOptions[DHCPOptions["XWindowFont"] = 48] = "XWindowFont";
    /**
     * X Window Display Manager
     * Size: N
     */
    DHCPOptions[DHCPOptions["XWindowManmager"] = 49] = "XWindowManmager";
    /**
     * Requested IP Address
     * Size: 4
     */
    DHCPOptions[DHCPOptions["AddressRequest"] = 50] = "AddressRequest";
    /**
     * IP Address Lease Time
     * Size: 4
     */
    DHCPOptions[DHCPOptions["AddressTime"] = 51] = "AddressTime";
    /**
     * Overloaf "sname" or "file"
     * Size: 1
     */
    DHCPOptions[DHCPOptions["Overload"] = 52] = "Overload";
    /*1          DHCP Message Type
    * Size: Type
     */
    DHCPOptions[DHCPOptions["DhcpMessageType"] = 53] = "DhcpMessageType";
    /**
     * DHCP Server Identification
     * Size: 4
     */
    DHCPOptions[DHCPOptions["DhcpServerId"] = 54] = "DhcpServerId";
    /**
     * Parameter Request List
     * Size: N
     */
    DHCPOptions[DHCPOptions["ParameterList"] = 55] = "ParameterList";
    /**
     * DHCP Error Message
     * Size: N
     */
    DHCPOptions[DHCPOptions["DhcpMessage"] = 56] = "DhcpMessage";
    /**
     * DHCP Maximum Message Size
     * Size: 2
     */
    DHCPOptions[DHCPOptions["DhcpMaxMsgSize"] = 57] = "DhcpMaxMsgSize";
    /**
     * DHCP Renewal (T1) Time
     * Size: 4
     */
    DHCPOptions[DHCPOptions["RenewalTime"] = 58] = "RenewalTime";
    /**
     * DHCP Rebinding (T2) Time
     * Size: 4
     */
    DHCPOptions[DHCPOptions["RebindingTime"] = 59] = "RebindingTime";
    /**
     * Class Identifier
     * Size: N
     */
    DHCPOptions[DHCPOptions["ClassId"] = 60] = "ClassId";
    /**
     * Client Identifier
     * Size: N
     */
    DHCPOptions[DHCPOptions["ClientId"] = 61] = "ClientId";
    /**
     * Netware/IP Domain Name
     * Size: N
     */
    DHCPOptions[DHCPOptions["NetwareIpDomain"] = 62] = "NetwareIpDomain";
    /**
     * Netware/IP sub Options
     * Size: N
     */
    DHCPOptions[DHCPOptions["NetwareIpOption"] = 63] = "NetwareIpOption";
    /**
     * None
     * Size: 0
     */
    DHCPOptions[DHCPOptions["TftpServer"] = 66] = "TftpServer";
    /**
     * TFTP server name
     * Size: N
     */
    DHCPOptions[DHCPOptions["BootFile"] = 67] = "BootFile";
    /**
     * Bootfile name
     * Size: N
     */
    DHCPOptions[DHCPOptions["End"] = 255] = "End";
    //  64-127  Unassigned
    //  128-154 Reserved
})(DHCPOptions = exports.DHCPOptions || (exports.DHCPOptions = {}));
var DHCPMessageType;
(function (DHCPMessageType) {
    DHCPMessageType[DHCPMessageType["discover"] = 1] = "discover";
    DHCPMessageType[DHCPMessageType["offer"] = 2] = "offer";
    DHCPMessageType[DHCPMessageType["request"] = 3] = "request";
    DHCPMessageType[DHCPMessageType["decline"] = 4] = "decline";
    DHCPMessageType[DHCPMessageType["ack"] = 5] = "ack";
    DHCPMessageType[DHCPMessageType["nak"] = 6] = "nak";
    DHCPMessageType[DHCPMessageType["release"] = 7] = "release";
    DHCPMessageType[DHCPMessageType["inform"] = 8] = "inform";
})(DHCPMessageType = exports.DHCPMessageType || (exports.DHCPMessageType = {}));
var BOOTMessageType;
(function (BOOTMessageType) {
    BOOTMessageType[BOOTMessageType["request"] = 1] = "request";
    BOOTMessageType[BOOTMessageType["reply"] = 2] = "reply";
})(BOOTMessageType = exports.BOOTMessageType || (exports.BOOTMessageType = {}));
