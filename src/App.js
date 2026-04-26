import { useState } from "react";
import Invoice from "./Invoice";
import InvoiceList from "./InvoiceList";
import Login from "./Login";
import Dashboard from "./Dashboard";
import axios from "axios";

function App() {

  // 🔐 LOGIN
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [page, setPage] = useState("billing"); 
  // billing | list | invoice | dashboard

  const [billType, setBillType] = useState("gst");

  // ✅ CUSTOMER DETAILS
  const [customerGST, setCustomerGST] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDL, setCustomerDL] = useState("");

  // ✅ INVOICE DETAILS
  const [dueDate, setDueDate] = useState("");
  const [invoiceCustomerName, setInvoiceCustomerName] = useState("");

  // ✅ MAIN DATA
  const [data, setData] = useState({
    customer: "",
    date: "",
    invoiceNumber: "",
    items: [
      {
        name: "",
        hsn: "",
        batch: "",
        expiry: "",
        qty: 1,
        price: 0,
        gst: 5,
        discount: 0
      }
    ]
  });

  // 🔒 LOGIN CHECK
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // ✅ SAVE INVOICE
  const saveInvoice = async () => {
    try {
      const total = data.items.reduce((sum, item) => {
        const base = item.qty * item.price;
        const discount = base * (item.discount / 100);
        const afterDiscount = base - discount;
        const gst = afterDiscount * (item.gst / 100);

        return billType === "gst"
          ? sum + afterDiscount + gst
          : sum + afterDiscount;
      }, 0);

      const res = await axios.post(
        "http://127.0.0.1:5000/api/invoices",
        {
          ...data,
          customerGST,
          customerPhone,
          customerDL,
          dueDate,
          invoiceCustomerName,
          billType,
          total
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setData(res.data);
      alert("Invoice Saved ✅");

      return res.data;

    } catch (err) {
      console.error(err);
      alert("Error saving invoice ❌");
    }
  };

  // ✅ GENERATE BILL
  const handleGenerate = async () => {
    const saved = await saveInvoice();
    if (saved) setPage("invoice");
  };

  // 🔄 HANDLE ITEM CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...data.items];
    updated[index][field] = value;
    setData({ ...data, items: updated });
  };

  // ➕ ADD ITEM
  const addItem = () => {
    setData({
      ...data,
      items: [
        ...data.items,
        {
          name: "",
          hsn: "",
          batch: "",
          expiry: "",
          qty: 1,
          price: 0,
          gst: 5,
          discount: 0
        }
      ]
    });
  };

  // 🔓 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5 no-print">
        <h2 className="text-xl font-bold mb-6">SmartBill</h2>

        <ul className="space-y-3">
          <li
            className={`p-2 rounded cursor-pointer ${page === "billing" && "bg-blue-700"}`}
            onClick={() => setPage("billing")}
          >
            🧾 Billing
          </li>

          <li
            className={`p-2 rounded cursor-pointer ${page === "list" && "bg-blue-700"}`}
            onClick={() => setPage("list")}
          >
            📜 Invoice History
          </li>

          <li
            className={`p-2 rounded cursor-pointer ${page === "dashboard" && "bg-blue-700"}`}
            onClick={() => setPage("dashboard")}
          >
            📊 Dashboard
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Navbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow no-print">
          <h2 className="text-lg font-semibold">
            {page === "billing" && "Create Invoice"}
            {page === "list" && "Invoice History"}
            {page === "dashboard" && "Sales Dashboard"}
          </h2>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="p-6">

          {/* ================= BILLING ================= */}
          {page === "billing" && (
            <div className="bg-white p-6 rounded-xl shadow">

              <div className="mb-4">
                <label className="block mb-1 font-medium">Bill Type</label>
                <select
                  className="border p-2 rounded w-full"
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                >
                  <option value="gst">Tax Invoice (GST)</option>
                  <option value="non-gst">Bill of Supply</option>
                </select>
              </div>

              {/* Customer */}
              <div className="grid grid-cols-3 gap-4">

                <input className="border p-2 rounded"
                  placeholder="Customer Name"
                  value={data.customer}
                  onChange={(e) =>
                    setData({ ...data, customer: e.target.value })
                  }
                />

                <input className="border p-2 rounded"
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />

                {billType === "gst" && (
                  <input className="border p-2 rounded"
                    placeholder="GST Number"
                    value={customerGST}
                    onChange={(e) => setCustomerGST(e.target.value)}
                  />
                )}

                <input className="border p-2 rounded"
                  placeholder="Drug Licence"
                  value={customerDL}
                  onChange={(e) => setCustomerDL(e.target.value)}
                />

                <input className="border p-2 rounded"
                  placeholder="Invoice Name"
                  value={invoiceCustomerName}
                  onChange={(e) =>
                    setInvoiceCustomerName(e.target.value)
                  }
                />

                <input type="date" className="border p-2 rounded"
                  value={data.date}
                  onChange={(e) =>
                    setData({ ...data, date: e.target.value })
                  }
                />

                <input type="date" className="border p-2 rounded"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {/* Items */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th>Item</th>
                      <th>HSN</th>
                      <th>Batch</th>
                      <th>Expiry</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Disc%</th>
                      {billType === "gst" && <th>GST%</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {data.items.map((item, i) => (
                      <tr key={i}>
                        <td><input className="border p-1 w-full" onChange={(e)=>handleChange(i,"name",e.target.value)}/></td>
                        <td><input className="border p-1 w-full" onChange={(e)=>handleChange(i,"hsn",e.target.value)}/></td>
                        <td><input className="border p-1 w-full" onChange={(e)=>handleChange(i,"batch",e.target.value)}/></td>
                        <td><input type="date" className="border p-1" onChange={(e)=>handleChange(i,"expiry",e.target.value)}/></td>
                        <td><input type="number" className="border p-1 w-16" onChange={(e)=>handleChange(i,"qty",Number(e.target.value))}/></td>
                        <td><input type="number" className="border p-1 w-20" onChange={(e)=>handleChange(i,"price",Number(e.target.value))}/></td>
                        <td><input type="number" className="border p-1 w-16" onChange={(e)=>handleChange(i,"discount",Number(e.target.value))}/></td>
                        {billType==="gst" && (
                          <td><input type="number" className="border p-1 w-16" onChange={(e)=>handleChange(i,"gst",Number(e.target.value))}/></td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={addItem}
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
                  + Add Item
                </button>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-4">
                <button onClick={saveInvoice}
                  className="bg-blue-600 text-white px-6 py-2 rounded">
                  Save
                </button>

                <button onClick={handleGenerate}
                  className="bg-purple-600 text-white px-6 py-2 rounded">
                  Generate Bill
                </button>
              </div>

            </div>
          )}

          {/* ================= LIST ================= */}
          {page === "list" && (
            <InvoiceList
              onSelect={(inv) => {
                setData(inv);
                setCustomerGST(inv.customerGST || "");
                setCustomerPhone(inv.customerPhone || "");
                setCustomerDL(inv.customerDL || "");
                setDueDate(inv.dueDate || "");
                setInvoiceCustomerName(inv.invoiceCustomerName || "");
                setBillType(inv.billType);
                setPage("invoice");
              }}
            />
          )}

          {/* ================= INVOICE ================= */}
          {page === "invoice" && (
            <Invoice
              data={data}
              billType={billType}
              customerGST={customerGST}
              customerPhone={customerPhone}
              customerDL={customerDL}
              dueDate={dueDate}
              invoiceCustomerName={invoiceCustomerName}
              goBack={() => setPage("billing")}
            />
          )}

          {/* ================= DASHBOARD ================= */}
          {page === "dashboard" && <Dashboard />}

        </div>
      </div>
    </div>
  );
}

export default App;