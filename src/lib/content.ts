import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  FranceHubFrontmatterSchema,
  HomeOverviewFrontmatterSchema,
  LegalFrontmatterSchema,
  type FranceHubFrontmatter,
  type HomeOverviewFrontmatter,
  type LegalFrontmatter,
} from "./schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type MarkdownBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string };

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "p", text: paragraphBuffer.join(" ").trim() });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "ul", items: [...listBuffer] });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "blockquote", text: line.slice(2).trim() });
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function readMarkdownFile(relativePath: string) {
  const fullPath = path.join(CONTENT_ROOT, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return matter(raw);
}

export function getHomeOverviewContent(): {
  frontmatter: HomeOverviewFrontmatter;
  blocks: MarkdownBlock[];
} {
  const { data, content } = readMarkdownFile(path.join("homepage", "overview.md"));
  return {
    frontmatter: HomeOverviewFrontmatterSchema.parse(data),
    blocks: parseMarkdownBlocks(content),
  };
}

export type LegalSlug = "privacy" | "terms" | "disclaimer";

export function getLegalPageContent(slug: LegalSlug): {
  frontmatter: LegalFrontmatter;
  blocks: MarkdownBlock[];
} {
  const { data, content } = readMarkdownFile(path.join("legal", `${slug}.md`));
  return {
    frontmatter: LegalFrontmatterSchema.parse(data),
    blocks: parseMarkdownBlocks(content),
  };
}

export function getFranceHubContent(): {
  frontmatter: FranceHubFrontmatter;
  blocks: MarkdownBlock[];
} {
  const { data, content } = readMarkdownFile(path.join("countries", "france.md"));
  return {
    frontmatter: FranceHubFrontmatterSchema.parse(data),
    blocks: parseMarkdownBlocks(content),
  };
}
