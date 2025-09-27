"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Wallet, Calendar } from "lucide-react"
import { SavingsChart } from "@/components/savings-chart"
import { SavingsGoals } from "@/components/savings-goals"
import { DailyEntry } from "@/components/daily-entry"

interface SavingsData {
  id: string // Added id field for deletion
  date: string
  amount: number
  total: number
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export default function SavingsTracker() {
  const [savingsData, setSavingsData] = useState<SavingsData[]>([])
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "شراء سيارة",
      target: 50000,
      current: 15000,
      deadline: "2025-12-31",
    },
    {
      id: "2",
      name: "رحلة العمرة",
      target: 8000,
      current: 3200,
      deadline: "2025-06-15",
    },
  ])
  const [totalSavings, setTotalSavings] = useState(18200)

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("savingsData")
    const savedGoals = localStorage.getItem("savingsGoals")
    const savedTotal = localStorage.getItem("totalSavings")

    if (savedData) setSavingsData(JSON.parse(savedData))
    if (savedGoals) setGoals(JSON.parse(savedGoals))
    if (savedTotal) setTotalSavings(Number.parseFloat(savedTotal))
  }, [])

  const addSavingsEntry = (amount: number) => {
    const today = new Date().toISOString().split("T")[0]
    const newTotal = totalSavings + amount

    const newEntry: SavingsData = {
      id: Date.now().toString(), // Added unique id
      date: today,
      amount,
      total: newTotal,
    }

    const updatedData = [...savingsData, newEntry].slice(-30) // Keep last 30 entries
    setSavingsData(updatedData)
    setTotalSavings(newTotal)

    // Save to localStorage
    localStorage.setItem("savingsData", JSON.stringify(updatedData))
    localStorage.setItem("totalSavings", newTotal.toString())
  }

  const deleteSavingsEntry = (entryId: string) => {
    const entryToDelete = savingsData.find((entry) => entry.id === entryId)
    if (!entryToDelete) return

    const updatedData = savingsData.filter((entry) => entry.id !== entryId)
    const newTotal = totalSavings - entryToDelete.amount

    setSavingsData(updatedData)
    setTotalSavings(newTotal)

    // Save to localStorage
    localStorage.setItem("savingsData", JSON.stringify(updatedData))
    localStorage.setItem("totalSavings", newTotal.toString())
  }

  const addGoal = (goal: Omit<Goal, "id" | "current">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
    }
    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals))
  }

  const updateGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
    )
    setGoals(updatedGoals)
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">مخطط التوفير</h1>
                <p className="text-sm text-muted-foreground">خطة ذكية لتوفير الأموال</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">إجمالي المدخرات</p>
              <p className="text-2xl font-bold text-secondary">{totalSavings.toLocaleString("ar-SA")} ريال</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-sky-100 to-blue-50 border-sky-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المدخرات اليوم</p>
                  <p className="text-2xl font-bold text-primary">
                    {savingsData.length > 0
                      ? savingsData[savingsData.length - 1]?.amount.toLocaleString("ar-SA") || "0"
                      : "0"}{" "}
                    ريال
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-sky-50 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الأهداف النشطة</p>
                  <p className="text-2xl font-bold text-secondary">{goals.length}</p>
                </div>
                <Target className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط التوفير اليومي</p>
                  <p className="text-2xl font-bold text-accent">
                    {savingsData.length > 0
                      ? Math.round(
                          savingsData.reduce((sum, entry) => sum + entry.amount, 0) / savingsData.length,
                        ).toLocaleString("ar-SA")
                      : "0"}{" "}
                    ريال
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Entry */}
        <DailyEntry onAddEntry={addSavingsEntry} />

        {/* Charts and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SavingsChart data={savingsData} />
          <SavingsGoals goals={goals} onAddGoal={addGoal} onUpdateGoal={updateGoal} />
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 border-sky-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-800">
              <TrendingUp className="w-5 h-5" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savingsData
                .slice(-5)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-sky-50/50 rounded-lg border border-sky-100"
                  >
                    <div>
                      <p className="font-medium text-sky-900">وفرت {entry.amount.toLocaleString("ar-SA")} ريال</p>
                      <p className="text-sm text-sky-600">{new Date(entry.date).toLocaleDateString("ar-SA")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-sm text-sky-600">الإجمالي</p>
                        <p className="font-bold text-blue-700">{entry.total.toLocaleString("ar-SA")} ريال</p>
                      </div>
                      <button
                        onClick={() => deleteSavingsEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="حذف الإدخار"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              {savingsData.length === 0 && <p className="text-center text-sky-600 py-8">لا توجد مدخرات مسجلة بعد</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
