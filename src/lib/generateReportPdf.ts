import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { IOrder } from "@/shared";
import { supabase } from "@/lib/supabase";

export type ReportPeriod = "daily" | "weekly" | "monthly";

const CORAL: [number, number, number] = [220, 80, 60];
const CORAL_DARK: [number, number, number] = [180, 55, 40];
const GRAY_BG: [number, number, number] = [248, 248, 248];
const GRAY_LINE: [number, number, number] = [220, 220, 220];

function getPeriodRange(period: ReportPeriod): { start: Date; end: Date; label: string; title: string } {
  const now = new Date();

  if (period === "daily") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return {
      start, end,
      title: "Daily Report",
      label: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    };
  }

  if (period === "weekly") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      start, end,
      title: "Weekly Report",
      label: `${fmt(start)} – ${fmt(end)}, ${now.getFullYear()}`,
    };
  }

  // monthly
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return {
    start, end,
    title: "Monthly Report",
    label: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

export async function generateReportPdf(allOrders: IOrder[], period: ReportPeriod) {
  const { start, end, title, label } = getPeriodRange(period);

  const orders = allOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= start && d <= end;
  });

  // ── Fetch categories
  const allItems = orders.flatMap((o) => o.items ?? []);
  const productIds = [...new Set(allItems.map((i) => i.productId).filter(Boolean))];
  const categoryMap: Record<string, string> = {};

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, categoryId")
      .in("id", productIds);

    const categoryIds = [...new Set((products ?? []).map((p: any) => p.categoryId).filter(Boolean))];

    if (categoryIds.length > 0) {
      const { data: categories } = await supabase
        .from("category")
        .select("id, name")
        .in("id", categoryIds);

      const catById: Record<string, string> = {};
      (categories ?? []).forEach((c: any) => { catById[c.id] = c.name; });
      (products ?? []).forEach((p: any) => {
        categoryMap[p.id] = catById[p.categoryId] ?? "—";
      });
    }
  }

  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();

  // ══════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════
  doc.setFillColor(...CORAL);
  doc.rect(0, 0, W, 46, "F");

  // Accent strip
  doc.setFillColor(...CORAL_DARK);
  doc.rect(0, 0, 6, 46, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, W / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(label, W / 2, 30, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(255, 220, 215);
  doc.text(
    `Generated on ${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`,
    W / 2, 39,
    { align: "center" }
  );

  // ══════════════════════════════════════════
  // STATS BOXES
  // ══════════════════════════════════════════
  const approved = orders.filter((o) => o.status === "approved" || o.status === "modified").length;
  const statsData = [
    { label: "Total Orders",  value: orders.length,                                           r: 70,  g: 100, b: 210 },
    { label: "Pending",       value: orders.filter((o) => o.status === "pending").length,     r: 210, g: 150, b: 30  },
    { label: "Approved",      value: approved,                                                r: 40,  g: 170, b: 100 },
    { label: "Rejected",      value: orders.filter((o) => o.status === "rejected").length,    r: 210, g: 60,  b: 60  },
  ];

  const boxW = (W - 28 - 9) / 4;
  statsData.forEach((s, i) => {
    const x = 14 + i * (boxW + 3);
    const y = 52;

    doc.setFillColor(s.r, s.g, s.b);
    doc.roundedRect(x, y, boxW, 22, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(String(s.value), x + boxW / 2, y + 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(s.label, x + boxW / 2, y + 18, { align: "center" });
  });

  // ══════════════════════════════════════════
  // SECTION TITLE
  // ══════════════════════════════════════════
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Orders Breakdown", 14, 86);

  doc.setDrawColor(...GRAY_LINE);
  doc.setLineWidth(0.4);
  doc.line(14, 88, W - 14, 88);

  // ══════════════════════════════════════════
  // TABLE
  // ══════════════════════════════════════════
  if (orders.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(160, 160, 160);
    doc.text("No orders found for this period.", W / 2, 104, { align: "center" });
  } else {
    // Group by branch
    const branchGroups: Record<string, IOrder[]> = {};
    orders.forEach((o) => {
      if (!branchGroups[o.branchName]) branchGroups[o.branchName] = [];
      branchGroups[o.branchName].push(o);
    });

    const rows: (string | { content: string; styles: object })[][] = [];

    Object.entries(branchGroups).forEach(([branchName, branchOrders]) => {
      branchOrders.forEach((order) => {
        const items = order.items ?? [];
        const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

        if (items.length === 0) {
          rows.push([branchName, "—", "—", "—", "—", statusLabel, orderDate]);
          return;
        }

        items.forEach((item, idx) => {
          rows.push([
            idx === 0 ? branchName : "",
            item.productName,
            categoryMap[item.productId] ?? item.categoryName ?? "—",
            String(item.quantity),
            item.approvedQuantity != null ? String(item.approvedQuantity) : "—",
            idx === 0 ? statusLabel : "",
            idx === 0 ? orderDate : "",
          ]);
        });
      });
    });

    autoTable(doc, {
      startY: 92,
      head: [["Branch", "Product", "Category", "Req.", "Approved", "Status", "Date"]],
      body: rows,
      styles: {
        fontSize: 8.5,
        cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
        textColor: [40, 40, 40],
      },
      headStyles: {
        fillColor: CORAL,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      },
      alternateRowStyles: { fillColor: GRAY_BG },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 30 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 30 },
        3: { cellWidth: 14, halign: "center" },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 22, halign: "center" },
        6: { cellWidth: 22, halign: "center" },
      },
      didDrawCell: (data) => {
        // Highlight approved status green, rejected red
        if (data.column.index === 5 && data.section === "body") {
          const val = String(data.cell.raw ?? "").toLowerCase();
          if (val === "approved" || val === "modified") {
            doc.setTextColor(34, 150, 80);
          } else if (val === "rejected") {
            doc.setTextColor(200, 50, 50);
          } else if (val === "pending") {
            doc.setTextColor(190, 130, 20);
          }
        }
      },
    });
  }

  const finalY: number = (doc as any).lastAutoTable?.finalY ?? 100;

  // ══════════════════════════════════════════
  // SUMMARY BAR
  // ══════════════════════════════════════════
  const totalRequested = allItems.reduce((s, i) => s + i.quantity, 0);
  const totalApproved = orders
    .flatMap((o) => o.items ?? [])
    .reduce((s, i) => s + (i.approvedQuantity ?? 0), 0);
  const branchCount = Object.keys(
    orders.reduce((acc, o) => { acc[o.branchName] = 1; return acc; }, {} as Record<string, number>)
  ).length;

  const barY = finalY + 8;
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(...GRAY_LINE);
  doc.roundedRect(14, barY, W - 28, 18, 2, 2, "FD");

  doc.setTextColor(70, 70, 70);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(
    `Branches: ${branchCount}   |   Total Orders: ${orders.length}   |   Units Requested: ${totalRequested}   |   Units Approved: ${totalApproved}`,
    W / 2, barY + 11,
    { align: "center" }
  );

  // ══════════════════════════════════════════
  // SIGNATURES
  // ══════════════════════════════════════════
  const sigY = barY + 36;
  const pageH = doc.internal.pageSize.getHeight();

  if (sigY + 18 < pageH) {
    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    doc.line(14, sigY, 82, sigY);
    doc.text("Prepared by", 14, sigY + 6);

    doc.line(W - 82, sigY, W - 14, sigY);
    doc.text("Manager Signature", W - 82, sigY + 6);
  }

  // ══════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════
  doc.setFillColor(...CORAL);
  doc.rect(0, pageH - 10, W, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`${title}  •  ${label}`, W / 2, pageH - 3.5, { align: "center" });

  // ══════════════════════════════════════════
  // SAVE
  // ══════════════════════════════════════════
  const dateLabel = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
  doc.save(`${period}_report_${dateLabel}.pdf`);
}
