import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function InvoiceList({ onSelect }) {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState("latest");
  const [gstFilter, setGstFilter] = useState("all");

  // ✅ FETCH INVOICES
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/api/invoices",
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setInvoices(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching invoices ❌");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ FIXED: useCallback
  const applyFilters = useCallback(() => {
    let data = [...invoices];

    if (search) {
      data = data.filter((inv) =>
        inv.customer?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (invoiceNo) {
      data = data.filter((inv) =>
        inv.invoiceNumber?.toLowerCase().includes(invoiceNo.toLowerCase())
      );
    }

    if (fromDate) {
      data = data.filter((inv) => inv.date >= fromDate);
    }

    if (toDate) {
      data = data.filter((inv) => inv.date <= toDate);
    }

    if (gstFilter !== "all") {
      data = data.filter((inv) => inv.billType === gstFilter);
    }

    data.sort((a, b) =>
      sort === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFiltered(data);
  }, [search, invoiceNo, fromDate, toDate, sort, gstFilter, invoices]);

  // ✅ FIXED: dependency
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // ❌ DELETE
  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:5000/api/invoices/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert("Error deleting invoice ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Invoice History</h2>

      {/* 🔍 FILTERS */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          placeholder="Search Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Invoice No"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
        />

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <select value={gstFilter} onChange={(e) => setGstFilter(e.target.value)}>
          <option value="all">All Bills</option>
          <option value="gst">GST Bills</option>
          <option value="non-gst">Non-GST Bills</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* 📊 TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff"
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={th}>Invoice No</th>
            <th style={th}>Customer</th>
            <th style={th}>Date</th>
            <th style={th}>Type</th>
            <th style={th}>Total</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No invoices found
              </td>
            </tr>
          ) : (
            filtered.map((inv) => (
              <tr key={inv._id}>
                <td style={td}>{inv.invoiceNumber}</td>
                <td style={td}>{inv.customer}</td>
                <td style={td}>{inv.date}</td>
                <td style={td}>{inv.billType === "gst" ? "GST" : "Non-GST"}</td>
                <td style={td}>₹ {inv.total}</td>

                <td style={td}>
                  <button style={viewBtn} onClick={() => onSelect(inv)}>
                    View
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => deleteInvoice(inv._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 🎨 STYLES
const th = {
  border: "1px solid #ddd",
  padding: "10px"
};

const td = {
  border: "1px solid #ddd",
  padding: "10px"
};

const viewBtn = {
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px"
};

const deleteBtn = {
  background: "#f44336",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px"
};

export default InvoiceList;