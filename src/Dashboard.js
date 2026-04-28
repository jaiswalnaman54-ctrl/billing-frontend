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

// ✅ USE LIVE BACKEND
const API = "https://billing-backend-lfu8.onrender.com";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState("daily");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API}/api/invoices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setInvoices(res.data || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      alert("Failed to load dashboard ❌");
    }
  };

  // 🔥 GROUP DATA
  const groupData = () => {
    const map = {};

    invoices.forEach((inv) => {
      if (!inv.date || !inv.total) return;

      let key;
      const date = new Date(inv.date);

      if (view === "daily") {
        key = inv.date;
      } else if (view === "weekly") {
        const week = Math.ceil(date.getDate() / 7);
        key = `Week ${week}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
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

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("daily")}>Daily</button>

        <button
          onClick={() => setView("weekly")}
          style={{ marginLeft: "10px" }}
        >
          Weekly
        </button>

        <button
          onClick={() => setView("monthly")}
          style={{ marginLeft: "10px" }}
        >
          Monthly
        </button>
      </div>

      {/* BAR CHART */}
      <div style={{ background: "#fff", padding: "20px" }}>
        <Bar data={chartData} />
      </div>

      <br />

      {/* LINE CHART */}
      <div style={{ background: "#fff", padding: "20px" }}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;