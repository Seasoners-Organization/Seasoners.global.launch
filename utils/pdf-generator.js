import jsPDF from 'jspdf';

/**
 * Generate PDF from signed agreement
 * Returns PDF as Blob for download or storage
 */
export function generateAgreementPDF(agreement) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

  // Helper to add text with word wrapping
  const addText = (text, fontSize = 11, isBold = false, color = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(...color);
    
    const lines = doc.splitTextToSize(text, contentWidth);
    
    // Check if we need a new page
    if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    lines.forEach((line) => {
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    
    return yPosition;
  };

  // Helper to add spacing
  const addSpace = (height = 8) => {
    yPosition += height;
  };

  // === HEADER ===
  doc.setFillColor(3, 105, 161); // Sky-700
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Stay Agreement', pageWidth / 2, 15, { align: 'center' });
  
  yPosition = 35;

  // === AGREEMENT DETAILS ===
  addText('Agreement Details', 14, true, [3, 105, 161]);
  addSpace(4);
  
  const location = agreement.listing.city 
    ? `${agreement.listing.city}, ${agreement.listing.region}` 
    : agreement.listing.location || agreement.listing.region;
  
  addText(`Property: ${agreement.listing.title}`, 11);
  addText(`Location: ${location}`, 11);
  
  if (agreement.startDate) {
    const startDate = new Date(agreement.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const endDate = agreement.endDate 
      ? new Date(agreement.endDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'TBD';
    addText(`Duration: ${startDate} - ${endDate}`, 11);
  }
  
  addSpace(6);

  // === PARTIES ===
  addText('Parties', 14, true, [3, 105, 161]);
  addSpace(4);
  
  addText(`Host: ${agreement.host.name}`, 11);
  addText(`Email: ${agreement.host.email}`, 11);
  addSpace(3);
  
  addText(`Guest: ${agreement.guest.name}`, 11);
  addText(`Email: ${agreement.guest.email}`, 11);
  addSpace(6);

  // === PREAMBLE ===
  addText('Preamble', 14, true, [3, 105, 161]);
  addSpace(4);
  
  addText(agreement.preamble, 11);
  addSpace(8);

  // === CLAUSES ===
  addText('Terms and Conditions', 14, true, [3, 105, 161]);
  addSpace(4);

  const clauses = Array.isArray(agreement.clauses) 
    ? agreement.clauses.sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  clauses.forEach((clause, index) => {
    addText(`${index + 1}. ${clause.title}`, 12, true);
    addSpace(3);
    addText(clause.content, 11);
    addSpace(6);
  });

  // === SIGNATURES ===
  addText('Signatures', 14, true, [3, 105, 161]);
  addSpace(4);

  const signatures = Array.isArray(agreement.signatures) ? agreement.signatures : [];
  
  signatures.forEach((sig) => {
    const signedDate = new Date(sig.signedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    addText(`Signed by: ${sig.name}`, 11, true);
    addText(`Date: ${signedDate}`, 10);
    addText(`IP Address: ${sig.ipAddress}`, 9, false, [100, 100, 100]);
    addSpace(5);
  });

  // === VERIFICATION HASH ===
  if (agreement.hash) {
    addSpace(8);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    addSpace(6);
    
    addText('Verification', 12, true, [3, 105, 161]);
    addSpace(4);
    
    addText('This agreement has been cryptographically hashed to ensure immutability:', 10);
    addSpace(3);
    
    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // Split hash into multiple lines for readability
    const hashChunks = agreement.hash.match(/.{1,64}/g) || [];
    hashChunks.forEach((chunk) => {
      doc.text(chunk, margin, yPosition);
      yPosition += 4;
    });
    
    addSpace(3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    addText('Any modification to this document will invalidate the hash.', 9, false, [100, 100, 100]);
  }

  // === FOOTER ===
  const finalizedDate = agreement.finalizedAt 
    ? new Date(agreement.finalizedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Pending';

  // Add footer to all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Finalized: ${finalizedDate} | Agreement ID: ${agreement.id}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
    
    // Add "Seasoners" branding
    doc.setFontSize(8);
    doc.text('Generated by Seasoners', margin, pageHeight - 10);
  }

  return doc;
}

/**
 * Download PDF to user's device
 */
export function downloadAgreementPDF(agreement) {
  const doc = generateAgreementPDF(agreement);
  const filename = `agreement-${agreement.listing.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${agreement.id.substring(0, 8)}.pdf`;
  doc.save(filename);
}

/**
 * Get PDF as blob for upload to S3 or email attachment
 */
export function getAgreementPDFBlob(agreement) {
  const doc = generateAgreementPDF(agreement);
  return doc.output('blob');
}

/**
 * Get PDF as base64 string for API transmission
 */
export function getAgreementPDFBase64(agreement) {
  const doc = generateAgreementPDF(agreement);
  return doc.output('dataurlstring');
}
