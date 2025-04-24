document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formTreino");
  const resultado = document.getElementById("resultado");
  const lista = document.getElementById("listaTreino");

  const categoriasPermitidas = [8, 9, 10, 11, 12, 13, 14, 15];

  // Função para ajustar as séries com base no número de dias de treino, objetivo e nível
  function ajustarSeries(diasTreino, objetivo, nivel) {
    let series = 2;  // Sempre 2 séries por exercício, pois são 2 dias de treino
    let repeticoes = '';
    
    if (nivel === 'iniciante') {
      if (objetivo === 'ganho') { // Hipertrofia
        repeticoes = '8–12 repetições (carga moderada)';
      } else if (objetivo === 'perda') { // Perda de peso
        repeticoes = '12–16 repetições (carga leve/moderada)';
      } else if (objetivo === 'resistencia') { // Saúde geral
        repeticoes = '10–14 repetições (carga leve)';
      }
    } else if (nivel === 'intermediario') {
      if (objetivo === 'ganho') { // Hipertrofia
        repeticoes = '8–12 repetições (carga moderada)';
      } else if (objetivo === 'perda') { // Perda de peso
        repeticoes = '12–16 repetições (carga leve/moderada)';
      } else if (objetivo === 'resistencia') { // Saúde geral
        repeticoes = '10–14 repetições (carga leve)';
      }
    } else if (nivel === 'avancado') {
      if (objetivo === 'ganho') { // Hipertrofia
        repeticoes = '8–12 repetições (carga moderada/alta)';
      } else if (objetivo === 'perda') { // Perda de peso
        repeticoes = '12–16 repetições (carga leve/moderada)';
      } else if (objetivo === 'resistencia') { // Saúde geral
        repeticoes = '10–14 repetições (carga leve)';
      }
    }

    return { series, repeticoes };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nivel = document.getElementById("nivel").value.toLowerCase(); // Agora em minúsculo para evitar problemas
    const dias = parseInt(document.getElementById("frequencia").value, 10);
    const objetivo = document.getElementById("objetivo").value;

    if (dias !== 2) {
      alert("Este gerador está configurado apenas para planos de 2 dias por semana.");
      return;
    }

    const { series, repeticoes } = ajustarSeries(dias, objetivo, nivel); // Ajuste das séries

    const totalExercicios = 6; // 6 exercícios por dia

    const res = await fetch("https://wger.de/api/v2/exerciseinfo/?limit=200");
    const data = await res.json();
    const exercicios = data.results;

    const filtrados = exercicios.filter(ex => categoriasPermitidas.includes(ex.category.id));
    filtrados.sort(() => Math.random() - 0.5);

    const diaA = filtrados.slice(0, totalExercicios);
    const diaB = filtrados.slice(totalExercicios, totalExercicios * 2);

    lista.innerHTML = "";

    const criarBloco = (titulo, exercicios) => {
      const bloco = document.createElement("li");
      bloco.innerHTML = `<h3 class="dia-titulo">${titulo}</h3>`; // Aplicando a classe 'dia-titulo' aqui
      exercicios.forEach(exercicio => {
        const nome = exercicio.translations?.find(t => t.language === 2)?.name || exercicio.name || `ID: ${exercicio.id}`;
        const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Not informed";
        const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Not informed";
        const videos = exercicio.videos?.length > 0
        ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank" class="video-link">Video</a>`).join(", ")
        : "Not available"; 
        const imagem = exercicio.images?.[0]?.image || null;
        const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Not informed";
        const categoria = exercicio.category?.name || "Not informed";

        const item = document.createElement("div");
        item.className = "mb-4 p-4 bg-gray-100 rounded shadow";
        item.innerHTML = `
          <h4 class="exercicio-nome">${nome}</h4> <!-- Nome com a classe para o estilo maior -->
          <p><strong>Muscles:</strong> ${musculos}</p>
          <p><strong>Secondary Muscles:</strong> ${musculosSecundarios}</p>
          <p><strong>Equipment:</strong> ${equipamento}</p>
          <p><strong>Category:</strong> ${categoria}</p>
          <p><strong>Videos:</strong> ${videos}</p>
          <p><strong>Series:</strong> ${series}</p>
          <p><strong>Repetitions:</strong> ${repeticoes}</p>
          ${imagem ? `<img src="${imagem}" alt="${nome}" class="mt-2 max-w-xs rounded">` : '<p>No image</p>'}
        `;
        bloco.appendChild(item);
      });
      lista.appendChild(bloco);
    };

    criarBloco("Dia A", diaA);
    criarBloco("Dia B", diaB);
    resultado.classList.remove("hidden");
  });
});
