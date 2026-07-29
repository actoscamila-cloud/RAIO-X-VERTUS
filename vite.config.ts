import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

function oklabToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 0.1291980507 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const transfer = (c: number) => {
    if (c <= 0) return 0;
    if (c >= 1) return 1;
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const red = Math.min(255, Math.max(0, Math.round(transfer(r_lin) * 255)));
  const green = Math.min(255, Math.max(0, Math.round(transfer(g_lin) * 255)));
  const blue = Math.min(255, Math.max(0, Math.round(transfer(b_lin) * 255)));

  if (alpha < 0.999) {
    return `rgba(${red}, ${green}, ${blue}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${red}, ${green}, ${blue})`;
}

function oklchToRgb(lStr: string, cStr: string, hStr: string, alphaStr?: string): string {
  let L = parseFloat(lStr);
  if (lStr.includes('%')) L /= 100;

  const C = parseFloat(cStr);
  const H = parseFloat(hStr) || 0;

  let alpha = 1;
  if (alphaStr) {
    let aVal = alphaStr.trim();
    if (aVal.startsWith('/')) aVal = aVal.substring(1).trim();
    if (aVal.includes('%')) alpha = parseFloat(aVal) / 100;
    else alpha = parseFloat(aVal);
  }

  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  return oklabToRgb(L, a, b, alpha);
}

function convertOklabCss(cssText: string): string {
  if (!cssText || (!cssText.includes('oklch') && !cssText.includes('oklab'))) {
    return cssText;
  }

  let result = cssText.replace(/oklch\(\s*([^,\s/]+)\s+([^,\s/]+)\s+([^,\s/]+)(?:\s*(?:\/|,)\s*([^)]+))?\s*\)/gi,
    (_, l, c, h, a) => oklchToRgb(l, c, h, a)
  );

  result = result.replace(/oklab\(\s*([^,\s/]+)\s+([^,\s/]+)\s+([^,\s/]+)(?:\s*(?:\/|,)\s*([^)]+))?\s*\)/gi,
    (_, l, a, b, alpha) => {
      let L = parseFloat(l);
      if (l.includes('%')) L /= 100;
      const A = parseFloat(a);
      const B = parseFloat(b);
      let al = 1;
      if (alpha) {
        let aVal = alpha.trim();
        if (aVal.startsWith('/')) aVal = aVal.substring(1).trim();
        if (aVal.includes('%')) al = parseFloat(aVal) / 100;
        else al = parseFloat(aVal);
      }
      return oklabToRgb(L, A, B, al);
    }
  );

  return result;
}

function convertOklabPlugin(): Plugin {
  return {
    name: 'convert-oklab-plugin',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('.css') || id.includes('css')) {
        return {
          code: convertOklabCss(code),
          map: null,
        };
      }
    },
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'asset' && fileName.endsWith('.css')) {
          const sourceText = typeof chunk.source === 'string'
            ? chunk.source
            : new TextDecoder().decode(chunk.source);
          const converted = convertOklabCss(sourceText);
          chunk.source = typeof chunk.source === 'string'
            ? converted
            : new TextEncoder().encode(converted);
        }
      }
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    build: {
      cssTarget: 'chrome90',
    },
    plugins: [react(), tailwindcss(), convertOklabPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
