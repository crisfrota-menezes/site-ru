import Cardapio from "./Cardapio.js";
import Carrinho from "./Carrinho.js";
import Usuario from "./Usuario.js";
import InterfaceUsuario from "./InterfaceUsuario.js";
import InterfaceAdm from "./InterfaceAdm.js";
import Menu from "./Menu.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ui = new InterfaceUsuario();
  const cardapio = new Cardapio(await fetchCardapio());
  const carrinho = new Carrinho();
  const menu = new Menu(await fetchMenu());
  const uiAdm = new InterfaceAdm();

  let usuarioAtual = null; // Armazena o usuário logado

  // Eventos de navegação
  document.getElementById("student-button").addEventListener("click", () => {
    usuarioAtual = new Usuario("estudante");
    ui.mostrarTela("login-screen");
  });

  document.getElementById("visitor-button").addEventListener("click", () => {
    usuarioAtual = new Usuario("visitante");
    ui.mostrarTela("home-screen");
    ui.atualizarNavbar(usuarioAtual);
  });

  document.getElementById("admin-button").addEventListener("click", () => {
    uiAdm.mostrarTela("login-adm-screen");
  });

  document.getElementById("nav-home").addEventListener("click", () => {
    ui.mostrarTela("home-screen");
  });

  document.getElementById("nav-cardapio").addEventListener("click", () => {
    carregarCardapio(cardapio, ui);
  });

  document.getElementById("nav-menu").addEventListener("click", () => {
    ui.atualizarMenu(menu.getItensDoDia(), carrinho);
    ui.mostrarTela("menu-screen");
  });

  document.getElementById("nav-carrinho").addEventListener("click", () => {
    ui.mostrarTela("carrinho-screen");
    ui.atualizarCarrinho(carrinho);
  });

  document.getElementById("finalizar-pedido").addEventListener("click", () => {
    fetch("/sucesso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: "finalizado" }), // Envia o novo estado de execução
    });
    ui.mostrarTela("pagamento-screen");
    ui.atualizarPagamento(carrinho);
    // armazena o relatório de exercução:
  });

  document.getElementById("nav-adm-compras").addEventListener("click", () => {
    uiAdm.mostrarTela("compras-adm-screen");
  });

  document.getElementById("nav-adm-execucao").addEventListener("click", () => {
    uiAdm.mostrarTela("execucao-adm-screen");
  });

  // Função para carregar o cardápio
  function carregarCardapio(cardapio, ui) {
    const hoje = getDiaSemanaFormatado();
    const itensDoDia = cardapio.getItensDoDia(hoje);
    ui.atualizarCardapio(itensDoDia);
    ui.mostrarTela("cardapio-screen");
  }

  // Função para obter o dia da semana formatado
  function getDiaSemanaFormatado() {
    const diasSemana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const hoje = new Date();
    const indiceDia = hoje.getDay();
    return diasSemana[indiceDia];
  }

  // Função para buscar o cardápio
  async function fetchCardapio() {
    try {
      const response = await fetch("/data/cardapio.json");
      if (!response.ok) {
        throw new Error("Erro ao carregar o cardápio.");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  // Função para buscar o menu
  async function fetchMenu() {
    try {
      const response = await fetch("/data/menu.json");
      if (!response.ok) {
        throw new Error("Erro ao carregar o menu.");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  // Função para realizar o login
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const ra = document.getElementById("ra").value;
      const senha = document.getElementById("senha").value;

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ra, senha }),
        });

        if (!response.ok) {
          throw new Error("Erro ao realizar o login.");
        }

        const data = await response.json();

        if (data.success) {
          const usuario = new Usuario(data.tipo, data.ra);

          if (usuario.tipo === "estudante") {
            ui.atualizarNavbar(usuario);
            ui.mostrarTela("home-screen");
          }
          // else{

          //   uiAdm.atualizarNavbarAdm(usuario);
          //   uiAdm.mostrarTela("home-screen");
          // }
        } else {
          alert("RA ou senha incorretos. Tente novamente.");
        }
      } catch (error) {
        console.error(error);
      }
    });

  // Função para realizar o login adm
  document
    .getElementById("login-adm-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginAdm = document.getElementById("login-adm").value;
      const senhaAdm = document.getElementById("senha-adm").value;

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginAdm, senhaAdm }),
        });

        if (!response.ok) {
          throw new Error("Erro ao realizar o login.");
        }

        const data = await response.json();

        if (data.success) {
          const usuario = new Usuario(data.tipo, data.ra);

          if (usuario.tipo === "administrador") {
            uiAdm.atualizarNavbarAdm();
            uiAdm.mostrarTela("home-adm-screen");
          }
        } else {
          alert("RA ou senha incorretos. Tente novamente.");
        }
      } catch (error) {
        console.error(error);
      }
    });

  document.getElementById("pix").addEventListener("click", () => {
    processarPagamento(carrinho, "PIX");
  });

  document.getElementById("cartao").addEventListener("click", () => {
    processarPagamento(carrinho, "Cartão");
  });

  // Função para processar o pagamento
  async function processarPagamento(carrinho) {
    const total = carrinho.calcularTotal();
    if (total === 0) {
      alert(
        "O carrinho está vazio. Adicione itens antes de finalizar o pedido."
      );
      return;
    }

    // Gera um código de compra aleatório
    const codigo = gerarCodigoCompra();

    // Dados da compra
    const compra = {
      usuario: usuarioAtual.ra ? usuarioAtual : usuarioAtual.tipo,
      itens: carrinho.itens.map((item) => ({
        nome: item.nome,
        preco: item.preco,
      })),
      total,
      codigo,
    };

    try {
      const response = await fetch("/registrar-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compra),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar a compra.");
      }

      const data = await response.json();

      if (data.success) {
        // Exibe a tela de confirmação
        ui.atualizarConfirmacao(total, codigo);

        // Limpa o carrinho após o pagamento
        carrinho.itens = [];
      } else {
        alert("Erro ao registrar a compra. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Função para gerar um código de compra aleatório
  function gerarCodigoCompra() {
    return `${Math.floor(Math.random() * 10000)}-${Math.floor(
      Math.random() * 10000
    )}`;
  }

  function carregarRelatorioCompras() {
    // Carrega o relatório de compras colocando os dados em uma tabela (compras-adm-tabel):
    fetch("/data/compras.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o relatório de compras.");
        }
        return response.json();
      })
      .then((compras) => {
        const relComprasTabela = document.getElementById("compras-adm-table");
        if (relComprasTabela) {
          relComprasTabela.innerHTML = ""; // Limpa a tabela antes de preencher

          // Cria o cabeçalho da tabela
          const cabecalho = document.createElement("tr");
          cabecalho.innerHTML = `
            <th>Usuário</th>
            <th>Itens</th>
            <th>Total</th>
            <th>Data</th>
          `;  
          relComprasTabela.appendChild(cabecalho);

          // Preenche a tabela com os dados de cada compra
          compras.forEach((compra) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
              <td>${compra.usuario}</td>
              <td>${compra.itens.map((item) => item.nome).join(", ")}</td>
              <td>${compra.total}</td>
              <td>${compra.data}</td>
            `;
            relComprasTabela.appendChild(linha);
          });
        }
      })
      .catch((error) => console.error("Erro ao carregar relatório:", error));
  }

  // Chame esta função ao exibir a tela de relatório de compras
  document.getElementById("nav-adm-compras").addEventListener("click", () => {
    carregarRelatorioCompras();
    uiAdm.mostrarTela("compras-adm-screen");
  });

  function carregarRelatorioExecucao() {
    fetch("/data/execucao.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar o relatório de execução.");
        }
        return response.json();
      })
      .then((execucao) => {
        const relExecucaoList = document.getElementById("execucao-adm-list");
        if (relExecucaoList) {
          relExecucaoList.innerHTML = ""; // Limpa a lista antes de preencher

          execucao.forEach((registro) => {
            // Para cada item do array
            const li = document.createElement("li");
            li.textContent = `Status: ${registro.status} - Data: ${registro.data}`;
            relExecucaoList.appendChild(li);
          });
        }
      })
      .catch((error) => console.error("Erro ao carregar relatório:", error));
  }

  // Chame esta função ao exibir a tela de relatório de execução
  document.getElementById("nav-adm-execucao").addEventListener("click", () => {
    carregarRelatorioExecucao();
    uiAdm.mostrarTela("execucao-adm-screen");
  });

  document.getElementById("nav-adm-home").addEventListener("click", () => {
    uiAdm.mostrarTela("home-adm-screen");
  });
});
