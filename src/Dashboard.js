import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// ✅ SINGLE SOURCE OF API
const API = "https://billing-backend-lfu8.onrender.com";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState("daily");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const res = await axios.get(`${API}/api/invoices`, {
        headers: {
          Authorization: token // ✅ FIXED
        }
      });

      console.log("Dashboard Data:", res.data); // 🔍 DEBUG

      setInvoices(res.data || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      alert("Dashboard failed ❌");
    }
  };

  // ✅ GROUP DATA SAFELY
  const groupData = () => {
    const map = {};

    invoices.forEach((inv) => {
      if (!inv.date || !inv.total) return;

      const dateObj = new Date(inv.date);
      let key;

      if (view === "daily") {
        key = inv.date;
      } else if (view === "weekly") {
        const week = Math.ceil(dateObj.getDate() / 7);
        key = `Week ${week}`;
      } else {
        key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
      }

      map[key] = (map[key] || 0) + inv.total;
    });

    return {
      labels: Object.keys(map),
      values: Object.values(map)
    };
  };

  const data = groupData();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Sales ₹",
        data: data.values
      }
    ]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Sales Dashboard</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("daily")}>Daily</button>
        <button onClick={() => setView("weekly")} style={{ marginLeft: "10px" }}>
          Weekly
        </button>
        <button onClick={() => setView("monthly")} style={{ marginLeft: "10px" }}>
          Monthly
        </button>
      </div>

      {/* DEBUG */}
      {invoices.length === 0 && (
        <p>No data found (check console)</p>
      )}

      {/* BAR */}
      <div style={{ background: "#fff", padding: "20px" }}>
        <Bar data={chartData} />
      </div>

      <br />

      {/* LINE */}
      <div style={{ background: "#fff", padding: "20px" }}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;