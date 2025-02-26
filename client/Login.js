export default class Login {
  constructor() {
    this.raInput = document.getElementById("ra-input");
    this.senhaInput = document.getElementById("senha-input");
    this.loginButton = document.getElementById("login-button");

    // Verifica se os elementos existem
    if (!this.raInput || !this.senhaInput || !this.loginButton) {
      console.error("Erro: Um ou mais elementos do DOM não foram encontrados.");
    }
  }

  mostrarTela(tela) {
    const telas = [
      "selection-screen",
      "login-screen",
      "home-screen",
      "cardapio-screen",
      "menu-screen",
      "carrinho-screen",
      "pagamento-screen",
      "confirmacao-screen",
    ];
    telas.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.style.display = id === tela ? "block" : "none";
      } else {
        console.error(`Erro: Elemento '${id}' não encontrado no DOM.`);
      }
    });
  }

  adicionarLoginHandler(callback) {
    if (!this.loginButton) {
      console.error("Erro: Elemento 'login-button' não encontrado no DOM.");
      return;
    }

    this.loginButton.addEventListener("click", () => {
      const ra = this.raInput.value;
      const senha = this.senhaInput.value;
      callback(ra, senha);
    });
  }
}
