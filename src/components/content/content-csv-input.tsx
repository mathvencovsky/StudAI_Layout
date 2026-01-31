import { type CreateContentInput, createContent } from "@/api/content";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  CONTENT_TYPES,
  CONTENT_LEVELS,
  type ContentType,
  type ContentLevel,
} from "@/model/content";
import { useRef, useState } from "react";
import Papa from "papaparse";
import { extractYouTubeMetadata } from "@/api/youtube";
import { getYouTubeVideoId } from "@/api/metadata/youtube";

type CsvRow = {
  type: string;
  category: string;
  level: string;
  title: string;
  description: string;
  link: string;
};

function parseCsvFile(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.error("CSV parse errors:", results.errors);
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export const ContentCsvInput = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const rows = await parseCsvFile(file);

      for (const row of rows) {
        try {
          let finalTitle = row.title?.trim() ?? "";
          let finalDescription = row.description?.trim() ?? "";
          let durationInSeconds = 0;

          const needsTitle = !finalTitle;
          const needsDescription = !finalDescription;

          const videoId = getYouTubeVideoId(row.link);
          console.log("videoId:", videoId);

          if (videoId) {
            const metadata = await extractYouTubeMetadata(row.link, videoId);
            console.log("metadata:", metadata);

            if (metadata) {
              durationInSeconds = metadata.durationInSeconds;
              if (needsTitle && metadata.title) {
                finalTitle = metadata.title;
              }
              if (needsDescription && metadata.description) {
                finalDescription = metadata.description;
              }
            }
          }

          const normalizedType = row.type?.replace(/-/g, "_");
          const parsedType = CONTENT_TYPES.includes(normalizedType as ContentType)
            ? (normalizedType as ContentType)
            : "article";
          const parsedLevel = CONTENT_LEVELS.includes(row.level as ContentLevel)
            ? (row.level as ContentLevel)
            : "beginner";

          const input: CreateContentInput = {
            type: parsedType,
            category: row.category,
            level: parsedLevel,
            title: finalTitle,
            description: finalDescription,
            link: row.link,
            durationInSeconds,
          };
          console.log("input:", input);

          await createContent(input);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
          console.error("Failed to import row", row, err);
        }
      }
    } catch (err) {
      console.error("Error while importing CSV", err);
    } finally {
      setIsUploading(false);
      // Reset input so selecting the same file again still triggers change
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button type="button" onClick={handleClick} disabled={isUploading}>
        {isUploading ? t("uploading") : t("upload-csv")}
      </Button>
    </>
  );
};
