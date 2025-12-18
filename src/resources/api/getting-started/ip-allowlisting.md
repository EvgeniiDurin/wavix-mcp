---
title: "Wavix IP addresses"
sidebarTitle: "Configure firewall"
keywords: ["webhook","callback","IP", "whitelist", "allowlist"]
---

## Know which Wavix IPs to allow
This guide lists the Wavix IP addresses you need to allow in your firewall for SIP connectivity, messaging, and webhooks.

### SIP connectivity
Wavix SIP proxies are available in different regions. You can choose which proxy to use by configuring your SIP device to connect to one of the SIP proxies below:

| Location           | DNS name        | IP address |
|--------------------|:----------------|:---------------|
| Amsterdam, NL      | nl.wavix.net    | 95.211.82.14   |
| Dallas, USA        | us.wavix.net    | 209.58.144.243	|
| Singapore, SG      | sg.wavix.net    | 23.108.101.90	|
| Sydney, AU         | au.wavix.net    | 173.234.106.26	|

<Tip>
Wavix recommends using domain names whenever possible. Domain names stay the same even if the underlying IPs change, helping ensure reliability and automatic failover.
</Tip>

Unlike static SIP signaling IPs, media IPs are dynamic and can change frequently. To ensure proper audio flow, allow RTP traffic on ports **10000–20000** from **any IP address** in your firewall settings.

### Webhooks
Wavix uses webhooks to communicate with your applications. To receive voice and SMS callbacks, make sure your firewall allows incoming connections from the IP address below:
- 62.212.73.112

### Call streaming
When you use call media streaming, Wavix sends raw call media from the following IP address:
- 5.79.64.122




