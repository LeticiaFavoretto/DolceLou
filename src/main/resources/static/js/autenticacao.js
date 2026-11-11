const API_URL = "/v1/acesso";

document.addEventListener("DOMContentLoaded", () => {

  const formAcesso = document.querySelector("#loginForm");
  const btnAlternar = document.querySelector(".js-alternar-login");
  const btnConvidado = document.querySelector(".js-entrar-convidado");

  const containerConfirmarSenha = document.querySelector(".campo--confirmar");
  const inputConfirmarSenha = document.querySelector("#confirmar-senha");

  const tituloForm = document.querySelector("#acesso-titulo");
  const btnSubmit = document.querySelector(".js-enviar-acesso");

  let modoCadastro = true;

  btnAlternar.addEventListener("click", () => {
    modoCadastro = !modoCadastro;

    if (modoCadastro) {
      tituloForm.textContent = "Cadastro";
      btnSubmit.textContent = "Cadastrar";
      btnAlternar.textContent = "Já tem conta? Entrar";
      
      containerConfirmarSenha.style.display = "block";
      inputConfirmarSenha.setAttribute('required', '');
      inputConfirmarSenha.disabled = false;

    } else {
      tituloForm.textContent = "Login";
      btnSubmit.textContent = "Entrar";
      btnAlternar.textContent = "Não tem conta? Cadastre-se";
      
      containerConfirmarSenha.style.display = "none";
      inputConfirmarSenha.removeAttribute('required'); 
      inputConfirmarSenha.disabled = true;
    }

  });

  formAcesso.addEventListener("submit", async (event) => {

    event.preventDefault();
    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (modoCadastro) {
      const confirmarSenha = inputConfirmarSenha.value;

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      await cadastrar(email, senha);
      
    } else {
      await login(email, senha);
    }
  });

  btnConvidado.addEventListener("click", () => {
    localStorage.removeItem("idUsuario");
    window.location.href = "index.html";
  });
});

async function cadastrar(email, senha) {
  try {
    const resposta = await fetch(
      `${API_URL}/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          acesso: "COMPRADOR",
          email: email,
          senha: senha
        })
      }
    );

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.log("Status:", resposta.status);
      console.log("Mensagem backend:", erro);

      throw new Error(`Erro ${resposta.status}: ${erro}`);
    }

    const usuario = await resposta.json();
    localStorage.setItem("idUsuario", usuario.id);
    localStorage.setItem("authToken", usuario.token);
    alert("Cadastro realizado com sucesso!");

    window.location.href = "index.html";

  } catch (erro) {
    console.error(erro);
    alert("Não foi possível realizar o cadastro");
  }
}


async function login(email, senha) {
  try {
      const resposta = await fetch(
          `${API_URL}/login`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "email" : email,
                  "senha" : senha
              }
          }
      );

      if (!resposta.ok) {
          throw new Error("Email ou senha inválidos");
      }

      const usuario = await resposta.json();

      localStorage.setItem("idUsuario", usuario.id);
      localStorage.setItem("authToken", usuario.token);

      if (usuario.acesso == "COMPRADOR") {
        window.location.href = "index.html";
      } else {
        window.location.href = "admin-cardapio.html";
      }

      alert("Login realizado!");

  } catch (erro) {
      console.error(erro);
      alert(erro.message);
  }
}
