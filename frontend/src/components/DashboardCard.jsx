export default function DashboardCard({ title, value, trend, trendColor, icon, subtitle }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow w-full md:w-1/4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm text-gray-500">{title}</h4>
        {icon}
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className={`text-sm mt-1 ${trendColor}`}>{trend} {subtitle}</p>
    </div>
  );
}
