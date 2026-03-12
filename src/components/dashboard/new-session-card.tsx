import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Plus } from "lucide-react";

/**
 * Card component that prompts users to create a new AI-powered learning track
 */
export function NewSessionCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateTrack = () => {
    navigate({ to: "/criar-trilha" });
  };

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{t("new-session-title")}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {t("new-session-description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={handleCreateTrack} 
          className="w-full gap-2"
          variant="default"
        >
          <Sparkles className="h-4 w-4" />
          {t("new-session-button")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
