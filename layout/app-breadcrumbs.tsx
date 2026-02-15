// src/components/app-breadcrumbs.tsx
import * as React from "react";
import { isMatch, Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumbs() {
  const matches = useMatches();

  // Optional: hide breadcrumbs while loaders are still pending
  if (matches.some((match) => match.status === "pending")) return null;

  // Only keep matches whose loaderData has a `crumb` key
  const crumbMatches = matches.filter((match) =>
    isMatch(match, "loaderData.crumb")
  );

  if (!crumbMatches.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbMatches.map((match, index) => {
          const isLast = index === crumbMatches.length - 1;

          return (
            <React.Fragment key={match.fullPath}>
              <BreadcrumbItem>
                {isLast ? (
                  // Last item = current page
                  <BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
                ) : (
                  // Previous items are links
                  <BreadcrumbLink asChild>
                    {/* `from={match.fullPath}` = "link to this route" */}
                    <Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
