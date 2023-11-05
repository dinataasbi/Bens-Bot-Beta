const axios = require("axios");
const cheerio = require("cheerio");
let author = "Depin x Dinata";

const mediafiredl = async (url) => {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  const hasil = [];
  const link = $("a#downloadButton").attr("href");
  const size = $("a#downloadButton")
    .text()
    .replace("Download", "")
    .replace("(", "")
    .replace(")", "")
    .replace("\n", "")
    .replace("\n", "")
    .replace("                         ", "");
  const seplit = link.split("/");
  const nama = seplit[5];
  mime = nama.split(".");
  mime = mime[1];
  hasil.push({ nama, mime, size, link });
  return hasil;
};
module.exports = { mediafiredl };

function groupwa(nama) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=" +
          nama +
          "&searchby=name"
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = [];
        const lnk = [];
        const nm = [];
        $("div.wa-chat-title-container").each(function (a, b) {
          const limk = $(b).find("a").attr("href");
          lnk.push(limk);
        });
        $("div.wa-chat-title-text").each(function (c, d) {
          const name = $(d).text();
          nm.push(name);
        });
        for (let i = 0; i < lnk.length; i++) {
          result.push({
            nama: nm[i].split(". ")[1],
            link: lnk[i].split("?")[0],
          });
        }
        resolve(result);
      })
      .catch(reject);
  });
}
module.exports = { groupwa };

function idML(userId, zoneId) {
  if (!userId) return new Error("no userId");
  if (!zoneId) return new Error("no zoneId");
  return new Promise((resolve, reject) => {
    let body = {
      "voucherPricePoint.id": 4150,
      "voucherPricePoint.price": "1565.0",
      "voucherPricePoint.variablePrice": 0,
      n: "",
      email: "",
      userVariablePrice: 0,
      "order.data.profile": "",
      "user.userId": userId,
      "user.zoneId": zoneId,
      msisdn: "",
      voucherTypeName: "MOBILE_LEGENDS",
      shopLang: "id_ID",
      impactClickId: "",
      affiliateTrackingId: "",
      checkoutId: "",
      tmwAccessToken: "",
      anonymousId: "",
    };
    axios({
      url: "https://order-sg.codashop.com/initPayment.action",
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "application/json; charset/utf-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    })
      .then(({ data }) => {
        resolve({
          username: data.confirmationFields.username,
          country: data.confirmationFields.country,
          userId: userId,
          zoneId: zoneId,
        });
      })
      .catch(reject);
  });
}

function idFF(userId) {
  if (!userId) return new Error("no userId");
  return new Promise((resolve, reject) => {
    let body = {
      "voucherPricePoint.id": 8050,
      "voucherPricePoint.price": "",
      "voucherPricePoint.variablePrice": "",
      n: "",
      email: "",
      userVariablePrice: "",
      "order.data.profile": "",
      "user.userId": userId,
      voucherTypeName: "FREEFIRE",
      affiliateTrackingId: "",
      impactClickId: "",
      checkoutId: "",
      tmwAccessToken: "",
      shopLang: "in_ID",
    };
    axios({
      url: "https://order.codashop.com/id/initPayment.action",
      method: "POST",
      data: body,
      headers: {
        "Content-Type": "application/json; charset/utf-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    })
      .then(({ data }) => {
        resolve({
          username: data.confirmationFields.roles[0].role,
          userId: userId,
          country: data.confirmationFields.country,
        });
      })
      .catch(reject);
  });
}
module.exports = {
  idML,
  idFF,
  mediafiredl,
  groupwa,
};
