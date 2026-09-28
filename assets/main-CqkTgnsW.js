(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={LIGHT:`light`,DARK:`dark`},t=`moss-theme`,n=t=>t===e.LIGHT||t===e.DARK,r=t=>{document.documentElement.dataset.theme=n(t)?t:e.LIGHT},i=()=>{let r=localStorage.getItem(t),i=window.matchMedia(`(prefers-color-scheme: dark)`).matches;return n(r)?r:i?e.DARK:e.LIGHT},a=e=>{n(e)&&(r(e),localStorage.setItem(t,e))},o=()=>{a((document.documentElement.dataset.theme||e.LIGHT)===e.LIGHT?e.DARK:e.LIGHT)},s=(e=`[data-theme-toggle]`)=>{r(i()),document.querySelectorAll(e).forEach(e=>e.addEventListener(`click`,o))},c={"easy-care":`Easy Care`,"low-light":`Low Light`,"pet-friendly":`Pet Friendly`,tropical:`Tropical`,succulent:`Succulents`},l=e=>c[e]??e,u={mobile:768,desktop:1200},d={mobile:`(max-width: ${u.mobile}px)`,tablet:`(min-width: ${u.mobile+1}px) and (max-width: ${u.desktop-1}px)`,desktop:`(min-width: ${u.desktop}px)`},f=0,p=()=>window.innerWidth-document.documentElement.clientWidth,m=()=>{f+=1,f===1&&(document.body.style.setProperty(`--scrollbar-width`,`${p()}px`),document.body.classList.add(`is-scroll-locked`))},h=()=>{f=Math.max(0,f-1),f===0&&document.body.classList.remove(`is-scroll-locked`)},g=`Open menu`,_=`Close menu`,v=()=>{let e=document.createElement(`div`);return e.className=`overlay-scrim nav-scrim`,document.body.append(e),e},y=()=>{let e=document.querySelector(`.burger`),t=document.getElementById(`primary-nav`);if(!e||!t)return;let n=v(),r=window.matchMedia(d.mobile),i=!1,a=r=>{r!==i&&(i=r,t.classList.toggle(`header__nav--open`,i),n.classList.toggle(`nav-scrim--visible`,i),e.classList.toggle(`burger--active`,i),e.setAttribute(`aria-expanded`,String(i)),e.setAttribute(`aria-label`,i?_:g),i?m():h())};e.addEventListener(`click`,()=>a(!i)),n.addEventListener(`click`,()=>a(!1)),t.addEventListener(`click`,e=>{e.target instanceof Element&&e.target.closest(`a`)&&a(!1)}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&i&&(a(!1),e.focus())}),r.addEventListener(`change`,e=>{e.matches||a(!1)})},b=`moss-submission-notice-closed`,x=`https://github.com/Khabib1802/rsschool-landing-page/pull/1`,S=()=>{let e=document.createElement(`aside`);e.className=`submission-notice`,e.setAttribute(`aria-label`,`Submission link information`),e.innerHTML=`
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
        href="${x}"
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
  `,document.body.append(e);let t=e.querySelector(`.submission-notice__close`),n=e.querySelector(`.submission-notice__tab`),r=()=>{e.classList.add(`submission-notice--closed`),n.setAttribute(`aria-expanded`,`false`),localStorage.setItem(b,`true`)},i=()=>{e.classList.remove(`submission-notice--closed`),n.setAttribute(`aria-expanded`,`true`)};return t.addEventListener(`click`,r),n.addEventListener(`click`,i),localStorage.getItem(b)===`true`&&e.classList.add(`submission-notice--closed`),{notice:e,close:r,open:i}},C=()=>{document.querySelector(`.submission-notice`)||S()};async function w(){try{let e=await fetch(`./data/plants.json`);if(!e.ok)throw Error(`Loading error: ${e.status}`);return await e.json()}catch(e){return console.error(`Unable to load plant data:`,e),[]}}var T=(e,t={})=>{let n=document.createElement(e),{className:r,text:i,attrs:a}=t;return r&&(n.className=r),i!==void 0&&(n.textContent=i),a&&Object.entries(a).forEach(([e,t])=>{n.setAttribute(e,t)}),n},E=(e,t={})=>{let{headingLevel:n=`h2`,itemClassName:r}=t,i=T(`li`,{className:r}),a=T(`article`,{className:`plant-card`}),o=T(`div`,{className:`plant-card__image-wrap`}),s=T(`img`,{className:`plant-card__image`,attrs:{src:e.image,alt:``,width:`640`,height:`800`}}),c=T(`div`,{className:`plant-card__body`}),u=T(`p`,{className:`plant-card__category`,text:e.categories.map(l).join(` · `)}),d=T(n,{className:`plant-card__name`}),f=T(`button`,{className:`plant-card__action`,text:e.name,attrs:{type:`button`,"aria-haspopup":`dialog`,"data-plant-id":e.id}}),p=T(`p`,{className:`plant-card__description`,text:e.description}),m=T(`p`,{className:`plant-card__price`,text:`$${e.pricing.base}`});return d.append(f),o.append(s),c.append(u,d,p,m),a.append(o,c),i.append(a),i},D=(e,t,n)=>{e.replaceChildren(),t.forEach((t,r)=>{let i=E(t,{headingLevel:`h2`});r>=n&&(i.hidden=!0),e.append(i)})},O=(e,t)=>t===`all`?e:e.filter(e=>e.categories.includes(t)),k=e=>{let t=getComputedStyle(e).getPropertyValue(`--catalog-page-size`).trim();return Number.parseInt(t,10)},A=(e,t,n)=>{e&&(e.style.display=t>=n?`none`:``)},j=(e,t)=>{e.forEach(e=>{let n=e===t;e.classList.toggle(`category-nav__item--active`,n),e.setAttribute(`aria-current`,String(n))})},M=e=>{let t=document.querySelector(`[data-plant-grid]`);if(!t)return;let n=document.querySelectorAll(`[data-category]`),r=document.querySelector(`[data-show-more]`),i=e,a=k(t),o=()=>{D(t,i,a),A(r,a,i.length)},s=()=>{a=k(t),o()};o();let c=Array.from(n).find(e=>e.classList.contains(`category-nav__item--active`));c&&j(n,c),n.forEach(t=>{t.addEventListener(`click`,()=>{i=O(e,t.dataset.category??`all`),j(n,t),s()})}),r?.addEventListener(`click`,()=>{a+=k(t),o()}),Object.values(d).map(e=>window.matchMedia(e)).forEach(e=>{e.addEventListener(`change`,s)})},N=(e,t,n)=>e.pricing.base+e.pricing.sizes[t]+e.pricing.pots[n],P=(e,t)=>e*t,F=`
<dialog class="plant-modal" aria-labelledby="plant-modal-title">
  <div class="plant-modal__content">
    <button class="plant-modal__close" type="button" data-modal-close aria-label="Close plant details">
      ×
    </button>

    <div class="plant-modal__image-wrap">
      <img class="plant-modal__image" data-modal-image src="" alt="" width="640" height="800">
    </div>

    <div class="plant-modal__body">
      <p class="plant-modal__category" data-modal-category></p>

      <h2 class="plant-modal__name" id="plant-modal-title" data-modal-name></h2>

      <p class="plant-modal__description" data-modal-description></p>

      <div class="plant-modal__characteristics">
        <div class="characteristic" data-characteristic="light">
          <span class="characteristic__label">Light</span>
          <span class="characteristic__value" data-characteristic-value="light"></span>
        </div>

        <div class="characteristic" data-characteristic="water">
          <span class="characteristic__label">Water</span>
          <span class="characteristic__value" data-characteristic-value="water"></span>
        </div>

        <div class="characteristic" data-characteristic="care">
          <span class="characteristic__label">Care</span>
          <span class="characteristic__value" data-characteristic-value="care"></span>
        </div>
      </div>

      <div class="plant-modal__options">
        <fieldset class="plant-modal__option">
          <legend>Size</legend>

          <label>
            <input type="radio" name="plant-size" value="small" data-modal-size checked>
            <span>Small</span>
          </label>

          <label>
            <input type="radio" name="plant-size" value="medium" data-modal-size>
            <span>Medium</span>
          </label>

          <label>
            <input type="radio" name="plant-size" value="large" data-modal-size>
            <span>Large</span>
          </label>
        </fieldset>

        <fieldset class="plant-modal__option">
          <legend>Pot</legend>

          <label>
            <input type="radio" name="plant-pot" value="none" data-modal-pot checked>
            <span>None</span>
          </label>

          <label>
            <input type="radio" name="plant-pot" value="ceramic" data-modal-pot>
            <span>Ceramic</span>
          </label>

          <label>
            <input type="radio" name="plant-pot" value="stone" data-modal-pot>
            <span>Stone</span>
          </label>
        </fieldset>

        <div class="plant-modal__quantity">
          <label for="plant-quantity">Quantity</label>

          <input id="plant-quantity" type="number" min="1" value="1" data-modal-quantity>
        </div>
      </div>

      <p class="plant-modal__price" data-modal-price aria-live="polite"></p>

      <button class="button button--primary" type="button" data-modal-submit>
        Add to collection
      </button>
    </div>
  </div>
</dialog>
`,I=()=>{let e=document.createElement(`template`);return e.innerHTML=F.trim(),e.content.firstElementChild},L=(e,t)=>{let n=e.querySelector(`[data-modal-image]`),r=e.querySelector(`[data-modal-category]`),i=e.querySelector(`[data-modal-name]`),a=e.querySelector(`[data-modal-description]`);n instanceof HTMLImageElement&&(n.src=t.image,n.alt=t.name),r&&(r.textContent=t.categories.map(l).join(` · `)),i&&(i.textContent=t.name),a&&(a.textContent=t.description),z(e,t)},R=e=>{e.close()},z=(e,t)=>{[`light`,`water`,`care`].forEach(n=>{let r=t.characteristics[n],i=e.querySelector(`[data-characteristic-value="${n}"]`);if(i){i.replaceChildren();for(let e=1;e<=4;e+=1){let t=document.createElement(`span`);t.className=`characteristic__indicator`,e<=r&&t.classList.add(`characteristic__indicator--active`),i.append(t)}}})},B=(e,t,n,r,i)=>{let a=e.querySelector(`[data-modal-price]`);a&&(a.textContent=`$${P(N(t,n,r),i)}`)},V=e=>{let t=e.querySelector(`[data-modal-size][value="small"]`),n=e.querySelector(`[data-modal-pot][value="none"]`),r=e.querySelector(`[data-modal-quantity]`);t instanceof HTMLInputElement&&(t.checked=!0),n instanceof HTMLInputElement&&(n.checked=!0),r instanceof HTMLInputElement&&(r.value=`1`)},H=e=>{let t=I();document.body.append(t);let n=null,r=`small`,i=`none`,a=1,o=t.querySelectorAll(`[data-modal-size]`),s=t.querySelectorAll(`[data-modal-pot]`),c=t.querySelector(`[data-modal-quantity]`);o.forEach(e=>{e.addEventListener(`change`,()=>{e instanceof HTMLInputElement&&n&&(r=e.value,B(t,n,r,i,a))})}),s.forEach(e=>{e.addEventListener(`change`,()=>{e instanceof HTMLInputElement&&n&&(i=e.value,B(t,n,r,i,a))})}),c?.addEventListener(`input`,()=>{if(!(c instanceof HTMLInputElement)||!n)return;let e=Number.parseInt(c.value,10);a=Number.isNaN(e)||e<1?1:e,c.value=String(a),B(t,n,r,i,a)});let l=t.querySelector(`[data-modal-close]`);document.addEventListener(`click`,o=>{if(!(o.target instanceof Element))return;let s=o.target.closest(`[data-plant-id]`);if(!s)return;let c=s.dataset.plantId;if(!c)return;let l=e.find(e=>e.id===c);l&&(n=l,r=`small`,i=`none`,a=1,V(t),L(t,l),B(t,l,r,i,a),m(),t.showModal())}),l?.addEventListener(`click`,()=>{R(t)}),t.addEventListener(`click`,e=>{e.target===t&&R(t)}),t.addEventListener(`close`,()=>{h()}),t.querySelector(`[data-modal-submit]`)?.addEventListener(`click`,()=>{R(t)})},U=5,W=3,G=500,K=e=>{let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t},q=e=>K(e).slice(0,U),J=e=>E(e,{headingLevel:`h3`,itemClassName:`plant-slider__item`}),Y=e=>{let t=J(e);return t.setAttribute(`aria-hidden`,`true`),t.querySelectorAll(`button`).forEach(e=>e.setAttribute(`tabindex`,`-1`)),t},X=(e,t)=>{let n=e.slice(-t).map(Y),r=e.map(J),i=e.slice(0,t).map(Y);return[...n,...r,...i]},Z=e=>{let t=document.querySelector(`[data-featured-track]`),n=document.querySelector(`[data-slider-prev]`),r=document.querySelector(`[data-slider-next]`);if(!(t instanceof HTMLElement))return;let i=q(e),a=i.length;if(a===0)return;let o=Math.min(W,a),s=o,c=s,l=!1,u=0,d=()=>{let e=t.firstElementChild;if(!(e instanceof HTMLElement))return 0;let n=Number.parseFloat(getComputedStyle(t).columnGap)||0;return e.getBoundingClientRect().width+n},f=()=>{t.style.transform=`translateX(${-c*d()}px)`},p=e=>{c=e,t.style.transition=`none`,f(),t.offsetWidth,t.style.transition=``},m=()=>{window.clearTimeout(u),l&&(l=!1,c>=s+a?p(c-a):c<s&&p(c+a))},h=e=>{l||(l=!0,c+=e,f(),u=window.setTimeout(m,G))};t.replaceChildren(...X(i,o)),p(s),t.addEventListener(`transitionend`,e=>{e.target===t&&e.propertyName===`transform`&&m()}),n?.addEventListener(`click`,()=>h(-1)),r?.addEventListener(`click`,()=>h(1)),window.addEventListener(`resize`,()=>p(c))};s(),y(),C(),(async()=>{let e=await w();e.length!==0&&(M(e),H(e),Z(e))})();
//# sourceMappingURL=main-CqkTgnsW.js.map