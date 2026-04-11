"use client"

import { useState } from "react"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {Bar,BarChart,Cell,Pie,PieChart,XAxis,YAxis,CartesianGrid,} from "recharts"
import {Users,DollarSign,Calendar,Building2,TrendingUp,Sun,} from "lucide-react"

// Data for the bar chart
const monthlyData = [
  { month: "Ene", turistas: 980 },
  { month: "Feb", turistas: 1120 },
  { month: "Mar", turistas: 1350 },
  { month: "Abr", turistas: 1480 },
  { month: "May", turistas: 1250 },
  { month: "Jun", turistas: 890 },
  { month: "Jul", turistas: 1100 },
  { month: "Ago", turistas: 1320 },
  { month: "Sep", turistas: 1150 },
  { month: "Oct", turistas: 980 },
  { month: "Nov", turistas: 1030 },
  { month: "Dic", turistas: 800 },
]

// Data for the pie chart
const categoryData = [
  { name: "Natural", value: 45, fill: "#059669" },
  { name: "Arquitectónico", value: 30, fill: "#d4a017" },
  { name: "Religioso", value: 25, fill: "#8b3a3a" },
]

// Data for the table
const topAttractions = [
  { ranking: 1, nombre: "Lago de Tota", categoria: "Natural", visitas: 4250 },
  { ranking: 2, nombre: "Museo Arqueológico", categoria: "Arquitectónico", visitas: 3180 },
  { ranking: 3, nombre: "Catedral de San Martín", categoria: "Religioso", visitas: 2890 },
]

const barChartConfig = {
  turistas: {
    label: "Turistas",
    color: "#059669",
  },
}

const pieChartConfig = {
  natural: {
    label: "Natural",
    color: "#059669",
  },
  arquitectonico: {
    label: "Arquitectónico",
    color: "#d4a017",
  },
  religioso: {
    label: "Religioso",
    color: "#8b3a3a",
  },
}

export default function EstadisticasPage() {
  const [year, setYear] = useState("2026")
  const [month, setMonth] = useState("todos")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-12 lg:px-8">
        {/* Page Header & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
            Panel de Estadísticas y Métricas
          </h1>
          <div className="flex items-center gap-3">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="enero">Enero</SelectItem>
                <SelectItem value="febrero">Febrero</SelectItem>
                <SelectItem value="marzo">Marzo</SelectItem>
                <SelectItem value="abril">Abril</SelectItem>
                <SelectItem value="mayo">Mayo</SelectItem>
                <SelectItem value="junio">Junio</SelectItem>
                <SelectItem value="julio">Julio</SelectItem>
                <SelectItem value="agosto">Agosto</SelectItem>
                <SelectItem value="septiembre">Septiembre</SelectItem>
                <SelectItem value="octubre">Octubre</SelectItem>
                <SelectItem value="noviembre">Noviembre</SelectItem>
                <SelectItem value="diciembre">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Turistas */}
          <Card className="border-0 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Turistas
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    12,450
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                      +8% vs mes anterior
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#d4a017]/10 p-3">
                  <Users className="h-6 w-6 text-[#d4a017]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impacto Económico */}
          <Card className="border-0 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Impacto Económico (COP)
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    $450M
                  </p>
                  <p className="mt-2 text-sm text-slate-400">Acumulado anual</p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eventos Realizados */}
          <Card className="border-0 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Eventos Realizados
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">15</p>
                  <p className="mt-2 text-sm text-slate-400">Este mes</p>
                </div>
                <div className="rounded-lg bg-[#d4a017]/10 p-3">
                  <Calendar className="h-6 w-6 text-[#d4a017]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prestadores Activos */}
          <Card className="border-0 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Prestadores Activos
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">120</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Registrados activos
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-3">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Bar Chart */}
          <Card className="border-0 bg-white shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Afluencia de Turistas por Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <BarChart data={monthlyData} accessibilityLayer>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="turistas"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-0 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Visitantes por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="mx-auto h-[250px] w-full">
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              {/* Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-slate-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-0 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Atractivos Más Visitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] text-slate-600">
                    Ranking
                  </TableHead>
                  <TableHead className="text-slate-600">
                    Nombre del Atractivo
                  </TableHead>
                  <TableHead className="text-slate-600">Categoría</TableHead>
                  <TableHead className="text-right text-slate-600">
                    Visitas Registradas
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAttractions.map((attraction) => (
                  <TableRow key={attraction.ranking}>
                    <TableCell>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                        {attraction.ranking}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {attraction.nombre}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          attraction.categoria === "Natural"
                            ? "bg-emerald-100 text-emerald-700"
                            : attraction.categoria === "Arquitectónico"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attraction.categoria}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      {attraction.visitas.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
