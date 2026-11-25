import React from "react";
import type { MarkdownBlock } from "@/lib/content";

function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-text">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[0.875em] text-brand"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

export function MarkdownRenderer({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="font-display pt-4 text-xl font-semibold tracking-tight text-text sm:text-2xl"
            >
              {renderInlineFormatting(block.text)}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="font-display pt-2 text-lg font-semibold text-text"
            >
              {renderInlineFormatting(block.text)}
            </h3>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="space-y-2.5 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-muted sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <span>{renderInlineFormatting(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={index}
              className="rounded-r-xl border-l-2 border-brand bg-surface-2/70 px-4 py-3 text-sm leading-relaxed text-muted"
            >
              {renderInlineFormatting(block.text)}
            </blockquote>
          );
        }

        return (
          <p
            key={index}
            className="text-[15px] leading-7 text-muted sm:text-base"
          >
            {renderInlineFormatting(block.text)}
          </p>
        );
      })}
    </div>
  );
}
