import React from "react";

const NewBillingUI = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">💊 Billing App</h2>

        <ul className="space-y-4">
          <li className="hover:bg-indigo-600 p-2 rounded">Dashboard</li>
          <li className="bg-indigo-600 p-2 rounded">New Invoice</li>
          <li className="hover:bg-indigo-600 p-2 rounded">Invoices</li>
          <li className="hover:bg-indigo-600 p-2 rounded">Customers</li>
          <li className="hover:bg-indigo-600 p-2 rounded">Reports</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">New Invoice</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Invoice History
          </button>
        </div>

        {/* Customer Card */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

          <div className="grid grid-cols-3 gap-4">
            <input className="input" placeholder="Customer Name" />
            <input className="input" placeholder="Phone" />
            <input className="input" placeholder="GST" />
            <input className="input" placeholder="Drug Licence" />
            <input className="input" placeholder="Invoice Name" />
            <select className="input">
              <option>Tax Invoice (GST)</option>
            </select>
            <input type="date" className="input" />
            <input type="date" className="input" />
          </div>
        </div>

        {/* Items */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>

          <table className="w-full border">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Item</th>
                <th>HSN</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>GST</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td><input className="tableInput" /></td>
                <td><input className="tableInput" /></td>
                <td><input className="tableInput" /></td>
                <td><input type="date" className="tableInput" /></td>
                <td><input className="tableInput" /></td>
                <td><input className="tableInput" /></td>
                <td><input className="tableInput" /></td>
                <td><input className="tableInput" /></td>
              </tr>
            </tbody>
          </table>

          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
            + Add Item
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Invoice
          </button>

          <button className="bg-green-600 text-white px-6 py-2 rounded">
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewBillingUI;