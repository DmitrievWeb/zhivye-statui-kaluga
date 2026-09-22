// Живые статуи Калуга: появление блоков, нижняя панель на телефоне, просмотр фото.
document.documentElement.classList.add("js");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// блоки проявляются при прокрутке
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }
}, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// видео: при «уменьшить движение» не крутим, показываем постер
const video = document.querySelector(".hero-video");
if (video && reduce) { video.removeAttribute("autoplay"); video.pause(); }

// нижняя панель с кнопками появляется, когда кнопки первого экрана ушли из вида
const dock = document.getElementById("dock");
const heroCta = document.getElementById("hero-cta");
// и прячется в блоке контактов, где те же кнопки уже на экране
const contact = document.getElementById("contact");
if (dock && heroCta && contact) {
  let pastHero = false, atContact = false;
  const sync = () => {
    const show = pastHero && !atContact;
    dock.classList.toggle("show", show);
    dock.setAttribute("aria-hidden", String(!show));
    dock.querySelectorAll("a").forEach((a) => (a.tabIndex = show ? 0 : -1));
  };
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync();
  }).observe(heroCta);
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); },
    { rootMargin: "0px 0px -35% 0px" }).observe(contact);
}

// просмотр фото во весь экран
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
document.querySelectorAll(".shot").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    lbImg.src = btn.dataset.full;
    lbImg.alt = img.alt;
    lb.showModal();
  });
});
lb.addEventListener("click", (e) => { if (e.target !== lbImg) lb.close(); });
lb.addEventListener("close", () => { lbImg.removeAttribute("src"); });
