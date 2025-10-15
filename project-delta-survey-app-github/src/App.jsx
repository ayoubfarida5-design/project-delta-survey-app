import React, { useMemo, useState } from "react";

const INDUSTRIES = [
  "Retail & Food Service",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Other",
];

// ---------------- Employer config (matches PRI model) ----------------
const ROLE_TYPES = [
  "Primarily entry-level / low-skill positions",
  "A mix of entry- and mid-level positions",
  "Primarily mid-level or specialized roles",
  "Primarily high-skill / highly experienced positions",
];
const HIRING_DIFFICULTY = [
  "Not difficult",
  "Somewhat difficult",
  "Difficult",
  "Extremely difficult",
];
const TURNOVER_COST = ["Minimal cost", "Moderate cost", "High cost", "Very high cost"];
const VALUE_LEVEL = ["Minimal value", "Moderate value", "High value", "Critical value"];
const BUDGET = ["<$200", "$200–$500", "$500–$1000", "$1000+"];
const ADOPT_LIKELIHOOD = [
  "Very unlikely",
  "Somewhat unlikely",
  "Somewhat likely",
  "Very likely",
];
const PREFERRED_VERSION = [
  "A basic, low-cost tool focused on entry-level positions",
  "A specialized solution for mid- and high-skill roles where hiring is harder",
  "A scalable solution that supports both segments",
];
const IMPACT = [
  "No impact",
  "Slightly more likely to pay",
  "Significantly more likely to pay",
  "I would definitely pay",
];

const ROLE_TYPES_SCORE = {
  "Primarily entry-level / low-skill positions": 0,
  "A mix of entry- and mid-level positions": 2,
  "Primarily mid-level or specialized roles": 4,
  "Primarily high-skill / highly experienced positions": 5,
};
const HIRING_DIFFICULTY_SCORE = {
  "Not difficult": 0,
  "Somewhat difficult": 2,
  "Difficult": 4,
  "Extremely difficult": 5,
};
const TURNOVER_COST_SCORE = {
  "Minimal cost": 0,
  "Moderate cost": 2,
  "High cost": 4,
  "Very high cost": 5,
};
const VALUE_LEVEL_SCORE = {
  "Minimal value": 0,
  "Moderate value": 3,
  "High value": 5,
  "Critical value": 6,
};
const BUDGET_SCORE = {"<$200": 0, "$200–$500": 3, "$500–$1000": 4, "$1000+": 5};
const ADOPT_LIKELIHOOD_SCORE = {
  "Very unlikely": 0,
  "Somewhat unlikely": 2,
  "Somewhat likely": 4,
  "Very likely": 5,
};
const IMPACT_SCORE = {
  "No impact": 0,
  "Slightly more likely to pay": 2,
  "Significantly more likely to pay": 4,
  "I would definitely pay": 5,
};

