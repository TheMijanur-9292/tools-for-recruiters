"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Tax Helpers ─────────────────────────────────────────────────────────────

/** Slab-based tax. slabs = [upperBound, rate] where upperBound is cumulative. */
function slabTax(income: number, slabs: Array<[number, number]>): number {
  let tax = 0;
  let prev = 0;
  for (const [upto, rate] of slabs) {
    if (income <= prev) break;
    const top = upto === Infinity ? income : Math.min(income, upto);
    tax += (top - prev) * rate;
    prev = upto;
  }
  return tax;
}

/** New Regime FY 2025-26: Rs.75K std deduction, 87A rebate <=12L, 4% cess */
function calcNewTax(gross: number): number {
  const taxable = Math.max(0, gross - 75_000);
  if (taxable <= 12_00_000) return 0;
  const tax = slabTax(taxable, [
    [4_00_000, 0],
    [8_00_000, 0.05],
    [12_00_000, 0.10],
    [16_00_000, 0.15],
    [20_00_000, 0.20],
    [24_00_000, 0.25],
    [Infinity, 0.30],
  ]);
  return Math.round(tax * 1.04);
}

/** Old Regime FY 2025-26: Rs.50K std deduction, 80C up to Rs.1.5L, 87A rebate <=5L, 4% cess */
function calcOldTax(gross: number, epfEmployee: number): number {
  const cap80C = Math.min(epfEmployee, 1_50_000);
  const taxable = Math.max(0, gross - 50_000 - cap80C);
  if (taxable <= 5_00_000) return 0;
  const tax = slabTax(taxable, [
    [2_50_000, 0],
    [5_00_000, 0.05],
    [10_00_000, 0.20],
    [Infinity, 0.30],
  ]);
  return Math.round(tax * 1.04);
}

// ─── Core Calculation ────────────────────────────────────────────────────────

interface Breakdown {
  basic: number; hra: number; lta: number; special: number; bonus: number; gross: number;
  employerEPF: number; gratuity: number;
  employeeEPF: number; stdDeduction: number; profTax: number; incomeTax: number;
  otherDed: number; totalDed: number; net: number; itNew: number; itOld: number;
}

