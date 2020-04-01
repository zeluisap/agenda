const AgendaService = require("./AgendaService");
const { log } = require("./util");

require("dotenv").config();

const intervalo_minutos = process.env.INTERVALO_MINUTOS || 9;

log(`Iniciando Agendamento ... rodando a cada ${intervalo_minutos} minutos.`);

console.log();

AgendaService.run();

setInterval(() => {
  AgendaService.run();
}, intervalo_minutos * 60 * 1000);
