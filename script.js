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
});
