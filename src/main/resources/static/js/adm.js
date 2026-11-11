const BASE_URL = "";
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return Promise.reject(new Error("Autenticação necessária"));
  }
  options.headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  return fetch(url, options).then(response => {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("idUsuario");
      window.location.href = "login.html";
    }
    return response;
  });
};

if (!localStorage.getItem("authToken")) window.location.href = "login.html";


function formatarDinheiro(valor) {
  if (!valor) {
    valor = 0;
  }
  return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function texto(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "-";
  }
  return valor;
}

function mostrarMensagem(tabela, mensagem) {
  tabela.innerHTML = "<tr><td colspan='6'>" + mensagem + "</td></tr>";
}

function botoesDaLinha() {
  return "<td class='tabela__acoes'>" +
           "<button type='button' class='botao-icone botao-icone--ver'>" +
             "<img src='fotinhas/Editar.png' alt='Editar'>" +
           "</button>" +
           "<button type='button' class='botao-icone botao-icone--cancelar'>" +
             "<img src='fotinhas/Lixeira.png' alt='Excluir'>" +
           "</button>" +
         "</td>";
}

function descobrirCategoria(produto) {
  let categoria = "";
  if (produto.categoria) {
    categoria = String(produto.categoria).toLowerCase();
  }

  if (categoria.includes("bolo")) {
    return "bolos";
  }
  if (categoria.includes("massa")) {
    return "massas";
  }
  return "salgados";
}


async function carregarProdutos() {
  const tabelaBolos = document.querySelector("tbody[data-lista='bolos']");
  const tabelaSalgados = document.querySelector("tbody[data-lista='salgados']");
  const tabelaMassas = document.querySelector("tbody[data-lista='massas']");

  if (!tabelaBolos || !tabelaSalgados || !tabelaMassas) {
    return;
  }

  try {
    const resposta = await authFetch(BASE_URL + "/v1/produto/findAll");
    const produtos = await resposta.json();

    tabelaBolos.innerHTML = "";
    tabelaSalgados.innerHTML = "";
    tabelaMassas.innerHTML = "";

    for (let i = 0; i < produtos.length; i++) {
      const produto = produtos[i];

      const linha = "<tr data-produto-id='" + produto.id + "'>" +
                      "<td>" + texto(produto.nome) + "</td>" +
                      "<td>" + texto(produto.medida) + "</td>" +
                      "<td>" + formatarDinheiro(produto.preco) + "</td>" +
                      "<td>" + texto(produto.descricao) + "</td>" +
                      botoesDaLinha() +
                    "</tr>";

      const categoria = descobrirCategoria(produto);
      
      if (categoria === "bolos") {
        tabelaBolos.innerHTML += linha;
      } else if (categoria === "massas") {
        tabelaMassas.innerHTML += linha;
      } else {
        tabelaSalgados.innerHTML += linha;
      }
    }

    if (tabelaBolos.innerHTML === "") {
      mostrarMensagem(tabelaBolos, "Nenhum bolo cadastrado.");
    }
    if (tabelaSalgados.innerHTML === "") {
      mostrarMensagem(tabelaSalgados, "Nenhum salgado cadastrado.");
    }
    if (tabelaMassas.innerHTML === "") {
      mostrarMensagem(tabelaMassas, "Nenhuma massa cadastrada.");
    }

  } catch (erro) {
    console.log("Erro ao carregar produtos:", erro);
    mostrarMensagem(tabelaBolos, "Não foi possível carregar os produtos.");
    mostrarMensagem(tabelaSalgados, "Não foi possível carregar os produtos.");
    mostrarMensagem(tabelaMassas, "Não foi possível carregar os produtos.");
  }
}


async function carregarPedidos() {
  const tabela = document.querySelector("tbody[data-lista='pedidos']");
  if (!tabela) {
    return;
  }

  mostrarMensagem(tabela, "Carregando pedidos...");

  try {
    const resposta = await authFetch(BASE_URL + "/v1/carrinho/all");
    const pedidos = await resposta.json();

    if (pedidos.length === 0) {
      mostrarMensagem(tabela, "Nenhum pedido recebido até agora.");
      return;
    }

    tabela.innerHTML = "";

    for (let i = 0; i < pedidos.length; i++) {
      const pedido = pedidos[i];

      tabela.innerHTML += "<tr data-pedido-id='" + pedido.id + "'>" +
                            "<td>#" + texto(pedido.id) + "</td>" +
                            "<td>" + texto(pedido.cliente) + "</td>" +
                            "<td>" + texto(pedido.itens) + "</td>" +
                            "<td>" + formatarDinheiro(pedido.preco_total) + "</td>" +
                            "<td><span class='selo'>" + texto(pedido.status) + "</span></td>" +
                            "<td>" + texto(pedido.data) + "</td>" +
                            botoesDaLinha() +
                          "</tr>";
    }

  } catch (erro) {
    console.log("Erro ao carregar pedidos:", erro);
    mostrarMensagem(tabela, "Não foi possível carregar os pedidos.");
  }
}


