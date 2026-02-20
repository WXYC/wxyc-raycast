import { ActionPanel, Action } from "@raycast/api";
import type { LibraryItem, DiscogsSearchResult } from "../api";
import { formatCallNumber } from "../utils/format";

interface LibraryItemActionsProps {
  item: LibraryItem;
  artwork: DiscogsSearchResult | null;
}

export function LibraryItemActions({ item, artwork }: LibraryItemActionsProps) {
  const callNumber = formatCallNumber(item);
  const showDiscogs =
    artwork?.release_url &&
    artwork.album &&
    item.title &&
    artwork.album.toLowerCase() === item.title.toLowerCase();

  return (
    <ActionPanel>
      <Action.OpenInBrowser
        title="Open in Wxyc Library"
        url={item.library_url}
      />
      {showDiscogs && (
        <Action.OpenInBrowser
          title="Open on Discogs"
          url={artwork!.release_url}
          shortcut={{ modifiers: ["cmd"], key: "d" }}
        />
      )}
      {callNumber && (
        <Action.CopyToClipboard
          title="Copy Call Number"
          content={callNumber}
          shortcut={{ modifiers: ["cmd"], key: "c" }}
        />
      )}
      <Action.CopyToClipboard
        title="Copy Artist & Title"
        content={`${item.artist ?? "Unknown"} - ${item.title ?? "Unknown"}`}
        shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
      />
    </ActionPanel>
  );
}
