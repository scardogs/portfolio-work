import React, { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, useToast, HStack } from "@chakra-ui/react";
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
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          languages: formData.languages.split("\n").filter((l) => l.trim()),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Saved", description: "About section updated", status: "success", duration: 3000, isClosable: true });
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
