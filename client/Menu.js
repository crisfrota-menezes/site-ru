export default class Menu {
  constructor(dados) {
    // Verifica se os dados contêm a chave 'menu'
    this.dados = Array.isArray(dados.menu) ? dados.menu : [];
  }

  getItensDoDia() {
    return this.dados; // Retorna todos os itens do menu
  }
}
