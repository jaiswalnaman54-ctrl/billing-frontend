import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState("daily"); // daily | weekly | monthly
  const [type, setType] = useState("total"); // total | product

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await axios.get(
      "http://127.0.0.1:5000/api/invoices",
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    );
    setInvoices(res.data);
  };

  // ✅ GROUP DATA
  const processData = () => {
    let map = {};

    invoices.forEach((inv) => {
      const date = new Date(inv.date);

      let key;

      if (view === "daily") {
        key = inv.date;
      } else if (view === "weekly") {
        const week = Math.ceil(date.getDate() / 7);
        key = `Week ${week}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!map[key]) map[key] = 0;

      if (type === "total") {
        map[key] += inv.total;
      } else {
        // 🔥 PRODUCT-WISE
        inv.items.forEach((item) => {
          map[item.name] = (map[item.name] || 0) + item.qty;
        });
      }
    });

    return map;
  };

  const chartData = processData();

  const data = {
    labels: Object.keys(chartData),
    datasets: [
      {
        label:
          type === "total"
            ? "Sales Amount (₹)"
            : "Product Quantity Sold",
        data: Object.values(chartData)
      }
    ]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Sales Reports</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <select value={view} onChange={(e) => setView(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="total">All Products (Revenue)</option>
          <option value="product">Product-wise</option>
        </select>
      </div>

      {/* GRAPH */}
      <Bar data={data} />
    </div>
  );
}

export default Reports;