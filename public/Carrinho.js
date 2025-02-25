export default class Carrinho {
  constructor() {
    this.itens = [];
  }

  adicionarItem(item) {
    this.itens.push(item);
  }

  removerItem(index) {
    this.itens.splice(index, 1);
  }

  calcularTotal() {
    return this.itens.reduce((total, item) => total + item.preco, 0);
  }
}
