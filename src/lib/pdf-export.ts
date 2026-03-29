import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportOptions {
  title: string;
  subtitle?: string;
  columns: { header: string; dataKey: string }[];
  data: Record<string, unknown>[];
  fileName?: string;
}

export function exportToPDF({
  title,
  subtitle,
  columns,
  data,
  fileName,
}: ExportOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.setTextColor(30, 30, 60);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 120);
    doc.text(subtitle, pageWidth / 2, 28, { align: "center" });
  }

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 35, {
    align: "center",
  });

  autoTable(doc, {
    startY: 42,
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => String(row[c.dataKey] ?? ""))),
    headStyles: {
      fillColor: [99, 69, 205],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
    styles: { cellPadding: 4, overflow: "linebreak" },
  });

  const name = fileName ?? `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(name);
}

export function exportUserReport(
  users: Record<string, unknown>[],
  fileName?: string
) {
  exportToPDF({
    title: "EduBridge User Report",
    subtitle: `Total Users: ${users.length}`,
    columns: [
      { header: "Name", dataKey: "full_name" },
      { header: "Email", dataKey: "email" },
      { header: "University", dataKey: "university" },
      { header: "Role", dataKey: "role" },
      { header: "Status", dataKey: "status" },
      { header: "Joined", dataKey: "created_at" },
    ],
    data: users,
    fileName,
  });
}

export function exportTranslationsReport(
  translations: Record<string, unknown>[],
  fileName?: string
) {
  exportToPDF({
    title: "EduBridge Translations Report",
    subtitle: `Total Entries: ${translations.length}`,
    columns: [
      { header: "Source (EN)", dataKey: "source_text" },
      { header: "Translation (SW)", dataKey: "translated_text" },
      { header: "Category", dataKey: "category" },
      { header: "Verified", dataKey: "is_verified" },
    ],
    data: translations,
    fileName,
  });
}

export function exportTransactionsReport(
  transactions: Record<string, unknown>[],
  fileName?: string
) {
  exportToPDF({
    title: "EduBridge Budget Report",
    subtitle: `Total Transactions: ${transactions.length}`,
    columns: [
      { header: "Date", dataKey: "date" },
      { header: "Type", dataKey: "type" },
      { header: "Category", dataKey: "category" },
      { header: "Amount (KES)", dataKey: "amount" },
      { header: "Description", dataKey: "description" },
    ],
    data: transactions,
    fileName,
  });
}
