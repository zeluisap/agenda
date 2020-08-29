const axios = require("axios");
const moment = require("moment");
const { log } = require("./util");
const _ = require("lodash");
const { Agenda } = require("./AgendaMongo");

class AgendaService {
  static async run() {
    try {
      const agendas = await this.getHabilitados();

      log();

      if (!(agendas && agendas.length)) {
        log("Nenhum Agendamento a Executar!");
        return;
      }

      log(agendas.length + " agendamentos a executar.");

      for (const agenda of agendas) {
        log(`** [${agenda.descricao}] Iniciando ... `);
        this.executar(agenda);
      }
    } catch (error) {
      console.error({
        error: error.message,
      });
    }
  }

  static async getHabilitados() {
    try {
      const objs = await Agenda.find({
        ativo: true,
      });

      if (!(objs && objs.length)) {
        return null;
      }

      return objs.filter((item) => {
        if (!item.ultimaExecucao) {
          return true;
        }

        const agora = moment();
        const proxima = moment(item.ultimaExecucao).add(
          item.intervalo,
          "seconds"
        );

        return proxima.isBefore(agora);
      });
    } catch (error) {
      console.error({
        error: error.message,
      });
    }
  }

  static async executar(agenda) {
    let resposta = {
      sucesso: true,
    };

    let linha = `** [${agenda.descricao}] - finalizado `;

    try {
      agenda.ultimaExecucao = new Date();
      await agenda.save();

      resposta.dados = await axios.post(agenda.url);

      linha += " - ok ";
      if (resposta && resposta.dados && resposta.dados.data) {
        linha += " - " + resposta.dados.data;
      }
    } catch (error) {
      resposta.sucesso = false;
      linha += " - ERRO ";

      let errorMessage = _.get(error, "response.data.error.message");

      if (!errorMessage && typeof error === "string") {
        errorMessage = " - " + error;
      }

      if (!errorMessage && error.message) {
        errorMessage = " - " + error.message;
      }

      linha += " - " + errorMessage;
    }

    log(linha);
  }
}

module.exports = AgendaService;
