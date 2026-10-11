<template>
  <svg
    class="coastal-scene"
    viewBox="0 0 1440 900"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="coastal-sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#111b38" />
        <stop offset="0.42" stop-color="#40325e" />
        <stop offset="0.72" stop-color="#b35f79" />
        <stop offset="1" stop-color="#f0a079" />
      </linearGradient>
      <radialGradient id="coastal-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#ffe1ae" stop-opacity="1" />
        <stop offset="0.38" stop-color="#ffc096" stop-opacity="0.8" />
        <stop offset="1" stop-color="#ff9c8b" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="coastal-sea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#5b6e85" />
        <stop offset="0.35" stop-color="#29465d" />
        <stop offset="1" stop-color="#142b43" />
      </linearGradient>
      <linearGradient id="coastal-road" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#24364b" />
        <stop offset="1" stop-color="#091522" />
      </linearGradient>
      <linearGradient id="editorial-wall" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#dd8879" />
        <stop offset="1" stop-color="#9c5367" />
      </linearGradient>
      <linearGradient id="gallery-glass" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#9bd7d3" stop-opacity="0.68" />
        <stop offset="0.48" stop-color="#3b7891" stop-opacity="0.78" />
        <stop offset="1" stop-color="#19334e" stop-opacity="0.96" />
      </linearGradient>
      <linearGradient id="archive-wall" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#294458" />
        <stop offset="1" stop-color="#13283d" />
      </linearGradient>
      <linearGradient id="studio-wall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#d19a7f" />
        <stop offset="1" stop-color="#80556a" />
      </linearGradient>
      <filter id="coastal-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>

    <rect width="1440" height="900" fill="url(#coastal-sky)" />
    <ellipse cx="735" cy="370" rx="185" ry="155" fill="url(#coastal-sun)" filter="url(#coastal-soft-glow)" />
    <circle cx="735" cy="370" r="62" fill="#ffd6a3" opacity="0.88" />
    <circle cx="735" cy="370" r="45" fill="#ffe4bb" opacity="0.82" />

    <g class="far-layer">
      <path d="M0 422 C170 396 305 410 445 399 S760 392 920 409 S1240 391 1440 414 V548 H0 Z" fill="#344762" opacity="0.82" />
      <g fill="#26394f" opacity="0.86">
        <path d="M40 437V348h65v89zM119 437V317h52v120zM184 437v-72h79v72zM275 437V337h63v100zM352 437V300h84v137z" />
        <path d="M1000 437V334h74v103zM1086 437V289h55v148zM1152 437v-82h92v82zM1259 437V315h69v122zM1345 437V348h74v89z" />
      </g>
      <g fill="#f2bd9c" opacity="0.2">
        <path d="M56 364h28v9H56zm0 24h28v9H56zm79-72h25v10h-25zm0 24h25v10h-25zm250 0h30v10h-30zm0 25h30v10h-30z" />
        <path d="M1018 353h32v10h-32zm0 24h32v10h-32zm86-68h24v10h-24zm0 25h24v10h-24zm172 57h42v10h-42z" />
      </g>
    </g>

    <path d="M0 502 C260 472 430 490 620 482 S1080 476 1440 500 V710 H0 Z" fill="url(#coastal-sea)" />
    <g class="sea-lines" fill="none" stroke="#9cc2bf" stroke-linecap="round">
      <path d="M35 548c120-16 216-16 323 0M480 538c126-12 226-12 350 0M982 551c127-17 252-15 400 0" stroke-width="3" opacity="0.34" />
      <path d="M80 590c90-10 190-11 282 0M550 581c100-12 224-10 356 0M1050 595c114-11 227-8 333 0" stroke-width="2" opacity="0.22" />
      <path d="M180 641c74-8 164-8 244 0M708 632c102-8 187-9 285 0M1150 644c74-8 142-7 227 0" stroke-width="2" opacity="0.18" />
    </g>

    <g class="mid-layer">
      <path d="M0 572 L170 546 275 575 387 532 500 567 640 526 791 569 936 533 1092 570 1232 538 1440 571V710H0Z" fill="#162b40" opacity="0.93" />
      <g fill="#0e2033" opacity="0.95">
        <path d="M94 562v-85h52v85zM153 562v-113h43v113zM204 562v-74h75v74zM286 562v-128h52v128zM346 562v-97h64v97z" />
        <path d="M1040 560v-94h57v94zM1105 560v-123h76v123zM1192 560v-72h43v72zM1246 560v-116h83v116zM1340 560v-90h51v90z" />
      </g>
      <g stroke="#f3bd9d" stroke-width="5" opacity="0.35">
        <path d="M114 503h15v13h-15zm59-37h14v14h-14zm80 36h16v14h-16zm60-66h16v14h-16zm70 31h16v14h-16z" />
        <path d="M1062 483h16v14h-16zm63-29h17v14h-17zm85 56h16v14h-16zm53-70h20v15h-20zm83 31h17v15h-17z" />
      </g>
    </g>

    <g class="street-layer">
      <path d="M0 621 C300 593 507 606 720 596 C958 585 1198 595 1440 621 V900 H0Z" fill="#11263a" />
      <path d="M580 900 L671 600 767 600 902 900Z" fill="url(#coastal-road)" />
      <path d="M0 688 C272 646 426 650 592 657 L572 716 C384 701 218 716 0 762Z" fill="#1d3e52" />
      <path d="M1440 688 C1177 649 1021 650 848 657 L872 718 C1052 700 1228 718 1440 763Z" fill="#1d3e52" />
      <g fill="#f6c89d" opacity="0.7">
        <path d="M712 653l17-1 7 43-22 1zM746 650l18 1 7 44-23-1zM788 651l18 2 17 44-23-2zM825 656l19 2 29 44-23-3z" />
      </g>
      <g fill="#f0b08f" opacity="0.42">
        <path d="M120 721h172v6H120zm1020 0h190v6h-190zM45 775h136v5H45zm1194 0h155v5h-155z" />
      </g>
      <g class="street-lamps" fill="none" stroke="#0b1928" stroke-width="8" stroke-linecap="round">
        <path d="M245 650v-185q0-25 25-25h34" />
        <path d="M1205 650v-185q0-25-25-25h-34" />
      </g>
      <g fill="#ffd1a3" opacity="0.75">
        <circle cx="304" cy="438" r="9" />
        <circle cx="1136" cy="438" r="9" />
      </g>
    </g>

    <g class="palm-layer" fill="none" stroke-linecap="round">
      <path d="M74 892C83 745 109 624 139 522" stroke="#12263a" stroke-width="18" />
      <path d="M138 532c-49-16-75-42-101-84M138 532c50-37 78-45 121-41M138 532c-12-51-9-85 12-126M138 532c39 0 67 13 99 43" stroke="#162b40" stroke-width="12" />
      <path d="M1370 892c-8-145-30-264-64-366" stroke="#12263a" stroke-width="18" />
      <path d="M1306 532c52-20 81-47 108-86M1306 532c-48-36-77-45-121-42M1306 532c13-51 10-86-12-127M1306 532c-38 2-67 15-98 45" stroke="#162b40" stroke-width="12" />
    </g>

    <g class="foreground-architecture">
      <g class="editorial-building">
        <path d="M247 624V411h271v213z" fill="#512f4a" />
        <path d="M247 411l39-46h215l17 46z" fill="url(#editorial-wall)" />
        <path d="M286 365v-22h205l10 22z" fill="#efa88b" />
        <rect x="270" y="432" width="225" height="17" fill="#f4b49c" opacity="0.7" />
        <g fill="#ffd6b0" opacity="0.82">
          <path d="M276 470h32v39h-32zm48 0h32v39h-32zm48 0h32v39h-32zm48 0h32v39h-32z" />
          <path d="M276 533h32v44h-32zm48 0h32v44h-32zm48 0h32v44h-32zm48 0h32v44h-32z" />
        </g>
        <g fill="#7e485c" opacity="0.8">
          <path d="M278 515h32v7h-32zm48 0h32v7h-32zm48 0h32v7h-32zm48 0h32v7h-32z" />
        </g>
        <rect x="337" y="382" width="103" height="24" fill="#2b2540" />
        <path d="M349 397h12v-10h8v10h15v-12h8v12h17v-9h8v9h12" fill="none" stroke="#ffc0a1" stroke-width="3" />
        <rect x="241" y="624" width="283" height="12" fill="#16263a" />
      </g>

      <g class="gallery-building">
        <path d="M891 624V397h253v227z" fill="url(#gallery-glass)" />
        <path d="M873 397h288l-33-31H902z" fill="#d9a58e" />
        <path d="M902 366h232l-21-20H923z" fill="#f5c5a4" />
        <g fill="#f4c8aa" opacity="0.74">
          <rect x="911" y="412" width="9" height="199" />
          <rect x="974" y="412" width="9" height="199" />
          <rect x="1036" y="412" width="9" height="199" />
          <rect x="1098" y="412" width="9" height="199" />
        </g>
        <g fill="#183149" opacity="0.78">
          <path d="M930 444h33v44h-33zm63 0h33v44h-33zm63 0h33v44h-33z" />
          <path d="M930 512h33v43h-33zm63 0h33v43h-33zm63 0h33v43h-33z" />
        </g>
        <path d="M881 624h274" stroke="#efc2a3" stroke-width="8" />
        <path d="M1020 346v-32m-18 17h37" stroke="#192e45" stroke-width="5" />
        <circle cx="1020" cy="308" r="8" fill="#ffad8d" />
        <rect x="942" y="573" width="153" height="37" fill="#e3b397" opacity="0.2" />
      </g>

      <g class="archive-building">
        <path d="M420 824V623h236v201z" fill="url(#archive-wall)" />
        <path d="M407 623h262l-27-27H435z" fill="#9cb6b4" />
        <path d="M448 596h181l-18-21H466z" fill="#d7bc9d" />
        <g fill="#8bb8b4" opacity="0.6">
          <path d="M442 652h37v48h-37zm57 0h37v48h-37zm57 0h37v48h-37zm57 0h37v48h-37z" />
          <path d="M442 729h37v52h-37zm57 0h37v52h-37zm57 0h37v52h-37zm57 0h37v52h-37z" />
        </g>
        <g stroke="#d4c49f" stroke-width="3" opacity="0.9">
          <path d="M430 713h211M430 789h211" />
          <path d="M475 641v157M532 641v157M589 641v157" />
        </g>
        <rect x="493" y="604" width="91" height="14" fill="#efc5a3" />
        <path d="M478 598h121" stroke="#f4caab" stroke-width="3" />
        <rect x="407" y="824" width="263" height="12" fill="#0b1a2a" />
      </g>

      <g class="studio-building">
        <path d="M823 824V641h277v183z" fill="url(#studio-wall)" />
        <path d="M809 641h307l-42-31H848z" fill="#edb393" />
        <path d="M844 610h233l-23-23H867z" fill="#f8c7a6" />
        <g fill="#23364b">
          <path d="M852 671h53v73h-53zm72 0h53v73h-53zm72 0h53v73h-53z" />
        </g>
        <g fill="#f7c9a4" opacity="0.72">
          <path d="M852 758h53v44h-53zm72 0h53v44h-53zm72 0h53v44h-53z" />
        </g>
        <path d="M815 635h295" stroke="#84c8c3" stroke-width="4" />
        <path d="M886 586v-31m65 31v-42m66 42v-25" stroke="#263c4f" stroke-width="5" />
        <circle cx="951" cy="542" r="8" fill="#ffd3a5" />
        <path d="M955 542l33-16" stroke="#263c4f" stroke-width="4" />
        <rect x="815" y="824" width="299" height="12" fill="#0b1a2a" />
      </g>
    </g>

    <g class="front-details" fill="#f8c39e">
      <rect x="0" y="844" width="1440" height="56" fill="#091622" />
      <path d="M0 850h1440" stroke="#40596a" stroke-width="4" />
      <path d="M80 869h121M280 869h121M1160 869h121M1360 869h80" stroke="#f3b18f" stroke-width="5" opacity="0.56" />
      <circle cx="218" cy="851" r="5" />
      <circle cx="1222" cy="851" r="5" />
    </g>
  </svg>
