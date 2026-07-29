import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DiagnosisResponse, Lead } from "../types";

export const pdfService = {
  async generateReport(elementId: string, lead: Lead, diagnosis: DiagnosisResponse) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    // Small delay to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#0A0A0A",
      onclone: (clonedDoc) => {
        // Remove modern CSS rules that html2canvas can't parse
        const styleSheets = clonedDoc.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
          try {
            const sheet = styleSheets[i];
            const rules = sheet.cssRules || sheet.rules;
            if (!rules) continue;
            for (let j = rules.length - 1; j >= 0; j--) {
              const rule = rules[j];
              if (rule.cssText.includes('oklab') || rule.cssText.includes('oklch')) {
                sheet.deleteRule(j);
              }
            }
          } catch (e) {
            // Cross-origin stylesheets might throw security errors
          }
        }

        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          :root {
            --tw-ring-color: rgba(212, 175, 119, 0.5) !important;
            --tw-ring-offset-color: #0A0A0A !important;
            --tw-shadow: 0 0 #0000 !important;
          }
          .bg-gold { background-color: #D4AF77 !important; }
          .text-gold { color: #D4AF77 !important; }
          .bg-vertus-black, .bg-vix-black { background-color: #0A0A0A !important; }
          .bg-vertus-gray, .bg-vix-gray { background-color: #121212 !important; }
          /* Hide locked overlay in PDF */
          .backdrop-blur-md { display: none !important; }
          .z-20 { display: none !important; }
          /* Fix for potential rendering issues */
          img { max-width: 100% !important; height: auto !important; }
        `;
        clonedDoc.head.appendChild(style);

        const elements = clonedDoc.getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          
          // Force fallback for oklab/oklch in inline styles
          const propertiesToFix = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'outlineColor'];
          
          propertiesToFix.forEach(prop => {
            const inlineValue = el.style.getPropertyValue(prop);
            if (inlineValue && (inlineValue.includes('oklab') || inlineValue.includes('oklch'))) {
              if (prop === 'backgroundColor') el.style.setProperty(prop, '#121212', 'important');
              else if (prop === 'color') el.style.setProperty(prop, '#FFFFFF', 'important');
              else el.style.setProperty(prop, '#D4AF77', 'important');
            }
          });

          // Fix box-shadow
          if (el.style.boxShadow && (el.style.boxShadow.includes('oklab') || el.style.boxShadow.includes('oklch'))) {
            el.style.boxShadow = 'none';
          }
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Raio-X_VERTUS_${lead.companyName.replace(/\s+/g, "_")}.pdf`);
  }
};
