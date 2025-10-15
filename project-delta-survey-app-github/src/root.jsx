import React, { useState } from "react";
import App from "./App";

function LandingPage({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-center px-6">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Project Delta</h1>
      <p className="text-slate-600 text-lg max-w-2xl mb-10">
        Discover payment readiness and workforce insights with our interactive survey tool. Choose a form below to begin.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => onSelect("employer")}
          className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg transition"
        >
          📊 Start Employer Survey
        </button>
        <button
          onClick={() => onSelect("employee")}
          className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg shadow-lg transition"
        >
          👤 Start Employee Survey
        </button>
      </div>
    </div>
  );
}

export default function Root() {
  const [selectedForm, setSelectedForm] = useState(null);
  return (
    <>
      {!selectedForm ? (
        <LandingPage onSelect={setSelectedForm} />
      ) : (
        <div className="min-h-screen">
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold">← Project Delta Survey</h1>
            <button
              className="text-sm px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg"
              onClick={() => setSelectedForm(null)}
            >
              Back to Landing Page
            </button>
          </div>
          <App defaultTab={selectedForm} />
        </div>
      )}
    </>
  );
}
