const container = document.getElementById("container");
const searchInput = document.getElementById("search");

let todosExercicios = [];

async function buscarTodosExercicios() {
    let url = "https://wger.de/api/v2/exerciseinfo/?limit=100&offset=0";

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
    mostrarExercicios(todosExercicios);
}

function mostrarExercicios(lista) {
    container.innerHTML = ""; // Limpa antes

    const favoritosSalvos = JSON.parse(localStorage.getItem("favoritos")) || [];

    lista.forEach(exercicio => {
        const nome = `${exercicio.translations?.find(t => t.language === 2)?.name || exercicio.name} (ID: ${exercicio.id})`;
        const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Não informado";
        const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Não informado";
        const videos = exercicio.videos?.length > 0 ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank" class="text-orange-400 underline">Vídeo</a>`).join(", ") : "Não disponível";
        const licença = exercicio.license?.full_name || "Licença não informada";
        const imagem = exercicio.images?.[0]?.image || null;
        const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Não informado";
        const categoria = exercicio.category?.name || "Não informada";

        const card = document.createElement("div");
        card.classList.add("card", "bg-white", "rounded-xl", "shadow", "p-4", "flex", "flex-col", "justify-between");

        const estaFavoritado = favoritosSalvos.includes(exercicio.id);

        card.innerHTML = `
            <h3 class="text-lg font-bold text-orange-500 mb-2">${nome}</h3>
            <p class="text-gray-600"><strong>Músculos:</strong> ${musculos}</p>
            <p class="text-gray-600"><strong>Músculos Secundários:</strong> ${musculosSecundarios}</p>
            <p class="text-gray-600"><strong>Equipamento:</strong> ${equipamento}</p>
            <p class="text-gray-600"><strong>Categoria:</strong> ${categoria}</p>
            <p class="text-gray-600"><strong>Licença:</strong> ${licença}</p>
            <p class="text-gray-600"><strong>Vídeos:</strong> ${videos}</p>
            ${imagem ? `<img src="${imagem}" alt="${nome}" class="mt-2 rounded-xl">` : '<p class="text-gray-400 mt-2">Sem imagem</p>'}

            <button class="favorito-btn mt-4 px-4 py-2 rounded-xl ${estaFavoritado ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}" data-id="${exercicio.id}">
                ${estaFavoritado ? 'Desfavoritar' : 'Favoritar'}
            </button>
        `;

        container.appendChild(card);
    });

    document.querySelectorAll(".favorito-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            toggleFavorito(id);
        });
    });
}


function toggleFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    mostrarExercicios(todosExercicios);
}

function filtrarExercicios(termo) {
    const termoLower = termo.toLowerCase();

    const listaFiltrada = todosExercicios.filter(exercicio => {
        const nomeCategoria = exercicio.category?.name?.toLowerCase() || "";
        return nomeCategoria.includes(termoLower);
    });

    mostrarExercicios(listaFiltrada);
}

searchInput.addEventListener("input", (e) => {
    filtrarExercicios(e.target.value);
});

buscarTodosExercicios();
