import "./index.scss";
import "./styles/vendors/css-reset.css"
import "./scripts/vendors/gsap.min.js";
import "./scripts/vendors/scroll-polyfill.js";
import MobileMenu from "./scripts/libs/mobile-menu";
import TweenTextAnimation from "./scripts/libs/text-animation";
import ScrollObserver from "./scripts/libs/scroll";

/**
 * 一括require
 * @param {*} r requireコンテキスト
 * @returns 
 */
function importAll(r) {
  return r.keys().map(r);
};

// images配下にあるfavicon.png以外のすべての画像を依存関係に含める（Webpack用）
const images = importAll(require.context("./images", false, /^(?!.*favicon\.png$).*\.png$|\.jpe?g$|\.svg$/));

// 成果物に表示するコンテンツ情報
const works = {
  todocorewpf: {
    title: "タスク管理ソフト (ToDo Core WPF)",
    content: "Windows向けのシンプルなタスク管理ソフトです。カテゴリの自由作成、ソート順、優先度による色付けなどを実装しています。通知領域への常駐、ホットキーでのウィンドウ表示にも対応します。",
    repos: "https://github.com/step63r/ToDoCoreWpf",
    images: ["./asset/ToDoCoreWpf.png"],
  },
  openjinro: {
    title: "人狼GMサーバ (open-jinro)",
    content: "人狼ゲームをオンラインで進行するためのWebアプリケーションです。WebSocketでリアルタイム進行に対応します。クラウドSDKを使っていないため、どのようなWebサーバでも動作可能なのが特長です。",
    repos: "https://github.com/step63r/open-jinro-frontend",
    images: ["./asset/open-jinro.png"],
  },
  mahjong: {
    title: "麻雀得点計算ソフト",
    content: "麻雀の得点を計算、保存、集計するツールです。対局ごとにルールを設定できるのが特長です。",
    repos: "https://github.com/step63r/MahjongScoreManager_MUI",
    images: ["./asset/MahjongScoreManager_MUI.png"],
  },
  destboard: {
    title: "行先予定表電子ペーパー",
    content: "会社でよく用いられる行先表示板を、ラズパイと電子ペーパーで実現しました。電子ペーパーでは在籍状態のトグルおよび行き先の表示に対応します。またWebサーバの機能も搭載しており、各メンバーのPCから表示板の確認・更新が可能となっています。",
    repos: "https://github.com/step63r/destboard",
    images: ["./asset/destboard.png"],
  },
  chataifluentwpf: {
    title: "OpenAIボイチャソフト (Chat AI Fluent Wpf)",
    content: "ChatGPTと会話するシンプルなチャットアプリです。音声入力を文字列化してChatGPTに送り、返ってきた内容を合成音声で喋らせます。",
    repos: "https://github.com/step63r/ChatAIFluentWpf",
    images: ["./asset/ChatAIFluentWpf.png"],
  },
  tsundoku: {
    title: "書籍管理サービス (ツンドク.com)",
    content: "本のバーコードを読み取るだけで登録可能な、シンプルな書籍管理サービスです。続き物のマンガや小説など、同じ巻を重複して買うことを防止できます。",
    repos: "https://github.com/step63r/sam-ayano",
    images: ["./asset/tsundoku.png"],
  },
};

// jQuery
$(".mobile-menu__item a[href]").on('click', function (event) {
  const container = document.querySelector("#global-container");
  container.classList.toggle("menu-open");
});

/**
 * 初期処理クラス
 */
class Main {
  /** スクロールオブザーバー */
  #observers = [];

  /**
   * コンストラクタ
   */
  constructor() {
    this.header = document.querySelector(".header");
    this.#init();
  }

  /**
   * 初期処理
   */
  #init() {
    new MobileMenu();
    this.#scrollInit();
    this.#microModalInit();
  }

  /**
   * 破棄処理
   */
  destroy() {
    this.#observers.forEach((so) => so.destroy());
  }

  /**
   * スクロール初期処理
   */
  #scrollInit() {
    this.#observers.push(
      new ScrollObserver(".nav-trigger", this.#navAnimation.bind(this), {
        once: false,
      }),
      new ScrollObserver(".appear", this.#inviewAnimation),
      new ScrollObserver(".tween-animate-title", this.#textAnimation)
    );
  }

  /**
   * MicroModal.js初期処理
   */
  #microModalInit() {
    // トリガーとなるボタンに一時的に is-active クラスを付与する
    document.querySelectorAll("[data-micromodal-trigger]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-micromodal-trigger]").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      })
    });
    
    // MicroModal.jsの初期処理
    MicroModal.init({
      onShow: (modal) => {
        const trigger = document.querySelector(`[data-micromodal-trigger="${modal.id}"].is-active`);
        const id = trigger?.dataset.id;

        const title = works[id].title || "Title";
        const content = works[id].content || "Content";
        const images = works[id].images || [];
        const repos = works[id].repos || "Repos";

        const titleArea = modal.querySelector("#modal-1-title");
        const contentBodyArea = modal.querySelector("#modal-1-content-body");
        const contentImagesArea = modal.querySelector("#modal-1-content-images");
        const reposArea = modal.querySelector("#modal-1-reposbutton");

        if (titleArea) {
          titleArea.innerHTML = title;
        }
        if (contentBodyArea) {
          contentBodyArea.innerHTML = `<p>${content}</p>`;
        }
        if (contentImagesArea) {
          let innerHTML = "";
          for (const img of images) {
            innerHTML += `<img src="${img}">`;
          }
          contentImagesArea.innerHTML = innerHTML;
        }
        if (reposArea) {
          reposArea.innerHTML = `<i class="fab fa-github"></i><a href="${repos}" target="_blank">GitHub</a>`;
        }
      },
      disableScroll: true,
    });
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
