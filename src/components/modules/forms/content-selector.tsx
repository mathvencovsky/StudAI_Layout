import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Control, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, ChevronDown, X, Search } from "lucide-react";
import { useAvailableContent } from "@/hooks/modules/use-available-content";
import { useModuleContents } from "@/hooks/modules/use-module-contents";
import { type ModuleFormValues } from "./module-form";
import type { Content } from "@/model/content";

export interface ContentSelectorProps {
  control: Control<ModuleFormValues>;
  name: "contentIds";
  moduleId?: string;
}

/**
 * Content selection and management component as a reusable react-hook-form field:
 * - Integrates with react-hook-form via useController
 * - Calls useAvailableContent to list content items
 * - Calls useModuleContents to initialize the selected content for the module
 * - Allows selecting, reordering, and removing content items
 */
export const ContentSelector: React.FC<ContentSelectorProps> = ({
  control,
  name,
  moduleId,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const { field } = useController({
    name,
    control,
  });

  const { onChange } = field;
  const selectedContentIds: string[] = Array.isArray(field.value)
    ? field.value
    : [];

  const { data: availableContent = [], isLoading: isLoadingAvailableContent } =
    useAvailableContent();

  const {
    data: moduleContentsData,
    isLoading: isLoadingModuleContents,
    isError: isModuleContentsError,
  } = useModuleContents({ moduleId });

  const isLoading = isLoadingAvailableContent || isLoadingModuleContents;

  // Initialize selected content IDs from module contents (on first load)
  useEffect(() => {
    if (!moduleContentsData || isModuleContentsError) {
      return;
    }

    // Only set initial value if the field is empty / not set
    if (selectedContentIds.length > 0) {
      return;
    }

    const sortedItems = [...moduleContentsData].sort(
      (a, b) => a.position - b.position,
    );
    const initialContentIds = sortedItems.map((item) => item.id);

    onChange(initialContentIds);
  }, [
    moduleContentsData,
    isModuleContentsError,
    selectedContentIds.length,
    onChange,
  ]);

  const selectedContent: Content[] = selectedContentIds
    .map((id) => availableContent.find((content) => content.id === id))
    .filter((content): content is Content => content !== undefined);

  const filteredAvailableContent = availableContent.filter((content) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      content.title.toLowerCase().includes(lowerSearch) ||
      content.description.toLowerCase().includes(lowerSearch) ||
      (content.type?.toLowerCase().includes(lowerSearch) ?? false)
    );
  });

  const handleContentToggle = (contentId: string, isSelected: boolean) => {
    if (isSelected) {
      field.onChange([...selectedContentIds, contentId]);
    } else {
      field.onChange(selectedContentIds.filter((id) => id !== contentId));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...selectedContentIds];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      field.onChange(newOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < selectedContentIds.length - 1) {
      const newOrder = [...selectedContentIds];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      field.onChange(newOrder);
    }
  };

  const handleRemoveContent = (contentId: string) => {
    field.onChange(selectedContentIds.filter((id) => id !== contentId));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Content Section */}
      {selectedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("selected-content")} ({selectedContent.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedContent.map((content, index) => (
              <div
                key={content.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-background"
              >
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === selectedContent.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{content.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {content.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {content.description}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveContent(content.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Available Content Section */}
      <div>
        <Label className="text-base font-medium">
          {t("add-content-to-module")}
        </Label>

        {/* Search */}
        <div className="relative mt-2 mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content by title, description, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Available Content List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAvailableContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {searchTerm ? t("no-content-matches") : t("no-content-available")}
            </p>
          ) : (
            filteredAvailableContent.map((content) => {
              const isSelected = selectedContentIds.includes(content.id);
              return (
                <div
                  key={content.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                    isSelected
                      ? "bg-muted border-primary"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleContentToggle(content.id, checked === true)
                    }
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {content.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                      {content.durationInSeconds && (
                        <Badge variant="secondary" className="text-xs">
                          {content.durationInSeconds} {t("seconds")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {content.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
