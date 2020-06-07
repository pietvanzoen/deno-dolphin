import { Update } from "./updater.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { makeFileName, makeFrontMatter } from "./github.ts";

Deno.test("makeFrontMatter", () => {
  assertEquals(
    makeFrontMatter({ foo: "bar", baz: "qux" }),
    `---
foo: "bar"
baz: "qux"
---`,
    "it parses and renders front matter",
  );
});

Deno.test("makeFileName", () => {
  const update: Update = {
    timestamp: new Date("1995-12-17T03:24:00"),
    content: "# foo bar baz",
  };
  assertEquals(
    makeFileName(update),
    "1995-12-17-foo-bar-baz.md",
    "it creates a filename",
  );

  update.content =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  console.log(makeFileName(update));
  assertEquals(
    makeFileName(update),
    "1995-12-17-lorem-ipsum-dolor-sit-amet-consectetur-adipiscing.md",
    "truncates long content",
  );
});
