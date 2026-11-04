// Duo Studios - negocio  do site parceiro

var header = document.querySelector(".site-header");
var botaoMenu = document.querySelector(".menu-btn");
var menu = document.getElementById("nav");
var barra = document.querySelector(".progress");

document.getElementById("ano").textContent = new Date().getFullYear();

// menu do celular para fica mais facil  ( e gay)
function abrirMenu(abrir) {
  botaoMenu.setAttribute("aria-expanded", abrir);
  botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("open", abrir);
  header.classList.toggle("menu-open", abrir);
  document.body.style.overflow = abrir ? "hidden" : "";
}

botaoMenu.addEventListener("click", function () {
  abrirMenu(botaoMenu.getAttribute("aria-expanded") !== "true");
});

menu.addEventListener("click", function (e) {
  if (e.target.tagName == "A") abrirMenu(false);
});

// header muda de cor ao rolar + barrinha de progresso, aiii vogel
function aoRolar() {
  header.classList.toggle("solid", window.scrollY > 40);
  var total = document.documentElement.scrollHeight - window.innerHeight;
  var parte = total > 0 ? window.scrollY / total : 0;
  barra.style.transform = "scaleX(" + parte + ")";
}
window.addEventListener("scroll", aoRolar);
aoRolar();

// cortina de abertura (deixa mais gay)
var semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!sessionStorage.getItem("duo-intro") && !semAnimacao) {
  var cortina = document.createElement("div");
  cortina.className = "intro";
  cortina.setAttribute("aria-hidden", "true");
  cortina.innerHTML = "<span>DUO STUDIOS</span>";
  document.body.appendChild(cortina);
  sessionStorage.setItem("duo-intro", "1");
  setTimeout(function () { cortina.classList.add("done"); }, 900);
  setTimeout(function () { cortina.remove(); }, 2600);
}

// fotos aparecendo quando chegam na tela(muito gay)
var observador = new IntersectionObserver(function (itens) {
  itens.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add("in");
      observador.unobserve(item.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal, .rise").forEach(function (el) {
  observador.observe(el);
});

// filtros do portfolio(para ficar coisa bonitinha igual a suiça)
var botoesFiltro = document.querySelectorAll("#filters button");
var fotos = document.querySelectorAll(".tile");
var visiveis = Array.from(fotos);

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    var categoria = botao.dataset.f;
    botoesFiltro.forEach(function (b) {
      b.setAttribute("aria-pressed", b === botao);
    });
    visiveis = [];
    fotos.forEach(function (foto) {
      var esconder = categoria != "todos" && foto.dataset.cat != categoria;
      foto.hidden = esconder;
      if (!esconder) visiveis.push(foto);
    });
  });
});

// leio o codigo do lightbox vc vai entender  e se eu não entendi é pq eu mesmo sou burro
var lb = document.querySelector(".lb");
var lbImg = lb.querySelector("img");
var lbTitulo = lb.querySelector("figcaption span");
var lbContagem = lb.querySelector(".meta");
var atual = 0;
var ultimoClicado = null;

function mostrar(n) {
  atual = (n + visiveis.length) % visiveis.length;
  var foto = visiveis[atual];
  var img = foto.querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbImg.setAttribute("width", img.getAttribute("width"));
  lbImg.setAttribute("height", img.getAttribute("height"));
  lbTitulo.textContent = foto.dataset.titulo;
  lbContagem.textContent = (atual + 1) + " / " + visiveis.length;
}

function abrirLightbox(foto) {
  ultimoClicado = foto;
  mostrar(visiveis.indexOf(foto));
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  lb.querySelector(".x").focus();
}

function fecharLightbox() {
  if (!lb.classList.contains("open")) return;
  lb.classList.remove("open");
  document.body.style.overflow = "";
  if (ultimoClicado) ultimoClicado.focus();
}

fotos.forEach(function (foto) {
  foto.addEventListener("click", function () { abrirLightbox(foto); });
});

lb.addEventListener("click", function (e) {
  if (e.target.closest(".x") || e.target === lb) fecharLightbox();
  else if (e.target.closest(".pv")) mostrar(atual - 1);
  else if (e.target.closest(".nx")) mostrar(atual + 1);
});

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    abrirMenu(false);
    fecharLightbox();
  }
  if (lb.classList.contains("open")) {
    if (e.key == "ArrowLeft") mostrar(atual - 1);
    if (e.key == "ArrowRight") mostrar(atual + 1);
  }
});

// deslizar o dedo no celular(igualzinho do instagram,muito gay)
var inicioToque = 0;
lb.addEventListener("touchstart", function (e) {
  inicioToque = e.touches[0].clientX;
});
lb.addEventListener("touchend", function (e) {
  var diferenca = e.changedTouches[0].clientX - inicioToque;
  if (Math.abs(diferenca) > 50) mostrar(atual + (diferenca < 0 ? 1 : -1));
});

// formulario de contato , isso  so para fica bonito

var numeroWhats = "https://wa.me/5583998543817";
var form = document.getElementById("contact-form");
var avisoForm = document.getElementById("form-status");

function validar(campo) {
  var valor = campo.value.trim();
  var erro = "";

  if (campo.name == "nome" && valor.length < 2) erro = "Informe seu nome.";
  if (campo.name == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) erro = "Informe um e-mail válido, como nome@exemplo.com.";
  if (campo.name == "servico" && valor == "") erro = "Escolha um tipo de serviço.";
  if (campo.name == "mensagem" && valor.length < 10) erro = "Escreva pelo menos 10 caracteres.";

  campo.setAttribute("aria-invalid", erro != "");
  document.getElementById(campo.name + "-err").textContent = erro;
  return erro == "";
}

var campos = form.querySelectorAll("input, select, textarea");

campos.forEach(function (campo) {
  campo.addEventListener("blur", function () { validar(campo); });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var primeiroErro = null;
  campos.forEach(function (campo) {
    if (!validar(campo) && !primeiroErro) primeiroErro = campo;
  });

  if (primeiroErro) {
    primeiroErro.focus();
    avisoForm.textContent = "Revise os campos destacados.";
    return;
  }

  var texto = "Olá, Duo Studios! Quero um orçamento.\n\n" +
    "Nome: " + form.nome.value + "\n" +
    "E-mail: " + form.email.value + "\n" +
    "Serviço: " + form.servico.value + "\n\n" +
    form.mensagem.value;

  avisoForm.textContent = "Tudo certo. Abrindo o WhatsApp para você enviar a mensagem.";
  window.location.href = numeroWhats + "?text=" + encodeURIComponent(texto);
});
