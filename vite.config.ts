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

const COLOR_MAP: Record<string, [number, number, number]> = {
  'var(--color-gold)': [212, 175, 119],
  'var(--color-gold-light)': [232, 185, 35],
  'var(--color-gold-dark)': [184, 134, 11],
  'var(--color-vertus-black)': [10, 10, 10],
  'var(--color-vertus-gray)': [18, 18, 18],
  'var(--color-vertus-gold-yellow)': [245, 197, 24],
  'var(--color-vix-black)': [10, 10, 10],
  'var(--color-vix-gray)': [18, 18, 18],
  'var(--color-vix-gold-yellow)': [245, 197, 24],
  'var(--color-white)': [255, 255, 255],
  'var(--color-black)': [0, 0, 0],
  'var(--color-red-500)': [239, 68, 68],
  'var(--color-green-500)': [34, 197, 94],
  'var(--color-amber-500)': [245, 158, 11],
  'var(--color-amber-50)': [255, 251, 235],
  'var(--color-emerald-50)': [236, 253, 245],
  'var(--color-emerald-500)': [16, 185, 129],
  'var(--color-rose-50)': [255, 241, 242],
  'var(--color-slate-50)': [248, 250, 252],
  'var(--color-slate-100)': [241, 245, 249],
  'var(--color-slate-200)': [226, 232, 240],
  'var(--color-slate-700)': [51, 65, 85],
  'var(--color-slate-800)': [30, 41, 59],
  'var(--color-slate-900)': [15, 23, 42],
  'var(--color-slate-950)': [2, 6, 23],
  'var(--color-teal-50)': [240, 253, 250],
  'var(--color-teal-100)': [204, 251, 241],
  'var(--color-teal-200)': [153, 246, 228],
  'var(--color-teal-500)': [20, 184, 166],
  'var(--color-teal-900)': [19, 78, 74],
  'var(--color-yellow-500)': [234, 179, 8],
  'white': [255, 255, 255],
  'black': [0, 0, 0],
  'red': [255, 0, 0],
};

function parseColorToRgba(str: string): [number, number, number, number] | null {
  str = str.trim().toLowerCase();

  if (COLOR_MAP[str]) {
    const [r, g, b] = COLOR_MAP[str];
    return [r, g, b, 1];
  }

  if (str.startsWith('var(')) {
    const varMatch = str.match(/var\(\s*([^,\s)]+)(?:\s*,\s*([^)]+))?\s*\)/);
    if (varMatch) {
      const varName = varMatch[1].trim();
      if (COLOR_MAP[varName]) {
        const [r, g, b] = COLOR_MAP[varName];
        return [r, g, b, 1];
      }
      if (varMatch[2]) {
        return parseColorToRgba(varMatch[2].trim());
      }
    }
  }

  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r, g, b, 1];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b, 1];
    }
  }

  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return [r, g, b, a];
  }

  if (str === 'currentcolor') {
    return [255, 255, 255, 1];
  }

  if (str === 'transparent') {
    return [0, 0, 0, 0];
  }

  return null;
}

function splitTopLevelCommas(str: string): string[] {
  const parts: string[] = [];
  let current = "";
  let parenCount = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") parenCount++;
    else if (char === ")") parenCount--;
    if (char === "," && parenCount === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function resolveSingleColorMix(fullCall: string): string {
  if (fullCall.includes('red,red') || fullCall.includes('red, red')) {
    return 'rgb(255, 0, 0)';
  }

  const innerMatch = fullCall.match(/color-mix\s*\(\s*in\s+[a-z]+\s*,\s*(.+)\s*\)/i);
  if (!innerMatch) return fullCall;

  let body = innerMatch[1].trim();
  if (body.endsWith(')')) {
    body = body.slice(0, -1).trim();
  }

  const parts = splitTopLevelCommas(body);
  if (parts.length < 2) return fullCall;

  let colorStr = '';
  let percent = 100;

  const p0Match = parts[0].match(/^(.*?)\s+([\d.]+)%$/);
  const p1Match = parts[1].match(/^(.*?)\s+([\d.]+)%$/);

  if (p0Match && parts[1].toLowerCase().includes('transparent')) {
    colorStr = p0Match[1].trim();
    percent = parseFloat(p0Match[2]);
  } else if (p1Match && parts[0].toLowerCase().includes('transparent')) {
    colorStr = p1Match[1].trim();
    percent = parseFloat(p1Match[2]);
  } else if (parts[1].toLowerCase().includes('transparent')) {
    colorStr = parts[0];
    percent = 100;
  } else if (parts[0].toLowerCase().includes('transparent')) {
    colorStr = parts[1];
    percent = 100;
  } else {
    colorStr = parts[0].replace(/\s+[\d.]+%$/, '');
  }

  const rgba = parseColorToRgba(colorStr);
  if (!rgba) {
    return fullCall;
  }

  const [r, g, b, baseAlpha] = rgba;
  const finalAlpha = Number((baseAlpha * (percent / 100)).toFixed(3));

  if (finalAlpha >= 0.999) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
}

function convertOklabCss(cssText: string): string {
  if (!cssText) return cssText;

  if (cssText.includes('oklch') || cssText.includes('oklab')) {
    cssText = cssText.replace(/oklch\(\s*([^,\s/]+)\s+([^,\s/]+)\s+([^,\s/]+)(?:\s*(?:\/|,)\s*([^)]+))?\s*\)/gi,
      (_, l, c, h, a) => oklchToRgb(l, c, h, a)
    );

    cssText = cssText.replace(/oklab\(\s*([^,\s/]+)\s+([^,\s/]+)\s+([^,\s/]+)(?:\s*(?:\/|,)\s*([^)]+))?\s*\)/gi,
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
  }

  let pass = 0;
  while (cssText.includes('color-mix') && pass < 5) {
    pass++;
    const regex = /color-mix\s*\(/gi;
    let match: RegExpExecArray | null;
    const occurrences: number[] = [];
    while ((match = regex.exec(cssText)) !== null) {
      occurrences.push(match.index);
    }

    for (let i = occurrences.length - 1; i >= 0; i--) {
      const startIndex = occurrences[i];
      let parenCount = 1;
      const openParenIndex = cssText.indexOf('(', startIndex);
      let curr = openParenIndex + 1;
      while (curr < cssText.length && parenCount > 0) {
        if (cssText[curr] === '(') parenCount++;
        else if (cssText[curr] === ')') parenCount--;
        curr++;
      }
      const fullFuncCall = cssText.slice(startIndex, curr);
      const replacement = resolveSingleColorMix(fullFuncCall);
      cssText = cssText.slice(0, startIndex) + replacement + cssText.slice(curr);
    }
  }

  return cssText;
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
