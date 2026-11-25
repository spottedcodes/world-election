import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { getLegalPageContent } from "@/lib/content";

export function generateMetadata(): Metadata {
  const { frontmatter } = getLegalPageContent("privacy");
  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
  };
}

export default function PrivacyPage() {
  const { frontmatter, blocks } = getLegalPageContent("privacy");
  return (
    <LegalDocumentView
      currentSlug="privacy"
      frontmatter={frontmatter}
      blocks={blocks}
    />
  );
}
