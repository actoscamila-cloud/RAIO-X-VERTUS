import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DiagnosisResponse, Lead } from "../types";

// Helper canvas context for native color conversion
let colorCanvas: HTMLCanvasElement | null = null;
let colorCtx: CanvasRenderingContext2D | null = null;

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

function fallbackOklchToRgb(str: string): string {
  if (!str) return "#D4AF77";

  if (str.toLowerCase().includes("color-mix")) {
    return "rgba(212, 175, 119, 0.2)";
  }

  // Match oklch(L C H / A)
  const oklchMatch = str.match(/oklch\(\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,]+)(?:\s*[\/,]\s*([^\s,)]+))?\s*\)/i);
  if (oklchMatch) {
    const [, lStr, cStr, hStr, aStr] = oklchMatch;
    let L = parseFloat(lStr);
    if (isNaN(L)) return "#D4AF77";
    if (lStr.includes('%')) L /= 100;
    const C = parseFloat(cStr);
    const H = parseFloat(hStr) || 0;
    let alpha = 1;
    if (aStr) {
      let aVal = aStr.trim();
      if (aVal.startsWith('/')) aVal = aVal.substring(1).trim();
      if (aVal.includes('%')) alpha = parseFloat(aVal) / 100;
      else alpha = parseFloat(aVal);
      if (isNaN(alpha)) alpha = 1;
    }
    if (isNaN(C)) return "#D4AF77";
    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);
    return oklabToRgb(L, a, b, alpha);
  }

  // Match oklab(L a b / alpha)
  const oklabMatch = str.match(/oklab\(\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,]+)(?:\s*[\/,]\s*([^\s,)]+))?\s*\)/i);
  if (oklabMatch) {
    const [, lStr, aStr, bStr, alphaStr] = oklabMatch;
    let L = parseFloat(lStr);
    if (isNaN(L)) return "#D4AF77";
    if (lStr.includes('%')) L /= 100;
    const A = parseFloat(aStr);
    const B = parseFloat(bStr);
    let alpha = 1;
    if (alphaStr) {
      let aVal = alphaStr.trim();
      if (aVal.startsWith('/')) aVal = aVal.substring(1).trim();
      if (aVal.includes('%')) alpha = parseFloat(aVal) / 100;
      else alpha = parseFloat(aVal);
      if (isNaN(alpha)) alpha = 1;
    }
    if (isNaN(A) || isNaN(B)) return "#D4AF77";
    return oklabToRgb(L, A, B, alpha);
  }

  return "#D4AF77";
}

function convertColorToRgb(colorStr: string): string {
  if (typeof document === "undefined") return "rgba(212, 175, 119, 0.5)";
  
  try {
    if (!colorCanvas) {
      colorCanvas = document.createElement("canvas");
      colorCanvas.width = 1;
      colorCanvas.height = 1;
      colorCtx = colorCanvas.getContext("2d");
    }
    if (colorCtx) {
      colorCtx.fillStyle = "#000000";
      colorCtx.fillStyle = colorStr;
      const computed = colorCtx.fillStyle;
      if (computed && computed !== "#000000") {
        return computed;
      }
    }
  } catch (e) {
    // Ignore canvas error
  }

  return fallbackOklchToRgb(colorStr);
}

