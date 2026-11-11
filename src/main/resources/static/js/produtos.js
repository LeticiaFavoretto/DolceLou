(function () {

  const API = (typeof BASE_URL !== 'undefined' ? BASE_URL : '') + '/v1/produto';

  const IMAGEM_PADRAO = 'fotinhas/bolochoccreme.png';

  const IMAGENS = [
    ['lasanha', 'fotinhas/lasanha.jpg'],
    ['torteleta de damasco', 'fotinhas/torteleta-damasco.jpg'],
    ['damasco', 'fotinhas/torteleta-damasco.jpg'],
    ['torteleta', 'fotinhas/torteleta.jpg'],
    ['canelone', 'fotinhas/canelone.jpg'],
    ['rondele', 'fotinhas/canelone.jpg'],
    ['cochila', 'fotinhas/cochila.jpg'],
    ['camarao', 'fotinhas/torta-camarao.jpg'],
    ['palmito', 'fotinhas/torta-palmito.jpg'],
    ['torta', 'fotinhas/torta-palmito.jpg'],
    ['maionese', 'fotinhas/maionese.jpg'],
    ['salpicao', 'fotinhas/maionese.jpg'],
    ['caponata', 'fotinhas/caponata-berinjela.jpg'],
    ['berinjela', 'fotinhas/caponata-berinjela.jpg'],
    ['brigadeirao', 'fotinhas/brigadeirao.jpg'],
    ['mousse', 'fotinhas/mousse.jpg'],
    ['pave', 'fotinhas/mousse.jpg'],
    ['brocolis', 'fotinhas/brocolis.png'],
    ['quiche', 'fotinhas/brocolis.png'],
    ['feijoada', 'fotinhas/beef-enchiladas_4004 1.png'],
    ['bacalhau', 'fotinhas/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158 1.png'],
    ['empanada', 'fotinhas/delish-200305-grilled-green-beans-0204-landscape-pf-1584045271 1.png'],
    ['salgado', 'fotinhas/gyro-sandwich1-1650490757 1.png'],
    ['porco', 'fotinhas/thai-tossed-green-salad-recipe-3217707-hero-01-8782b0ef1cbd404680af8a51769140ba 1.png'],
    ['bolo', 'fotinhas/bolochoccreme.png']
  ];


  function semAcento(valor) {
    return String(valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function escapar(valor) {
    return String(valor === undefined || valor === null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function imagemDoProduto(produto) {
    if (produto.imagem) return produto.imagem;
    if (produto.urlImagem) return produto.urlImagem;

    const nome = semAcento(produto.nome);
    for (let i = 0; i < IMAGENS.length; i++) {
      if (nome.includes(IMAGENS[i][0])) return IMAGENS[i][1];
    }
    return IMAGEM_PADRAO;
  }

  function unidadeDoProduto(produto) {
    const medida = semAcento(produto.medida || produto.unidade);
    if (medida.includes('un')) return 'un';
    if (medida.includes('kg') || medida.includes('g')) return 'kg';
    return 'kg';
  }

  function precoNumero(produto) {
    return Number(produto.preco) || 0;
  }

  function precoTexto(produto) {
    return 'R$ ' + precoNumero(produto).toFixed(2).replace('.', ',') + ' / ' + unidadeDoProduto(produto);
  }

  function categoriaDoProduto(produto) {
    const categoria = semAcento(produto.categoria);
    const nome = semAcento(produto.nome);

    if (categoria.includes('massa')) return 'massas';
    if (categoria.includes('bolo') || categoria.includes('sobremesa') || categoria.includes('doce')) return 'sobremesas';

    if (/lasanha|canelone|rondele|torteleta|cochila|nhoque|ravioli|talharim|panqueca/.test(nome)) return 'massas';
    if (/bolo|pave|mousse|brigadeir|torta gelada|red velvet|pudim|sobremesa|doce/.test(nome)) return 'sobremesas';

    return 'salgados';
  }

  function mensagem(lista, texto) {
    lista.innerHTML = '<li><p class="texto-suave">' + escapar(texto) + '</p></li>';
  }

  function dadosDoProduto(produto) {
    const unidade = unidadeDoProduto(produto);
    const categoria = categoriaDoProduto(produto);

    let dados = ' data-produto-id="' + escapar(produto.id) + '"' +
                ' data-nome="' + escapar(produto.nome) + '"' +
                ' data-preco="' + precoNumero(produto) + '"' +
                ' data-unidade="' + unidade + '"' +
                ' data-categoria="' + categoria + '"' +
                ' data-medida="' + escapar(produto.medida) + '"' +
                ' data-descricao="' + escapar(produto.descricao) + '"' +
                ' data-imagem="' + escapar(imagemDoProduto(produto)) + '"';

    if (unidade === 'un') dados += ' data-permite-unidade="true"';
    if (produto.sabores) dados += ' data-sabores="' + escapar(produto.sabores) + '"';

    return dados;
  }

  function cartaoHome(produto) {
    const nome = escapar(produto.nome);
    const imagem = escapar(imagemDoProduto(produto));

    return '<li>' +
             '<button type="button" class="produto js-comprar"' + dadosDoProduto(produto) + '>' +
               '<img class="produto__imagem" src="' + imagem + '" alt="' + nome + '" loading="lazy">' +
               '<span class="produto__corpo">' +
                 '<span class="produto__nome">' + nome + '</span>' +
               '</span>' +
             '</button>' +
             botaoAdicionar() +
           '</li>';
  }

  function linhaCardapio(produto) {
    return '<li>' +
             '<button type="button" class="item-menu js-comprar"' + dadosDoProduto(produto) + '>' +
               '<span class="item-menu__nome">' + escapar(produto.nome) + '</span>' +
               '<span class="item-menu__descricao">' + escapar(produto.descricao) + '</span>' +
               '<span class="item-menu__preco">' + precoTexto(produto) + '</span>' +
             '</button>' +
           '</li>';
  }

  async function buscarTodosOsProdutos() {
    const resposta = await fetch(API + '/findAll');
    if (!resposta.ok) throw new Error('status ' + resposta.status);

    const dados = await resposta.json();
    if (Array.isArray(dados)) return dados;
    return dados.produtos || dados.content || [];
  }

  async function buscarProdutoPorId(id) {
    try {
      const resposta = await fetch(API + '/find/' + id);
      if (!resposta.ok) return null;
      return await resposta.json();
    } catch (erro) {
      console.log('Erro ao buscar produto ' + id + ':', erro);
      return null;
    }
  }


  function listasDoCardapio() {
    function lista(idDoTitulo) {
      const secao = document.querySelector('section[aria-labelledby="' + idDoTitulo + '"]');
      return secao ? secao.querySelector('.menu-lista') : null;
    }

    return {
      massas: lista('massas-titulo'),
      salgados: lista('entradas-titulo'),
      sobremesas: lista('sobremesa-titulo')
    };
  }

  function preencherCardapio(produtos) {
    const listas = listasDoCardapio();
    const html = { massas: '', salgados: '', sobremesas: '' };

    produtos.forEach(function (produto) {
      html[categoriaDoProduto(produto)] += linhaCardapio(produto);
    });

    Object.keys(listas).forEach(function (chave) {
      const lista = listas[chave];
      if (!lista) return;

      if (html[chave]) lista.innerHTML = html[chave];
      else mensagem(lista, 'Nenhum item disponível nesta categoria por enquanto.');
    });
  }

  function preencherMaisPedidos(produtos) {
    const grade = document.querySelector('.produtos-grade');
    if (!grade) return;

    const destacados = produtos.filter(function (p) {
      return p.destaque === true || p.maisPedido === true;
    });

    const escolhidos = (destacados.length ? destacados : produtos).slice(0, 6);

    if (!escolhidos.length) {
      mensagem(grade, 'Nenhum produto disponível no momento.');
      return;
    }

    grade.innerHTML = escolhidos.map(cartaoHome).join('');
  }

  async function carregarProdutos() {
    const grade = document.querySelector('.produtos-grade');
    const listas = listasDoCardapio();
    const alvos = [grade, listas.massas, listas.salgados, listas.sobremesas].filter(Boolean);

    if (!alvos.length) return;

    alvos.forEach(function (lista) {
      mensagem(lista, 'Carregando produtos...');
    });

    try {
      const produtos = await buscarTodosOsProdutos();

      preencherMaisPedidos(produtos);
      preencherCardapio(produtos);

      document.dispatchEvent(new CustomEvent('produtos:carregados', { detail: produtos }));

    } catch (erro) {
      console.log('Erro ao carregar produtos:', erro);
      alvos.forEach(function (lista) {
        mensagem(lista, 'Não foi possível carregar os produtos agora. Tente novamente mais tarde.');
      });
    }
  }

  window.ProdutosAPI = {
    carregarProdutos: carregarProdutos,
    buscarTodosOsProdutos: buscarTodosOsProdutos,
    buscarProdutoPorId: buscarProdutoPorId
  };

  document.addEventListener('DOMContentLoaded', carregarProdutos);

})();
