const container = document.getElementById("container");

async function buscarTodosExercicios() {
  let url = "https://wger.de/api/v2/exerciseinfo/?limit=100&offset=0";
  let todosExercicios = [];

  while (url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      todosExercicios = todosExercicios.concat(data.results);
      url = data.next; // se houver próxima página
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      break;
    }
  }

  mostrarExercicios(todosExercicios);
}

function mostrarExercicios(lista) {
  lista.forEach(exercicio => {
    const traducaoPt = exercicio.translations?.find(t => t.language === 6);
    const nome = traducaoPt ? traducaoPt.name : exercicio.name || `ID: ${exercicio.id}`;

    const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Não informado";
    const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Não informado";
    const videos = exercicio.videos?.length > 0 ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank">Vídeo</a>`).join(", ") : "Não disponível";
    const licença = exercicio.license?.full_name || "Licença não informada";
    const imagem = exercicio.images?.[0]?.image || null;
    const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Não informado";
    const categoria = exercicio.category?.name || "Não informada";

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${nome}</h3>
      <p><strong>Músculos:</strong> ${musculos}</p>
      <p><strong>Músculos Secundários:</strong> ${musculosSecundarios}</p>
      <p><strong>Equipamento:</strong> ${equipamento}</p>
      <p><strong>Categoria:</strong> ${categoria}</p>
      <p><strong>Licença:</strong> ${licença}</p>
      <p><strong>Vídeos:</strong> ${videos}</p>
      ${imagem ? `<img src="${imagem}" alt="${nome}">` : '<p>Sem imagem</p>'}
    `;
    container.appendChild(card);
  });
}

// Executar ao carregar a página ou quando quiser buscar
buscarTodosExercicios();