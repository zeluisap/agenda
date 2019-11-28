const axios = require("axios");
const moment = require("moment");
const BdClient = require("./BdClient");

class AgendaService {
  static async run() {
    try {
      const agendas = await this.getHabilitados();

      if (!(agendas && agendas.length)) {
        console.log("Nenhum Agendamento a Executar!");
        return;
      }

      console.log(agendas.length + " agendamentos a executar.");

      for (const agenda of agendas) {
        console.log(` ** [${agenda.descricao}] Iniciando ... `);
        this.executar(agenda);
      }
    } catch (error) {
      console.error({
        error: error.message
      });
    }
  }

  static async getHabilitados() {
    try {
      const client = await BdClient.client();
      const res = await client.query(
        `
        select * 
        from agendamento 
        where (ativo = true)
        `
      );

      const objs = res.rows;
      if (!(objs && objs.length)) {
        return null;
      }

      return objs.filter(item => {
        if (!item.ultima_execucao) {
          return true;
        }
        const agora = moment();
        const proxima = moment(item.ultima_execucao).add(
          item.intervalo,
          "seconds"
        );

        return proxima.isBefore(agora);
      });
    } catch (error) {
      console.error({
        error: error.message
      });
    }
  }

  static async executar(agenda) {
    let resposta = {
      sucesso: true
    };

    let linha = ` ** [${agenda.descricao}] - finalizado `;

    try {
      const client = await BdClient.client();
      await client.query(
        `
                update agendamento
                set ultima_execucao = now()
                where id = $1
                `,
        [agenda.id]
      );

      resposta.dados = await axios.post(agenda.url);

      linha += " - ok ";
      if (resposta && resposta.dados && resposta.dados.data) {
        linha += " - " + resposta.dados.data;
      }
    } catch (error) {
      resposta.sucesso = false;
      linha += " - ERRO ";

      if (error && error.response && error.response.data) {
        resposta.error = error.response.data;
        if (error.response.status >= 500) {
          linha += " - " + error.response.data;
        }
      }
    }

    console.log(linha);
  }
}

module.exports = AgendaService;
