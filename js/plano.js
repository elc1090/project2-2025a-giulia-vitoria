document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formTreino");
  const resultado = document.getElementById("resultado");
  const lista = document.getElementById("listaTreino");

  const categoriasPermitidas = [8, 9, 10, 11, 12, 13, 14, 15];

  function ajustarSeries(diasTreino, objetivo, nivel) {
    let series = 2;
    let repeticoes = '';

    const nivelLimpo = nivel.toLowerCase();
    const objetivoLimpo = objetivo.toLowerCase();

    if (nivelLimpo === 'iniciante') {
      if (objetivoLimpo === 'ganho') {
        repeticoes = '10–14 repetições (carga leve)';
      } else if (objetivoLimpo === 'perda') {
        repeticoes = '12–16 repetições (carga leve/moderada)';
      } else {
        repeticoes = '8–12 repetições (carga moderada)';
      }
    } else if (nivelLimpo === 'intermediario') {
      if (objetivoLimpo === 'ganho') {
        repeticoes = '8–12 repetições (carga moderada)';
      } else if (objetivoLimpo === 'perda') {
        repeticoes = '12–16 repetições (carga leve/moderada)';
      } else {
        repeticoes = '10–14 repetições (carga leve)';
      }
    } else if (nivelLimpo === 'avancado') {
      if (objetivoLimpo === 'ganho') {
        repeticoes = '6–10 repetições (carga moderada/alta)';
      } else if (objetivoLimpo === 'perda') {
        repeticoes = '10–15 repetições (carga moderada)';
      } else {
        repeticoes = '12–16 repetições (carga leve)';
      }
    }

    return { series, repeticoes };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nivel = document.getElementById("nivel").value.toLowerCase();
    const dias = parseInt(document.getElementById("frequencia").value, 10);
    const objetivo = document.getElementById("objetivo").value.toLowerCase();

    if (dias < 2 || dias > 6) {
      alert("Escolha entre 2 e 6 dias de treino por semana.");
      return;
    }

    const { series, repeticoes } = ajustarSeries(dias, objetivo, nivel);
    const totalExerciciosPorDia = 6;
    const totalExercicios = totalExerciciosPorDia * dias;

    const res = await fetch("https://wger.de/api/v2/exerciseinfo/?limit=200");
    const data = await res.json();
    const exercicios = data.results;

    const filtrados = exercicios.filter(ex => categoriasPermitidas.includes(ex.category.id));
    filtrados.sort(() => Math.random() - 0.5);

    const todosExercicios = filtrados.slice(0, totalExercicios);
    lista.innerHTML = "";

    const criarCardDia = (titulo, exercicios) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const tituloDia = document.createElement("h3");
      tituloDia.classList.add("text-xl", "font-semibold", "text-gray-800", "mb-4");
      tituloDia.textContent = titulo;
      card.appendChild(tituloDia);

      exercicios.forEach(exercicio => {
        const nome = exercicio.translations?.find(t => t.language === 2)?.name || exercicio.name || `ID: ${exercicio.id}`;
        const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Não informado";
        const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Não informado";
        const videos = exercicio.videos?.length > 0
          ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank" class="text-blue-500">Vídeo</a>`).join(", ")
          : "Não disponível";
        const imagem = exercicio.images?.[0]?.image || null;
        const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Não informado";
        const categoria = exercicio.category?.name || "Não informado";

        const item = document.createElement("div");
        item.classList.add("mb-4", "p-4", "bg-gray-100", "rounded", "shadow-sm");
        item.innerHTML = `
          <h4 class="text-lg font-medium text-gray-800">${nome}</h4>
          <p><strong>Músculos principais:</strong> ${musculos}</p>
          <p><strong>Musculação Secundária:</strong> ${musculosSecundarios}</p>
          <p><strong>Equipamento:</strong> ${equipamento}</p>
          <p><strong>Categoria:</strong> ${categoria}</p>
          <p><strong>Vídeos:</strong> ${videos}</p>
          <p><strong>Séries:</strong> ${series}</p>
          <p><strong>Repetições:</strong> ${repeticoes}</p>
          ${imagem ? `<img src="${imagem}" alt="${nome}" class="mt-2 max-w-xs rounded">` : '<p>Sem imagem</p>'}
        `;
        card.appendChild(item);
      });

      return card;
    };

    const gridContainer = document.createElement("div");
    gridContainer.classList.add("cards-container");

    for (let i = 0; i < dias; i++) {
      const inicio = i * totalExerciciosPorDia;
      const fim = inicio + totalExerciciosPorDia;
      const exerciciosDia = todosExercicios.slice(inicio, fim);
      const cardDia = criarCardDia(`Dia ${i + 1}`, exerciciosDia);
      gridContainer.appendChild(cardDia);
    }

    lista.appendChild(gridContainer);
    resultado.classList.remove("hidden");
  });
});
