const BASE_URL = "";

function obterIdUsuario() {
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("Você precisa estar logado para adicionar itens ao carrinho!");
    window.location.href = "login.html";
    return null;
  }
  return idUsuario;
}

async function enviarParaCarrinho(idProduto, quantidade) {
  const idUsuario = obterIdUsuario();
  if (!idUsuario) return;

  try {
    const resposta = await fetch(`${BASE_URL}/v1/carrinho/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "idUsuario": idUsuario
      },
      body: JSON.stringify({
        idProduto: String(idProduto), 
        quantidade: Number(quantidade)
      })
    });

    if (resposta.ok) {
      alert("Produto adicionado ao carrinho com sucesso!");
      atualizarContadorCarrinho();
    } else {
      const mensagemErro = await resposta.text();
      alert("Erro ao adicionar: " + mensagemErro);
    }
  } catch (erro) {
    console.error("Erro na comunicação com o servidor:", erro);
    alert("Servidor indisponível no momento.");
  }
}

document.querySelectorAll(".js-comprar").forEach(element => {
    element.addEventListener("click", (e) => {
        const item = e.currentTarget;
        const idProduto = item.dataset.produtoId;
        
        const modal = document.querySelector("#modal-compra");
        modal.dataset.produtoIdAtual = idProduto;
        
        modal.hidden = false;
    });
});

document.addEventListener("DOMContentLoaded", () => {

  const botoesAddDireto = document.querySelectorAll(".js-add-carrinho");

  botoesAddDireto.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      const itemMenu = e.target.parentElement.querySelector(".js-comprar");
      
      if (itemMenu) {
        const idProduto = itemMenu.dataset.produtoId;
        const quantidadePadrao = 1; 

        enviarParaCarrinho(idProduto, quantidadePadrao);
      }
    });
  });

  const botaoModalAdicionar = document.querySelector(".compra__adicionar");

  if (botaoModalAdicionar) {
    botaoModalAdicionar.addEventListener("click", () => {
      const modal = document.querySelector("#modal-compra");
      const idProduto = modal.dataset.produtoIdAtual;
      
      const textoValor = document.querySelector(".contador__valor").textContent;
      
      const quantidade = parseFloat(textoValor.replace(",", ".").replace(/[^0-9.]/g, "")) || 1;

      if (idProduto) {
        enviarParaCarrinho(idProduto, quantidade);
        modal.hidden = true; 
      }
    });
  }
});