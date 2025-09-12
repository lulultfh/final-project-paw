import React from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case "cake":
      return "#893941";
    case "bread":
      return "#D4A373";
    case "cookies":
      return "#8B5E3C";
    case "pastry":
      return "#8075B2";
    default:
      return "#D0A583";
  }
};

const ProductStatistics = ({ data, selectedPeriod, setSelectedPeriod }) => {
  const chartData = data.map((item) => ({
    ...item,
    fill: getCategoryColor(item.name),
  }));

  return (
    <div className="bg-[#B6BB79] rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Statistik Produk
          </h2>
          <p className="text-gray-600 text-sm">
            Lihat penjualan produk per kategori
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-[#F3EBD8] border border-[#F9D0CE] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F9D0CE] text-black"
        >
          <option className="text-black">Hari Ini</option>
          <option className="text-black">Minggu Ini</option>
          <option className="text-black">Bulan Ini</option>
          <option className="text-black">Tahun Ini</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          innerRadius="10%"
          outerRadius="80%"
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductStatistics;
