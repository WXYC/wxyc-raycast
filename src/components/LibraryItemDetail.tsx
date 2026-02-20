import { List } from "@raycast/api";
import type { LibraryItem, DiscogsSearchResult } from "../api";
import { formatCallNumber, formatSearchType } from "../utils/format";

interface LibraryItemDetailProps {
  item: LibraryItem;
  artwork: DiscogsSearchResult | null;
  searchType: string;
  parsedSong: string | null;
}

export function LibraryItemDetail({
  item,
  artwork,
  searchType,
  parsedSong,
}: LibraryItemDetailProps) {
  const showArtwork =
    artwork?.artwork_url &&
    artwork.album &&
    item.title &&
    artwork.album.toLowerCase() === item.title.toLowerCase();

  const markdown = showArtwork ? `![Album Art](${artwork!.artwork_url})` : "";

  return (
    <List.Item.Detail
      markdown={markdown || undefined}
      metadata={
        <List.Item.Detail.Metadata>
          {item.artist && (
            <List.Item.Detail.Metadata.Label
              title="Artist"
              text={item.artist}
            />
          )}
          {item.title && (
            <List.Item.Detail.Metadata.Label title="Album" text={item.title} />
          )}
          {item.genre && (
            <List.Item.Detail.Metadata.TagList title="Genre">
              <List.Item.Detail.Metadata.TagList.Item text={item.genre} />
            </List.Item.Detail.Metadata.TagList>
          )}
          {item.format && (
            <List.Item.Detail.Metadata.TagList title="Format">
              <List.Item.Detail.Metadata.TagList.Item text={item.format} />
            </List.Item.Detail.Metadata.TagList>
          )}

          <List.Item.Detail.Metadata.Separator />

          {formatCallNumber(item) && (
            <List.Item.Detail.Metadata.Label
              title="Call Number"
              text={formatCallNumber(item)}
            />
          )}
          {parsedSong && (
            <List.Item.Detail.Metadata.Label
              title="Parsed Song"
              text={parsedSong}
            />
          )}
          <List.Item.Detail.Metadata.Label
            title="Search Strategy"
            text={formatSearchType(searchType)}
          />

          <List.Item.Detail.Metadata.Separator />

          <List.Item.Detail.Metadata.Link
            title="WXYC Library"
            target={item.library_url}
            text="Open"
          />
          {artwork?.release_url && (
            <List.Item.Detail.Metadata.Link
              title="Discogs"
              target={artwork.release_url}
              text="Open"
            />
          )}
        </List.Item.Detail.Metadata>
      }
    />
  );
}
