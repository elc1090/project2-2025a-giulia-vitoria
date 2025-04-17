const form = document.getElementById('trainingForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const activityLevel = document.getElementById('activity').value;
    const days = parseInt(document.getElementById('days').value);
    const goal = document.getElementById('goal').value;

    resultDiv.innerHTML = '<p>Gerando plano de treino...</p>';

    try {
        const response = await fetch('https://wger.de/api/v2/exercise/?language=2&limit=100');
        const data = await response.json();

        let filteredExercises = data.results.filter(exercise => {
            return (
                (goal === 'bulking' && exercise.description.toLowerCase().includes('massa')) ||
                (goal === 'cutting' && exercise.description.toLowerCase().includes('emagrecimento')) ||
                (goal === 'resistance' && exercise.description.toLowerCase().includes('resistência')) ||
                (!exercise.description) // fallback
            );
        });

        if (filteredExercises.length === 0) filteredExercises = data.results.slice(0, 10); // fallback

        const exercisesPerDay = Math.min(5, Math.floor(filteredExercises.length / days));
        let output = `<h3>Plano de Treino (${days} dias por semana - Objetivo: ${goal})</h3>`;

        for (let i = 0; i < days; i++) {
            output += `<h4>Dia ${i + 1}</h4><ul>`;
            const dayExercises = filteredExercises.splice(0, exercisesPerDay);
            dayExercises.forEach(ex => {
                output += `<li><strong>${ex.name}</strong>: ${ex.description || 'Descrição não disponível'}</li>`;
            });
            output += `</ul>`;
        }

        resultDiv.innerHTML = output;

    } catch (error) {
        resultDiv.innerHTML = '<p>Erro ao carregar dados da API.</p>';
        console.error(error);
    }

    const form = document.getElementById('formTreino');
    const listaTreino = document.getElementById('listaTreino');
    const resultado = document.getElementById('resultado');

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capturando as informações do formulário
    const idade = parseInt(document.getElementById('idade').value);
    const sexo = document.getElementById('sexo').value;
    const nivel = document.getElementById('nivel').value;
    const frequencia = parseInt(document.getElementById('frequencia').value);
    const objetivo = document.getElementById('objetivo').value;

    // Armazenando as informações localmente
    const treino = {
        idade,
        sexo,
        nivel,
        frequencia,
        objetivo
    };

    // Exibindo as informações armazenadas
    console.log(treino);

    // Exibindo uma mensagem de carregamento
    listaTreino.innerHTML = '<li class="text-gray-500">Carregando...</li>';
    resultado.classList.remove('hidden');

    try {
        // Requisição à API para pegar os exercícios
        const res = await fetch('https://wger.de/api/v2/exercise/?language=2&limit=100');
        const data = await res.json();

        const exercicios = data.results.filter(ex => ex.category && ex.description);

        listaTreino.innerHTML = '';
        for (let i = 0; i < frequencia * 2; i++) {
        const ex = exercicios[Math.floor(Math.random() * exercicios.length)];
        const item = document.createElement('li');
        item.classList.add('bg-gray-100', 'p-4', 'rounded', 'shadow');
        item.innerHTML = `<strong>${ex.name}</strong><p class="text-sm text-gray-700 mt-1">${ex.description.slice(0, 150)}...</p>`;
        listaTreino.appendChild(item);
        }
    } catch (err) {
        listaTreino.innerHTML = '<li class="text-red-500">Erro ao carregar exercícios.</li>';
        console.error(err);
    }
    });

});
