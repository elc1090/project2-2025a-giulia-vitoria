const form = document.getElementById("formTreino");
const resultadoDiv = document.getElementById("resultado");
const listaTreino = document.getElementById("listaTreino");

// Tabela de planos recomendados
const planos = [
  { dias: 2, nivel: "Iniciante", objetivo: "Hipertrofia", divisao: "Full Body A/B", series: 24, repeticoes: "8–12 repetições" },
  { dias: 2, nivel: "Intermediário", objetivo: "Perda de peso", divisao: "Full Body A/B", series: 28, repeticoes: "12–16 repetições" },
  { dias: 2, nivel: "Avançado", objetivo: "Hipertrofia", divisao: "Full Body A/B", series: 36, repeticoes: "8–12 repetições" },
  { dias: 3, nivel: "Iniciante", objetivo: "Saúde geral", divisao: "Full Body", series: 36, repeticoes: "10–14 repetições" },
  { dias: 3, nivel: "Intermediário", objetivo: "Perda de peso", divisao: "Push / Pull / Legs", series: 45, repeticoes: "12–16 repetições" },
  { dias: 3, nivel: "Avançado", objetivo: "Hipertrofia", divisao: "Push / Pull / Legs", series: 57, repeticoes: "8–12 repetições" },
  { dias: 4, nivel: "Iniciante", objetivo: "Hipertrofia", divisao: "Upper / Lower", series: 36, repeticoes: "8–12 repetições" },
  { dias: 4, nivel: "Intermediário", objetivo: "Perda de peso", divisao: "Upper / Lower", series: 45, repeticoes: "12–16 repetições" },
  { dias: 4, nivel: "Avançado", objetivo: "Hipertrofia", divisao: "Upper / Lower A/B", series: 57, repeticoes: "8–12 repetições" },
  { dias: 5, nivel: "Intermediário", objetivo: "Hipertrofia", divisao: "Push / Pull / Legs / Upper / Lower", series: 45, repeticoes: "8–12 repetições" },
  { dias: 5, nivel: "Avançado", objetivo: "Hipertrofia", divisao: "Push / Pull / Legs / Upper / Lower", series: 57, repeticoes: "8–12 repetições" },
  { dias: 6, nivel: "Intermediário", objetivo: "Perda de peso", divisao: "Push / Pull / Legs (2x)", series: 45, repeticoes: "12–16 repetições" },
  { dias: 6, nivel: "Avançado", objetivo: "Hipertrofia", divisao: "Push / Pull / Legs (2x)", series: 57, repeticoes: "8–12 repetições" }
];

// Mapeamento de divisões para categorias musculares
const categoriasPorDivisao = {
  "Full Body": [1, 8, 11, 12],
  "Full Body A/B": [1, 8, 11, 12],
  "Push / Pull / Legs": [8, 9, 10],
  "Upper / Lower": [1, 5],
  "Upper / Lower A/B": [1, 5],
  "Push / Pull / Legs / Upper / Lower": [1, 5, 8, 9, 10],
  "Push / Pull / Legs (2x)": [8, 9, 10]
};

// Buscar plano ideal
function buscarPlano(dias, nivel, objetivo) {
  return planos.find(p =>
    p.dias === dias &&
    p.nivel.toLowerCase() === nivel.toLowerCase() &&
    p.objetivo.toLowerCase() === objetivo.toLowerCase()
  );
}

// Buscar exercícios conforme as categorias musculares da divisão
async function buscarExerciciosPorCategorias(categorias, limite = 20) {
  const url = `https://wger.de/api/v2/exerciseinfo/?language=6&limit=200`; // language=6 é português
  const res = await fetch(url);
  const json = await res.json();
  return json.results
    .filter(ex => categorias.includes(ex.category?.id))
    .slice(0, limite);
}

// Gera o plano e busca os exercícios
async function gerarPlanoPersonalizado(dias, nivel, objetivo) {
  const plano = buscarPlano(dias, nivel, objetivo);
  if (!plano) {
    console.error("Nenhum plano encontrado com esses dados");
    return null;
  }

  const categorias = categoriasPorDivisao[plano.divisao] || [];
  const exercicios = await buscarExerciciosPorCategorias(categorias);

  return { plano, exercicios };
}

// Mostra o treino na tela
function mostrarTreino(exercicios, plano) {
  listaTreino.innerHTML = "";

  if (exercicios.length === 0) {
    listaTreino.innerHTML = "<li>Nenhum exercício encontrado.</li>";
    return;
  }

  exercicios.forEach(ex => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${ex.name}</strong> – ${plano.series} séries de ${plano.repeticoes}`;
    listaTreino.appendChild(li);
  });

  resultadoDiv.classList.remove("hidden");
}

// Evento do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nivel = document.getElementById("nivel").value;
  const frequencia = parseInt(document.getElementById("frequencia").value);
  const objetivoInput = document.getElementById("objetivo").value;

  const objetivo = objetivoInput === "ganho" ? "Hipertrofia"
                   : objetivoInput === "perda" ? "Perda de peso"
                   : "Saúde geral";

  const resultado = await gerarPlanoPersonalizado(frequencia, nivel, objetivo);

  if (!resultado) {
    alert("Não encontramos uma recomendação para sua combinação de dados.");
    return;
  }

  mostrarTreino(resultado.exercicios, resultado.plano);
});
