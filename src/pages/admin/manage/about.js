import React, { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, useToast, HStack, Flex, Text, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Panel,
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  SectionLabel,
  Loading,
} from "../../../component/admin/AdminUI";
import ImageUploader from "../../../component/admin/ImageUploader";

export default function ManageAbout() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
    description: "",
    languages: "",
    education: "",
    jobTitle: "",
    tagline: "",
    quote: "",
    currentJobTitle: "",
    currentCompany: "",
    githubLink: "",
    linkedinLink: "",
    portfolioLink: "",
    emailLink: "",
    loaderStatusText: "Initializing",
    loaderTitle: "",
    loaderSubtitle: "Full-Stack Developer · Portfolio",
    loaderProgressLabel: "LOAD",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about");
      const data = await response.json();
      if (data.success && data.data) {
        setFormData({
          name: data.data.name || "",
          profileImage: data.data.profileImage || "",
          description: data.data.description || "",
          languages: data.data.languages?.join("\n") || "",
          education: data.data.education || "",
          jobTitle: data.data.jobTitle || "",
          tagline: data.data.tagline || "",
          quote: data.data.quote || "",
          currentJobTitle: data.data.currentJobTitle || "",
          currentCompany: data.data.currentCompany || "",
          githubLink: data.data.githubLink || "",
          linkedinLink: data.data.linkedinLink || "",
          portfolioLink: data.data.portfolioLink || "",
          emailLink: data.data.emailLink || "",
          loaderStatusText: data.data.loaderStatusText || "Initializing",
          loaderTitle: data.data.loaderTitle ?? data.data.name ?? "",
          loaderSubtitle: data.data.loaderSubtitle || "Full-Stack Developer · Portfolio",
          loaderProgressLabel: data.data.loaderProgressLabel || "LOAD",
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch about data", status: "error", duration: 3000, isClosable: true });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const payload = {
        ...formData,
        languages: formData.languages.split("\n").filter((l) => l.trim()),
      };
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "portfolio_loader_text",
              JSON.stringify({
                loaderStatusText: payload.loaderStatusText || "Initializing",
                loaderTitle: payload.loaderTitle || payload.name || "John Michael T. Escarlan",
                loaderSubtitle: payload.loaderSubtitle || "Full-Stack Developer · Portfolio",
                loaderProgressLabel: payload.loaderProgressLabel || "LOAD",
              })
            );
          } catch (err) {}
        }
        toast({ title: "Saved", description: "About & Loading Screen settings updated", status: "success", duration: 3000, isClosable: true });
      } else {
        toast({ title: "Error", description: data.message || "Failed to update", status: "error", duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <HStack spacing={2}>
      <GhostButton onClick={() => router.push("/admin/dashboard")} h="38px" px={4} fontSize="11px">
        Cancel
      </GhostButton>
      <PrimaryButton type="submit" form="about-form" isLoading={loading} h="38px" px={5} fontSize="11px">
        Save Changes
      </PrimaryButton>
    </HStack>
  );

  return (
    <AdminLayout title="About Section" subtitle="Edit" actions={actions}>
      {fetching ? (
        <Loading label="Loading content" />
      ) : (
        <form id="about-form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch" maxW="900px">
            <Panel>
              <SectionLabel mt={0}>Loading / Intro Screen</SectionLabel>
              <VStack spacing={5} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Field
                    label="Top Status Text"
                    helper="Small uppercase status text next to the yellow indicator dot."
                  >
                    <TextInput
                      name="loaderStatusText"
                      value={formData.loaderStatusText}
                      onChange={handleChange}
                      placeholder="Initializing"
                    />
                  </Field>
                  <Field
                    label="Progress Bar Label"
                    helper="Label shown on the left side above the loading bar."
                  >
                    <TextInput
                      name="loaderProgressLabel"
                      value={formData.loaderProgressLabel}
                      onChange={handleChange}
                      placeholder="LOAD"
                    />
                  </Field>
                </SimpleGrid>

                <Field
                  label="Main Loading Screen Title / Name"
                  helper="Large animated headline in the center of the loading screen (leave blank to use your Name)."
                >
                  <TextInput
                    name="loaderTitle"
                    value={formData.loaderTitle}
                    onChange={handleChange}
                    placeholder={formData.name || "John Michael T. Escarlan"}
                  />
                </Field>

                <Field
                  label="Loading Screen Subtitle"
                  helper="Subtitle line displayed directly below the main title."
                >
                  <TextInput
                    name="loaderSubtitle"
                    value={formData.loaderSubtitle}
                    onChange={handleChange}
                    placeholder="Full-Stack Developer · Portfolio"
                  />
                </Field>

                {/* Live Preview Box */}
                <Box
                  mt={2}
                  p={[6, 8, 10]}
                  bg="#0a0a0a"
                  border="1px solid #222222"
                  borderRadius="8px"
                  position="relative"
                  overflow="hidden"
                  textAlign="center"
                  backgroundImage="linear-gradient(rgba(224,224,224,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(224,224,224,0.03) 1px, transparent 1px)"
                  backgroundSize="40px 40px"
                >
                  <Text
                    position="absolute"
                    top={2.5}
                    right={3}
                    fontSize="9px"
                    color="#666666"
                    fontFamily="monospace"
                    letterSpacing="2px"
                    textTransform="uppercase"
                  >
                    Live Preview
                  </Text>

                  <Box position="relative" display="inline-block" px={[4, 8]} py={4}>
                    {/* Corner brackets */}
                    <Box position="absolute" top={0} left={0} w="16px" h="16px" borderTop="1px solid rgba(224,224,224,0.4)" borderLeft="1px solid rgba(224,224,224,0.4)" />
                    <Box position="absolute" top={0} right={0} w="16px" h="16px" borderTop="1px solid rgba(224,224,224,0.4)" borderRight="1px solid rgba(224,224,224,0.4)" />
                    <Box position="absolute" bottom={0} left={0} w="16px" h="16px" borderBottom="1px solid rgba(224,224,224,0.4)" borderLeft="1px solid rgba(224,224,224,0.4)" />
                    <Box position="absolute" bottom={0} right={0} w="16px" h="16px" borderBottom="1px solid rgba(224,224,224,0.4)" borderRight="1px solid rgba(224,224,224,0.4)" />

                    <Flex justify="center" align="center" gap={3} mb={4}>
                      <Box w="6px" h="6px" bg="#e2b714" borderRadius="50%" boxShadow="0 0 8px rgba(226,183,20,0.7)" />
                      <Text
                        color="#888888"
                        fontSize="10px"
                        fontWeight="500"
                        letterSpacing="4px"
                        textTransform="uppercase"
                        fontFamily="monospace"
                      >
                        {formData.loaderStatusText || "Initializing"}
                      </Text>
                      <Box w="32px" h="1px" bg="rgba(224,224,224,0.2)" />
                    </Flex>

                    <Heading
                      as="h4"
                      color="#f5f5f5"
                      fontSize={["20px", "26px", "34px"]}
                      fontWeight="700"
                      letterSpacing="-1px"
                      lineHeight="1.1"
                      mb={3}
                    >
                      {formData.loaderTitle || formData.name || "John Michael T. Escarlan"}
                    </Heading>

                    <Flex justify="center" align="center" gap={3} mb={6}>
                      <Box w="24px" h="1px" bg="rgba(255,255,255,0.2)" />
                      <Text
                        color="rgba(255,255,255,0.5)"
                        fontSize="10px"
                        fontWeight="400"
                        letterSpacing="5px"
                        textTransform="uppercase"
                        fontFamily="monospace"
                      >
                        {formData.loaderSubtitle || "Full-Stack Developer · Portfolio"}
                      </Text>
                      <Box w="24px" h="1px" bg="rgba(255,255,255,0.2)" />
                    </Flex>

                    <Box w={["200px", "240px"]} mx="auto">
                      <Flex justify="space-between" mb={1.5} fontFamily="monospace">
                        <Text fontSize="9px" color="rgba(255,255,255,0.35)" letterSpacing="2px" textTransform="uppercase">
                          {formData.loaderProgressLabel || "LOAD"}
                        </Text>
                        <Text fontSize="9px" color="rgba(255,255,255,0.55)" letterSpacing="2px">
                          094 / 100
                        </Text>
                      </Flex>
                      <Box h="2px" bg="rgba(255,255,255,0.08)" borderRadius="2px" overflow="hidden">
                        <Box w="94%" h="100%" bg="linear-gradient(90deg, #888888 0%, #e0e0e0 50%, #888888 100%)" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </VStack>
            </Panel>

            <Panel>
              <SectionLabel mt={0}>Identity</SectionLabel>
              <VStack spacing={5} align="stretch">
                <Field label="Name" required>
                  <TextInput name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
                </Field>

                <Field label="Profile Image">
                  <ImageUploader
                    label=""
                    currentImage={formData.profileImage}
                    onImageSelect={(url) => setFormData({ ...formData, profileImage: url })}
                  />
                </Field>

                <Field label="Description" required helper="Shown in the About section quote box.">
                  <TextArea name="description" value={formData.description} onChange={handleChange} rows={5} />
                </Field>

                <Field label="Languages" helper="One per line, e.g. English (Intermediate)">
                  <TextArea
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    rows={3}
                    placeholder={"English (Intermediate)\nTagalog (Fluent)"}
                  />
                </Field>

                <Field label="Education">
                  <TextInput name="education" value={formData.education} onChange={handleChange} placeholder="University / Degree" />
                </Field>
              </VStack>
            </Panel>

            <Panel>
              <SectionLabel mt={0}>Hero & Tagline</SectionLabel>
              <VStack spacing={5} align="stretch">
                <Field label="Job Title" helper="Main title in the hero section.">
                  <TextInput name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer" />
                </Field>

                <Field label="Tagline">
                  <TextInput name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Building thoughtful digital experiences" />
                </Field>

                <Field label="Quote" helper="Optional quote shown in the About section.">
                  <TextArea name="quote" value={formData.quote} onChange={handleChange} rows={3} />
                </Field>
              </VStack>
            </Panel>

            <Panel>
              <SectionLabel mt={0}>Current Employment</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Field label="Current Job Title" helper="Shown in the experience box.">
                  <TextInput name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} placeholder="Software Developer" />
                </Field>
                <Field label="Current Company">
                  <TextInput name="currentCompany" value={formData.currentCompany} onChange={handleChange} placeholder="Company name" />
                </Field>
              </SimpleGrid>
            </Panel>

            <Panel>
              <SectionLabel mt={0}>Social Links</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Field label="GitHub">
                  <TextInput name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="https://github.com/username" />
                </Field>
                <Field label="LinkedIn">
                  <TextInput name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                </Field>
                <Field label="Portfolio" helper="Optional external portfolio URL.">
                  <TextInput name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://portfolio.com" />
                </Field>
              </SimpleGrid>
            </Panel>

            <Box display={{ base: "block", md: "none" }}>
              <PrimaryButton type="submit" isLoading={loading} w="100%">
                Save Changes
              </PrimaryButton>
            </Box>
          </VStack>
        </form>
      )}
    </AdminLayout>
  );
}
