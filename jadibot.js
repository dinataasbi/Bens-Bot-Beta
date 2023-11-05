require("./config");
const { Boom } = require("@hapi/boom");
const {
  default: makeWaSocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const FileType = require("file-type");
const PhoneNumber = require("awesome-phonenumber");
const qrcode = require("qrcode");
const { jClient, jSerialize } = require("./lib/serial.js");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
let listbot = JSON.parse(fs.readFileSync("./database/listbot.json"));

if (global.conns instanceof Array) console.log();
else global.conns = [];

const jadibot = async (sock, m) => {
  console.log("RUNNING JADIBOT ........");
  const { state, saveCreds } = await useMultiFileAuthState(
    `./database/jadibot/${m.sender}`,
    pino({ level: "silent" })
  );
  try {
    async function start() {
      console.log("RUNNING START ........");
      let { version, isLatest } = await fetchLatestBaileysVersion();
      const tabrak = await makeWaSocket({
        auth: state,
        browser: [`Bens || Clone`, "Chrome", "1.0.0"],
        logger: pino({ level: "silent" }),
        version,
      });

      tabrak.ws.on("CB:Blocklist", (json) => {
        if (blocked.length > 2) return;
        for (let i of json[1].blocklist) {
          blocked.push(i.replace("c.us", "s.whatsapp.net"));
        }
      });

      tabrak.multi = true;
      tabrak.nopref = false;
      tabrak.prefa = "anjing";
      tabrak.ev.on("messages.upsert", async (message) => {
        if (!message.messages) return;
        const m = await jSerialize(tabrak, message.messages[0]);
        require("./message/tabrak.js")(tabrak, m, message, store);
      });

      store.bind(tabrak.ev);
      await jClient({ tabrak, store });
      tabrak.ev.on("creds.update", saveCreds);

      let countQR = 0;
      let chatQR;
      tabrak.ev.on("connection.update", async (up) => {
        if (countQR > 3) return;
        console.log("RUNNING connection.update ........");
        const { lastDisconnect, connection } = up;
        if (connection == "connecting") return;
        if (connection) {
          if (connection != "connecting")
            console.log("Connecting to jadibot..");
        }
        console.log(up);
        if (up.qr) {
          countQR++;
          if (countQR > 3) {
            await m.reply(
              "*[GAGAL TERHUBUNG]*\n\nQR Code tidak discan, Silahkan Coba Lagi nanti !!"
            );
            await sock.sendMessage(m.key.remoteJid, { delete: chatQR.key });
          } else {
            try {
              let res = await qrcode.toDataURL(up.qr, { scale: 8 });
              const buffer = new Buffer.from(
                res.replace("data:image/png;base64,", ""),
                "base64"
              );
              const scan = await sock.sendMessage(m.key.remoteJid, {
                image: buffer,
                caption: "_*Scan this qr code!!*_",
              });
              if (chatQR) {
                await sock.sendMessage(m.key.remoteJid, { delete: chatQR.key });
              }
              chatQR = scan;
            } catch (error) {
              m.reply("_*ERROR: silahkan hubungi owner*_");
            }
          }
        }
        console.log(`Connection Jadibot: ` + connection);

        if (connection == "open") {
          tabrak.id = tabrak.user.id;
          tabrak.name = tabrak.user.name;
          tabrak.time = Date.now();
          global.conns.push(tabrak);
          listbot.push({ user: tabrak.user.id, name: tabrak.user.name });
          await m.reply(
            `*Connected to Whatsapp - Bot*\n\n*User :*\n _*× id : ${tabrak.decodeJid(
              tabrak.user.id
            )}*_\n\nJika ingin restart/bot mati, ketik kembali *.jadibot*`
          );
          user = `${tabrak.decodeJid(tabrak.user.id)}`;
          txt = `*Terdeteksi menumpang Jadibot*\n\n _× User : @${
            user.split("@")[0]
          }_`;
          sock.sendMessage(
            `${global.owner}@s.whatsapp.net`,
            {
              text: txt,
              mentions: [user],
            },
            { quoted: m }
          );
          let credential = await fs.readFileSync(
            `./database/jadibot/${m.sender}/creds.json`
          );

          await tabrak.sendMessage(
            m.key.remoteJid,
            {
              text: credential,
            },
            { quoted: m }
          );
          console.log(typeof credential);
        }

        if (connection === "close") {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
          if (reason === DisconnectReason.badSession) {
            console.log(
              `Bad Session File, Please Delete Session and Scan Again`
            );
            tabrak.logout();
          } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....");
            start();
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server, reconnecting...");
            start();
          } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(
              "Connection Replaced, Another New Session Opened, Please Close Current Session First"
            );
            tabrak.logout();
          } else if (reason === DisconnectReason.loggedOut) {
            console.log(`Device Logged Out, Please Scan Again And Run.`);
            tabrak.logout();
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            start();
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut, Reconnecting...");
            start();
          } else
            tabrak.end(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
      });

      tabrak.ev.on("contacts.update", (update) => {
        for (let contact of update) {
          let id = tabrak.decodeJid(contact.id);
          if (store && store.contacts)
            store.contacts[id] = { id, name: contact.notify };
        }
      });

      //  =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_= FUNCTION  =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=
      tabrak.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
          let decode = jidDecode(jid) || {};
          return (
            (decode.user &&
              decode.server &&
              decode.user + "@" + decode.server) ||
            jid
          );
        } else return jid;
      };

      tabrak.getName = (jid, withoutContact = false) => {
        id = tabrak.decodeJid(jid);
        withoutContact = tabrak.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us"))
          return new Promise(async (resolve) => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = tabrak.groupMetadata(id) || {};
            resolve(
              v.name ||
                v.subject ||
                PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
                  "international"
                )
            );
          });
        else
          v =
            id === "0@s.whatsapp.net"
              ? {
                  id,
                  name: "WhatsApp",
                }
              : id === tabrak.decodeJid(sock.user.id)
              ? tabrak.user
              : store.contacts[id] || {};
        return (
          (withoutContact ? "" : v.name) ||
          v.subject ||
          v.verifiedName ||
          PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
            "international"
          )
        );
      };

      tabrak.parseMention = (text = "") => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
          (v) => v[1] + "@s.whatsapp.net"
        );
      };

      tabrak.sendImage = async (
        jid,
        path,
        caption = "",
        quoted = "",
        options
      ) => {
        let buffer = Buffer.isBuffer(path)
          ? path
          : /^data:.*?\/.*?;base64,/i.test(path)
          ? Buffer.from(path.split`,`[1], "base64")
          : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);
        return await tabrak.sendMessage(
          jid,
          { image: buffer, caption: caption, ...options },
          { quoted }
        );
      };

      tabrak.sendContact = async (jid, kon, quoted = "", opts = {}) => {
        let list = [];
        for (let i of kon) {
          list.push({
            displayName: await tabrak.getName(i + "@s.whatsapp.net"),
            vcard: `BEGIN:VCARD\n
VERSION:3.0\n
N:${await tabrak.getName(i + "@s.whatsapp.net")}\n
FN:${await tabrak.getName(i + "@s.whatsapp.net")}\n
item1.TEL;waid=${i}:${i}\n
item1.X-ABLabel:Ponsel\n
item2.EMAIL;type=INTERNET:tesheroku123@gmail.com\n
item2.X-ABLabel:Email\n
item3.URL:https://bit.ly/39Ivus6\n
item3.X-ABLabel:YouTube\n
item4.ADR:;;Indonesia;;;;\n
item4.X-ABLabel:Region\n
END:VCARD`,
          });
        }
        tabrak.sendMessage(
          jid,
          {
            contacts: {
              displayName: `${list.length} Kontak`,
              contacts: list,
            },
            ...opts,
          },
          { quoted }
        );
      };

      tabrak.setStatus = (status) => {
        tabrak.query({
          tag: "iq",
          attrs: {
            to: "@s.whatsapp.net",
            type: "set",
            xmlns: "status",
          },
          content: [
            {
              tag: "status",
              attrs: {},
              content: Buffer.from(status, "utf-8"),
            },
          ],
        });
        return status;
      };

      tabrak.downloadAndSaveMediaMessage = async (
        message,
        filename,
        attachExtension = true
      ) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype
          ? message.mtype.replace(/Message/gi, "")
          : mime.split("/")[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        trueFileName = attachExtension ? filename + "." + type.ext : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
      };

      tabrak.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || "";
        let messageType = message.mtype
          ? message.mtype.replace(/Message/gi, "")
          : mime.split("/")[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      };

      tabrak.sendText = (jid, text, quoted = "", options) =>
        tabrak.sendMessage(jid, { text: text, ...options }, { quoted });
    }
    start();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { jadibot, conns };
