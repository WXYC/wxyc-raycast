import {
  List,
  Icon,
  getPreferenceValues,
  showToast,
  Toast,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import type { UnifiedResponse } from "./api";
import { LibraryItemDetail } from "./components/LibraryItemDetail";
import { LibraryItemActions } from "./components/LibraryItemActions";
import { formatSearchType } from "./utils/format";

interface Preferences {
  apiBaseUrl: string;
}

async function lookupRequest(
  searchText: string,
  apiBaseUrl: string,
): Promise<UnifiedResponse> {
  const response = await fetch(`${apiBaseUrl}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: searchText,
      skip_slack: true,
      skip_cache: false,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const detail = body?.detail ?? `HTTP ${response.status}`;
    throw new Error(String(detail));
  }

  return (await response.json()) as UnifiedResponse;
}

export default function Lookup() {
  const [searchText, setSearchText] = useState("");
  const { apiBaseUrl } = getPreferenceValues<Preferences>();

  const { data, isLoading, error } = useCachedPromise(
    (query: string) => lookupRequest(query, apiBaseUrl),
    [searchText],
    {
      execute: searchText.length > 0,
      keepPreviousData: true,
      onError: (err) => {
        showToast({
          style: Toast.Style.Failure,
          title: "Lookup failed",
          message: err.message,
        });
      },
    },
  );

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={!!data?.library_results.length}
      searchBarPlaceholder="What do you want to hear? e.g. 'play Bohemian Rhapsody by Queen'"
      onSearchTextChange={setSearchText}
      throttle
    >
      {!searchText ? (
        <List.EmptyView
          icon={Icon.Music}
          title="WXYC Library Lookup"
          description="Type a natural language query to search the music library"
        />
      ) : error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Connection Error"
          description={error.message}
        />
      ) : data && !data.parsed.is_request ? (
        <List.EmptyView
          icon={Icon.SpeechBubble}
          title="Not a Song Request"
          description={`"${data.parsed.raw_message}" was interpreted as ${data.parsed.message_type.replace("_", " ")}`}
        />
      ) : data && data.library_results.length === 0 ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No Results"
          description={describeQuery(data)}
        />
      ) : data ? (
        <List.Section
          title={data.context_message ?? formatSearchType(data.search_type)}
        >
          {data.library_results.map((item) => (
            <List.Item
              key={item.id}
              title={item.artist ?? "Unknown Artist"}
              subtitle={item.title ?? "Unknown Title"}
              accessories={[
                ...(item.genre ? [{ tag: item.genre }] : []),
                ...(item.format ? [{ tag: item.format }] : []),
              ]}
              detail={
                <LibraryItemDetail
                  item={item}
                  artwork={data.artwork}
                  searchType={data.search_type}
                  parsedSong={data.parsed.song}
                />
              }
              actions={
                <LibraryItemActions item={item} artwork={data.artwork} />
              }
            />
          ))}
        </List.Section>
      ) : null}
    </List>
  );
}

function describeQuery(data: UnifiedResponse): string {
  const parts: string[] = [];
  if (data.parsed.artist) parts.push(`Artist: ${data.parsed.artist}`);
  if (data.parsed.song) parts.push(`Song: ${data.parsed.song}`);
  if (data.parsed.album) parts.push(`Album: ${data.parsed.album}`);
  if (parts.length === 0) return "No matching items found in the library";
  return `No results for ${parts.join(", ")}`;
}
