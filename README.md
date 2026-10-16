# Buscador de Perfiles GitHub 🚀

Aplicación web estática que consume la API REST pública de GitHub para buscar perfiles de usuario, visualizar sus repositorios con opciones de ordenamiento, paginación dinámica y conteo de lenguajes de programación.

---

## 🌐 Sitio Web Publicado
Puedes probar la aplicación desplegada en tiempo real aquí:
👉 **[https://dixter777.github.io/buscador-github/](https://dixter777.github.io/buscador-github/)**

---

## 📌 Funcionalidades
- **Búsqueda de usuarios:** Obtiene avatar, nombre, repositorios públicos y seguidores.
- **Filtro de ordenamiento (Actividad 2):** Permite ordenar por `updated` (más recientes), `created` (creación) o `full_name` (alfabético).
- **Resumen de lenguajes (Actividad 2):** Muestra el desglose de los lenguajes de programación utilizados entre los repositorios cargados.
- **Paginación dinámica (Actividad 3):** Botón **"Cargar más"** para solicitar los siguientes 5 repositorios mediante el parámetro `page`.
- **Monitoreo de peticiones (Actividad 3):** Visualiza las peticiones restantes (`x-ratelimit-remaining`) en el pie de página.

---

## 🛠️ Tecnologías Utilizadas
- HTML5
- JavaScript (Fetch API / Async - Await)
- GitHub REST API

---

## 🎓 Información del Autor
- **Estudiante:** Diego Alonso Quispe Castilla
- **Usuario GitHub:** [dixter777](https://github.com/dixter777)
- **Curso:** Desarrollo de Software I - UNSAAC