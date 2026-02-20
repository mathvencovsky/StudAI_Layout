import { createStub } from "./base-stub";

export interface SavedItem {
  id: string;
  itemId: string;
  itemType: "track" | "module" | "content" | "assessment";
  title: string;
  thumbnail?: string;
  savedAt: string;
}

export async function getSavedItemsStub(): Promise<SavedItem[]> {
  return createStub([
    {
      id: "1",
      itemId: "t1",
      itemType: "track" as const,
      title: "React Avançado",
      savedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      itemId: "m1",
      itemType: "module" as const,
      title: "TypeScript Fundamentals",
      savedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "3",
      itemId: "c1",
      itemType: "content" as const,
      title: "JavaScript ES6 Features",
      savedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ]);
}

export async function removeSavedItemStub(itemId: string): Promise<void> {
  return createStub(undefined);
}

export async function toggleSavedStub(
  itemId: string,
  itemType: SavedItem["itemType"],
  title: string,
): Promise<SavedItem> {
  return createStub({
    id: Date.now().toString(),
    itemId,
    itemType,
    title,
    savedAt: new Date().toISOString(),
  });
}
