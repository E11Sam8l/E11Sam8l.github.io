<template>
  <svg
    class="coastal-scene"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="animated-sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#17283a" />
        <stop offset="0.43" stop-color="#496379" />
        <stop offset="0.76" stop-color="#bd7b7d" />
        <stop offset="1" stop-color="#e4ad83" />
      </linearGradient>
      <linearGradient id="animated-sea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#668d96" />
        <stop offset="0.32" stop-color="#376678" />
        <stop offset="1" stop-color="#17374b" />
      </linearGradient>
      <linearGradient id="animated-road" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#315866" />
        <stop offset="1" stop-color="#0a1b29" />
      </linearGradient>
      <linearGradient id="animated-coral" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#d8806c" />
        <stop offset="1" stop-color="#87495b" />
      </linearGradient>
      <linearGradient id="animated-aqua" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#75b7b1" />
        <stop offset="1" stop-color="#2b5b6d" />
      </linearGradient>
      <linearGradient id="animated-paper" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#e5c59d" />
        <stop offset="1" stop-color="#b27c75" />
      </linearGradient>
      <radialGradient id="animated-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff0c8" stop-opacity="0.98" />
        <stop offset="0.35" stop-color="#ffcc9d" stop-opacity="0.62" />
        <stop offset="1" stop-color="#f0a188" stop-opacity="0" />
      </radialGradient>
      <filter id="animated-shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <pattern id="animated-speckle" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="2" r="0.65" fill="#f6dfbd" opacity="0.2" />
        <circle cx="7" cy="6" r="0.45" fill="#0b1c2b" opacity="0.16" />
      </pattern>
    </defs>

    <rect width="1440" height="900" fill="url(#animated-sky)" />
    <ellipse cx="760" cy="360" rx="210" ry="180" fill="url(#animated-sun)" />
    <circle cx="760" cy="360" r="56" fill="#ffe0af" opacity="0.92" />
    <circle cx="760" cy="360" r="76" fill="none" stroke="#ffd4a9" stroke-width="7" opacity="0.2" />

    <g class="far-coast">
      <path d="M0 423C160 397 285 411 435 399S768 389 925 406s320-12 515 7v139H0Z" fill="#3b536a" opacity="0.82" />
      <path d="M0 432c169-25 308-28 440-18 155 12 307-21 451-9 182 15 356 2 549 20v40H0Z" fill="#637687" opacity="0.35" />
      <g fill="#263c51" opacity="0.88">
        <path d="M44 441v-76h56v76zM111 441v-105h43v105zM165 441v-63h70v63zM248 441V347h62v94zM320 441V307h73v134zM406 441v-80h58v80z" />
        <path d="M996 441v-82h60v82zM1066 441V307h48v134zM1127 441v-73h83v73zM1222 441V331h62v110zM1294 441v-88h73v88zM1380 441v-62h60v62z" />
      </g>
      <g fill="#f4c19d" opacity="0.23">
        <path d="M59 384h22v8H59zm0 22h22v8H59zm70-47h18v8h-18zm0 22h18v8h-18zm227-18h25v8h-25zm0 21h25v8h-25z" />
        <path d="M1014 392h26v8h-26zm0 21h26v8h-26zm76-78h19v8h-19zm0 22h19v8h-19zm170 55h32v8h-32z" />
      </g>
    </g>

    <path d="M0 505C247 476 426 493 619 484s460-11 821 17v214H0Z" fill="url(#animated-sea)" />
    <g class="water-lines" fill="none" stroke="#b7d8d3" stroke-linecap="round">
      <path d="M34 550c121-16 218-15 326 0M477 541c127-12 231-11 359 0M984 553c132-16 252-15 408 0" stroke-width="3" opacity="0.36" />
      <path d="M80 591c93-10 188-10 284 0M548 584c104-12 225-10 357 0M1051 596c116-10 227-8 335 0" stroke-width="2" opacity="0.24" />
      <path d="M174 641c77-8 163-8 248 0M707 634c104-9 190-9 289 0M1156 646c72-7 143-7 216 0" stroke-width="2" opacity="0.17" />
    </g>
    <path d="M0 505C247 476 426 493 619 484s460-11 821 17v214H0Z" fill="url(#animated-speckle)" opacity="0.33" />

    <g class="mid-coast">
      <path d="M0 572l165-27 111 29 108-42 120 35 138-40 154 44 143-36 165 37 132-34 204 33v150H0Z" fill="#183449" />
      <path d="M0 592c214-25 370-29 552-15 205 16 411-24 588-9 113 10 203 8 300 19v79H0Z" fill="#234b5e" opacity="0.7" />
      <g fill="#0f273a">
        <path d="M76 569v-78h50v78zM135 569V457h42v112zM185 569v-70h75v70zM270 569V442h51v127zM330 569v-94h65v94z" />
        <path d="M1018 568v-95h59v95zM1086 568V446h75v122zM1172 568v-70h43v70zM1225 568V453h83v115zM1320 568v-87h50v87zM1378 568v-63h62v63z" />
      </g>
      <g fill="#efb692" opacity="0.37">
        <path d="M95 519h15v13H95zm57-40h14v14h-14zm76 38h16v14h-16zm58-67h16v14h-16zm69 33h16v14h-16z" />
        <path d="M1039 501h15v14h-15zm61-30h17v14h-17zm83 56h16v14h-16zm54-71h19v15h-19zm80 32h17v15h-17z" />
      </g>
    </g>

    <g class="street-plane">
      <path d="M0 620c292-27 503-14 716-24 239-11 484-2 724 25v279H0Z" fill="#112c40" />
      <path d="M550 900l121-304h93l166 304Z" fill="url(#animated-road)" />
      <path d="M0 690c268-41 423-38 598-31l-25 58C389 704 216 720 0 766Z" fill="#245064" />
      <path d="M1440 690c-268-39-423-38-597-30l25 58c182-16 355 0 572 48Z" fill="#245064" />
      <g fill="#f1c59e" opacity="0.72">
        <path d="M700 648h18l7 42-22 1zM738 647h18l8 43-23-1zM779 649l18 2 17 44-23-2zM818 654l19 2 28 44-23-3z" />
      </g>
      <g fill="#eeae8b" opacity="0.46">
        <path d="M116 722h178v6H116zm1029 0h194v6h-194zM45 776h140v5H45zm1196 0h155v5h-155z" />
      </g>
      <g fill="none" stroke="#091b2a" stroke-linecap="round" stroke-width="8">
        <path d="M235 650V475q0-25 25-25h39" />
        <path d="M1209 650V475q0-25-25-25h-39" />
      </g>
      <g fill="#ffd2a5" opacity="0.78">
        <circle cx="299" cy="441" r="9" />
        <circle cx="1142" cy="441" r="9" />
      </g>
    </g>

    <g class="palm-silhouette" fill="none" stroke-linecap="round">
      <path d="M67 900C76 744 103 620 135 516" stroke="#10283b" stroke-width="18" />
      <path d="M135 526c-50-17-77-44-103-87M135 526c50-36 80-45 123-41M135 526c-13-51-9-88 13-129M135 526c39 1 69 14 101 44" stroke="#183b4d" stroke-width="12" />
      <path d="M1375 900c-10-145-33-264-67-370" stroke="#10283b" stroke-width="18" />
      <path d="M1308 530c51-20 81-48 109-88M1308 530c-49-37-79-46-123-42M1308 530c13-52 10-88-12-130M1308 530c-39 2-68 15-100 46" stroke="#183b4d" stroke-width="12" />
    </g>

    <g class="foreground-buildings">
      <g class="journal-building">
        <ellipse cx="370" cy="644" rx="177" ry="26" fill="#071a28" opacity="0.48" filter="url(#animated-shadow)" />
        <path d="M224 636V423l46-42h223l22 42v213Z" fill="url(#animated-coral)" />
        <path d="m224 423 46-42h223l22 42Z" fill="#e2a07e" />
        <path d="M268 381v-22h207l11 22Z" fill="#f0bd97" />
        <path d="M242 448h249v18H242Z" fill="#efb38f" opacity="0.7" />
        <g fill="#f7d5ae" opacity="0.88">
          <path d="M252 483h38v43h-38zm54 0h38v43h-38zm54 0h38v43h-38zm54 0h38v43h-38z" />
          <path d="M252 550h38v47h-38zm54 0h38v47h-38zm54 0h38v47h-38zm54 0h38v47h-38z" />
        </g>
        <path d="M246 536h47m8 0h47m8 0h47m8 0h47" stroke="#824759" stroke-width="7" opacity="0.8" />
        <rect x="315" y="392" width="116" height="22" fill="#1d2d40" />
        <path d="M327 408h12v-10h8v10h16v-12h8v12h17v-9h8v9h16" fill="none" stroke="#ffd0a8" stroke-width="3" />
        <path d="M218 636h304" stroke="#0c2132" stroke-width="12" />
      </g>

      <g class="exhibition-building">
        <ellipse cx="1028" cy="644" rx="173" ry="25" fill="#071a28" opacity="0.48" filter="url(#animated-shadow)" />
        <path d="M890 639V407h278l-25-31H918Z" fill="url(#animated-aqua)" />
        <path d="M890 407h278l-33-35H924Z" fill="#e0ad8d" />
        <path d="M921 372h240l-21-21H941Z" fill="#f3c4a0" />
        <g fill="#f2cfac" opacity="0.74">
          <path d="M906 423h10v202h-10zm65 0h10v202h-10zm65 0h10v202h-10zm65 0h10v202h-10z" />
        </g>
        <g fill="#15354a" opacity="0.76">
          <path d="M927 454h40v47h-40zm69 0h40v47h-40zm69 0h40v47h-40z" />
          <path d="M927 526h40v46h-40zm69 0h40v46h-40zm69 0h40v46h-40z" />
        </g>
        <path d="M877 639h302" stroke="#f0c6a2" stroke-width="8" />
        <path d="M1026 351v-33m-19 18h38" stroke="#19374a" stroke-width="5" />
        <circle cx="1026" cy="309" r="8" fill="#ffb08c" />
      </g>

      <g class="archive-building">
        <ellipse cx="534" cy="836" rx="158" ry="22" fill="#071a28" opacity="0.52" filter="url(#animated-shadow)" />
        <path d="M399 831V634h270l-23-29H425Z" fill="#31586a" />
        <path d="M399 634h270l-29-28H429Z" fill="#a8c0b7" />
        <path d="M429 606h211l-19-22H448Z" fill="#dac5a4" />
        <g fill="#84b5b1" opacity="0.72">
          <path d="M423 660h40v51h-40zm60 0h40v51h-40zm60 0h40v51h-40zm60 0h40v51h-40z" />
          <path d="M423 740h40v55h-40zm60 0h40v55h-40zm60 0h40v55h-40zm60 0h40v55h-40z" />
        </g>
        <g stroke="#dfcbaa" stroke-width="3" opacity="0.9">
          <path d="M412 723h244M412 804h244" />
          <path d="M458 650v164M518 650v164M578 650v164" />
        </g>
        <path d="M389 831h290" stroke="#0a1e2d" stroke-width="12" />
      </g>

      <g class="studio-building">
        <ellipse cx="956" cy="836" rx="180" ry="22" fill="#071a28" opacity="0.52" filter="url(#animated-shadow)" />
        <path d="M808 831V650h301l-40-33H851Z" fill="url(#animated-paper)" />
        <path d="M808 650h301l-43-34H851Z" fill="#e3ad8b" />
        <path d="M849 616h250l-24-24H874Z" fill="#f4c5a0" />
        <g fill="#203b4d">
          <path d="M837 680h58v76h-58zm78 0h58v76h-58zm78 0h58v76h-58z" />
        </g>
        <g fill="#f0c09c" opacity="0.75">
          <path d="M837 771h58v44h-58zm78 0h58v44h-58zm78 0h58v44h-58z" />
        </g>
        <path d="M800 644h318" stroke="#81c7c0" stroke-width="4" />
        <path d="M869 592v-33m72 33v-45m72 45v-26" stroke="#294358" stroke-width="5" />
        <circle cx="941" cy="538" r="8" fill="#ffd3a5" />
        <path d="m945 538 36-18" stroke="#294358" stroke-width="4" />
        <path d="M797 831h326" stroke="#0a1e2d" stroke-width="12" />
      </g>
    </g>

    <g class="foreground-edge">
      <rect y="854" width="1440" height="46" fill="#081722" />
      <path d="M0 858h1440" stroke="#4d6974" stroke-width="3" />
      <path d="M58 878h148M285 878h146M1145 878h146M1366 878h74" stroke="#efb18d" stroke-width="5" opacity="0.55" />
      <circle cx="233" cy="859" r="5" fill="#f6bf98" />
      <circle cx="1216" cy="859" r="5" fill="#f6bf98" />
    </g>
  </svg>
