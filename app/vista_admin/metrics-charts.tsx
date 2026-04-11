"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const economicImpactData = [
  { month: "Ene", ingresos: 45000, gastos: 32000 },
  { month: "Feb", ingresos: 52000, gastos: 35000 },
  { month: "Mar", ingresos: 48000, gastos: 30000 },
  { month: "Abr", ingresos: 61000, gastos: 38000 },
  { month: "May", ingresos: 55000, gastos: 36000 },
  { month: "Jun", ingresos: 67000, gastos: 40000 },
  { month: "Jul", ingresos: 72000, gastos: 45000 },
  { month: "Ago", ingresos: 69000, gastos: 42000 },
  { month: "Sep", ingresos: 58000, gastos: 38000 },
  { month: "Oct", ingresos: 63000, gastos: 41000 },
  { month: "Nov", ingresos: 70000, gastos: 44000 },
  { month: "Dic", ingresos: 85000, gastos: 52000 },
]

const attendanceData = [
  { month: "Ene", turistas: 1200, eventos: 8 },
  { month: "Feb", turistas: 1450, eventos: 10 },
  { month: "Mar", turistas: 1300, eventos: 7 },
  { month: "Abr", turistas: 1800, eventos: 12 },
  { month: "May", turistas: 1650, eventos: 9 },
  { month: "Jun", turistas: 2100, eventos: 15 },
  { month: "Jul", turistas: 2400, eventos: 18 },
  { month: "Ago", turistas: 2200, eventos: 14 },
  { month: "Sep", turistas: 1700, eventos: 11 },
  { month: "Oct", turistas: 1900, eventos: 13 },
  { month: "Nov", turistas: 2050, eventos: 16 },
  { month: "Dic", turistas: 2600, eventos: 20 },
]

const barChartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
  gastos: {
    label: "Gastos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const lineChartConfig = {
  turistas: {
    label: "Turistas",
    color: "var(--chart-1)",
  },
  eventos: {
    label: "Eventos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const months = [
  { value: "all", label: "Todos los meses" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

const years = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
]

export function MetricsCharts() {
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("2024")

  return (
    <div className="space-y-6">
      {/* Section Header with Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground text-balance">
            Métricas de Impacto Económico y Asistencia
          </h2>
          <p className="text-sm text-muted-foreground">
            Análisis detallado del rendimiento turístico y cultural
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] sm:w-[160px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[90px] sm:w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Economic Impact */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Impacto Económico (COP millones)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <BarChart data={economicImpactData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="ingresos"
                  fill="var(--color-ingresos)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="gastos"
                  fill="var(--color-gastos)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Attendance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Asistencia y Eventos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <LineChart data={attendanceData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="turistas"
                  stroke="var(--color-turistas)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-turistas)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="eventos"
                  stroke="var(--color-eventos)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-eventos)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