function compute(ctc: number, bonusPct: number, regime: "new" | "old", profTax: number, otherDed: number): Breakdown {
  const bonus = Math.round(ctc * bonusPct / 100);
  const ctcBase = ctc - bonus;
  const basic = Math.round(ctcBase * 0.40);
  const hra = Math.round(basic * 0.50);
  const lta = Math.round(basic * 0.08);
  const employerEPF = Math.min(Math.round(basic * 0.12), 21_600);
  const gratuity = Math.round(basic * 0.0481);
  const special = Math.max(0, ctcBase - basic - hra - lta - employerEPF - gratuity);
  const gross = basic + hra + lta + special + bonus;
  const employeeEPF = Math.min(Math.round(basic * 0.12), 21_600);
  const stdDeduction = regime === "new" ? 75_000 : 50_000;
  const itNew = calcNewTax(gross);
  const itOld = calcOldTax(gross, employeeEPF);
  const incomeTax = regime === "new" ? itNew : itOld;
  const totalDed = employeeEPF + profTax + incomeTax + otherDed;
  const net = gross - totalDed;
  return { basic, hra, lta, special, bonus, gross, employerEPF, gratuity, employeeEPF, stdDeduction, profTax, incomeTax, otherDed, totalDed, net, itNew, itOld };
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function inr(n: number): string {
  if (n === 0) return "Rs.0";
  const a = Math.abs(Math.round(n));
  return (n < 0 ? "-Rs." : "Rs.") + a.toLocaleString("en-IN");
}

function inrSym(n: number): string {
  return inr(n).replace("Rs.", "\u20b9");
}

function inrLPA(n: number): string {
  return (n / 1_00_000).toFixed(2) + " LPA";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TableRow({ label, value, note, variant = "normal", monthly }: {
  label: string; value: number; note?: string;
  variant?: "normal" | "total" | "deduction" | "dimmed"; monthly: boolean;
}) {
  const display = inrSym(monthly ? Math.round(value / 12) : value);
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${variant === "total" ? "bg-muted-surface font-bold" : ""} ${variant === "dimmed" ? "opacity-55" : ""}`}>
      <div>
        <span className={`text-sm ${variant === "total" ? "font-bold" : ""} text-foreground`}>{label}</span>
        {note && <span className="ml-2 text-[10px] text-muted-foreground">{note}</span>}
      </div>
      <span className={`text-sm font-semibold ${variant === "deduction" ? "text-red-500" : variant === "dimmed" ? "text-muted-foreground" : "text-foreground"}`}>
        {variant === "deduction" ? `-${inrSym(monthly ? Math.round(value / 12) : value)}` : display}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SalaryCalculatorWorkspace() {
  const [ctc, setCtc] = useState(18_00_000);
  const [bonusPct, setBonusPct] = useState(10);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [profTax, setProfTax] = useState(2_400);
  const [otherDed, setOtherDed] = useState(0);
  const [showAdv, setShowAdv] = useState(false);
  const [view, setView] = useState<"annual" | "monthly">("annual");

  const d = useMemo(() => compute(ctc, bonusPct, regime, profTax, otherDed), [ctc, bonusPct, regime, profTax, otherDed]);
  const monthly = view === "monthly";
  const sliderLPA = Math.max(3, Math.round(ctc / 1_00_000));

  const barSegments = [
    { pct: (d.net / ctc) * 100, color: "bg-green-500", label: "Take Home" },
    { pct: (d.employeeEPF / ctc) * 100, color: "bg-blue-400", label: "EPF (Employee)" },
    { pct: (d.incomeTax / ctc) * 100, color: "bg-orange-400", label: "Income Tax" },
    { pct: (d.profTax / ctc) * 100, color: "bg-red-400", label: "Prof. Tax" },
    { pct: ((d.employerEPF + d.gratuity) / ctc) * 100, color: "bg-purple-400", label: "Employer (EPF+Gratuity)" },
  ];

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.5fr]">

      {/* LEFT: Inputs */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
          <h2 className="font-display text-lg font-semibold">CTC Details</h2>

          {/* Annual CTC */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground">Annual CTC (Cost to Company)</label>
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{inrLPA(ctc)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">Rs.</span>
              <input type="number" min={1_00_000} max={10_00_00_000} step={50_000} value={ctc}
                onChange={(e) => setCtc(Math.max(1_00_000, Number(e.target.value) || 1_00_000))}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold outline-none ring-yellow-400 focus:ring-2" />
            </div>
            <input type="range" min={3} max={200} value={sliderLPA}
              onChange={(e) => setCtc(Number(e.target.value) * 1_00_000)}
              className="mt-3 w-full accent-yellow-500" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>3L</span><span>50L</span><span>1Cr</span><span>1.5Cr</span><span>2Cr</span>
            </div>
          </div>

          {/* Bonus */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground">Bonus / Variable Pay (% of CTC)</label>
              <span className="text-xs font-bold text-foreground">{bonusPct}%</span>
            </div>
            <input type="range" min={0} max={50} value={bonusPct}
              onChange={(e) => setBonusPct(Number(e.target.value))}
              className="w-full accent-yellow-500" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>0%</span><span>10%</span><span>25%</span><span>50%</span>
            </div>
            {bonusPct > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">= {inrSym(Math.round(ctc * bonusPct / 100))} per year</p>
            )}
          </div>

          {/* Tax Regime */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Income Tax Regime</label>
            <div className="mt-2 grid grid-cols-2 rounded-xl border border-border overflow-hidden text-sm font-semibold">
              <button onClick={() => setRegime("new")}
                className={`py-2.5 transition ${regime === "new" ? "bg-yellow-500 text-white" : "text-muted-foreground hover:bg-muted-surface"}`}>
                New Regime
              </button>
              <button onClick={() => setRegime("old")}
                className={`py-2.5 transition ${regime === "old" ? "bg-yellow-500 text-white" : "text-muted-foreground hover:bg-muted-surface"}`}>
                Old Regime
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {regime === "new"
                ? "FY 2025-26 · Rs.75K std. deduction · 87A rebate up to Rs.12L taxable"
                : "Classic slabs · Rs.50K std. deduction · 80C (EPF counted, up to Rs.1.5L)"}
            </p>
          </div>

          {/* Advanced */}
          <div>
            <button onClick={() => setShowAdv((p) => !p)}
              className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition">
              <span>Advanced Deductions</span>
              {showAdv ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showAdv && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Professional Tax (Rs. / year)</label>
                  <input type="number" value={profTax}
                    onChange={(e) => setProfTax(Math.max(0, Number(e.target.value) || 0))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-yellow-400 focus:ring-2" />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Max Rs.2,400/year. Set 0 if not applicable.</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Other Annual Deductions (Rs.)</label>
                  <input type="number" value={otherDed}
                    onChange={(e) => setOtherDed(Math.max(0, Number(e.target.value) || 0))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-yellow-400 focus:ring-2" />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Employee insurance, NPS, or other deductions.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regime Comparison */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tax Regime Comparison</h3>
          <div className="grid grid-cols-2 gap-3">
            {(["new", "old"] as const).map((r) => {
              const tax = r === "new" ? d.itNew : d.itOld;
              const net = d.gross - d.employeeEPF - d.profTax - tax - d.otherDed;
              const isBetter = tax <= (r === "new" ? d.itOld : d.itNew);
              return (
                <button key={r} onClick={() => setRegime(r)}
                  className={`rounded-xl p-3 border text-left transition ${r === regime ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" : "border-border hover:bg-muted-surface"}`}>
                  <p className="text-xs font-semibold text-muted-foreground">{r === "new" ? "New" : "Old"} Regime</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{inrSym(net)}/yr</p>
                  <p className="text-[10px] text-muted-foreground">Tax: {inrSym(tax)}</p>
                  {isBetter && <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400">Lower Tax</span>}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Click a card to switch regime. Lower tax = higher take-home.</p>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="space-y-4">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Gross Annual Salary", value: d.gross, sub: inrSym(Math.round(d.gross / 12)) + " / month", hi: false },
            { label: "Total Annual Deductions", value: d.totalDed, sub: inrSym(Math.round(d.totalDed / 12)) + " / month", hi: false },
            { label: "Annual Take Home", value: d.net, sub: inrSym(Math.round(d.net / 12)) + " / month", hi: false },
            { label: "Monthly Take Home", value: Math.round(d.net / 12), sub: inrLPA(d.net) + " / year", hi: true },
          ].map(({ label, value, sub, hi }) => (
            <div key={label} className={`rounded-2xl p-4 border ${hi ? "bg-yellow-500 border-yellow-500 text-white" : "border-border bg-surface"}`}>
              <p className={`text-xs font-semibold ${hi ? "text-yellow-100" : "text-muted-foreground"}`}>{label}</p>
              <p className={`mt-1 text-xl font-bold font-display ${hi ? "text-white" : "text-foreground"}`}>{inrSym(value)}</p>
              <p className={`text-[11px] mt-0.5 ${hi ? "text-yellow-100" : "text-muted-foreground"}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* CTC Breakdown Bar */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold mb-3">CTC Breakdown</h3>
          <div className="h-7 rounded-full overflow-hidden flex gap-[2px]">
            {barSegments.map(({ pct, color }) => (
              <div key={color} className={`${color} transition-all duration-300`}
                style={{ width: `${Math.max(pct, 0.3).toFixed(1)}%` }} />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {barSegments.map(({ pct, color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`h-2.5 w-2.5 rounded-sm flex-shrink-0 ${color}`} />
                {label}: {pct.toFixed(1)}%
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Salary Breakdown</h3>
            <div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
              {(["annual", "monthly"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 capitalize transition ${view === v ? "bg-yellow-500 text-white" : "text-muted-foreground hover:bg-muted-surface"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-2 bg-muted-surface"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Earnings</span></div>
          <TableRow label="Basic Salary" value={d.basic} note="40% of CTC" monthly={monthly} />
          <TableRow label="HRA (House Rent Allowance)" value={d.hra} note="50% of basic" monthly={monthly} />
          <TableRow label="LTA (Leave Travel Allowance)" value={d.lta} note="8% of basic" monthly={monthly} />
          <TableRow label="Special Allowance" value={d.special} monthly={monthly} />
          {d.bonus > 0 && <TableRow label="Annual Bonus / Variable Pay" value={d.bonus} note={`${bonusPct}% of CTC`} monthly={monthly} />}
          <div className="flex items-center justify-between px-4 py-3 bg-muted-surface font-bold border-t border-border">
            <span className="text-sm font-bold text-foreground">Gross Salary</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{inrSym(monthly ? Math.round(d.gross / 12) : d.gross)}</span>
          </div>

          <div className="px-4 py-2 bg-muted-surface"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deductions</span></div>
          <div className="flex items-center justify-between px-4 py-2.5 opacity-55">
            <div>
              <span className="text-sm text-foreground">Standard Deduction</span>
              <span className="ml-2 text-[10px] text-muted-foreground">{regime === "new" ? "Rs.75,000" : "Rs.50,000"} · reduces taxable income only</span>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">-{inrSym(monthly ? Math.round(d.stdDeduction / 12) : d.stdDeduction)}</span>
          </div>
          <TableRow label="Employee EPF Contribution" value={d.employeeEPF} note="12% of basic, max Rs.1,800/mo" variant="deduction" monthly={monthly} />
          {d.profTax > 0 && <TableRow label="Professional Tax" value={d.profTax} note="state levy, max Rs.2,400/yr" variant="deduction" monthly={monthly} />}
          <TableRow label="Income Tax (TDS)" value={d.incomeTax} note={regime === "new" ? "New regime slabs + 4% cess" : "Old regime slabs + 80C + 4% cess"} variant="deduction" monthly={monthly} />
          {d.otherDed > 0 && <TableRow label="Other Deductions" value={d.otherDed} variant="deduction" monthly={monthly} />}
          <div className="flex items-center justify-between px-4 py-3 bg-muted-surface font-bold border-t border-border">
            <span className="text-sm font-bold text-foreground">Total Deductions</span>
            <span className="text-sm font-bold text-red-500">-{inrSym(monthly ? Math.round(d.totalDed / 12) : d.totalDed)}</span>
          </div>

          <div className="flex items-center justify-between px-4 py-4 bg-yellow-50 dark:bg-yellow-950/30 border-t-2 border-yellow-400">
            <div>
              <span className="text-base font-bold text-foreground">Net Take Home</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {monthly ? `Monthly · ${inrSym(d.net)} per year` : `Annual · ${inrSym(Math.round(d.net / 12))} per month`}
              </p>
            </div>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-display">
              {inrSym(monthly ? Math.round(d.net / 12) : d.net)}
            </span>
          </div>

          <div className="px-4 py-2 bg-muted-surface border-t border-border"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Employer Contributions (not deducted from take-home)</span></div>
          <TableRow label="Employer EPF Contribution" value={d.employerEPF} note="12% of basic, max Rs.1,800/mo" variant="dimmed" monthly={monthly} />
          <TableRow label="Gratuity (Employer)" value={d.gratuity} note="4.81% of basic" variant="dimmed" monthly={monthly} />
        </div>

        {/* Formula Note */}
        <div className="rounded-2xl border border-border bg-muted-surface p-4 text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground text-sm">How it is calculated</p>
          <p><span className="font-semibold text-foreground">Gross Salary</span> = CTC - Employer EPF - Gratuity</p>
          <p><span className="font-semibold text-foreground">Net Take Home</span> = Gross - Employee EPF - Professional Tax - Income Tax</p>
          <p><span className="font-semibold text-foreground">Income Tax</span> computed under {regime === "new" ? "New Regime (FY 2025-26): slabs 0%, 5%, 10%, 15%, 20%, 25%, 30%. 87A rebate if taxable income <= Rs.12L" : "Old Regime: slabs 0%, 5%, 20%, 30% with 80C deduction and 87A rebate if taxable income <= Rs.5L"}. Plus 4% Health and Education Cess.</p>
        </div>
      </div>
    </div>
  );
}