async function carregarContas() {
  const tabela = document.querySelector("tbody[data-lista='contas']");
  if (!tabela) {
    return;
  }

  mostrarMensagem(tabela, "Carregando contas...");

  try {
    const resposta = await authFetch(BASE_URL + "/v1/acesso/findAll");
    const contas = await resposta.json();

    if (contas.length === 0) {
      mostrarMensagem(tabela, "Nenhuma conta cadastrada.");
      return;
    }

    tabela.innerHTML = "";

    for (let i = 0; i < contas.length; i++) {
      const conta = contas[i];

      let tipo = "Funcionário";
      if (conta.acesso === "COMPRADOR") {
        tipo = "Cliente";
      }

      tabela.innerHTML += "<tr data-acesso-id='" + conta.id + "'>" +
                            "<td>" + texto(conta.email) + "</td>" +
                            "<td>" + tipo + "</td>" +
                            botoesDaLinha() +
                          "</tr>";
    }

  } catch (erro) {
    console.log("Erro ao carregar contas:", erro);
    mostrarMensagem(tabela, "Não foi possível carregar as contas.");
  }
}

async function cadastrarConta() {
  const formCadastro = document.querySelector("#formulario-cadastro-conta");
  console.log("Formulário encontrado?", formCadastro);

  if (!formCadastro) return;

  formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();
    const novoEmail = document.getElementById("novo-email").value
    const novaSenha = document.getElementById("nova-senha").value
    const tipoConta = document.getElementById("novo-tipo-conta").value 
    const confirmarSenha = document.getElementById("confirmar-nova-senha").value

    if (!novoEmail || !novaSenha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const dadosCadastro = {
      email: novoEmail,
      senha: novaSenha,
      acesso: tipoConta
    };

    try {
      const resposta = await authFetch(BASE_URL + "/v1/acesso/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCadastro)
      });

      if (resposta.ok) {
        alert("Conta cadastrada com sucesso!");
        formCadastro.reset();
        
        if (typeof carregarContas === "function") {
          carregarContas();
        }
      } else {
        const mensagemErro = await resposta.text();
        alert("Erro ao cadastrar conta: " + mensagemErro);
      }

    } catch (erro) {
      console.error("Erro na conexão com o servidor:", erro);
      alert("Não foi possível conectar ao servidor backend.");
    }
  });
}


async function carregarIndicadores() {
  const campoPedidos = document.querySelector("[data-campo='pedidos-hoje']");
  const campoAguardando = document.querySelector("[data-campo='aguardando']");
  const campoFaturamento = document.querySelector("[data-campo='faturamento']");

  if (!campoPedidos || !campoAguardando || !campoFaturamento) {
    return;
  }

  try {
    const resposta = await authFetch(BASE_URL + "/v1/carrinho/indicadores");
    const dados = await resposta.json();

    campoPedidos.textContent = texto(dados.pedidosHoje);
    campoAguardando.textContent = texto(dados.aguardandoPreparo);
    campoFaturamento.textContent = formatarDinheiro(dados.faturamentoDia);

  } catch (erro) {
    console.log("Erro ao carregar indicadores:", erro);
    campoPedidos.textContent = "-";
    campoAguardando.textContent = "-";
    campoFaturamento.textContent = "-";
  }
}

function ligarPopUpDeProduto() {
  const popUp = document.getElementById("modal-produto");
  const botaoAbrir = document.querySelector(".js-criar-produto");
  const formulario = document.getElementById("formulario-produto");

  if (!popUp || !botaoAbrir || !formulario) {
    return;
  }

  const textoErro = document.getElementById("produto-erro");
  const botaoFechar = popUp.querySelector(".js-fechar-produto");
  const fundoEscuro = popUp.querySelector(".modal__fundo");

  botaoAbrir.addEventListener("click", function () {
    textoErro.textContent = "";
    formulario.reset();
    popUp.removeAttribute("hidden");
  });

  function fecharPopUp() {
    popUp.setAttribute("hidden", "");
  }

  botaoFechar.addEventListener("click", fecharPopUp);
  fundoEscuro.addEventListener("click", fecharPopUp);

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharPopUp();
    }
  });

  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const produto = {
      nome: document.getElementById("produto-nome").value,
      categoria: document.getElementById("produto-categoria").value,
      medida: document.getElementById("produto-medida").value,
      preco: Number(document.getElementById("produto-preco").value),
      descricao: document.getElementById("produto-descricao").value,
      quantidade: Number(document.getElementById("produto-quantidade").value)
    };

    if (produto.nome === "" || produto.medida === "" || produto.preco <= 0) {
      textoErro.textContent = "Preencha nome, medida e preço.";
      return;
    }

    try {
      const resposta = await authFetch(BASE_URL + "/v1/produto/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      if (!resposta.ok) {
        const erro = await resposta.text();
        console.log("erro:", erro);
        textoErro.textContent = "O backend recusou o cadastro (erro " + resposta.status + ").";
        return;
      }

      fecharPopUp();
      carregarProdutos();

    } catch (erro) {
      console.log("Erro ao cadastrar produto:", erro);
      textoErro.textContent = "Não foi possível conectar no backend.";
    }
  });
}


document.addEventListener("DOMContentLoaded", function () {
  carregarProdutos();
  carregarPedidos();
  carregarContas();
  carregarIndicadores();
  ligarPopUpDeProduto();
  cadastrarConta();
});
