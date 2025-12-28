<template>
  <main>
    <Hero/>

    <div class="code-row">
      <div class="code-block">
        <div class="label">
          <label class="label__title" for="svg-code">SVG Raw Code</label>
          <a @click="minifySVG">Minify</a>
        </div>

        <textarea id="svg-code" class="code code--main" v-model="svg.code" spellcheck="false"/>
      </div>

      <div class="svg-preview">
        <div class="label">
          <label for="#">Preview</label>
          
          <div class="svg-preview-list">
            <button class="svg-preview-list__item" @click="svg.preview = ''"/>
            <button class="svg-preview-list__item svg-preview-list__item--light" @click="svg.preview = 'light'"/>
            <button class="svg-preview-list__item svg-preview-list__item--dark" @click="svg.preview = 'dark'"/>
          </div>
        </div>

        <CodeBlock
          :svg="svg.code"
          format="urlencodedNoStyles"
          type="img"
          :class="{'no-img': !svg.code.length || !svg.isValidSVG, 'light': svg.preview === 'light', 'dark': svg.preview === 'dark'}"/>
      </div>

      <div class="svg-options">
        <div class="label">
          <label for="#">SVG Options</label>
        </div>

        <div class="svg-options-row">
          <div class="svg-options-item">
            <div class="label">
              <label for="width">Width</label>

              <div>
                <input type="checkbox" id="aspectRatio" v-model="svg.aspectRatio"
                       @change="e => e.target.checked ? svg.height = svg.width : ''"/>
                <label for="aspectRatio">Aspect Ratio</label>
              </div>
            </div>

            <input type="number" placeholder="Width (px)" class="input" id="width" v-model="svg.width"/>

          </div>
          <div class="svg-options-item">
            <div class="label">
              <label for="height">Height</label>
            </div>

            <input type="number" placeholder="Height (px)" class="input" id="height" v-model="svg.height"
                   :disabled="svg.aspectRatio"/>
          </div>
          <div class="svg-options-item">
            <div class="label">
              <label for="color">Fill color</label>
              <a @click="svg.fill = 'currentColor'">to currentColor</a>
            </div>

            <div class="svg-options-item__color">
              <input type="color" :value="getFillColor" @input="e => svg.fill = e.target.value"/>
              <input type="text" class="input" placeholder="#000000" id="color" v-model="svg.fill" spellcheck="false"/>
            </div>
          </div>
          <div class="svg-options-item">
            <div class="label">
              <label for="#">Download</label>
              <a class="svg-options-item__download" @click="downloadImage">Download</a>
            </div>

            <select class="input" v-model="svg.downloadFormat">
              <option value="svg" selected>SVG</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="result-row" v-if="svg.code && svg.isValidSVG">
      <div class="result-item">
        <h5 class="result-item__title">URL-Encoded</h5>
        <p class="result-item__description">Spaces excluded</p>

        <CodeBlock :svg="svg.code" format="urlencoded" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">URL-Encoded CSS</h5>
        <p class="result-item__description">background-image: url()</p>

        <CodeBlock :svg="svg.code" format="background" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">URL-Encoded &lt;img&gt;</h5>
        <p class="result-item__description">&lt;img src=""&gt;</p>

        <CodeBlock :svg="svg.code" format="img" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">Data Image</h5>
        <p class="result-item__description">data:image/svg+xml encoded</p>

        <CodeBlock :svg="svg.code" format="dataImg" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">URL-Encoded Base64 &lt;img&gt;</h5>
        <p class="result-item__description">Base64 &lt;img src=""&gt;</p>

        <CodeBlock :svg="svg.code" format="imgBase64" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">Data Image Base64</h5>
        <p class="result-item__description">data:image/svg+xml;base64 encoded</p>

        <CodeBlock :svg="svg.code" format="base64" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">No Groups</h5>
        <p class="result-item__description">Removed all groups</p>

        <CodeBlock :svg="svg.code" format="html" tabindex="0"/>
      </div>

      <div class="result-item">
        <h5 class="result-item__title">Merged paths</h5>
        <p class="result-item__description">Merged all svg paths (may cause errors)</p>

        <CodeBlock :svg="mergeSvgPaths" format="html" tabindex="0"/>
      </div>

      <div class="result-item full">
        <h5 class="result-item__title">SVG Symbol</h5>
        <p class="result-item__description">Get SVG Symbol of SVG and use it as sprite</p>

        <div class="block">
          <CodeBlock :svg="getSymbolSVG" format="html" tabindex="0"/>
          <CodeBlock :svg="getSymbolUseSVG" format="html" tabindex="0"/>
        </div>
      </div>
    </div>

    <div class="by">Created with <span>❤️</span> by <a href="https://dan13.me/?utm_source=svgtools">DanRotaru</a>️</div>
  </main>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { useSvgDimensions } from '@/composables/useSvgDimensions';

import Hero from "@/components/Hero.vue";
import CodeBlock from "@/components/CodeBlock.vue";

/* ---------------- STATE ---------------- */

const svg = reactive({
  code: '',
  fill: 'currentColor',
  preview: '',

  width: null,
  height: null,
  aspectRatio: false,
  downloadFormat: 'svg',

  isValidSVG: true,
});

useSvgDimensions(svg);

/* ---------------- DOM HELPERS ---------------- */

const parseSvg = (code) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'image/svg+xml');
  const svgEl = doc.documentElement;

  if (svgEl.tagName.toLowerCase() !== 'svg') return null;
  if (doc.querySelector('parsererror')) return null;

  return { doc, svgEl };
};

const serializeSvg = (doc) => doc.documentElement.outerHTML;

/* ---------------- VALIDATION + READ ---------------- */

watch(() => svg.code, (value) => {
  const parsed = parseSvg(value?.trim());
  svg.isValidSVG = !!parsed;

  if (!parsed) {
    svg.fill = 'currentColor';
    svg.width = null;
    svg.height = null;
    return;
  }

  const { svgEl } = parsed;

  svg.width = svgEl.getAttribute('width');
  svg.height = svgEl.getAttribute('height');

  // Read first fill found
  const fillNode = svgEl.querySelector('[fill]');
  if (fillNode) {
    svg.fill = fillNode.getAttribute('fill');
  }
});

/* ---------------- FILL HANDLING ---------------- */

watch(() => svg.fill, (color) => {
  if (!svg.code || !svg.isValidSVG) return;

  const parsed = parseSvg(svg.code);
  if (!parsed) return;

  const { doc, svgEl } = parsed;

  // 1. <svg fill="">
  if (svgEl.hasAttribute('fill') && svgEl.getAttribute('fill') !== 'none') {
    svgEl.setAttribute('fill', color);
  }
  // 2. descendant fill
  else {
    const fillEls = svgEl.querySelectorAll('[fill]:not([fill="none"])');

    if (fillEls.length) {
      fillEls.forEach(el => el.setAttribute('fill', color));
    }
    // 3. <svg stroke="">
    else if (svgEl.hasAttribute('stroke') && svgEl.getAttribute('stroke') !== 'none') {
      svgEl.setAttribute('stroke', color);
    }
    // 4. descendant stroke
    else {
      const strokeEls = svgEl.querySelectorAll('[stroke]:not([stroke="none"])');

      if (strokeEls.length) {
        strokeEls.forEach(el => el.setAttribute('stroke', color));
      }
      // 5. fallback → inject fill
      else {
        svgEl.setAttribute('fill', color);
      }
    }
  }

  svg.code = serializeSvg(doc);
});


/* ---------------- MINIFY (SAFE) ---------------- */

const minifySVG = () => {
  if (!svg.code) return;

  const parsed = parseSvg(svg.code);
  if (!parsed) return;

  svg.code = serializeSvg(parsed.doc)
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/<!--.*?-->/gs, '')
    .trim();
};

/* ---------------- DERIVED OUTPUTS ---------------- */