</template>

<style scoped>
.coastal-scene {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: #0b1825;
}

.far-coast,
.mid-coast,
.street-plane,
.palm-silhouette,
.foreground-buildings {
  transform-box: view-box;
  transform-origin: 50% 100%;
}

.far-coast {
  transform: translateY(calc((1 - var(--journey-progress, 0)) * -18px)) scale(calc(0.986 + var(--journey-progress, 0) * 0.014));
  opacity: calc(0.78 + var(--journey-progress, 0) * 0.22);
}

.mid-coast {
  transform: translateY(calc((1 - var(--journey-progress, 0)) * -9px)) scale(calc(0.992 + var(--journey-progress, 0) * 0.008));
}

.street-plane {
  transform: translateY(calc((1 - var(--journey-progress, 0)) * 7px));
}

.palm-silhouette {
  transform: translateY(calc((1 - var(--journey-progress, 0)) * 5px)) scale(calc(0.985 + var(--journey-progress, 0) * 0.015));
}

.foreground-buildings {
  transform: translateY(calc((1 - var(--journey-progress, 0)) * 14px)) scale(calc(0.97 + var(--journey-progress, 0) * 0.03));
  opacity: calc(0.48 + var(--journey-progress, 0) * 0.52);
}

.water-lines {
  opacity: calc(0.42 + var(--journey-progress, 0) * 0.32);
}

@media (prefers-reduced-motion: reduce) {
  .far-coast,
  .mid-coast,
  .street-plane,
  .palm-silhouette,
  .foreground-buildings {
    transform: none;
  }

  .foreground-buildings {
    opacity: 1;
  }
}
</style>
