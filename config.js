const fs = require("fs");
const chalk = require("chalk");
global.thumb = fs.existsSync("./src/thumb.jpg")
  ? fs.readFileSync("./src/thumb.jpg")
  : console.log("Error: no such file or directory, open './src/thumb.jpg'");

global.author = "WhyDepin";
global.lolkey = ""; //Lolhuman apikey, saran beli premium biar fitur work all
global.kiikey = ""; //apikey kiicode
global.apikey = "tabraklurus"; //setting apikey
global.namabot = "Bens - MD"; //setting bot name
global.owner = ["6281384447735"]; //setting owner
global.prefix = "/^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i";
global.pairingNum = ""; //contoh: 62xxxx
global.openaikey = "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";
global.gamewaktu = 90;
global.limitCount = 25;
global.gcount = {
  prem: 35,
  user: 15,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.yellow(`'${__filename}' telah di update`));
  delete require.cache[file];
  require(file);
});
