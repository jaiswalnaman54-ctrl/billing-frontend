import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://billing-backend-lfu8.onrender.com";

function InvoiceList({ onSelect }) {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState("latest");
  const [gstFilter, setGstFilter] = useState("all");

  const getToken = () => localStorage.getItem("token") || "";

  // ✅ FETCH INVOICES
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/invoices`, {
        headers: {
          Authorization: getToken()
        }
      });

      setInvoices(res.data || []);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert("Error fetching invoices ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD DATA
  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ FILTER LOGIC DIRECTLY INSIDE useEffect (NO ESLINT ISSUE)
  useEffect(() => {
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

  // ❌ DELETE
  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await axios.delete(`${API}/api/invoices/${id}`, {
        headers: {
          Authorization: getToken()
        }
      });

      fetchInvoices();

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert("Error deleting invoice ❌");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading invoices...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Invoice History</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input placeholder="Search Customer" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Invoice No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
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

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
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
                  <button style={viewBtn} onClick={() => onSelect(inv)}>View</button>
                  <button style={deleteBtn} onClick={() => deleteInvoice(inv._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = { border: "1px solid #ddd", padding: "10px" };
const td = { border: "1px solid #ddd", padding: "10px" };

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