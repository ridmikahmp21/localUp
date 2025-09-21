import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import DashboardCard from "../../components/DashboardCard";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaBox,
  FaChartLine,
  FaClock,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const data = [
  { name: "Jan", value: 20 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 60 },
  { name: "Apr", value: 40 },
  { name: "May", value: 65 },
  { name: "Jun", value: 45 },
  { name: "Jul", value: 70 },
  { name: "Aug", value: 30 },
  { name: "Sep", value: 85 },
  { name: "Oct", value: 60 },
  { name: "Nov", value: 75 },
  { name: "Dec", value: 55 },
];

export default function Dashboard() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Users
                </h3>
                <div className="p-2 rounded-lg bg-gray-100">
                  <FaUsers className="text-gray-700" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">26</p>
              <p className="text-xs text-gray-400">Registered customers</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Orders
                </h3>
                <div className="p-2 rounded-lg bg-gray-100">
                  <FaBox className="text-gray-700" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">20</p>
              <p className="text-xs text-gray-400">Processed this year</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Sales
                </h3>
                <div className="p-2 rounded-lg bg-gray-100">
                  <FaChartLine className="text-gray-700" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">LKR 59,000</p>
              <p className="text-xs text-gray-400">Revenue generated</p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Sales Performance
              </h2>
              <div className="flex items-center gap-3">
                <select className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
                <select className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <option>All Products</option>
                  <option>Category 1</option>
                  <option>Category 2</option>
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B5563" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4B5563" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `LKR${value}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1F2937"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