const mergeSvgPaths = computed(() => {
  if (!svg.code || !svg.isValidSVG) return '';

  const parsed = parseSvg(svg.code);
  if (!parsed) return '';

  const { doc, svgEl } = parsed;
  const paths = [...svgEl.querySelectorAll('path')]
    .map(p => p.getAttribute('d'))
    .filter(Boolean);

  svgEl.querySelectorAll('path').forEach(p => p.remove());

  const merged = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
  merged.setAttribute('d', paths.join(' '));
  svgEl.appendChild(merged);

  return serializeSvg(doc);
});

const getSymbolSVG = computed(() => {
  if (!svg.code || !svg.isValidSVG) return '';

  const parsed = parseSvg(svg.code);
  if (!parsed) return '';

  const { doc, svgEl } = parsed;

  const symbol = doc.createElementNS(svgEl.namespaceURI, 'symbol');
  symbol.setAttribute('id', 'symbol-id');

  [...svgEl.attributes].forEach(attr => {
    if (!['width', 'height', 'xmlns'].includes(attr.name)) {
      symbol.setAttribute(attr.name, attr.value);
    }
  });

  symbol.innerHTML = svgEl.innerHTML;
  return symbol.outerHTML;
});

const getSymbolUseSVG = computed(() => `
<svg class="icon">
  <use xlink:href="#symbol-id"></use>
</svg>
`.trim());

/* ---------------- FILL COLOR PICKER ---------------- */

const getSvgPaintColor = (svgCode) => {
  const parsed = parseSvg(svgCode);
  if (!parsed) return null;

  const { svgEl } = parsed;

  // 1. <svg fill="">
  const svgFill = svgEl.getAttribute('fill');
  if (svgFill && svgFill !== 'none') {
    return svgFill;
  }

  // 2. descendant fill
  const fillEl = svgEl.querySelector('[fill]:not([fill="none"])');
  if (fillEl) {
    return fillEl.getAttribute('fill');
  }

  // 3. <svg stroke="">
  const svgStroke = svgEl.getAttribute('stroke');
  if (svgStroke && svgStroke !== 'none') {
    return svgStroke;
  }

  // 4. descendant stroke
  const strokeEl = svgEl.querySelector('[stroke]:not([stroke="none"])');
  if (strokeEl) {
    return strokeEl.getAttribute('stroke');
  }

  return null;
};


const getFillColor = computed(() => {
  if (!svg.code || !svg.isValidSVG) {
    return '#000000';
  }

  const color = getSvgPaintColor(svg.code);

  console.log('color', color);

  // currentColor → fallback for picker
  if (!color || color === 'currentColor') {
    return '#000000';
  }

  // Normalize HEX
  if (/^#([a-fA-F0-9]{3})$/.test(color)) {
    return (
      '#' +
      color
        .slice(1)
        .split('')
        .map(c => c + c)
        .join('')
    ).toUpperCase();
  }

  if (/^#([a-fA-F0-9]{6})$/.test(color)) {
    return color.toUpperCase();
  }

  // Named colors / rgb / others → let browser normalize ONCE
  const tmp = document.createElement('div');
  tmp.style.color = color;
  document.body.appendChild(tmp);

  const computed = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);

  const rgb = computed.match(/\d+/g);
  if (!rgb) return '#000000';

  return (
    '#' +
    rgb
      .slice(0, 3)
      .map(n => (+n).toString(16).padStart(2, '0'))
      .join('')
  ).toUpperCase();
});

/* ---------------- DOWNLOAD ---------------- */

const downloadImage = () => {
  if (!svg.code || !svg.isValidSVG) return;

  let format = svg.downloadFormat.toLowerCase();
  const width = svg.width || 512;
  const height = svg.height || 512;

  let svgCode = svg.code;

  if (!svgCode.includes('xmlns')) {
    svgCode = svgCode.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  if (format === 'svg') {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    triggerDownload(URL.createObjectURL(blob), 'image.svg');
    return;
  }

  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}`;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    canvas.getContext('2d').drawImage(img, 0, 0, width, height);

    canvas.toBlob(blob => {
      triggerDownload(URL.createObjectURL(blob), `image.${format}`);
    }, `image/${format === 'jpg' ? 'jpeg' : format}`);
  };
};

const triggerDownload = (url, name) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};
</script>