export default class InterfaceUsuario {
  constructor() {
    this.cardapioList = document.getElementById("cardapio-list");
    this.menuList = document.getElementById("menu-list");
    this.carrinhoList = document.getElementById("carrinho-list");
    this.listaPagamento = document.getElementById("lista-pagamento");
    this.valorTotal = document.getElementById("valor-total");
    this.codigoTicket = document.getElementById("codigo-ticket");
    this.totalPago = document.getElementById("total-pago");
    this.navbar = document.getElementById("navbar");

    // Verifica se os elementos existem
    if (
      !this.cardapioList ||
      !this.menuList ||
      !this.carrinhoList ||
      !this.listaPagamento ||
      !this.valorTotal ||
      !this.codigoTicket ||
      !this.totalPago ||
      !this.navbar
    ) {
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
    // Oculta a barra de navegação apenas na tela de confirmação
    if (tela === "confirmacao-screen") {
      this.navbar.classList.add("navbar-oculta");
    } else {
      this.navbar.classList.remove("navbar-oculta");
    }
  }

  atualizarCardapio(itens) {
    if (!this.cardapioList) {
      console.error("Erro: Elemento 'cardapio-list' não encontrado no DOM.");
      return;
    }

    this.cardapioList.innerHTML = "";
    for (const [categoria, descricao] of Object.entries(itens)) {
      const li = document.createElement("li");
      li.textContent = `${categoria
        .replace("_", " ")
        .toUpperCase()}: ${descricao}`;
      this.cardapioList.appendChild(li);
    }
  }

  atualizarMenu(itens, carrinho) {
    if (!this.menuList) {
      console.error("Erro: Elemento 'menu-list' não encontrado no DOM.");
      return;
    }
    this.menuList.innerHTML = "";
    itens.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
      li.style.cursor = "pointer"; // Altera o cursor para indicar que é clicável
      li.addEventListener("click", () => {
        carrinho.adicionarItem(item); // Adiciona o item ao carrinho
      });
      this.menuList.appendChild(li);
    });
  }

  atualizarCarrinho(carrinho) {
    if (!this.carrinhoList) {
      console.error("Erro: Elemento 'carrinho-list' não encontrado no DOM.");
      return;
    }
    this.carrinhoList.innerHTML = ""; // Limpa a lista atual
    carrinho.itens.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

      // Adiciona um botão para remover o item do carrinho
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remover";
      removeButton.style.marginLeft = "10px";
      removeButton.addEventListener("click", () => {
        carrinho.removerItem(index); // Remove o item do carrinho
        this.atualizarCarrinho(carrinho); // Atualiza a interface do carrinho
      });

      li.appendChild(removeButton);
      this.carrinhoList.appendChild(li);
    });

    // Habilita ou desabilita o botão "Finalizar Pedido"
    const finalizarPedidoButton = document.getElementById("finalizar-pedido");
    if (finalizarPedidoButton) {
      finalizarPedidoButton.disabled = carrinho.itens.length === 0; // Desativa se o carrinho estiver vazio
    }
  }

  atualizarPagamento(carrinho) {
    if (!this.listaPagamento || !this.valorTotal) {
      console.error(
        "Erro: Elementos 'lista-pagamento' ou 'valor-total' não encontrados no DOM."
      );
      return;
    }

    this.listaPagamento.innerHTML = "";
    carrinho.itens.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
      this.listaPagamento.appendChild(li);
    });
    this.valorTotal.textContent = `R$ ${carrinho.calcularTotal().toFixed(2)}`;
  }

  atualizarNavbar() {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.style.display = "flex"; // Exibe a barra de navegação
    } else {
      console.error("Erro: Elemento 'navbar' não encontrado no DOM.");
    }
  }

  atualizarConfirmacao(total, codigo) {
    if (!this.codigoTicket || !this.totalPago) {
      console.error("Erro: Elementos de confirmação não encontrados.");
      return;
    }
    this.totalPago.textContent = `R$ ${total.toFixed(2)}`;
    this.codigoTicket.textContent = codigo;
    this.mostrarTela("confirmacao-screen");
  }
}
