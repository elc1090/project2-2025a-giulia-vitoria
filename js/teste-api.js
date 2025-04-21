const ids = [
    465, 828, 365, 1297, 694, 571, 83, 268, 238, 348, 323, 237, 76, 377, 301, 537,
    829, 427, 171, 525, 73, 482, 135, 197, 92, 1277, 185, 256, 154, 275, 572, 206,
    367, 194, 167, 484, 1295, 95, 566, 543, 567, 375, 513, 84, 1276, 538, 75, 246,
    822, 91, 366, 194, 197, 185, 171, 167, 154, 135, 95, 92, 91, 84, 83, 76, 75, 73
];

const container = document.getElementById("container");

async function buscarExercicio(id) {
    try {
    // idioma português (ID 6)
        let res = await fetch(`https://wger.de/api/v2/exerciseinfo/${id}/?language=6`);
        let exercicio = await res.json();

    // verificar se tem nome em portugues mas nao tá funcionando, de resto puxa infos certinho com suas especificações
    const traducaoPt = exercicio.translations?.find(t => t.language === 6);
    const nome = traducaoPt ? traducaoPt.name : `ID: ${id}`;

    const musculos = exercicio.muscles?.map(m => m.name).join(", ") || "Não informado";
    const musculosSecundarios = exercicio.muscles_secondary?.map(m => m.name).join(", ") || "Não informado";
    const videos = exercicio.videos?.length > 0 ? exercicio.videos.map(v => `<a href="${v.video}" target="_blank">Vídeo</a>`).join(", ") : "Não disponível";
    const licença = exercicio.license?.full_name || "Licença não informada";
    const imagem = exercicio.images?.[0]?.image || null;
    const equipamento = exercicio.equipment?.map(e => e.name).join(", ") || "Não informado";
    const categoria = exercicio.category?.name || "Não informada";
    const traducoes = exercicio.translations?.length > 0
        ? exercicio.translations.map(t => `${t.language}: ${t.name}`).join(", ")
        : "Não disponível";

    // card exercício
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
        <p><strong>Traduções:</strong> ${traducoes}</p>
        ${imagem ? `<img src="${imagem}" alt="${nome}">` : '<p>Sem imagem</p>'}
    `;
    container.appendChild(card);
    } catch (error) {
        console.error("Erro ao buscar exercício", id, error);
    }
}

// todos os ids
ids.forEach(id => buscarExercicio(id));
