var mongoose = require("mongoose");

var usuario = process.env.MONGODB_USER;
var senha = process.env.MONGODB_PASSWORD;
var host = process.env.MONGODB_HOST;
var port = process.env.MONGODB_PORT;
var db = process.env.MONGODB_DB;

const stringConnection =
  "mongodb://" + usuario + ":" + senha + "@" + host + ":" + port + "/" + db;

mongoose.connect(stringConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var Schema = mongoose.Schema;

var agendaSchema = new Schema(
  {
    descricao: { type: String, required: true },
    ultimaExecucao: Date,
    url: String,
    intervalo: Number,
    ativo: Boolean,
  },
  { collection: "agenda" }
);

var Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = {
  Agenda,
};
