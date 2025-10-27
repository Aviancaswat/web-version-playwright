import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import logoAV from "../assets/avianca-logo-desk.png";

export async function createPDF(text: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('Respuesta agente chat-APA', {
        x: 50,
        y: height - 50,
        size: 18,
        font,
        color: rgb(0.2, 0.2, 0.7),
    });

    const pngImageBytes = await fetch(logoAV).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = 480;
    const logoY = height - 70;

    page.drawRectangle({
        x: logoX - 5,    
        y: logoY - 5,
        width: logoWidth + 10,
        height: logoHeight + 10,
        color: rgb(0, 0, 0),
    });

    page.drawImage(pngImage, {
        x: logoX,
        y: logoY,
        width: logoWidth,
        height: logoHeight,
    });

    page.drawText(text, {
        x: 50,
        y: height - 120,
        size: 12,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
}