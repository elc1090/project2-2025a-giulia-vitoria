const containerFavoritos = document.getElementById("favoritosContainer");
const mensagemVazio = document.getElementById("mensagemVazio");

async function buscarExerciciosFavoritos() {
    const idsFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (idsFavoritos.length === 0) {
        mensagemVazio.classList.remove("hidden");
        return;
    }

    let url = "https://wger.de/api/v2/exerciseinfo/?limit=100&offset=0";
    let todosExercicios = [];

    while (url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            todosExercicios = todosExercicios.concat(data.results);
            url = data.next;
        } catch (error) {
            console.error("Erro ao buscar exercícios:", error);
            break;
        }
    }

    const exerciciosFavoritos = todosExercicios.filter(exercicio => idsFavoritos.includes(exercicio.id));

    mostrarFavoritos(exerciciosFavoritos);
}

function mostrarFavoritos(lista) {
    containerFavoritos.innerHTML = "";

    lista.forEach(exercicio => {
        const nome = exercicio.name || `ID: ${exercicio.id}`;
        const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Não informado";
        const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Não informado";
        const videos = exercicio.videos?.length > 0 
            ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank" class="text-orange-400 underline">Vídeo</a>`).join(", ") 
            : "Não disponível";
        const licença = exercicio.license?.full_name || "Licença não informada";
        const imagem = exercicio.images?.[0]?.image || null;
        const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Não informado";
        const categoria = exercicio.category?.name || "Não informada";

        const card = document.createElement("div");
        card.classList.add("card", "flex", "flex-col", "justify-between");

        card.innerHTML = `
            <h3 class="exercicio-nome">${nome}</h3>
            <p><strong>Grupo principal:</strong> ${musculos}</p>
            <p><strong>Grupo secundário:</strong> ${musculosSecundarios}</p>
            <p><strong>Equipamento:</strong> ${equipamento}</p>
            <p><strong>Categoria:</strong> ${categoria}</p>
            <p><strong>Vídeo:</strong> ${videos}</p>
            <p><strong>Licença:</strong> ${licença}</p>
            ${imagem ? `<img src="${imagem}" alt="${nome}" class="mt-2 rounded-xl">` : '<p class="text-gray-400 mt-2">Sem imagem</p>'}
            <button class="botao-laranja" data-id="${exercicio.id}">Desfavoritar</button>
        `;

        containerFavoritos.appendChild(card);
    });

    const botoesDesfavoritar = document.querySelectorAll("button[data-id]");
    botoesDesfavoritar.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const idExercicio = parseInt(event.target.getAttribute("data-id"));
            removerFavorito(idExercicio);
        });
    });
}

function removerFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos = favoritos.filter(exercicioId => exercicioId !== id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    buscarExerciciosFavoritos();
}

buscarExerciciosFavoritos();
