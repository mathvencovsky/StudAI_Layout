import { useMutation } from "@tanstack/react-query";
import { fetchYouTubeMetadata } from "@/api/metadata/fetch-youtube-metadata";

export const useFetchYouTubeMetadata = () => {
  return useMutation({
    mutationFn: fetchYouTubeMetadata,
  });
};