</template>

<style scoped>
.coastal-scene {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: #0d1626;
}

.far-layer,
.mid-layer,
.street-layer,
.palm-layer,
.foreground-architecture {
  transform-box: view-box;
  transform-origin: 50% 100%;
}

.far-layer {
  transform: translateY(calc((1 - var(--world-progress, 0)) * -18px)) scale(calc(0.985 + var(--world-progress, 0) * 0.015));
  opacity: calc(0.88 + var(--world-progress, 0) * 0.12);
}

.mid-layer {
  transform: translateY(calc((1 - var(--world-progress, 0)) * -10px)) scale(calc(0.99 + var(--world-progress, 0) * 0.01));
}

.street-layer {
  transform: translateY(calc((1 - var(--world-progress, 0)) * 7px));
}

.palm-layer {
  transform: translateY(calc((1 - var(--world-progress, 0)) * 6px)) scale(calc(0.98 + var(--world-progress, 0) * 0.02));
}

.foreground-architecture {
  transform: translateY(calc((1 - var(--world-progress, 0)) * 13px)) scale(calc(0.975 + var(--world-progress, 0) * 0.025));
  opacity: calc(0.56 + var(--world-progress, 0) * 0.44);
}

.sea-lines {
  opacity: calc(0.42 + var(--world-progress, 0) * 0.38);
}

@media (prefers-reduced-motion: reduce) {
  .far-layer,
  .mid-layer,
  .street-layer,
  .palm-layer,
  .foreground-architecture {
    transform: none;
  }

  .foreground-architecture {
    opacity: 1;
  }
}
</style>
