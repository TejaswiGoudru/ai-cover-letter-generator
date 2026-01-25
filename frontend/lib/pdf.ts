import jsPDF from "jspdf";

export function downloadPDF(content: string, fileName: string = "Cover_Letter.pdf") {
    // Basic HTML to plain text conversion to preserve structure in PDF
    const plainText = content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '') // Strip remaining tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();

    const doc = new jsPDF();

    // PDF Settings
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);

    // Split text into lines that fit the width
    const splitText = doc.splitTextToSize(plainText, contentWidth);

    // Add text to document
    doc.text(splitText, margin, margin + 10);

    // Save the PDF
    doc.save(fileName);
}
