import jsPDF from "jspdf";

export function downloadPDF(content: string, fileName: string = "Cover_Letter.pdf") {
    const doc = new jsPDF();

    // PDF Settings
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);

    // Split text into lines that fit the width
    const splitText = doc.splitTextToSize(content, contentWidth);

    // Add text to document
    doc.text(splitText, margin, margin + 10);

    // Save the PDF
    doc.save(fileName);
}
