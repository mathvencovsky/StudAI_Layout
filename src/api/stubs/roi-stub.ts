import { createStub } from "./base-stub";

export interface ROIMetrics {
  timeInvested: string;
  efficiency: number;
  estimatedROI: string;
  velocity: string;
}

export interface ModuleEfficiency {
  module: string;
  efficiency: number;
  hoursSpent: number;
  expected: number;
}

export async function getROIMetricsStub(): Promise<ROIMetrics> {
  return createStub<ROIMetrics>({
    timeInvested: "185h",
    efficiency: 87,
    estimatedROI: "R$ 45k",
    velocity: "1.3x",
  });
}

export async function getModuleEfficiencyStub(): Promise<ModuleEfficiency[]> {
  return createStub<ModuleEfficiency[]>([
    { module: "Time Value of Money", efficiency: 94, hoursSpent: 12, expected: 14 },
    { module: "Probability Concepts", efficiency: 78, hoursSpent: 18, expected: 16 },
    { module: "Organizing Data", efficiency: 88, hoursSpent: 8, expected: 10 },
    { module: "Common Distributions", efficiency: 65, hoursSpent: 6, expected: 8 },
  ]);
}
