import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import mongoose from "mongoose";
import dbConnect from "../../lib/mongodb";
import Project from "../../models/Project";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz";

const C = {
  bg: "#0a0a0a",
  card: "#0d0d0d",
  border: "#1f1f1f",
  borderStrong: "#2a2a2a",
  text: "#e0e0e0",
  muted: "#888888",
  dim: "#555555",
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (/^(https?:|mailto:|tel:)/.test(url)) return url;
  return `https://${url}`;
};

function formatDate(project) {
  const raw = project.projectDate || project.createdAt;
  if (!raw) return "";
  if (project.projectDate && isNaN(Date.parse(project.projectDate))) {
    return project.projectDate.toUpperCase();
  }
  try {
    return new Date(raw)
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
  } catch {
    return "";
  }
}

export default function ProjectDetail({ project, related }) {
  const router = useRouter();
  if (router.isFallback) return null;

  const dateLabel = formatDate(project);
  const description = (project.description || "").split("\n").filter((l) => l.trim());
  const metaDesc = description[0] || `${project.title} — ${project.type}`;

  return (
    <>
      <Head>
        <title>{`${project.title} | John Michael T. Escarlan`}</title>
        <meta name="description" content={metaDesc.slice(0, 160)} />
        <link rel="canonical" href={`${SITE_URL}/projects/${project._id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={metaDesc.slice(0, 160)} />
        <meta property="og:url" content={`${SITE_URL}/projects/${project._id}`} />
        {project.img && <meta property="og:image" content={project.img} />}
      </Head>

      <Box bg={C.bg} minH="100vh" color={C.text}>
        <Container maxW="1000px" px={[4, 6, 8]} py={[8, 10, 14]}>
          {/* Back */}
          <NextLink href="/#projects-section" legacyBehavior>
            <HStack
              as="a"
              spacing={3}
              color={C.muted}
              fontSize="12px"
              letterSpacing="2px"
              textTransform="uppercase"
              fontWeight="500"
              mb={[10, 12, 16]}
              w="fit-content"
              cursor="pointer"
              _hover={{ color: C.text }}
              transition="color 0.3s"
              role="group"
            >
              <Box as="span" _groupHover={{ transform: "translateX(-4px)" }} transition="transform 0.3s">
                <FaArrowLeft size={12} />
              </Box>
              <Text>All Work</Text>
            </HStack>
          </NextLink>

          {/* Header */}
          <VStack align="start" spacing={5} mb={[8, 10, 12]}>
            <HStack spacing={3} divider={<Box w="20px" h="1px" bg={C.borderStrong} />}>
              <Text fontSize="11px" color={C.muted} letterSpacing="3px" textTransform="uppercase" fontWeight="500">
                {project.type}
              </Text>
              {dateLabel && (
                <Text fontSize="11px" color={C.dim} letterSpacing="2px" fontFamily="monospace">
                  {dateLabel}
                </Text>
              )}
            </HStack>

            <Heading
              as="h1"
              fontSize={[34, 46, 60]}
              fontWeight="700"
              letterSpacing="-2px"
              lineHeight="1.02"
            >
              {project.title}
            </Heading>

            {/* CTAs */}
            <HStack spacing={6} pt={2} flexWrap="wrap">
              {project.github && (
                <HStack
                  as="a"
                  href={ensureAbsoluteUrl(project.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  spacing={3}
                  role="group"
                  color={C.muted}
                  fontSize="12px"
                  fontWeight="500"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  py={2}
                  borderBottom={`1px solid ${C.borderStrong}`}
                  _hover={{ color: C.text, borderColor: C.text }}
                  transition="all 0.3s"
                >
                  <FaGithub size={14} />
                  <Text>View Code</Text>
                </HStack>
              )}
              {project.website && (
                <HStack
                  as="a"
                  href={ensureAbsoluteUrl(project.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  spacing={3}
                  role="group"
                  color={C.text}
                  fontSize="12px"
                  fontWeight="500"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  py={2}
                  borderBottom={`1px solid ${C.text}`}
                  _hover={{ color: "#ffffff" }}
                  transition="all 0.3s"
                >
                  <FaExternalLinkAlt size={12} />
                  <Text>Live Preview</Text>
                </HStack>
              )}
            </HStack>
          </VStack>

          {/* Cover image */}
          <Box
            position="relative"
            border={`1px solid ${C.border}`}
            bg={C.card}
            borderRadius="2px"
            overflow="hidden"
            aspectRatio="16 / 9"
            mb={[10, 12, 16]}
          >
            <Box
              as="img"
              src={project.img}
              alt={project.title}
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              objectFit="contain"
              p={[8, 12, 16]}
            />
            <Box
              position="absolute"
              inset={0}
              pointerEvents="none"
              opacity={0.4}
              backgroundImage="linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)"
              backgroundSize="40px 40px"
            />
          </Box>

          {/* Body: description + tech sidebar */}
          <Flex direction={{ base: "column", md: "row" }} gap={[8, 10, 16]} mb={[12, 16, 20]}>
            <Box flex="1">
              <Text
                fontSize="11px"
                color={C.muted}
                letterSpacing="3px"
                textTransform="uppercase"
                fontWeight="500"
                mb={5}
              >
                Overview
              </Text>
              <VStack align="start" spacing={4}>
                {description.length > 0 ? (
                  description.map((line, i) => (
                    <Text key={i} fontSize={[15, 16]} lineHeight="1.8" color="#aaaaaa" fontWeight="300">
                      {line.trim()}
                    </Text>
                  ))
                ) : (
                  <Text fontSize={[15, 16]} color={C.muted}>
                    No description provided.
                  </Text>
                )}
              </VStack>
            </Box>

            {project.technologies?.length > 0 && (
              <Box flex={{ base: "1", md: "0 0 240px" }}>
                <Text
                  fontSize="11px"
                  color={C.muted}
                  letterSpacing="3px"
                  textTransform="uppercase"
                  fontWeight="500"
                  mb={5}
                >
                  Built With
                </Text>
                <VStack align="stretch" spacing={0} divider={<Divider borderColor={C.border} />}>
                  {project.technologies.map((tech, i) => (
                    <HStack key={i} justify="space-between" py={3}>
                      <Text fontSize="14px" color={C.text} fontWeight="400">
                        {tech}
                      </Text>
                      <Text fontSize="11px" color={C.dim} fontFamily="monospace">
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
          </Flex>

          {/* More work */}
          {related.length > 0 && (
            <Box pt={[8, 10, 12]} borderTop={`1px solid ${C.border}`}>
              <Text
                fontSize="11px"
                color={C.muted}
                letterSpacing="3px"
                textTransform="uppercase"
                fontWeight="500"
                mb={6}
              >
                More Work
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
                {related.map((r) => (
                  <NextLink key={r._id} href={`/projects/${r._id}`} legacyBehavior>
                    <Box
                      as="a"
                      role="group"
                      bg={C.card}
                      border={`1px solid ${C.border}`}
                      borderRadius="2px"
                      overflow="hidden"
                      cursor="pointer"
                      _hover={{ borderColor: C.borderStrong, transform: "translateY(-4px)" }}
                      transition="all 0.4s"
                    >
                      <Box position="relative" aspectRatio="16 / 10" bg={C.bg}>
                        <Box
                          as="img"
                          src={r.img}
                          alt={r.title}
                          position="absolute"
                          inset={0}
                          w="100%"
                          h="100%"
                          objectFit="contain"
                          p={5}
                          filter="grayscale(100%)"
                          _groupHover={{ filter: "grayscale(0%)" }}
                          transition="filter 0.5s"
                        />
                      </Box>
                      <Box p={4}>
                        <Text fontSize="14px" fontWeight="600" color={C.text} noOfLines={1} mb={2}>
                          {r.title}
                        </Text>
                        <HStack
                          spacing={2}
                          color={C.dim}
                          fontSize="10px"
                          letterSpacing="2px"
                          textTransform="uppercase"
                          _groupHover={{ color: C.text }}
                          transition="color 0.3s"
                        >
                          <Text>View</Text>
                          <Box as="span" _groupHover={{ transform: "translateX(4px)" }} transition="transform 0.3s">
                            <FaArrowRight size={9} />
                          </Box>
                        </HStack>
                      </Box>
                    </Box>
                  </NextLink>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

export async function getServerSideProps({ params }) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return { notFound: true };
  }

  await dbConnect();
  const doc = await Project.findById(params.id).lean();
  if (!doc) return { notFound: true };

  const serialize = (p) => ({
    _id: p._id.toString(),
    title: p.title || "",
    description: p.description || "",
    img: p.img || "/LOGO.png",
    github: p.github || "",
    website: p.website || "",
    type: p.type || "Project",
    technologies: p.technologies || [],
    projectDate: p.projectDate || "",
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
  });

  const relatedDocs = await Project.find({ _id: { $ne: doc._id } })
    .sort({ order: 1, createdAt: -1 })
    .limit(3)
    .lean();

  return {
    props: {
      project: serialize(doc),
      related: relatedDocs.map((r) => ({
        _id: r._id.toString(),
        title: r.title || "",
        img: r.img || "/LOGO.png",
      })),
    },
  };
}
