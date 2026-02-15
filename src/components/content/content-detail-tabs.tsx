import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { markdownConfig } from "@/lib/markdown-config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { AiChatWaitlist } from "@/components/content/ai-chat-waitlist";

export interface ContentDetailTabsProps {
  description: string;
  aiTranscript?: string | null;
  aiSummary?: string | null;
}

/**
 * Displays content details in a tabbed interface with Description, AI Transcript, and AI Summary tabs.
 * Includes a Hide/Show toggle button to collapse/expand all tab content.
 * Shows waitlist for users not in the AI group.
 */
export const ContentDetailTabs = ({
  description,
  aiTranscript,
  aiSummary,
}: ContentDetailTabsProps) => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(true);
  const { isAiUser } = useIsAiUser();

  const onShow = useCallback(() => {
    setIsHidden(false);
  }, []);

  return (
    <TooltipProvider>
      <Tabs defaultValue="description">
        <TabsList>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHidden(!isHidden)}
            title={isHidden ? t("show") : t("hide")}
          >
            {isHidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <TabsTrigger onClick={onShow} value="description">
            {t("description")}
          </TabsTrigger>
          {!aiTranscript ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <TabsTrigger
                    onClick={onShow}
                    value="ai-transcript"
                    disabled
                    className="pointer-events-none opacity-50"
                  >
                    {t("content-transcript")}
                    <Sparkles className="ml-1 h-4 w-4" />
                  </TabsTrigger>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t("content-no-content")}</TooltipContent>
            </Tooltip>
          ) : (
            <TabsTrigger onClick={onShow} value="ai-transcript">
              {t("content-transcript")}
              <Sparkles className="ml-1 h-4 w-4" />
            </TabsTrigger>
          )}
          {!aiSummary ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <TabsTrigger
                    onClick={onShow}
                    value="ai-summary"
                    disabled
                    className="pointer-events-none opacity-50"
                  >
                    {t("content-summary")}
                    <Sparkles className="ml-1 h-4 w-4" />
                  </TabsTrigger>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t("content-no-content")}</TooltipContent>
            </Tooltip>
          ) : (
            <TabsTrigger onClick={onShow} value="ai-summary">
              {t("content-summary")}
              <Sparkles className="ml-1 h-4 w-4" />
            </TabsTrigger>
          )}
        </TabsList>
        {!isHidden && (
          <>
            <TabsContent value="description">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {description}
              </p>
            </TabsContent>
            <TabsContent value="ai-transcript">
              {!isAiUser ? (
                <AiChatWaitlist />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {aiTranscript}
                </p>
              )}
            </TabsContent>
            <TabsContent value="ai-summary">
              {!isAiUser ? (
                <AiChatWaitlist />
              ) : (
                <div className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown {...markdownConfig}>{aiSummary}</ReactMarkdown>
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </TooltipProvider>
  );
};
