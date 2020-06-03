const moment = require("moment");

const log = (txt) => {
  if (!txt) {
    console.log("");
    return;
  }

  console.log(moment().format("YYYY-MM-DD HH:mm:ss") + " - " + txt);
};

module.exports = {
  log,
};
