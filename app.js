const API = 'https://api.github.com';
const form = document.querySelector('#form-buscar');
const input = document.querySelector('#input-usuario');
const boton = document.querySelector('#btn-buscar');
const estado = document.querySelector('#estado');
const perfil = document.querySelector('#perfil');
const titulo = document.querySelector('#titulo-repos');
const repos = document.querySelector('#repos');

async function obtenerJSON(url) {
  const res = await fetch(url);
  if (res.status === 404) throw new Error('Usuario no encontrado');
  if (res.status === 403) throw new Error('Límite de peticiones alcanzado');
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

function mostrarPerfil(u) {
  const img = document.createElement('img');
  img.src = u.avatar_url;
  img.alt = `Avatar de ${u.login}`;
  const nombre = document.createElement('h2');
  nombre.textContent = u.name ?? u.login;
  const datos = document.createElement('p');
  datos.textContent = `${u.public_repos} repositorios | ${u.followers} seguidores`;
  const enlace = document.createElement('a');
  enlace.href = u.html_url;
  enlace.target = '_blank';
  enlace.textContent = 'Ver en GitHub';
  const info = document.createElement('div');
  info.append(nombre, datos, enlace);
  perfil.replaceChildren(img, info);
  perfil.classList.remove('oculto');
}

function mostrarRepos(lista) {
  repos.innerHTML = '';
  lista.forEach(r => {
    const a = document.createElement('a');
    a.href = r.html_url;
    a.target = '_blank';
    a.textContent = r.name;
    const li = document.createElement('li');
    const lenguaje = r.language ?? 'sin lenguaje';
    li.append(a, ` — ${lenguaje} (⭐ ${r.stargazers_count})`);
    repos.append(li);
  });
  titulo.classList.remove('oculto');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = encodeURIComponent(input.value.trim());
  if (!usuario) return;
  const params = new URLSearchParams({ sort: 'updated', per_page: 5 });
  boton.disabled = true;
  estado.className = '';
  estado.textContent = 'Buscando...';
  try {
    const [datosUsuario, datosRepos] = await Promise.all([
      obtenerJSON(`${API}/users/${usuario}`),
      obtenerJSON(`${API}/users/${usuario}/repos?${params}`)
    ]);
    mostrarPerfil(datosUsuario);
    mostrarRepos(datosRepos);
    estado.textContent = '';
  } catch (error) {
    perfil.classList.add('oculto');
    titulo.classList.add('oculto');
    repos.innerHTML = '';
    estado.className = 'error';
    estado.textContent = error.message;
  } finally {
    boton.disabled = false;
  }
});