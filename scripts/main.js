class Main {
  #observers = [];

  constructor() {
    this.header = document.querySelector(".header");
    this.#init();
  }

  #init() {
    // new MobileMenu();
    // Pace.on("done", this.#scrollInit.bind(this));
    this.#scrollInit();
  }

  destroy() {
    this.#observers.forEach((so) => so.destroy());
  }

  #scrollInit() {
    this.#observers.push(
      new ScrollObserver(".nav-trigger", this.#navAnimation.bind(this), {
        once: false,
      }),
      new ScrollObserver(".appear", this.#inviewAnimation),
      new ScrollObserver(".tween-animate-title", this.#textAnimation)
    );
    console.log(this.#observers);
  }

  #textAnimation(el, inview) {
    if (inview) {
      const ta = new TweenTextAnimation(el);
      ta.animate();
    }
  }

  #navAnimation(el, inview) {
    if (inview) {
      this.header.classList.remove("triggered");
    } else {
      this.header.classList.add("triggered");
    }
  }

  #inviewAnimation(el, inview) {
    if (inview) {
      el.classList.add("inview");
    } else {
      el.classList.remove("inview");
    }
  }
}
const main = new Main();
