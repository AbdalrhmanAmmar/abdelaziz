import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { IOrder } from "@/shared";
import { supabase } from "@/lib/supabase";

export async function generateOrderPdf(order: IOrder) {
  const doc = new jsPDF();
  const items = order.items ?? [];

  const productIds = [...new Set(items.map((i) => i.productId).filter(Boolean))];
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

  const dateStr = new Date(order.createdAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // ── Header ──────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Order Report", 105, 18, { align: "center" });

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 22, 196, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Branch:`, 14, 32);
  doc.setFont("helvetica", "bold");
  doc.text(order.branchName, 40, 32);

  doc.setFont("helvetica", "normal");
  doc.text(`Date:`, 14, 40);
  doc.setFont("helvetica", "bold");
  doc.text(dateStr, 40, 40);

  // ── Items Table ─────────────────────────────────────────
  autoTable(doc, {
    startY: 50,
    head: [["Product Name", "Category", "Quantity"]],
    body: items.map((item) => [
      item.productName,
      categoryMap[item.productId] ?? item.categoryName ?? "—",
      String(item.approvedQuantity ?? item.quantity),
    ]),
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: {
      fillColor: [220, 53, 69],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 50 },
      2: { cellWidth: 25, halign: "center" },
    },
  });

  const finalY: number = (doc as any).lastAutoTable.finalY + 8;

  // ── Totals ───────────────────────────────────────────────
  const totalItems = items.length;
  const totalUnits = items.reduce(
    (sum, item) => sum + (item.approvedQuantity ?? item.quantity),
    0
  );

  doc.setDrawColor(200, 200, 200);
  doc.line(14, finalY, 196, finalY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total items: ${totalItems}  |  Total units: ${totalUnits}`,
    14,
    finalY + 8
  );

  // ── Signatures ───────────────────────────────────────────
  const sigY = finalY + 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setDrawColor(80, 80, 80);

  // Left: Requester Signature
  doc.line(14, sigY, 88, sigY);
  doc.text("Requester Signature", 14, sigY + 6);

  // Right: Store Manager Signature
  doc.line(122, sigY, 196, sigY);
  doc.text("Store Manager Signature", 122, sigY + 6);

  // ── Save ─────────────────────────────────────────────────
  const safeBranch = order.branchName.replace(/[^a-zA-Z0-9]/g, "_");
  const dateLabel = new Date(order.createdAt)
    .toLocaleDateString("en-US")
    .replace(/\//g, "-");
  doc.save(`order_${safeBranch}_${dateLabel}.pdf`);
}
