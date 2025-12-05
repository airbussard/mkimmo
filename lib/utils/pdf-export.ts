/**
 * PDF-Export Utility für Rechner
 *
 * Generiert professionelle PDFs mit Firmenbranding für alle Rechner.
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { COMPANY_INFO } from '@/config/navigation'

// ==================== INTERFACES ====================

export interface PDFEingabe {
  label: string
  wert: string
}

export interface PDFErgebnis {
  label: string
  wert: string
  hervorgehoben?: boolean
}

export interface PDFExportOptions {
  titel: string
  untertitel?: string
  eingaben: PDFEingabe[]
  ergebnisse: PDFErgebnis[]
  chartElement?: HTMLElement | null
  tabelle?: {
    headers: string[]
    rows: string[][]
    titel?: string
  }
}

// ==================== KONSTANTEN ====================

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#64748b',
  border: '#e2e8f0',
  background: '#f8fafc',
  text: '#1e293b',
  lightText: '#64748b',
}

const MARGINS = {
  left: 20,
  right: 20,
  top: 20,
}

const PAGE_WIDTH = 210 // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right

// ==================== HELPER FUNCTIONS ====================

function formatDatum(): string {
  return new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ==================== MAIN EXPORT FUNCTION ====================

export async function exportRechnerToPDF(options: PDFExportOptions): Promise<void> {
  const { titel, untertitel, eingaben, ergebnisse, chartElement, tabelle } = options

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  let yPos = MARGINS.top

  // ========== HEADER MIT LOGO ==========
  try {
    // Logo laden
    const logoImg = new Image()
    logoImg.crossOrigin = 'anonymous'

    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => resolve()
      logoImg.onerror = () => reject(new Error('Logo konnte nicht geladen werden'))
      logoImg.src = '/images/Logo MK Immobilien.png'
    })

    // Logo einfügen (proportional skaliert)
    const logoHeight = 15
    const logoWidth = (logoImg.width / logoImg.height) * logoHeight
    pdf.addImage(logoImg, 'PNG', MARGINS.left, yPos, logoWidth, logoHeight)
    yPos += logoHeight + 5
  } catch {
    // Fallback: Nur Firmenname als Text
    pdf.setFontSize(16)
    pdf.setTextColor(COLORS.primary)
    pdf.setFont('helvetica', 'bold')
    pdf.text(COMPANY_INFO.name, MARGINS.left, yPos + 8)
    yPos += 15
  }

  // Trennlinie
  pdf.setDrawColor(COLORS.primary)
  pdf.setLineWidth(0.5)
  pdf.line(MARGINS.left, yPos, PAGE_WIDTH - MARGINS.right, yPos)
  yPos += 10

  // ========== TITEL ==========
  pdf.setFontSize(18)
  pdf.setTextColor(COLORS.primary)
  pdf.setFont('helvetica', 'bold')
  pdf.text(titel, MARGINS.left, yPos)
  yPos += 8

  if (untertitel) {
    pdf.setFontSize(11)
    pdf.setTextColor(COLORS.secondary)
    pdf.setFont('helvetica', 'normal')
    pdf.text(untertitel, MARGINS.left, yPos)
    yPos += 6
  }

  // Datum
  pdf.setFontSize(9)
  pdf.setTextColor(COLORS.lightText)
  pdf.text(`Erstellt am: ${formatDatum()}`, MARGINS.left, yPos)
  yPos += 12

  // ========== EINGABEN ==========
  pdf.setFontSize(12)
  pdf.setTextColor(COLORS.primary)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Ihre Eingaben', MARGINS.left, yPos)
  yPos += 6

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(COLORS.text)

  for (const eingabe of eingaben) {
    const labelWidth = 80
    pdf.text(eingabe.label + ':', MARGINS.left, yPos)
    pdf.text(eingabe.wert, MARGINS.left + labelWidth, yPos)
    yPos += 5
  }

  yPos += 8

  // ========== ERGEBNISSE ==========
  pdf.setFontSize(12)
  pdf.setTextColor(COLORS.primary)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Ergebnisse', MARGINS.left, yPos)
  yPos += 6

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  for (const ergebnis of ergebnisse) {
    if (ergebnis.hervorgehoben) {
      // Hervorgehobene Ergebnisse mit Hintergrund
      pdf.setFillColor(COLORS.background)
      pdf.rect(MARGINS.left - 2, yPos - 4, CONTENT_WIDTH + 4, 7, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(COLORS.primary)
    } else {
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(COLORS.text)
    }

    const labelWidth = 80
    pdf.text(ergebnis.label + ':', MARGINS.left, yPos)
    pdf.text(ergebnis.wert, MARGINS.left + labelWidth, yPos)
    yPos += 6
  }

  yPos += 8

  // ========== CHART (falls vorhanden) ==========
  if (chartElement) {
    // Prüfen ob genug Platz, sonst neue Seite
    if (yPos > 180) {
      pdf.addPage()
      yPos = MARGINS.top
    }

    pdf.setFontSize(12)
    pdf.setTextColor(COLORS.primary)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Grafische Darstellung', MARGINS.left, yPos)
    yPos += 8

    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = CONTENT_WIDTH
      const imgHeight = (canvas.height / canvas.width) * imgWidth

      // Prüfen ob Chart auf Seite passt
      if (yPos + imgHeight > 270) {
        pdf.addPage()
        yPos = MARGINS.top
      }

      pdf.addImage(imgData, 'PNG', MARGINS.left, yPos, imgWidth, imgHeight)
      yPos += imgHeight + 10
    } catch (error) {
      console.error('Chart konnte nicht gerendert werden:', error)
    }
  }

  // ========== TABELLE (falls vorhanden) ==========
  if (tabelle && tabelle.rows.length > 0) {
    // Prüfen ob genug Platz, sonst neue Seite
    if (yPos > 200) {
      pdf.addPage()
      yPos = MARGINS.top
    }

    if (tabelle.titel) {
      pdf.setFontSize(12)
      pdf.setTextColor(COLORS.primary)
      pdf.setFont('helvetica', 'bold')
      pdf.text(tabelle.titel, MARGINS.left, yPos)
      yPos += 8
    }

    // Tabellen-Header
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(COLORS.text)
    pdf.setFillColor(COLORS.background)
    pdf.rect(MARGINS.left, yPos - 3, CONTENT_WIDTH, 6, 'F')

    const colWidth = CONTENT_WIDTH / tabelle.headers.length
    tabelle.headers.forEach((header, i) => {
      pdf.text(header, MARGINS.left + i * colWidth + 2, yPos)
    })
    yPos += 5

    // Tabellen-Zeilen (max 20 Zeilen im PDF)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    const maxRows = Math.min(tabelle.rows.length, 20)

    for (let i = 0; i < maxRows; i++) {
      const row = tabelle.rows[i]

      // Abwechselnde Hintergrundfarbe
      if (i % 2 === 1) {
        pdf.setFillColor('#f9fafb')
        pdf.rect(MARGINS.left, yPos - 3, CONTENT_WIDTH, 5, 'F')
      }

      row.forEach((cell, j) => {
        pdf.text(String(cell), MARGINS.left + j * colWidth + 2, yPos)
      })
      yPos += 4

      // Neue Seite wenn nötig
      if (yPos > 265) {
        pdf.addPage()
        yPos = MARGINS.top
      }
    }

    if (tabelle.rows.length > maxRows) {
      yPos += 3
      pdf.setFontSize(8)
      pdf.setTextColor(COLORS.lightText)
      pdf.text(`... und ${tabelle.rows.length - maxRows} weitere Zeilen`, MARGINS.left, yPos)
    }
  }

  // ========== FOOTER ==========
  const pageCount = pdf.getNumberOfPages()

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)

    const footerY = 280

    // Trennlinie
    pdf.setDrawColor(COLORS.border)
    pdf.setLineWidth(0.3)
    pdf.line(MARGINS.left, footerY - 8, PAGE_WIDTH - MARGINS.right, footerY - 8)

    // Firmeninformationen
    pdf.setFontSize(8)
    pdf.setTextColor(COLORS.secondary)
    pdf.setFont('helvetica', 'normal')

    const footerText = `${COMPANY_INFO.name} | ${COMPANY_INFO.strasse}, ${COMPANY_INFO.plz} ${COMPANY_INFO.ort} | Tel: ${COMPANY_INFO.telefon} | ${COMPANY_INFO.email}`
    pdf.text(footerText, PAGE_WIDTH / 2, footerY - 3, { align: 'center' })

    // Hinweis
    pdf.setFontSize(7)
    pdf.setTextColor(COLORS.lightText)
    pdf.text(
      'Diese Berechnung dient nur zur Orientierung und ersetzt keine professionelle Beratung.',
      PAGE_WIDTH / 2,
      footerY + 2,
      { align: 'center' }
    )

    // Seitenzahl
    pdf.text(`Seite ${i} von ${pageCount}`, PAGE_WIDTH - MARGINS.right, footerY + 2, { align: 'right' })
  }

  // ========== PDF SPEICHERN ==========
  const filename = `${titel.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(filename)
}

// ==================== WÄHRUNGS-FORMATTER ====================

export function formatWaehrungFuerPDF(betrag: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(betrag)
}

export function formatProzentFuerPDF(wert: number, nachkommastellen: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen,
  }).format(wert) + ' %'
}