function replaceUnsupportedColorFunctions(cssText: string): string {
  if (!cssText) return "";
  if (!cssText.includes("oklab") && !cssText.includes("oklch") && !cssText.includes("color-mix")) {
    return cssText;
  }

  const funcRegex = /(?:oklab|oklch|color-mix)\s*\(/gi;
  let match: RegExpExecArray | null;
  let result = "";
  let lastIndex = 0;

  while ((match = funcRegex.exec(cssText)) !== null) {
    const startIndex = match.index;
    result += cssText.slice(lastIndex, startIndex);

    let parenCount = 1;
    let curr = funcRegex.lastIndex;
    while (curr < cssText.length && parenCount > 0) {
      if (cssText[curr] === '(') parenCount++;
      else if (cssText[curr] === ')') parenCount--;
      curr++;
    }

    const fullFuncCall = cssText.slice(startIndex, curr);
    const converted = convertColorToRgb(fullFuncCall);
    result += converted;

    lastIndex = curr;
    funcRegex.lastIndex = curr;
  }

  result += cssText.slice(lastIndex);
  return result;
}

function sanitizeDocumentStyles(doc: Document) {
  const styleBackups: { element: Element; text: string }[] = [];
  const attrBackups: { element: Element; attr: string }[] = [];

  // 1. Sanitize <style> elements textContent
  const styleNodes = doc.querySelectorAll("style");
  styleNodes.forEach((styleNode) => {
    const text = styleNode.textContent;
    if (text && (text.includes("oklab") || text.includes("oklch") || text.includes("color-mix"))) {
      styleBackups.push({ element: styleNode, text });
      styleNode.textContent = replaceUnsupportedColorFunctions(text);
    }
  });

  // 2. Sanitize document.styleSheets CSS rules directly
  try {
    const sheets = doc.styleSheets;
    for (let s = 0; s < sheets.length; s++) {
      try {
        const sheet = sheets[s];
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;

        for (let r = rules.length - 1; r >= 0; r--) {
          const rule = rules[r];
          if (rule.cssText && (rule.cssText.includes("oklab") || rule.cssText.includes("oklch") || rule.cssText.includes("color-mix"))) {
            const sanitized = replaceUnsupportedColorFunctions(rule.cssText);
            try {
              sheet.deleteRule(r);
              sheet.insertRule(sanitized, r);
            } catch (e) {
              // If insertRule fails, modify rule styles directly if possible
              if ('style' in rule && (rule as CSSStyleRule).style) {
                const styleRule = rule as CSSStyleRule;
                for (let k = styleRule.style.length - 1; k >= 0; k--) {
                  const prop = styleRule.style[k];
                  const val = styleRule.style.getPropertyValue(prop);
                  if (val && (val.includes("oklab") || val.includes("oklch") || val.includes("color-mix"))) {
                    styleRule.style.setProperty(prop, convertColorToRgb(val));
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Ignore cross-origin sheet restriction
      }
    }
  } catch (e) {
    // Ignore sheet iteration error
  }

  // 3. Sanitize inline style attributes on all DOM elements
  const inlineStyleNodes = doc.querySelectorAll("*[style*='oklab'], *[style*='oklch'], *[style*='color-mix']");
  inlineStyleNodes.forEach((node) => {
    const attr = node.getAttribute("style");
    if (attr) {
      attrBackups.push({ element: node, attr });
      node.setAttribute("style", replaceUnsupportedColorFunctions(attr));
    }
  });

  return () => {
    styleBackups.forEach(({ element, text }) => {
      element.textContent = text;
    });
    attrBackups.forEach(({ element, attr }) => {
      element.setAttribute("style", attr);
    });
  };
}

export const pdfService = {
  async generateReport(elementId: string, lead: Lead, diagnosis: DiagnosisResponse) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      alert("Elemento do relatório não encontrado para exportação.");
      return;
    }

    // Small delay to ensure dynamic components are stable
    await new Promise(resolve => setTimeout(resolve, 300));

    // Pre-sanitize host document styles
    const restoreHostStyles = sanitizeDocumentStyles(document);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#0A0A0A",
        windowWidth: Math.max(element.scrollWidth, 1200),
        onclone: (clonedDoc) => {
          // Pre-sanitize cloned document styles as well
          sanitizeDocumentStyles(clonedDoc);

          // Remove backdrop filters and overlays that break canvas rendering
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .backdrop-blur-md, .backdrop-blur-lg, .backdrop-blur-sm, [class*="backdrop-blur"] {
              display: none !important;
            }
            .z-20 {
              display: none !important;
            }
            .overflow-y-auto, .overflow-hidden, .custom-scrollbar {
              max-height: none !important;
              overflow: visible !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Generate PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const safeCompanyName = (lead?.companyName || "Empresa")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_");

      pdf.save(`Raio-X_VERTUS_${safeCompanyName}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      restoreHostStyles();
    }
  }
};



