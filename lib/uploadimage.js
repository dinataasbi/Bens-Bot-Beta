const fetch = require("node-fetch");
const { default: Axios } = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");

const uploadImages = (buffData, type) => {
  return new Promise(async (resolve, reject) => {
    const { ext } = fromBuffer(buffData);
    const filePath = "stik" + ext;
    fs.writeFile(filePath, buffData, { encoding: "base64" }, (err) => {
      if (err) return reject(err);
      console.log("Uploading image to server telegra.ph");
      const fileData = fs.readFileSync(filePath);
      const form = new FormData();
      form.append("file", fileData, "tmp" + ext);
      fetch("https://telegra.ph/upload", {
        method: "POST",
        body: form,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) return reject(res.error);
          resolve("https://telegra.ph" + res[0].src);
        })
        .then(() => fs.unlinkSync(filePath))
        .catch((err) => reject(err));
    });
  });
};

exports.uploadImages = uploadImages;
