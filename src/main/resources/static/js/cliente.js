const BASE_URL = "";

function obterIdUsuario() {
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    return null;
  }
  return idUsuario;
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCarrinho();

  const botaoFinalizar = document.querySelector(".js-finalizar-compra");
  if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", finalizarCompra);
  }
});

async function carregarCarrinho() {
  const idUsuario = obterIdUsuario();
  if (!idUsuario) return;

  const tbody = document.querySelector('[data-lista="carrinho"]');
  const spanTotal = document.querySelector('[data-carrinho-total]');

  try {
    const resposta = await fetch(`${BASE_URL}/v1/carrinho`, {
      method: "GET",
      headers: {
        "idUsuario": idUsuario
      }
    });

    if (!resposta.ok) {
      tbody.innerHTML = `<tr class="tabela__estado"><td colspan="6">Erro ao carregar os itens do pedido.</td></tr>`;
      return;
    }

    const carrinho = await resposta.json();

    if (!carrinho.itens || carrinho.itens.length === 0) {
      tbody.innerHTML = `<tr class="tabela__estado"><td colspan="6">Seu carrinho está vazio.</td></tr>`;
      spanTotal.textContent = "R$ 0,00";
      return;
    }

    tbody.innerHTML = "";

    carrinho.itens.forEach(item => {
      const tr = document.createElement("tr");

      const precoUnitario = Number(item.precoUnitario || item.preco || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const subtotal = Number(item.subtotal || (item.preco * item.quantidade) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      tr.innerHTML = `
        <td><strong>${item.nomeProduto || item.produtoNome || 'Produto'}</strong></td>
        <td>${item.unidade || 'kg/un'}</td>
        <td>${precoUnitario}</td>
        <td>
          <input type="number" 
                 class="campo__entrada" 
                 style="width: 70px; text-align: center;" 
                 value="${item.quantidade}" 
                 min="1" 
                 onchange="atualizarQuantidadeItem('${item.idProduto}', this.value)">
        </td>
        <td class="texto-suave">${item.descricao || '-'}</td>
        <td>
          <button type="button" 
                  class="botao botao--contorno botao--pequeno" 
                  onclick="removerItemDoCarrinho('${item.idProduto}')">
            Remover
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    const valorTotalFormatted = Number(carrinho.valorTotal || carrinho.total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    spanTotal.textContent = valorTotalFormatted;

  } catch (erro) {
    console.error("Erro ao buscar carrinho:", erro);
    tbody.innerHTML = `<tr class="tabela__estado"><td colspan="6">Não foi possível conectar ao servidor.</td></tr>`;
  }
}

async function atualizarQuantidadeItem(idProduto, novaQuantidade) {
  const idUsuario = obterIdUsuario();
  if (!idUsuario) return;

  try {
    const resposta = await fetch(`${BASE_URL}/v1/carrinho/update/${idProduto}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "idUsuario": idUsuario
      },
      body: JSON.stringify({ quantidade: Number(novaQuantidade) })
    });

    if (resposta.ok) {
      carregarCarrinho(); 
    } else {
      alert("Erro ao atualizar quantidade.");
    }
  } catch (erro) {
    console.error("Erro ao atualizar item:", erro);
  }
}

async function removerItemDoCarrinho(idProduto) {
  const idUsuario = obterIdUsuario();
  if (!idUsuario) return;

  if (!confirm("Tem certeza que deseja remover este item?")) return;

  try {
    const resposta = await fetch(`${BASE_URL}/v1/carrinho/delete/${idProduto}`, {
      method: "DELETE",
      headers: {
        "idUsuario": idUsuario
      }
    });

    if (resposta.ok) {
      carregarCarrinho(); 
    } else {
      alert("Erro ao remover produto.");
    }
  } catch (erro) {
    console.error("Erro ao deletar item:", erro);
  }
}

async function finalizarCompra() {
  const idUsuario = obterIdUsuario();
  if (!idUsuario) return;

  try {
    const resposta = await fetch(`${BASE_URL}/v1/carrinho`, {
      method: "DELETE",
      headers: {
        "idUsuario": idUsuario
      }
    });

    if (resposta.ok) {
      const modalSucesso = document.querySelector("#modal-sucesso");
      if (modalSucesso) {
        modalSucesso.hidden = false;
      }
      carregarCarrinho(); 
    } else {
      alert("Erro ao finalizar a compra.");
    }
  } catch (erro) {
    console.error("Erro ao finalizar compra:", erro);
  }
}