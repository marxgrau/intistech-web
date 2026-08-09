/* ═══════════════════════════════════════════════════════════
   INTIS Tech — comportamiento
   Carga con defer: el DOM ya existe cuando esto corre.
   El cambio de tema inicial vive en el <head> aparte, para
   evitar el destello al cargar.
   ═══════════════════════════════════════════════════════════ */

const WA = "https://wa.me/51974327332?text=Hola%2C%20me%20interesa%3A%20";

// Una sola fuente de datos para los precios: escribir 14 bloques HTML
// a mano se vuelve imposible de mantener cuando cambia una tarifa.
const PRECIOS = {
  taller: [
    ["Eliminación de virus", "Virus y malware · limpieza del sistema · optimización", 40],
    ["Instalación de programas", "Ofimática, diseño, antivirus · con licencia del cliente", 40],
    ["Mantenimiento de PC", "Limpieza interna · optimización · eliminación de archivos basura", 60],
    ["Formateo e instalación de Windows", "Sistema · drivers actualizados · programas básicos", 80],
    ["Recuperación de datos", "Discos duros y SSD · memorias USB · tarjetas SD", 80],
    ["Mantenimiento completo", "Limpieza interna · cambio de pasta térmica · pruebas", 100],
    ["Instalación de macOS", "Sistema · actualización · programas básicos · optimización", 120],
  ],
  web: [
    ["Landing page", "Una página · se adapta al celular · formulario y WhatsApp · SEO básico", 450],
    ["Página web básica", "Hasta 5 páginas · diseño profesional · formulario de contacto · SEO", 700],
    ["Página web empresarial", "Hasta 10 páginas · panel de administración · blog y galería", 1200],
    ["Tienda virtual", "Catálogo · carrito de compras · pasarela de pago · panel administrativo", 1800],
    ["Sistema web a medida", "Administrativos · CRM · APIs · base de datos · automatización", 2500],
  ],
  bots: [
    ["Bot básico", "Respuestas automáticas · menús y comandos · atención al cliente", 350],
    ["Bot avanzado", "Base de datos · APIs · inteligencia artificial · cobros · automatización", 800],
  ],
};

for (const [clave, filas] of Object.entries(PRECIOS)) {
  document.getElementById("g-" + clave).innerHTML =
    '<div class="ficha">' + filas.map(([t, d, p]) => `
      <a class="serv" target="_blank" rel="noopener"
         href="${WA}${encodeURIComponent(t)}">
        <div class="serv-t">${t}</div>
        <div class="serv-p"><sup>desde</sup>S/${p.toLocaleString("es-PE")}</div>
        <div class="serv-d">${d}</div>
        <span class="serv-ir">Consultar <i class="ph-bold ph-arrow-right"></i></span>
      </a>`).join("") + '</div>';
}

document.querySelectorAll(".pes").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".pes").forEach(x => x.setAttribute("aria-selected", "false"));
    document.querySelectorAll(".grupo").forEach(x => x.classList.remove("abierto"));
    b.setAttribute("aria-selected", "true");
    document.getElementById("g-" + b.dataset.g).classList.add("abierto");
  });
});

// Rayos del sol de fondo
(() => {
  const g = document.getElementById("rayos");
  for (let i = 0; i < 24; i++) {
    const largo = i % 3 === 0 ? 168 : i % 3 === 1 ? 118 : 142;
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", i % 3 === 0 ? "396" : "397");
    r.setAttribute("y", "58");
    r.setAttribute("width", i % 3 === 0 ? "8" : "6");
    r.setAttribute("height", String(largo));
    r.setAttribute("rx", "4");
    r.setAttribute("fill", "var(--oro)");
    // La opacidad la decide el tema: sobre fondo claro el oro necesita
    // más presencia para no desaparecer.
    r.style.opacity = i % 3 === 0 ? "var(--rayo-fuerte)" : "var(--rayo-suave)";
    r.style.transformOrigin = "400px 400px";
    r.style.transform = `rotate(${i * 15}deg)`;
    g.appendChild(r);
  }
})();

// Greca escalonada: el motivo geométrico andino, dibujado como camino.
// Es lo que separa las secciones y la firma visual de la página.
(() => {
  const paso = 29, alto = 13;
  let d = "";
  for (let x = -paso; x < 1160 + paso; x += paso) {
    d += `M${x} ${alto} L${x} ${alto * .48} L${x + paso * .5} ${alto * .48} `
       + `L${x + paso * .5} 0 L${x + paso * .82} 0 `;
  }
  document.querySelectorAll(".greca-g").forEach(g => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("stroke", "var(--oro-hondo)");
    p.setAttribute("stroke-width", "1.3");
    p.setAttribute("fill", "none");
    p.setAttribute("vector-effect", "non-scaling-stroke");
    g.appendChild(p);
  });
})();

// Encabezado y botón flotante
const cab = document.getElementById("cab"), flota = document.getElementById("flota");
addEventListener("scroll", () => {
  cab.classList.toggle("fijo", scrollY > 8);
  flota.classList.toggle("se-ve", scrollY > 480);
}, { passive: true });

const hamb = document.getElementById("hamb"), menu = document.getElementById("menu");
hamb.addEventListener("click", () => {
  hamb.setAttribute("aria-expanded", String(menu.classList.toggle("abre")));
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    menu.classList.remove("abre");
    hamb.setAttribute("aria-expanded", "false");
  }
});

const io = new IntersectionObserver(es => {
  es.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add("ok"), i * 65);
    io.unobserve(e.target);
  });
}, { threshold: .1, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll(".rev").forEach(el => io.observe(el));

// La moneda se inclina hacia donde está el cursor. Solo en escritorio
// y con puntero fino: en táctil no hay cursor y el giro solo ya basta.
if (matchMedia("(hover:hover) and (pointer:fine)").matches &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const escena = document.getElementById("escena");
  const zona = escena.parentElement;

  zona.addEventListener("pointermove", e => {
    const r = zona.getBoundingClientRect();
    // -1 a 1 desde el centro
    const px = (e.clientX - r.left) / r.width * 2 - 1;
    const py = (e.clientY - r.top) / r.height * 2 - 1;
    escena.style.transform = `rotateX(${-py * 13}deg) rotateY(${px * 13}deg)`;
  });

  zona.addEventListener("pointerleave", () => {
    escena.style.transform = "";
  });
}

// ── Cambio de tema ──
const btnTema = document.getElementById("tema");
const metaColor = document.querySelector('meta[name="theme-color"]');

const pintarBarra = () => {
  // El color de la barra del navegador en celular debe seguir al tema,
  // o queda una franja del color contrario arriba de la pantalla.
  const fondo = getComputedStyle(document.documentElement)
    .getPropertyValue("--noche").trim();
  if (metaColor && fondo) metaColor.setAttribute("content", fondo);
};
pintarBarra();

btnTema.addEventListener("click", () => {
  const actual = document.documentElement.getAttribute("data-tema");
  const nuevo = actual === "claro" ? "oscuro" : "claro";
  document.documentElement.setAttribute("data-tema", nuevo);
  try { localStorage.setItem("tema", nuevo); } catch(e) {}
  pintarBarra();
});

// Si el visitante nunca eligió, la página sigue lo que cambie en su
// sistema — por ejemplo cuando su celular pasa a modo noche.
matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => {
  let guardado = null;
  try { guardado = localStorage.getItem("tema"); } catch(err) {}
  if (guardado) return;
  document.documentElement.setAttribute("data-tema", e.matches ? "claro" : "oscuro");
  pintarBarra();
});

document.getElementById("anio").textContent = new Date().getFullYear();
