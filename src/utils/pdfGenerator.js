import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export function generateReport(users, locationId) {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = format(now, 'MMMM d, yyyy');
  const timeStr = format(now, 'h:mm a');

  // ── Title ──
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Game Report — Location ${locationId}`, 14, 20);

  // ── Subtitle ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${dateStr}`, 14, 28);
  doc.text(`Total Players: ${users.length}`, 14, 34);

  const scored = users.filter((u) => u.score !== null && u.score !== undefined);
  if (scored.length > 0) {
    const avg = Math.round(scored.reduce((s, u) => s + u.score, 0) / scored.length);
    doc.text(`Average Score: ${avg}`, 14, 40);
  }

  // ── Table ──
  const sorted = [...users].sort((a, b) => {
    if (a.score == null && b.score == null) return 0;
    if (a.score == null) return 1;
    if (b.score == null) return -1;
    return b.score - a.score;
  });

  doc.autoTable({
    startY: 48,
    head: [['Rank', 'Name', 'Contact', 'Age', 'Score', 'Registered']],
    body: sorted.map((u, i) => [
      i + 1,
      u.name,
      u.contact,
      u.age,
      u.score != null ? u.score : '—',
      u.timestamp ? format(new Date(u.timestamp), 'h:mm a') : '—',
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  // ── Footer ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated: ${dateStr} at ${timeStr} | Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  const filename = `location-${locationId}-report-${format(now, 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}
