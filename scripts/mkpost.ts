#!/usr/bin/env -S deno run --allow-write

const today = new Date().toISOString().split("T")[0];
const title = prompt("title:")?.trim();

if (!title) {
  console.error("No title provided.");
  Deno.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
const filename = `content/blog/${today}-${slug}.md`;
const content = `+++\ntitle = "${title}"\ndate = ${today}\ndraft = true\n+++\n`;

console.log(`slug:     ${slug}`);
console.log(`filename: ${filename}`);

await Deno.writeTextFile(filename, content);
