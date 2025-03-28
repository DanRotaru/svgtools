<template>
  <div
    v-if="props.type === 'img'"
    class="icon-preview">
    <img :src="data" onerror="src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='" alt=" "/>
  </div>

  <code v-else class="code" v-html="data"/>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['svg', 'format', 'type']);

const codeFormat = (svg, format, returnType) => {
  // const originalSVG = svg;

  if (!svg.includes('<svg') && !svg.includes('<symbol')) {
    return;
  }

  // Add xmlns if is missing
  if (!svg.includes("xmlns=")) {
    svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  if (format === 'html') {
    svg = svg.replace(/(<g.*?>|<\/g\s*?>)/g, '')
  }

  // Replace all double quotes to single
  if (format !== 'html') {
    svg = svg.replace(/"/g, "\'");
  }

  // Remove new lines
  svg = svg.replace(/(\r\n|\n|\r)/gm, ' ');

  // Remove HTML comments
  svg = svg.replace(/<!--.*?-->/gs, '');

  // Remove whitespaces
  svg = svg.replace(/>\s{1,}</g, `><`);      // One of more spaces between groups or tags
  svg = svg.replace(/\s{2,}/g, ` `);

  // Encode svg
  if (format !== 'html') {
    svg = svg.replace(/>\s{1,}</g, `><`);
    svg = svg.replace(/\s{2,}/g, ` `);
    svg = svg.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
  }

  // Remove extra spaces
  svg = svg.trim();

  const formats = {
    // Urlencoded (default format)
    urlencoded: () => {
      return `<span class="str">${svg}</span>`;
    },

    urlencodedNoStyles: () => {
      return svg;
    },

    // Background-image format
    background: () => {
      svg = `background-image: url("data:image/svg+xml,${svg}");`;
      return svg.replace(/url\("(.*?)"\)/g, '<span class="func">url</span>(<span class="str">"$1"</span>)');
    },

    // Background-image url format
    dataImg: () => {
      return `<span class="str">data:image/svg+xml,${svg}</span>`;
    },

    // Background-image url format
    base64: () => {
      svg = window.btoa(decodeURIComponent(svg));
      return `<span class="str">data:image/svg+xml;base64,${svg}</span>`;
    },

    // Image tag format
    img: () => {
      svg = `&lt;img src="data:image/svg+xml,${svg}"/&gt;`;

      svg = svg.replace(/(\b[\w-]+)=("[^"]*"|'[^']*')/g,
        `<span class="attr">$1</span>=<span class="str">$2</span>`
      );

      return svg.replace('img', '<span class="tag">img</span>');
    },

    imgBase64: () => {
      svg = window.btoa(decodeURIComponent(svg));
      svg = `&lt;img src="data:image/svg+xml,${svg}"/&gt;`;

      svg = svg.replace(/(\b[\w-]+)=("[^"]*"|'[^']*')/g,
        `<span class="attr">$1</span>=<span class="str">$2</span>`
      );

      return svg.replace('img', '<span class="tag">img</span>');
    },

    // Remove all svg groups format
    html: () => {
      svg = svg.replaceAll('<', '&lt;');
      svg = svg.replaceAll('>', '&gt;');

      svg = svg.replace(/(\b[\w-]+)=("[^"]*"|'[^']*')/g,
        `<span class="attr">$1</span>=<span class="str">$2</span>`
      );

      svg = svg.replaceAll('xlink:', '<span class="attr">xlink:</span>');
      svg = svg.replaceAll('img', '<span class="tag">img</span>');
      svg = svg.replaceAll('path', '<span class="tag">path</span>');
      svg = svg.replaceAll('svg ', '<span class="tag">svg </span>');
      svg = svg.replaceAll('&lt;/svg', '&lt;/<span class="tag">svg</span>');
      svg = svg.replaceAll('symbol ', '<span class="tag">symbol </span>');
      svg = svg.replaceAll('&lt;/symbol', '&lt;/<span class="tag">symbol</span>');

      svg = svg.replaceAll('use ', '<span class="tag">use </span>');
      svg = svg.replaceAll('&lt;/use', '&lt;/<span class="tag">use</span>');

      return svg;
    }
  }

  svg = formats[format || 'urlencoded']();

  if (returnType === 'img') {
    return `data:image/svg+xml,${svg}`;
  }

  if (returnType === 'base64') {
    return `data:image/svg+xml,${window.btoa(svg)}`;
  }

  return svg;
}

const data = computed(() => codeFormat(props.svg, props.format, props.type));
</script>

<style lang="scss">
.code {
  word-wrap: break-word;
  user-select: all;
  display: block;
  overflow-x: auto;
  padding: 16px;
  width: 100%;
  min-height: 120px;
  font: 400 15px/normal "Jetbrains Mono NL", Consolas, monospace;
  outline: none;
  resize: none;
  white-space: break-spaces;
  border-radius: 5px;
  border: 1px solid rgba(55, 65, 81, 0.5);
  color: #abb2bf;
  background-color: #242a3f;
  transition: 0.2s ease;
  transition-property: box-shadow, background-color;

  &:hover {
    background-color: #252b41
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px #7ad4a0;
  }

  &:focus {
    //box-shadow: 0 0 0 2px #7ad4a0;
    box-shadow: 0 0 0 1px #585f79;
  }

  &--main {
    min-height: 163px;
    resize: vertical;
    color: #f8f8f8;
  }

  .attr {
    color: #d19a66;
  }

  .str {
    color: #98c379;
  }

  .tag {
    color: #e06c75;
  }

  .func {
    color: #61aeee;
  }
}
</style>