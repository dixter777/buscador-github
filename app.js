const API = 'https://api.github.com';

const form = document.querySelector('#form-buscar');
const input = document.querySelector('#input-usuario');
const boton = document.querySelector('#btn-buscar');
const selectOrden = document.querySelector('#select-orden');
const estado = document.querySelector('#estado');
const perfil = document.querySelector('#perfil');
const titulo = document.querySelector('#titulo-repos');
const repos = document.querySelector('#repos');
const resumenLenguajes = document.querySelector('#resumen-lenguajes');

// elementos para la actividad 3
const btnCargarMas = document.querySelector('#btn-cargar-mas');
const infoRateLimit = document.querySelector('#info-rate-limit');

let usuarioActual = '';
let paginaActual = 1;
let acumuladoRepos = [];

// 1. Petición genérica con lectura de cabeceras HTTP (x-ratelimit-remaining)
async function obtenerJSON(url) {
  const res = await fetch(url);

  // Muestra en el pie de página las peticiones restantes
  const restantes = res.headers.get('x-ratelimit-remaining');
  if (restantes !== null) {
    infoRateLimit.textContent = `Peticiones restantes disponibles: ${restantes}`;
  }

  if (res.status === 404) throw new Error('Usuario no encontrado');
  if (res.status === 403) throw new Error('Límite de peticiones alcanzado');
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  return res.json();
}

// 2. Pintar el perfil
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

// 3. Resumen acumulado de lenguajes
function mostrarResumenLenguajes(listaRepos) {
  const conteo = {};

  listaRepos.forEach(r => {
    const lang = r.language ?? 'Sin lenguaje';
    conteo[lang] = (conteo[lang] || 0) + 1;
  });

  resumenLenguajes.innerHTML = '<strong>Lenguajes más usados:</strong>';
  const ul = document.createElement('ul');

  for (const [lenguaje, cantidad] of Object.entries(conteo)) {
    const li = document.createElement('li');
    li.textContent = `${lenguaje}: ${cantidad} repositorio(s)`;
    ul.append(li);
  }

  resumenLenguajes.append(ul);
  resumenLenguajes.classList.remove('oculto');
}

// 4. Pintar repositorios (agregando nuevos elementos)
function agregarRepos(listaNuevos) {
  listaNuevos.forEach(r => {
    const a = document.createElement('a');
    a.href = r.html_url;
    a.target = '_blank';
    a.textContent = r.name;

    const lenguaje = r.language ?? 'sin lenguaje';
    const li = document.createElement('li');
    li.append(a, ` — ${lenguaje} (⭐ ${r.stargazers_count})`);

    repos.append(li);
  });

  titulo.classList.remove('oculto');
}

// 5. Evento submit 
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  usuarioActual = encodeURIComponent(input.value.trim());
  if (!usuarioActual) return;

  paginaActual = 1;
  acumuladoRepos = [];
  repos.innerHTML = '';
  btnCargarMas.classList.add('oculto');

  const criterioOrden = selectOrden.value;
  const params = new URLSearchParams({ 
    sort: criterioOrden, 
    per_page: 5,
    page: paginaActual 
  });

  boton.disabled = true;
  estado.className = '';
  estado.textContent = 'Buscando...';

  try {
    const [datosUsuario, datosRepos] = await Promise.all([
      obtenerJSON(`${API}/users/${usuarioActual}`),
      obtenerJSON(`${API}/users/${usuarioActual}/repos?${params}`)
    ]);

    mostrarPerfil(datosUsuario);
    
    acumuladoRepos = [...datosRepos];
    agregarRepos(datosRepos);
    mostrarResumenLenguajes(acumuladoRepos);

    // Si devuelve 5 resultados, puede haber mas paginas
    if (datosRepos.length === 5) {
      btnCargarMas.classList.remove('oculto');
    }

    estado.textContent = '';
  } catch (error) {
    perfil.classList.add('oculto');
    titulo.classList.add('oculto');
    resumenLenguajes.classList.add('oculto');
    btnCargarMas.classList.add('oculto');
    repos.innerHTML = '';
    estado.className = 'error';
    estado.textContent = error.message;
  } finally {
    boton.disabled = false;
  }
});

// 6. Evento click en "Cargar mas"
btnCargarMas.addEventListener('click', async () => {
  paginaActual++;
  btnCargarMas.disabled = true;
  btnCargarMas.textContent = 'Cargando...';

  const criterioOrden = selectOrden.value;
  const params = new URLSearchParams({ 
    sort: criterioOrden, 
    per_page: 5,
    page: paginaActual 
  });

  try {
    const nuevosRepos = await obtenerJSON(`${API}/users/${usuarioActual}/repos?${params}`);
    
    acumuladoRepos = [...acumuladoRepos, ...nuevosRepos];
    agregarRepos(nuevosRepos);
    mostrarResumenLenguajes(acumuladoRepos);

    // Se oculta si hay menos de 5 resultados
    if (nuevosRepos.length < 5) {
      btnCargarMas.classList.add('oculto');
    }
  } catch (error) {
    estado.className = 'error';
    estado.textContent = error.message;
  } finally {
    btnCargarMas.disabled = false;
    btnCargarMas.textContent = 'Cargando más';
  }
});