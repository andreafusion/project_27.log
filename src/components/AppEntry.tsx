"use client";
import { useState } from "react";
import Terminal from "./Terminal";
import Dashboard from "./Dashboard";

export default function AppEntry() {
  const [phase, setPhase] = useState<"boot" | "dashboard">("boot");

  return (
    <>
      {phase === "boot" && (
        <Terminal onComplete={() => setPhase("dashboard")} />
      )}
      {phase === "dashboard" && <Dashboard />}
    </>
  );
}
