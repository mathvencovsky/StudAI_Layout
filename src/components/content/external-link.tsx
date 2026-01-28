import { Button } from "@/components/ui/button";
import { extractDomain } from "@/lib/metadata-utils";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

export interface ExternalLinkProps {
  url: string;
  label?: string;
}

/**
 * Displays a button that opens an external link in a new tab.
 */
export const ExternalLink = ({ url, label }: ExternalLinkProps) => {
  const domain = extractDomain(url);
  const displayLabel = label || `Visit ${domain}`;

  return (
    <Button asChild variant="default" className="w-full sm:w-auto">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon className="mr-2 h-4 w-4" />
        {displayLabel}
      </a>
    </Button>
  );
};
