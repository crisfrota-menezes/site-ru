export default class InterfaceUsuario {
  constructor() {
    this.relComprasTable = document.getElementById("compras-adm-table");
    this.relExecList = document.getElementById("execucao-adm-list");
    this.navbarAdm = document.getElementById("navbar-adm");

    // Verifica se os elementos existem
    if (!this.relComprasTable || !this.relExecList || !this.navbarAdm) {
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

  atualizarNavbarAdm() {
    const navbarAdm = document.getElementById("navbar-adm");
    if (navbarAdm) {
      navbarAdm.style.display = "flex"; // Exibe a barra de navegação do administrador
    } else {
      console.error("Erro: Elemento 'navbar-adm' não encontrado no DOM.");
    }
  }
}
