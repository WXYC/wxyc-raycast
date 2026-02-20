import { describe, it, expect } from "vitest";
import { formatCallNumber, formatSearchType } from "../format";
import type { LibraryItem } from "../../api";

function makeItem(overrides: Partial<LibraryItem> = {}): LibraryItem {
  return {
    id: 1,
    title: "Test Album",
    artist: "Test Artist",
    call_letters: null,
    artist_call_number: null,
    release_call_number: null,
    genre: null,
    format: null,
    library_url: "http://www.wxyc.info/wxycdb/libraryRelease?id=1",
    ...overrides,
  };
}

describe("formatCallNumber", () => {
  it.each([
    {
      name: "all fields present",
      item: makeItem({
        genre: "Rock",
        format: "CD",
        call_letters: "QUE",
        artist_call_number: 42,
        release_call_number: 3,
      }),
      expected: "Rock CD QUE 42/3",
    },
    {
      name: "no release_call_number",
      item: makeItem({
        genre: "Jazz",
        format: "LP",
        call_letters: "COL",
        artist_call_number: 7,
      }),
      expected: "Jazz LP COL 7",
    },
    {
      name: "all null fields",
      item: makeItem(),
      expected: "",
    },
    {
      name: "genre only",
      item: makeItem({ genre: "Electronic" }),
      expected: "Electronic",
    },
    {
      name: "genre and format only",
      item: makeItem({ genre: "Hip Hop", format: "CD" }),
      expected: "Hip Hop CD",
    },
    {
      name: "call letters without numbers",
      item: makeItem({
        genre: "Rock",
        format: "LP",
        call_letters: "BEA",
      }),
      expected: "Rock LP BEA",
    },
    {
      name: "release number without artist number (edge case)",
      item: makeItem({
        genre: "Rock",
        format: "CD",
        call_letters: "ABC",
        release_call_number: 5,
      }),
      // release_call_number only appends /N to the last part, but without artist_call_number
      // the Python code would have parts = ["Rock", "CD", "ABC"] and then parts[-1] = "ABC/5"
      expected: "Rock CD ABC/5",
    },
    {
      name: "numbers without call letters",
      item: makeItem({
        genre: "Rock",
        format: "CD",
        artist_call_number: 10,
        release_call_number: 2,
      }),
      expected: "Rock CD 10/2",
    },
  ])("$name -> $expected", ({ item, expected }) => {
    expect(formatCallNumber(item)).toBe(expected);
  });
});

describe("formatSearchType", () => {
  it.each([
    { type: "direct", expected: "Direct Match" },
    { type: "fallback", expected: "Fallback Search" },
    { type: "alternative", expected: "Alternative Interpretation" },
    { type: "compilation", expected: "Compilation Match" },
    { type: "song_as_artist", expected: "Song as Artist" },
    { type: "none", expected: "No Search" },
    { type: "unknown_value", expected: "unknown_value" },
  ])("$type -> $expected", ({ type, expected }) => {
    expect(formatSearchType(type)).toBe(expected);
  });
});
