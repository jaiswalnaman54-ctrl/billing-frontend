import React from "react";
import logo from "./assets/logo.png";
import qrImage from "./assets/qr.png";

function Invoice({
  data,
  billType,
  customerGST,
  customerPhone,
  customerDL,
  dueDate,
  invoiceCustomerName,
  goBack
}) {

  const calculateAmount = (item) => {
    const base = item.qty * item.price;
    const discount = base * (item.discount / 100);
    const afterDiscount = base - discount;
    const gst = afterDiscount * (item.gst / 100);

    return billType === "gst"
      ? afterDiscount + gst
      : afterDiscount;
  };

  const total = data.items.reduce(
    (sum, item) => sum + calculateAmount(item),
    0
  );

  const cell = {
    border: "1px solid black",
    padding: "4px",
    fontSize: "12px",
    lineHeight: "1.2",
    whiteSpace: "nowrap"
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  };

  const renderInvoice = (copyType) => (
    <div className="invoice-box">

      <div style={{ textAlign: "right", fontWeight: "bold" }}>
        {copyType}
      </div>

      <div className="invoice-container">

        {/* TOP BAR */}
        <table style={table}>
          <tr>
            <td style={{ ...cell, width: "25%" }}>Page No. 1 of 1</td>

            <td style={{ ...cell, width: "50%", textAlign: "center", fontWeight: "bold" }}>
              {billType === "gst" ? "TAX INVOICE" : "BILL OF SUPPLY"}
            </td>

            {/* ✅ FIXED: GST conditional, DL always */}
            <td
              style={{
                ...cell,
                width: "25%",
                textAlign: "right",
                verticalAlign: "top",
                paddingRight: "6px"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                
                {/* GST (ONLY for GST bill) */}
                {billType === "gst" && (
                  <div style={{ whiteSpace: "nowrap", fontSize: "11.5px" }}>
                    GST No: 09AUNPJ8884G1ZU
                  </div>
                )}

                {/* DL (ALWAYS visible) */}
                <div
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "10px",
                    marginTop: billType === "gst" ? "2px" : "0px"
                  }}
                >
                  DLNo: UP7020B001884, UP7021B001875
                </div>

              </div>
            </td>

          </tr>
        </table>

        {/* HEADER */}
        <table style={table}>
          <tr>
            <td style={{ ...cell, width: "20%", textAlign: "center" }}>
              <img src={logo} alt="logo" style={{ width: "90px" }} />
            </td>

            <td style={{ ...cell, textAlign: "center" }}>
              <b>HP Pharmaceuticals</b><br />
              Arazi No. 18 mauza tezau dixit, Naini, Prayagraj, U.P., 211008<br />
              Mobile: +91 8887608038 , 8887617381 | Email: sales@hppharmasolutions.com
            </td>
          </tr>
        </table>

        {/* BILLING + INVOICE */}
        <table style={table}>
          <tr>
            <td style={{ ...cell, width: "50%" }}>
              <b>Billing Details:</b><br />
              Name: {data.customer}<br />
              Phone: {customerPhone}<br />
              {billType === "gst" && <>GST No: {customerGST}<br /></>}
              DL No: {customerDL}
            </td>

            <td style={{ ...cell, width: "50%" }}>
              <b>Invoice No:</b> {data.invoiceNumber}<br />
              <b>Invoice Date:</b> {data.date}<br />
              <b>Due Date:</b> {dueDate}<br />
              <b>Name:</b> {invoiceCustomerName}
            </td>
          </tr>
        </table>

        {/* ITEMS */}
        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...cell, width: "5%" }}>Sr.</th>
              <th style={{ ...cell, width: "20%" }}>Item</th>
              <th style={{ ...cell, width: "8%" }}>HSN</th>
              <th style={{ ...cell, width: "12%" }}>Batch</th>
              <th style={{ ...cell, width: "12%" }}>Expiry</th>
              <th style={{ ...cell, width: "5%" }}>Qty</th>
              <th style={{ ...cell, width: "8%" }}>Price</th>
              <th style={{ ...cell, width: "6%" }}>Disc</th>
              <th style={{ ...cell, width: "6%" }}>Tax %</th>
              <th style={{ ...cell, width: "10%" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td style={cell}>{i + 1}</td>
                <td style={cell}>{item.name}</td>
                <td style={cell}>{item.hsn}</td>
                <td style={cell}>{item.batch}</td>
                <td style={cell}>{item.expiry}</td>
                <td style={cell}>{item.qty}</td>
                <td style={cell}>{item.price}</td>
                <td style={cell}>{item.discount || 0}%</td>
                <td style={cell}>{billType === "gst" ? item.gst + "%" : "--"}</td>
                <td style={cell}>{calculateAmount(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL */}
        <table style={table}>
          <tr>
            <td style={{ ...cell }}>Total</td>
            <td style={{ ...cell, textAlign: "right", width: "150px" }}>
              ₹ {total.toFixed(2)}
            </td>
          </tr>
        </table>

        {/* FOOTER */}
        <table style={table}>
          <tr>
            <td style={{ ...cell, width: "33%" }}>
              <b>Terms</b><br />
              Goods once sold will not be taken back.
            </td>

            <td style={{ ...cell, width: "33%" }}>
              <b>HP PHARMA</b><br />
              AC: 1006002100109565<br />
              IFSC: PUNB0100600<br />
              <img src={qrImage} alt="qr" style={{ width: "120px" }} />
            </td>

            <td style={{ ...cell, width: "33%", textAlign: "right" }}>
              Signature
            </td>
          </tr>
        </table>

      </div>
    </div>
  );

  return (
    <div>

      <div className="no-print">
        <button onClick={goBack}>Back</button>
        <button onClick={() => window.print()}>Print</button>
      </div>

      {renderInvoice("Customer Copy")}
      <div style={{ margin: "80px 0", textAlign: "center" }}>
      <hr style={{ borderTop: "2px dashed black" }} />
      <span style={{ fontSize: "12px" }}></span>
      </div>
      {renderInvoice("Office Copy")}
    </div>
  );
}

export default Invoice;