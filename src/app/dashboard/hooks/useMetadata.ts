import { useEffect, useState } from "react";

export const useMetadata = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isValidUrl(url)) return;

    const timeout = setTimeout(async () => {
      try {
        setIsFetchingMeta(true);

        const res = await fetch("/api/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const result = await res.json();
        setData(result);
      } catch {
        console.error("Metadata fetch failed");
      } finally {
        setIsFetchingMeta(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [url]);

  return { data, isFetchingMeta };
};
