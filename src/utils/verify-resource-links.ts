/**
 * Resource Link Verification Utility
 * 
 * Verifies resource URLs and updates their status.
 * Can be run as a scheduled job (Lambda/cron) or manually.
 */

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface VerificationResult {
  resourceId: string;
  url: string;
  status: "verified" | "broken" | "redirect" | "error";
  httpStatus?: number;
  finalUrl?: string;
  error?: string;
}

/**
 * Verify a single URL
 * Uses HEAD request with fallback to GET
 */
export async function verifyUrl(url: string): Promise<{
  status: "verified" | "broken" | "redirect" | "error";
  httpStatus?: number;
  finalUrl?: string;
  error?: string;
}> {
  try {
    // Try HEAD request first (faster)
    const headResponse = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });

    const finalUrl = headResponse.url !== url ? headResponse.url : undefined;
    const status = headResponse.ok ? "verified" : "broken";

    return {
      status: finalUrl ? "redirect" : status,
      httpStatus: headResponse.status,
      finalUrl,
    };
  } catch (headError) {
    // Fallback to GET request
    try {
      const getResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });

      const finalUrl = getResponse.url !== url ? getResponse.url : undefined;
      const status = getResponse.ok ? "verified" : "broken";

      return {
        status: finalUrl ? "redirect" : status,
        httpStatus: getResponse.status,
        finalUrl,
      };
    } catch (getError) {
      return {
        status: "error",
        error: getError instanceof Error ? getError.message : "Unknown error",
      };
    }
  }
}

/**
 * Verify all resources in the catalog
 * Returns array of verification results
 */
export async function verifyAllResources(): Promise<VerificationResult[]> {
  console.log("Starting resource verification...");

  // Get all resources
  const result = await client.models.ResourceCatalog.list();
  const resources = result.data || [];

  console.log(`Found ${resources.length} resources to verify`);

  const results: VerificationResult[] = [];

  // Verify each resource
  for (const resource of resources) {
    console.log(`Verifying: ${resource.title}`);

    const verification = await verifyUrl(resource.url);

    results.push({
      resourceId: resource.id,
      url: resource.url,
      ...verification,
    });

    // Update resource with verification result
    try {
      await client.models.ResourceCatalog.update({
        id: resource.id,
        verified: verification.status === "verified" || verification.status === "redirect",
        httpStatus: verification.httpStatus,
        finalUrl: verification.finalUrl,
        lastVerifiedAt: Date.now(),
      });

      console.log(`✓ Updated: ${resource.title} - ${verification.status}`);
    } catch (error) {
      console.error(`✗ Failed to update: ${resource.title}`, error);
    }

    // Rate limiting: wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\nVerification complete!");
  console.log(`Total: ${results.length}`);
  console.log(`Verified: ${results.filter((r) => r.status === "verified").length}`);
  console.log(`Redirects: ${results.filter((r) => r.status === "redirect").length}`);
  console.log(`Broken: ${results.filter((r) => r.status === "broken").length}`);
  console.log(`Errors: ${results.filter((r) => r.status === "error").length}`);

  return results;
}

/**
 * Verify resources that haven't been checked recently
 * @param daysOld - Only verify resources older than this many days
 */
export async function verifyStaleResources(daysOld: number = 7): Promise<VerificationResult[]> {
  console.log(`Verifying resources older than ${daysOld} days...`);

  const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;

  // Get all resources
  const result = await client.models.ResourceCatalog.list();
  const resources = result.data || [];

  // Filter stale resources
  const staleResources = resources.filter((resource) => {
    if (!resource.lastVerifiedAt) return true; // Never verified
    return resource.lastVerifiedAt < cutoffDate;
  });

  console.log(`Found ${staleResources.length} stale resources`);

  const results: VerificationResult[] = [];

  for (const resource of staleResources) {
    console.log(`Verifying: ${resource.title}`);

    const verification = await verifyUrl(resource.url);

    results.push({
      resourceId: resource.id,
      url: resource.url,
      ...verification,
    });

    // Update resource
    try {
      await client.models.ResourceCatalog.update({
        id: resource.id,
        verified: verification.status === "verified" || verification.status === "redirect",
        httpStatus: verification.httpStatus,
        finalUrl: verification.finalUrl,
        lastVerifiedAt: Date.now(),
      });

      console.log(`✓ Updated: ${resource.title} - ${verification.status}`);
    } catch (error) {
      console.error(`✗ Failed to update: ${resource.title}`, error);
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Get verification statistics
 */
export async function getVerificationStats(): Promise<{
  total: number;
  verified: number;
  broken: number;
  neverChecked: number;
  stale: number;
}> {
  const result = await client.models.ResourceCatalog.list();
  const resources = result.data || [];

  const cutoffDate = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days

  return {
    total: resources.length,
    verified: resources.filter((r) => r.verified).length,
    broken: resources.filter((r) => !r.verified && r.lastVerifiedAt).length,
    neverChecked: resources.filter((r) => !r.lastVerifiedAt).length,
    stale: resources.filter(
      (r) => r.lastVerifiedAt && r.lastVerifiedAt < cutoffDate
    ).length,
  };
}
