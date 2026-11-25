import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { getLegalPageContent } from "@/lib/content";

export function generateMetadata(): Metadata {
  const { frontmatter } = getLegalPageContent("disclaimer");
  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
  };
}

export default function DisclaimerPage() {
  const { frontmatter, blocks } = getLegalPageContent("disclaimer");
  return (
    <LegalDocumentView
      currentSlug="disclaimer"
      frontmatter={frontmatter}
      blocks={blocks}
    />
  );
}
