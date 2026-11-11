document.addEventListener('DOMContentLoaded', () => {


  const btnAbrirFiltroPedidos = document.querySelector('.js-abrir-filtro-pedidos');
  const painelFiltroPedidos = document.getElementById('filtro-pedidos');
  const radiosFiltroStatus = document.querySelectorAll('input[name="filtro-status"]');

  if (btnAbrirFiltroPedidos && painelFiltroPedidos) {
    btnAbrirFiltroPedidos.addEventListener('click', (e) => {
      e.stopPropagation();
      const estaOculto = painelFiltroPedidos.hasAttribute('hidden');
      if (estaOculto) {
        painelFiltroPedidos.removeAttribute('hidden');
      } else {
        painelFiltroPedidos.setAttribute('hidden', '');
      }
    });

    document.addEventListener('click', (e) => {
      if (!painelFiltroPedidos.contains(e.target) && e.target !== btnAbrirFiltroPedidos) {
        painelFiltroPedidos.setAttribute('hidden', '');
      }
    });
  }
  
if (radiosFiltroStatus.length > 0) {
  radiosFiltroStatus.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const valorStatus = e.target.value.toLowerCase();
      const linhasPedidos = document.querySelectorAll('tr[data-pedido-id]');

      linhasPedidos.forEach((linha) => {
        const celulaStatus = linha.querySelector('[data-campo="status"]')?.textContent.trim().toLowerCase();
        
        if (valorStatus === 'todos' || celulaStatus === valorStatus) {
          linha.style.display = '';
        } else {
          linha.style.display = 'none';
        }
      });
    });
  });
}


  const btnAbrirFiltroProdutos = document.querySelector('.js-abrir-filtro-produtos');
  const painelFiltroProdutos = document.getElementById('filtro-produtos');
  const checkboxesCategorias = document.querySelectorAll('#filtro-produtos input[type="checkbox"]');
  const btnLimparFiltroProd = document.querySelector('.js-limpar-filtro');

  if (btnAbrirFiltroProdutos && painelFiltroProdutos) {
    btnAbrirFiltroProdutos.addEventListener('click', (e) => {
      e.stopPropagation();
      const estaOculto = painelFiltroProdutos.hasAttribute('hidden');
      if (estaOculto) {
        painelFiltroProdutos.removeAttribute('hidden');
      } else {
        painelFiltroProdutos.setAttribute('hidden', '');
      }
    });

    document.addEventListener('click', (e) => {
      if (!painelFiltroProdutos.contains(e.target) && e.target !== btnAbrirFiltroProdutos) {
        painelFiltroProdutos.setAttribute('hidden', '');
      }
    });
  }

  checkboxesCategorias.forEach((chk) => {
    chk.addEventListener('change', () => {
      const idSecao = chk.value;
      const secao = document.getElementById(idSecao);
      if (secao) {
        secao.style.display = chk.checked ? '' : 'none';
      }
    });
  });

  if (btnLimparFiltroProd) {
    btnLimparFiltroProd.addEventListener('click', () => {
  checkboxesCategorias.forEach((chk) => {
        chk.checked = true;
        const secao = document.getElementById(chk.value);
        if (secao) secao.style.display = '';
      });
    });
  }


  document.addEventListener('click', (e) => {
    const btnExcluir = e.target.closest('.botao-icone--excluir');
    const btnEditar = e.target.closest('.botao-icone--editar');

    if (btnExcluir) {
      const linha = btnExcluir.closest('tr');
      const nomeOuId = linha?.querySelector('[data-campo="nome"]')?.textContent || 
                        linha?.querySelector('[data-campo="email"]')?.textContent || 
                        'este registro';

      if (confirm(`Tem certeza que deseja excluir: "${nomeOuId}"?`)) {
        linha.remove();
        alert('Item removido com sucesso.');
      }
    }

    if (btnEditar) {
      const linha = btnEditar.closest('tr');
      const nome = linha?.querySelector('[data-campo="nome"]')?.textContent || 
                    linha?.querySelector('[data-campo="email"]')?.textContent;
      alert(`Abrindo edição de: ${nome}`);
    }
  });

});
