import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates an ISO/IEC 7810 ID-1 standard sized PDF (85.60 mm × 53.98 mm).
 * Uses high-scale rasterization (scale: 3 for ~300 DPI) for print-ready quality.
 *
 * @param {HTMLElement} element - The DOM element containing the card
 * @param {string} filename - The output PDF file name
 */
export async function generateIDCardPDF(element, filename = 'CampusPass-ID-Card.pdf') {
  if (!element) {
    throw new Error('Target element for PDF generation was not found.');
  }

  // ISO ID-1 dimensions in millimeters
  const cardWidthMM = 85.6;
  const cardHeightMM = 53.98;

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // 300 DPI equivalent for crisp text and QR lines
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Initialize landscape jsPDF with exact ID-1 card dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidthMM, cardHeightMM],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, cardWidthMM, cardHeightMM, undefined, 'FAST');
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

