import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { getLegalPageContent } from "@/lib/content";

export function generateMetadata(): Metadata {
  const { frontmatter } = getLegalPageContent("terms");
  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
  };
}

export default function TermsPage() {
  const { frontmatter, blocks } = getLegalPageContent("terms");
  return (
    <LegalDocumentView
      currentSlug="terms"
      frontmatter={frontmatter}
      blocks={blocks}
    />
  );
}
