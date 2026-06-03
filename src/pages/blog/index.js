import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  Badge,
  Tag,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import dbConnect from "../../lib/mongodb";
import BlogPost from "../../models/BlogPost";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz";

const COLORS = {
  bg: "#0a0a0a",
  card: "#111111",
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
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export async function getStaticProps() {
  await dbConnect();
  const docs = await BlogPost.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(50)
    .lean();

  const posts = docs.map((p) => ({
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    coverImage: p.coverImage || "",
    tags: p.tags || [],
    readingTime: p.readingTime || 1,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    createdAt: new Date(p.createdAt).toISOString(),
  }));

  return { props: { posts }, revalidate: 60 };
}

export default function BlogIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Notes & Writing | John Michael T. Escarlan</title>
        <meta
          name="description"
          content="Notes on web development, React, Next.js, performance, and what I'm learning."
        />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Notes & Writing | John Michael T. Escarlan" />
        <meta property="og:description" content="Notes on web development and engineering." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Box minH="100vh" bg={COLORS.bg} color={COLORS.text} fontFamily="system-ui, -apple-system, sans-serif">
        <Container maxW="container.lg" py={[10, 14, 20]}>
          {/* Back link */}
          <NextLink href="/" passHref legacyBehavior>
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
              <Text>Back to portfolio</Text>
            </HStack>
          </NextLink>

          {/* Header */}
          <Box mb={[10, 14]}>
            <Text
              fontSize="11px"
              color={COLORS.muted}
              letterSpacing="4px"
              textTransform="uppercase"
              mb={3}
            >
              Notes
            </Text>
            <Heading
              as="h1"
              fontSize={["36px", "48px", "64px"]}
              fontWeight="700"
              letterSpacing="-2px"
              lineHeight="1"
              mb={4}
            >
              Writing & <Text as="span" color={COLORS.accent}>Notes</Text>
            </Heading>
            <Text fontSize={["14px", "16px"]} color={COLORS.muted} maxW="600px">
              Thoughts on web development, the projects I'm building, and what I'm
              learning along the way.
            </Text>
          </Box>

          {/* Posts */}
          {posts.length === 0 ? (
            <Box
              border={`1px solid ${COLORS.border}`}
              borderRadius="12px"
              p={10}
              textAlign="center"
            >
              <Text color={COLORS.muted} fontSize="13px">
                No posts yet. Check back soon.
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch" divider={<Box h="1px" bg={COLORS.border} />}>
              {posts.map((post) => (
                <NextLink key={post._id} href={`/blog/${post.slug}`} passHref legacyBehavior>
                  <Box
                    as="a"
                    py={[6, 8]}
                    display="block"
                    role="group"
                    cursor="pointer"
                    transition="all 0.25s ease"
                    _hover={{ transform: "translateX(4px)" }}
                  >
                    <Flex direction={["column", "column", "row"]} gap={[4, 6]} align="flex-start">
                      {post.coverImage && (
                        <Box
                          flexShrink={0}
                          w={["100%", "100%", "200px"]}
                          h={["180px", "200px", "120px"]}
                          borderRadius="8px"
                          overflow="hidden"
                          bg={COLORS.card}
                        >
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            transition="transform 0.5s ease"
                            _groupHover={{ transform: "scale(1.05)" }}
                          />
                        </Box>
                      )}
                      <Box flex="1">
                        <HStack spacing={3} mb={2} color={COLORS.dim} fontSize="11px" letterSpacing="1px">
                          <Text>{formatDate(post.publishedAt || post.createdAt)}</Text>
                          <Text>·</Text>
                          <Text>{post.readingTime} min read</Text>
                        </HStack>
                        <Heading
                          as="h2"
                          fontSize={["20px", "24px", "28px"]}
                          fontWeight="600"
                          letterSpacing="-0.5px"
                          mb={2}
                          _groupHover={{ color: COLORS.accent }}
                          transition="color 0.25s ease"
                        >
                          {post.title}
                        </Heading>
                        {post.excerpt && (
                          <Text color={COLORS.muted} fontSize={["13px", "14px"]} mb={3} noOfLines={2}>
                            {post.excerpt}
                          </Text>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <HStack spacing={2} flexWrap="wrap">
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
                      </Box>
                      <Box
                        color={COLORS.dim}
                        alignSelf="center"
                        _groupHover={{ color: COLORS.accent, transform: "translateX(4px)" }}
                        transition="all 0.25s ease"
                        display={["none", "none", "block"]}
                      >
                        <FaArrowRight />
                      </Box>
                    </Flex>
                  </Box>
                </NextLink>
              ))}
            </VStack>
          )}
        </Container>
      </Box>
    </>
  );
}
