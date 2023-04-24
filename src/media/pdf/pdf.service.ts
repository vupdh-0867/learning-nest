import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async drawPackingSlip(): Promise<Buffer> {
    const doc = new PDFDocument();
    this.drawSlipInformation(doc);
    this.drawOrderTable(doc);
    this.drawItemsTable(doc);

    const buffer = await new Promise<Buffer>((resolve, _reject) => {
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.end();
    });

    return buffer;
  }

  private drawSlipInformation(document: PDFDocument) {
    document
      .font('Times-Bold')
      .fontSize(16)
      .text('PACKING SLIP', { align: 'center' })
      .moveDown(2)
      .font('Times-Roman')
      .fontSize(12)
      .text('Date: June 13, 20XX', { align: 'right' })
      .moveDown(0.1)
      .text('INVOICE# 100', { align: 'right' })
      .font('Times-Bold')
      .text('Ship to', 60, 165)
      .text('Bill to', 335, 165);
    this.drawInformation(document, 140);
    this.drawInformation(document, 415);
  }

  private drawInformation(document: PDFDocument, position: number) {
    document
      .font('Times-Roman')
      .text('[Name]', position, 165)
      .text('[Company Name]', position, 180)
      .text('[Street Address]', position, 195)
      .text('[City, ST ZIP Code]', position, 210)
      .text('[Phone]', position, 225)
      .text('Customer ID [ABC12345]', position, 240);
  }

  private drawOrderTable(doc: PDFDocument) {
    doc
      .lineJoin('miter')
      .rect(30, 280, 180, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .rect(210, 280, 180, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .rect(390, 280, 180, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .rect(30, 300, 180, 20)
      .rect(210, 300, 180, 20)
      .rect(390, 300, 180, 20)
      .stroke()
      .fillColor('black')
      .font('Times-Bold')
      .text('Order Date', 90, 285)
      .text('Order Number', 260, 285)
      .text('Job', 465, 285);
  }

  private drawItemsTable(doc: PDFDocument) {
    doc
      .lineJoin('miter')
      .rect(30, 335, 180, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .rect(210, 335, 270, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .rect(480, 335, 90, 20)
      .fillAndStroke('#DBF7CA', 'black')
      .fillColor('black')
      .font('Times-Bold')
      .text('Items #', 35, 340)
      .text('Description', 215, 340)
      .text('Quantity', 485, 340);
    for (let i = 1; i <= 21; i++) {
      const height = 335 + i * 20;
      doc
        .rect(30, height, 180, 20)
        .rect(210, height, 270, 20)
        .rect(480, height, 90, 20);
    }
    doc.stroke();
  }
}
