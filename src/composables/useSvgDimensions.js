import { watch } from 'vue';

export function useSvgDimensions(svg) {
  const parseSvg = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg.code, 'image/svg+xml');
    const svgEl = doc.documentElement;

    if (svgEl.tagName.toLowerCase() !== 'svg') {
      return null;
    }

    return { doc, svgEl };
  };

  const serialize = (doc) => {
    svg.code = doc.documentElement.outerHTML;
  };

  const syncViewBox = (svgEl, width, height) => {
    if (!svgEl.hasAttribute('viewBox')) {
      svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  };

  const updateDimensions = () => {
    if (!svg.code) return;

    const parsed = parseSvg();
    if (!parsed) return;

    const { doc, svgEl } = parsed;

    let width = svg.width ? String(svg.width) : null;
    let height = svg.height ? String(svg.height) : null;

    // Aspect ratio sync
    if (svg.aspectRatio && width) {
      height = width;
      svg.height = width;
    }

    if (width) svgEl.setAttribute('width', width);
    else svgEl.removeAttribute('width');

    if (height) svgEl.setAttribute('height', height);
    else svgEl.removeAttribute('height');

    if (width && height) {
      syncViewBox(svgEl, width, height);
    }

    serialize(doc);
  };

  const readDimensionsFromSvg = () => {
    const parsed = parseSvg();
    if (!parsed) return;

    const { svgEl } = parsed;

    svg.width = svgEl.getAttribute('width');
    svg.height = svgEl.getAttribute('height');
  };

  watch(() => svg.code, readDimensionsFromSvg);
  watch(() => [svg.width, svg.height, svg.aspectRatio], updateDimensions);
}
