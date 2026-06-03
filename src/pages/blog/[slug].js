import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Image,
  Tag,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import dbConnect from "../../lib/mongodb";
import BlogPost from "../../models/BlogPost";
import { renderMarkdown, stripMarkdown } from "../../lib/markdown";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz";

const COLORS = {
  bg: "#0a0a0a",
  card: "#111111",
  codeBg: "#0d0d0d",
  border: "#1f1f1f",
  text: "#e8e8e8",
  muted: "#888888",
  dim: "#555555",
  accent: "#e2b714",
};

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export async function getStaticPaths() {
  await dbConnect();
  const docs = await BlogPost.find({ status: "published" }).select("slug").lean();
  return {
    paths: docs.map((d) => ({ params: { slug: d.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const doc = await BlogPost.findOne({ slug: params.slug, status: "published" }).lean();

  if (!doc) {
    return { notFound: true, revalidate: 60 };
  }

  const post = {
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || "",
    coverImage: doc.coverImage || "",
    tags: doc.tags || [],
    readingTime: doc.readingTime || 1,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
    createdAt: new Date(doc.createdAt).toISOString(),
    contentHtml: renderMarkdown(doc.content || ""),
    description: doc.excerpt || stripMarkdown(doc.content || "", 200),
  };

  return { props: { post }, revalidate: 60 };
}

export default function BlogPostPage({ post }) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${SITE_URL}/icon-512x512.png`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.publishedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: "John Michael T. Escarlan",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <Head>
        <title>{post.title} | Notes — John Michael T. Escarlan</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
        {post.tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
      </Head>

      <Box
        minH="100vh"
        bg={COLORS.bg}
        color={COLORS.text}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        <Container maxW="760px" py={[8, 12, 16]}>
          <NextLink href="/blog" passHref legacyBehavior>
            <HStack
              as="a"
              spacing={2}
              color={COLORS.muted}
              fontSize="11px"
              letterSpacing="2px"
              textTransform="uppercase"
              cursor="pointer"
              _hover={{ color: COLORS.accent }}
              mb={10}
              display="inline-flex"
            >
              <FaArrowLeft size={10} />
              <Text>All notes</Text>
            </HStack>
          </NextLink>

          <Box as="article">
            {/* Meta */}
            <HStack spacing={3} mb={4} color={COLORS.dim} fontSize="11px" letterSpacing="1px">
              <Text>{formatDate(post.publishedAt || post.createdAt)}</Text>
              <Text>·</Text>
              <Text>{post.readingTime} min read</Text>
            </HStack>

            {/* Title */}
            <Heading
              as="h1"
              fontSize={["32px", "40px", "52px"]}
              fontWeight="700"
              letterSpacing="-1.5px"
              lineHeight="1.1"
              mb={4}
            >
              {post.title}
            </Heading>

            {post.excerpt && (
              <Text fontSize={["15px", "17px"]} color={COLORS.muted} mb={8} lineHeight="1.6">
                {post.excerpt}
              </Text>
            )}

            {post.tags.length > 0 && (
              <HStack spacing={2} flexWrap="wrap" mb={8}>
                {post.tags.map((t) => (
                  <Tag
                    key={t}
                    size="sm"
                    bg="transparent"
                    color={COLORS.dim}
                    border={`1px solid ${COLORS.border}`}
                    fontSize="10px"
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    {t}
                  </Tag>
                ))}
              </HStack>
            )}

            {post.coverImage && (
              <Box borderRadius="12px" overflow="hidden" mb={10} border={`1px solid ${COLORS.border}`}>
                <Image src={post.coverImage} alt={post.title} w="100%" h="auto" display="block" />
              </Box>
            )}

            {/* Content */}
            <Box
              className="prose"
              sx={{
                fontSize: ["15px", "16px", "17px"],
                lineHeight: "1.75",
                color: COLORS.text,
                "& h1, & h2, & h3, & h4": {
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.25",
                  marginTop: "2em",
                  marginBottom: "0.6em",
                  color: COLORS.text,
                },
                "& h1": { fontSize: ["26px", "30px", "34px"] },
                "& h2": { fontSize: ["22px", "26px", "28px"] },
                "& h3": { fontSize: ["18px", "20px", "22px"] },
                "& h4": { fontSize: ["16px", "18px"] },
                "& p": { marginBottom: "1.25em" },
                "& a": {
                  color: COLORS.accent,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: "rgba(226,183,20,0.4)",
                },
                "& a:hover": { textDecorationColor: COLORS.accent },
                "& strong": { color: COLORS.text, fontWeight: "600" },
                "& em": { color: COLORS.text },
                "& ul, & ol": { paddingLeft: "1.5em", marginBottom: "1.25em" },
                "& li": { marginBottom: "0.5em" },
                "& blockquote": {
                  borderLeft: `3px solid ${COLORS.accent}`,
                  paddingLeft: "1.25em",
                  margin: "1.5em 0",
                  color: COLORS.muted,
                  fontStyle: "italic",
                },
                "& code": {
                  bg: COLORS.codeBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "4px",
                  padding: "1px 6px",
                  fontSize: "0.88em",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  color: COLORS.accent,
                },
                "& pre": {
                  bg: COLORS.codeBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  padding: "1.1em 1.3em",
                  overflowX: "auto",
                  margin: "1.5em 0",
                  fontSize: "13px",
                  lineHeight: "1.6",
                },
                "& pre code": {
                  bg: "transparent",
                  border: "none",
                  padding: 0,
                  color: COLORS.text,
                  fontSize: "inherit",
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  margin: "1.5em 0",
                  border: `1px solid ${COLORS.border}`,
                },
                "& hr": {
                  border: "none",
                  borderTop: `1px solid ${COLORS.border}`,
                  margin: "2.5em 0",
                },
              }}
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Footer */}
            <Box mt={16} pt={8} borderTop={`1px solid ${COLORS.border}`}>
              <Text fontSize="12px" color={COLORS.dim} letterSpacing="1px">
                Thanks for reading. —{" "}
                <NextLink href="/blog" passHref legacyBehavior>
                  <Text as="a" color={COLORS.accent} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                    More notes
                  </Text>
                </NextLink>
              </Text>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
