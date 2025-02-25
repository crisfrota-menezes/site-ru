export default class Cardapio {
  constructor(dados) {
    this.dados = dados || {}; // Garante que `this.dados` seja um objeto vazio se `dados` for indefinido
  }

  getItensDoDia(dia) {
    if (!this.dados[dia]) {
      console.error(`Erro: Dados do cardápio para '${dia}' não encontrados.`);
      return {};
    }
    return this.dados[dia];
  }
}
