/**
 * Truncates a description to a specified number of lines and adds ellipsis if truncated.
 *
 * @param description - The description text to truncate
 * @param maxLines - Maximum number of lines to display (default: 2)
 * @returns Truncated description with ellipsis if needed
 */
export const truncateDescription = (
  description: string,
  maxLines: number = 2
): string => {
  if (!description) {
    return "";
  }

  const lines = description.split("\n");

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join("\n") + "...";
  }

  // Also check if the text is very long on a single line
  const singleLineText = lines.join(" ");
  const estimatedLineLength = 80; // Approximate characters per line
  const maxCharacters = estimatedLineLength * maxLines;

  if (singleLineText.length > maxCharacters) {
    const truncated = singleLineText.substring(0, maxCharacters);
    // Find the last space to avoid cutting words
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }
    return truncated + "...";
  }

  return description;
};

/**
 * Extracts the domain from a URL for display purposes.
 *
 * @param url - The URL to extract the domain from
 * @returns The domain name (e.g., "example.com" from "https://www.example.com/path")
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' prefix if present for cleaner display
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    // If URL parsing fails, return the original URL
    return url;
  }
};
