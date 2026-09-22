(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={LIGHT:`light`,DARK:`dark`},t=`moss-theme`,n=t=>t===e.LIGHT||t===e.DARK,r=t=>{document.documentElement.dataset.theme=n(t)?t:e.LIGHT},i=()=>{let r=localStorage.getItem(t),i=window.matchMedia(`(prefers-color-scheme: dark)`).matches;return n(r)?r:i?e.DARK:e.LIGHT},a=e=>{n(e)&&(r(e),localStorage.setItem(t,e))},o=()=>{a((document.documentElement.dataset.theme||e.LIGHT)===e.LIGHT?e.DARK:e.LIGHT)},s=(e=`[data-theme-toggle]`)=>{r(i()),document.querySelectorAll(e).forEach(e=>e.addEventListener(`click`,o))},c=`moss-submission-notice-closed`,l=`https://github.com/Khabib1802/rsschool-landing-page/pull/1`;s(),document.querySelector(`.submission-notice`)||(()=>{let e=document.createElement(`aside`);e.className=`submission-notice`,e.setAttribute(`aria-label`,`Submission link information`),e.innerHTML=`
    <div class="submission-notice__panel">
      <div class="submission-notice__header">
        <p class="submission-notice__eyebrow">SUBMISSION LINK</p>

        <button
          class="submission-notice__close"
          type="button"
          aria-label="Close notification"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <p class="submission-notice__title">
        The submitted link is incorrect.
      </p>

      <p class="submission-notice__text">
        Please use this Pull Request instead:
      </p>

      <a
        class="submission-notice__link"
        href="${l}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Pull Request #1
        <span aria-hidden="true">↗</span>
      </a>
    </div>

    <button
      class="submission-notice__tab"
      type="button"
      aria-label="Open submission link notification"
      aria-expanded="false"
    >
      <span class="submission-notice__tab-label">PR #1</span>
    </button>
  `,document.body.append(e);let t=e.querySelector(`.submission-notice__close`),n=e.querySelector(`.submission-notice__tab`),r=()=>{e.classList.add(`submission-notice--closed`),n.setAttribute(`aria-expanded`,`false`),localStorage.setItem(c,`true`)},i=()=>{e.classList.remove(`submission-notice--closed`),n.setAttribute(`aria-expanded`,`true`)};return t.addEventListener(`click`,r),n.addEventListener(`click`,i),localStorage.getItem(c)===`true`&&e.classList.add(`submission-notice--closed`),{notice:e,close:r,open:i}})();
//# sourceMappingURL=main-B6-UUy9V.js.map