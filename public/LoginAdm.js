export default class LoginAdm {
    constructor() {
        this.loginAdmInput = document.getElementById("login-adm-input");
        this.senhaAdmInput = document.getElementById("senha-adm-input");
        this.loginAdmButton = document.getElementById("login-button");
  
      // Verifica se os elementos existem
      if (!this.loginAdmInput || !this.senhaAdmInput || !this.loginAdmButton) {
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
            "login-adm-screen",
            "home-adm-screen",
            "compras-adm-screen",
            "execucao-adm-screen",
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
  
    adicionarLoginAdmHandler(callback) {
      if (!this.loginAdmButton) {
        console.error("Erro: Elemento 'login-button' não encontrado no DOM.");
        return;
      }
  
      this.loginAdmButton.addEventListener("click", () => {
        const loginAdm = this.loginAdmInput.value;
        const senhaAdm = this.senhaAdmInput.value;
        callback(loginAdm, senhaAdm);
      });
    }
  }
  