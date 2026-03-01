import { type ReportPeriod } from "@/hooks/reports/use-reports";

/** Groups daily chart data into weekly buckets for the year view */
function groupIntoWeeks(
  data: { date: string; minutes: number }[],
): { date: string; minutes: number }[] {
  const weeks: { date: string; minutes: number }[] = [];
  for (let i = 0; i < data.length; i += 7) {
    const slice = data.slice(i, i + 7);
    weeks.push({
      date: slice[0].date,
      minutes: slice.reduce((sum, d) => sum + d.minutes, 0),
    });
  }
  return weeks;
}

export interface ActivityChartProps {
  data: { date: string; minutes: number }[];
  period: ReportPeriod;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Renders a bar chart of activity minutes per day/week.
 */
export function ActivityChart({ data, period }: ActivityChartProps) {
  const chartData = period === "year" ? groupIntoWeeks(data) : data;
  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);

  return (
    <div className="flex justify-between gap-1 flex-wrap">
      {chartData.map((item, index) => {
        const intensity = item.minutes / maxMinutes;
        const label =
          period === "week"
            ? weekDays[new Date(item.date).getDay()]
            : period === "month"
              ? new Date(item.date).getDate().toString()
              : `W${index + 1}`;
        return (
          <div key={index} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <div
              className="w-full h-6 rounded bg-primary"
              style={{ opacity: Math.max(intensity * 0.8, 0.1) }}
            />
            {period !== "year" && (
              <p className="text-[9px] text-muted-foreground truncate w-full text-center">
                {label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
