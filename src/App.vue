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
import {computed, reactive, watch} from 'vue';

import Hero from "@/components/Hero.vue";
import CodeBlock from "@/components/CodeBlock.vue";

const svg = reactive({
  code: '',
  fill: `currentColor`,
  preview: '',

  width: null,
  height: null,
  aspectRatio: false,
  downloadFormat: 'svg',

  isValidSVG: true,
})

// Watch for SVG code changes
watch(() => svg.code, (svgCodeValue) => {
  svgCodeValue = svgCodeValue.toString().trim();
  svg.isValidSVG = isValidSVG(svgCodeValue);

  if (!svg.isValidSVG) {
    // invalid SVG

    svg.fill = 'currentColor';
    svg.width = null;
    svg.height = null;

    return;
  }

  const fillMatches = [...svgCodeValue.matchAll(/\bfill=['"](#[0-9a-fA-F]{3,8}|[a-zA-Z]+|rgba?\([^)]*\))['"]/gmi)];
  const fillValue = fillMatches.map(m => m[1])[0];

  if (fillValue) {
    svg.fill = fillValue;
  }

  // Extract width and height attributes
  const widthMatch = svgCodeValue.match(/\bwidth=['"]([\d.]+)['"]/);
  const heightMatch = svgCodeValue.match(/\bheight=['"]([\d.]+)['"]/);

  svg.width = widthMatch?.[1] || null;
  svg.height = heightMatch?.[1] || null;
});

// Watch svg fill color
watch(() => svg.fill, (fillColor) => {
  svg.code = svg.code.toString().replace(/fill=['"](.*?)['"]/gmi, `fill="${fillColor}"`);
});

// Watch for width changes
watch(() => svg.width, (newWidth) => {
  const width = newWidth?.toString().trim() || null;
  let svgCode = svg.code.toString();

  if (width && svg.aspectRatio) {
    svg.height = width;
  }

  // Remove width & height if width is null
  if (!width) {
    svgCode = svgCode.replace(/\b width=['"][^'"]+['"]/gi, '');

    if (svg.aspectRatio) {
      svgCode = svgCode.replace(/\b height=['"][^'"]+['"]/gi, '');
    }

    svg.code = svgCode;
    return;
  }

  // Update or insert width
  svg.code = svgCode.includes('width=')
    ? svgCode.replace(/\bwidth=['"]\d+['"]/gi, `width="${width}"`)
    : svgCode.replace('<svg', `<svg width="${width}"`);
});

// Watch for height changes
watch(() => svg.height, (newHeight) => {
  const height = newHeight?.toString().trim() || null;
  let svgCode = svg.code.toString();

  // Remove height if null
  if (!height) {
    svg.code = svgCode.replace(/\bheight=['"][^'"]+['"]/gi, '');
    return;
  }

  const hasWidth = svgCode.includes('width=');
  const hasHeight = svgCode.includes('height=');

  // Update or set width value
  if (hasHeight) {
    svg.code = svgCode.replace(/height=['"]\d+['"]/gmi, `height="${height}"`);
  } else if (hasWidth) {
    svg.code = svgCode.replace(/width=['"](.*?)['"]/gmi, `width="$1" height="${height}"`);
  } else {
    svg.code = svgCode.replace('<svg', `<svg height="${height}"`);
  }
});

const minifySVG = () => {
  svg.code = svg.code.toString()
    .replace(/>\s+</g, '><')  // Remove spaces between HTML tags
    .replace(/\s{2,}/g, ' ')  // Replace multiple spaces with a single space
    .replace(/(.*?)><\/path>/gi, '$1/>') // end path tag
    .replace(/<!--.*?-->/gs, '')  // Remove HTML comments
    .trim();
}

const mergeSvgPaths = computed(() => {
  let all = [];

  return svg.code.toString()
    .replace(/<path[^>]*d="([^"]+)"[^>]*>/g, (_, d) => {
      all.push(d);
      return '';
    })
    .replace(/<\/svg>/, `<path d="${all.join(' ')}"/></svg>`);
});

const getSymbolSVG = computed(() => {
  return svg.code.toString()
    .replaceAll('<svg ', '<symbol id="symbol-id" ')
    .replaceAll('</svg>', '</symbol>');
});

const getSymbolUseSVG = computed(() => {
  return `
  <svg class="icon">
    <use xlink:href="#symbol-id"></use>
  </svg>`;
});

const getFillColor = computed(() => {
  const color = svg.fill.toString();

  // currentColor fill
  if (color === 'currentColor') {
    return '#000000';
  }

  // Handle short hex (e.g., #FFF -> #FFFFFF)
  if (/^#([a-fA-F0-9]){3}$/.test(color)) {
    return '#' + color.slice(1).split('').map(c => c + c).join('');
  }

  // Handle full hex (e.g., #FFFFFF)
  if (/^#([a-fA-F0-9]){6}$/.test(color)) {
    return color.toUpperCase();
  }

  // Handle named colors
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = color;
  const hex = ctx.fillStyle;
  if (/^#[a-fA-F0-9]{6}$/.test(hex)) {
    return hex.toUpperCase();
  }

  // Handle rgb formats (rgb(0,0,0) and variations)
  const rgbMatch = color.match(/^rgb\(?\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*\)?$/);
  if (rgbMatch) {
    return '#' + rgbMatch.slice(1, 4)
      .map(n => (+n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  return svg.fill;
})

const isValidSVG = (svgString) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const isParseError = doc.querySelector("parsererror");
    return !isParseError && doc.documentElement.tagName.toLowerCase() === "svg";
  } catch (error) {
    return false;
  }
}

const downloadImage = () => {
  let format = svg.downloadFormat.toString();
  let svgCode = svg.code.toString().trim();

  const width = svg.width || 512;
  const height = svg.height || 512;

  format = format.toLowerCase();

  // Ensure SVG has namespace
  if (!svgCode.includes('xmlns=')) {
    svgCode = svgCode.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Download directly if format is SVG
  if (format === 'svg') {
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    triggerDownload(url, `image.${format}`);
    return;
  }

  // Encode SVG to Data URL
  const encodedSvg = encodeURIComponent(svgCode).replace(/%20/g, ' ');
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

  // Create an Image element
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = dataUrl;

  img.onload = () => {
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Draw the SVG onto the canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Convert canvas to the specified format
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Error creating image blob.');
          return;
        }
        const imageUrl = URL.createObjectURL(blob);
        triggerDownload(imageUrl, `image.${format}`);
      },
      `image/${format === 'jpg' ? 'jpeg' : format}`,
      1.0 // Quality for lossy formats
    );
  };

  img.onerror = (error) => {
    console.error('Error loading SVG image.', error);
  };
}

// Helper function to trigger download
function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


</script>