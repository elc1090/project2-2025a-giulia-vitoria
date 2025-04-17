// api.js - Módulo para interagir com a API da Wger

const BASE_URL = "https://wger.de/api/v2";
const PT_BR = 2; // ID da linguagem pt-br na API

// Busca exercícios com base na linguagem e limite
export async function buscarExercicios(limit = 20) {
  const res = await fetch(`${BASE_URL}/exercise/?language=${PT_BR}&limit=${limit}`);
  const data = await res.json();
  return data.results;
}

// Busca um exercício específico pelo ID
export async function buscarExercicioPorId(id) {
  const res = await fetch(`${BASE_URL}/exercise/${id}/`);
  if (!res.ok) throw new Error("Erro ao buscar exercício");
  return await res.json();
}

// Busca imagem de exercício pelo ID do exercício
export async function buscarImagemDoExercicio(idExercicio) {
  const res = await fetch(`${BASE_URL}/exerciseimage/?exercise=${idExercicio}`);
  const data = await res.json();
  return data.results.length ? data.results[0].image : null;
}

// Busca informações completas do exercício (incluindo músculos e imagens)
export async function buscarInfoCompletaDoExercicio(id) {
  const res = await fetch(`${BASE_URL}/exerciseinfo/${id}/`);
  if (!res.ok) throw new Error("Erro ao buscar info completa do exercício");
  return await res.json();
}

// Busca os dados de um equipamento
export async function buscarEquipamentoPorId(id) {
  const res = await fetch(`${BASE_URL}/equipment/${id}/`);
  return await res.json();
}

// Lista todos os músculos
export async function listarMusculos() {
  const res = await fetch(`${BASE_URL}/muscle/`);
  const data = await res.json();
  return data.results;
}

// Busca por termo (nome do exercício)
export async function buscarPorTermo(termo) {
  const res = await fetch(`${BASE_URL}/exercise/search/?term=${termo}`);
  const data = await res.json();
  return data.suggestions;
}
