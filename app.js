const AgendaService = require("./AgendaService");
require("dotenv").config();

const intervalo_minutos = process.env.INTERVALO_MINUTOS || 9;

console.log(
  `Iniciando Agendamento ... rodando a cada ${intervalo_minutos} minutos.`
);

console.log();

AgendaService.run();

setInterval(() => {
  AgendaService.run();
}, intervalo_minutos * 60 * 1000);
