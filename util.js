const moment = require("moment");

const log = (txt) => {
  console.log(moment().format("YYYY-MM-DD HH:mm:ss") + " - " + txt);
};

module.exports = {
  log,
};
