"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 15000 },
  { month: "Mar", sales: 18000 },
  { month: "Apr", sales: 14000 },
  { month: "May", sales: 22000 },
  { month: "Jun", sales: 25000 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
        <Bar dataKey="sales" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