// Readiness thresholds
const READINESS_BANDS = [
  { max: 14, label: "Low", color: "bg-rose-100 text-rose-700 border-rose-300" },
  { max: 24, label: "Medium", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { max: 999, label: "High", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

// ---------------- Employee config (segmentation) ----------------
const ROLE_LEVEL = ["Entry-level", "Mid-level / Specialist", "Senior / Highly skilled", "Executive"];
const YEARS_EXP = ["<1 year", "1–3 years", "3–7 years", "7+ years"];
const EASE_MATCH = ["Very easy", "Somewhat easy", "Somewhat difficult", "Very difficult"];
const USE_PLATFORM = ["Yes", "Maybe", "No"];
const FEATURES = [
  "Skill-based job matching",
  "Direct access to employers",
  "Career growth and training recommendations",
  "Transparent salary and growth paths",
  "Easy application and interview scheduling",
];
const RECOMMEND = ["Not likely", "Somewhat likely", "Very likely"];

const ROLE_LEVEL_TO_SEGMENT = {
  "Entry-level": "Entry",
  "Mid-level / Specialist": "Mid",
  "Senior / Highly skilled": "High",
  "Executive": "High",
};

function SectionTitle({ children, kicker }) {
  return (
    <div className="mb-3">
      {kicker && <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kicker}</div>}
      <h3 className="text-xl font-semibold">{children}</h3>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-lg border border-slate-200 bg-white ${className}`}>{children}</div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Select({ value, onChange, options, placeholder = "Select..." }) {
  return (
    <select
      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Progress({ value, total }) {
  const pct = Math.round((value / Math.max(total, 1)) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ label, tone }) {
  const colors = {
    Low: "bg-rose-100 text-rose-700 border-rose-300",
    Medium: "bg-amber-100 text-amber-800 border-amber-300",
    High: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${colors[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

// ---------------- Employer Form ----------------
function EmployerForm() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [roleType, setRoleType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [turnoverCost, setTurnoverCost] = useState("");
  const [valueLevel, setValueLevel] = useState("");
  const [budget, setBudget] = useState("");
  const [adopt, setAdopt] = useState("");
  const [preferred, setPreferred] = useState("");
  const [impact, setImpact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const answered = [industry, roleType, difficulty, turnoverCost, valueLevel, budget, adopt, preferred, impact].filter(Boolean).length;
  const total = 9;

  const score = useMemo(() => {
    return (
      (ROLE_TYPES_SCORE[roleType] || 0) +
      (HIRING_DIFFICULTY_SCORE[difficulty] || 0) +
      (TURNOVER_COST_SCORE[turnoverCost] || 0) +
      (VALUE_LEVEL_SCORE[valueLevel] || 0) +
      (BUDGET_SCORE[budget] || 0) +
      (ADOPT_LIKELIHOOD_SCORE[adopt] || 0) +
      (IMPACT_SCORE[impact] || 0)
    );
  }, [roleType, difficulty, turnoverCost, valueLevel, budget, adopt, impact]);

  const readiness = useMemo(() => {
    const band = READINESS_BANDS.find((b) => score <= b.max);
    return band ? { label: band.label, className: band.color } : { label: "Low", className: READINESS_BANDS[0].color };
  }, [score]);

  const readyToSubmit = answered === total;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Employer Survey</h2>
          <p className="text-slate-600 text-sm">Estimate payment readiness for your hardest-to-fill roles.</p>
        </div>
        <Badge label={`PRI: ${score}/35`} tone={readiness.label} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company (optional)">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            placeholder="e.g., Acme Tech"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Field>
        <Field label="Industry">
          <Select value={industry} onChange={setIndustry} options={INDUSTRIES} />
        </Field>
        <Field label="Role Types Recruited (most often)">
          <Select value={roleType} onChange={setRoleType} options={ROLE_TYPES} />
        </Field>
        <Field label="Hiring Difficulty (critical roles)">
          <Select value={difficulty} onChange={setDifficulty} options={HIRING_DIFFICULTY} />
        </Field>
        <Field label="Cost of Turnover (critical roles)">
          <Select value={turnoverCost} onChange={setTurnoverCost} options={TURNOVER_COST} />
        </Field>
        <Field label="Value if tool improves time-to-hire & retention">
          <Select value={valueLevel} onChange={setValueLevel} options={VALUE_LEVEL} />
        </Field>
        <Field label="Willingness to Pay (monthly)">
          <Select value={budget} onChange={setBudget} options={BUDGET} />
        </Field>
        <Field label="Likelihood to Adopt After Pilot">
          <Select value={adopt} onChange={setAdopt} options={ADOPT_LIKELIHOOD} />
        </Field>
        <Field label="Preferred Version">
          <Select value={preferred} onChange={setPreferred} options={PREFERRED_VERSION} />
        </Field>
        <Field label="Impact of 20–30% Turnover Reduction">
          <Select value={impact} onChange={setImpact} options={IMPACT} />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Progress value={answered} total={total} />
        <div className="flex items-center gap-3">
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
              readyToSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-400 cursor-not-allowed"
            }`}
            disabled={!readyToSubmit}
            onClick={() => setSubmitted(true)}
          >
            Get Final Rating
          </button>
          <span className="text-xs text-slate-500">Fill all required fields to enable.</span>
        </div>

        {submitted && (
          <div className={`rounded-xl border p-4 ${readiness.className}`}>
            <div className="text-sm">Final Rating</div>
            <div className="text-2xl font-bold leading-tight">{readiness.label} payment readiness</div>
            <p className="text-sm mt-2 opacity-80">
              Score = <strong>{score}</strong> out of 35. Thresholds: Low ≤ 14, Medium 15–24, High ≥ 25.
            </p>
            <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
              <li>Higher scores indicate focus on mid/high-skill roles and stronger ROI from retention gains.</li>
              <li>Offer a short pilot to convert Medium prospects.</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

// ---------------- Employee Form ----------------
function EmployeeForm() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [roleLevel, setRoleLevel] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [ease, setEase] = useState("");
  const [usePlatform, setUsePlatform] = useState("");
  const [feat1, setFeat1] = useState("");
  const [feat2, setFeat2] = useState("");
  const [recommend, setRecommend] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const answered = [industry, roleLevel, yearsExp, ease, usePlatform, feat1, feat2, recommend].filter(Boolean).length;
  const total = 8;

  const segment = roleLevel ? ROLE_LEVEL_TO_SEGMENT[roleLevel] : "";

  const readyToSubmit = answered === total;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Employee Survey</h2>
          <p className="text-slate-600 text-sm">Segment respondents by skill level to inform employer value.</p>
        </div>
        {segment && <Badge label={`Segment: ${segment}`} tone={segment === "High" ? "High" : segment === "Mid" ? "Medium" : "Low"} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name (optional)">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
            placeholder="e.g., Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Industry">
          <Select value={industry} onChange={setIndustry} options={INDUSTRIES} />
        </Field>
        <Field label="Role Level">
          <Select value={roleLevel} onChange={setRoleLevel} options={ROLE_LEVEL} />
        </Field>
        <Field label="Years of Experience">
          <Select value={yearsExp} onChange={setYearsExp} options={YEARS_EXP} />
        </Field>
        <Field label="Ease of finding matching jobs">
          <Select value={ease} onChange={setEase} options={EASE_MATCH} />
        </Field>
        <Field label="Would you use this platform?">
          <Select value={usePlatform} onChange={setUsePlatform} options={USE_PLATFORM} />
        </Field>
        <Field label="Preferred Feature #1">
          <Select value={feat1} onChange={setFeat1} options={FEATURES} />
        </Field>
        <Field label="Preferred Feature #2">
          <Select value={feat2} onChange={setFeat2} options={FEATURES} />
        </Field>
        <Field label="How likely to recommend?">
          <Select value={recommend} onChange={setRecommend} options={RECOMMEND} />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Progress value={answered} total={total} />
        <div className="flex items-center gap-3">
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
              readyToSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-400 cursor-not-allowed"
            }`}
            disabled={!readyToSubmit}
            onClick={() => setSubmitted(true)}
          >
            See Segment
          </button>
          <span className="text-xs text-slate-500">Fill all required fields to enable.</span>
        </div>

        {submitted && segment && (
          <div className={`rounded-xl border p-4 ${
            segment === "High"
              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
              : segment === "Mid"
              ? "bg-amber-100 text-amber-800 border-amber-300"
              : "bg-rose-100 text-rose-700 border-rose-300"
          }`}>
            <div className="text-sm">Skill Segment</div>
            <div className="text-2xl font-bold leading-tight">{segment}</div>
            <p className="text-sm mt-2 opacity-80">
              Entry-level data is less persuasive for employer investment. High-skill respondents increase perceived ROI.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

// ---------------- App Shell ----------------
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm border transition ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function App({ defaultTab = "employer" }) {
  const [tab, setTab] = useState(defaultTab);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-indigo-500">Project Delta</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Survey & Readiness Rating</h1>
            <p className="text-slate-600 mt-1">Two separate forms. Instant results. Bold, modern UI.</p>
          </div>
          <div className="flex items-center gap-2">
            <TabButton active={tab === "employer"} onClick={() => setTab("employer")}>Employer Form</TabButton>
            <TabButton active={tab === "employee"} onClick={() => setTab("employee")}>Employee Form</TabButton>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 gap-6">
          {tab === "employer" ? <EmployerForm /> : <EmployeeForm />}

          <Card className="p-6">
            <SectionTitle kicker="What the rating means">Interpretation</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-rose-200 p-4 bg-rose-50">
                <div className="text-sm font-semibold text-rose-700">Low (0–14)</div>
                <p className="text-sm text-rose-900/80 mt-1">Mostly entry-level focus or low hiring pain; unlikely to pay. Consider a lightweight/low-cost tier or self-serve resources.</p>
              </div>
              <div className="rounded-xl border border-amber-200 p-4 bg-amber-50">
                <div className="text-sm font-semibold text-amber-800">Medium (15–24)</div>
                <p className="text-sm text-amber-900/80 mt-1">Some pain and budget; may convert with a short pilot and clear ROI (time-to-hire, retention metrics).</p>
              </div>
              <div className="rounded-xl border border-emerald-200 p-4 bg-emerald-50">
                <div className="text-sm font-semibold text-emerald-800">High (25–35)</div>
                <p className="text-sm text-emerald-900/80 mt-1">Strong signal for high/mid-skill roles and meaningful turnover cost. Prioritize these leads and propose premium plans.</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-10 text-xs text-slate-500">
        Built for Hossam • PRI model thresholds: Low ≤ 14, Medium 15–24, High ≥ 25
      </footer>
    </div>
  );
}
