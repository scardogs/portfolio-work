import React, { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, useToast, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Panel,
  Field,
  TextInput,
  PrimaryButton,
  GhostButton,
  SectionLabel,
  Loading,
} from "../../../component/admin/AdminUI";

export default function ManageContact() {
  const [formData, setFormData] = useState({
    facebook: "",
    facebookUsername: "",
    email: "",
    mobile: "",
    location: "",
    githubLink: "",
    linkedinLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data.success && data.data) {
        setFormData({
          facebook: data.data.facebook || "",
          facebookUsername: data.data.facebookUsername || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
          location: data.data.location || "",
          githubLink: data.data.githubLink || "",
          linkedinLink: data.data.linkedinLink || "",
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch contact data", status: "error", duration: 3000, isClosable: true });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Saved", description: "Contact info updated", status: "success", duration: 3000, isClosable: true });
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
      <PrimaryButton type="submit" form="contact-form" isLoading={loading} h="38px" px={5} fontSize="11px">
        Save Changes
      </PrimaryButton>
    </HStack>
  );

  return (
    <AdminLayout title="Contact Information" subtitle="Edit" actions={actions}>
      {fetching ? (
        <Loading label="Loading contact" />
      ) : (
        <form id="contact-form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch" maxW="900px">
            <Panel>
              <SectionLabel mt={0}>Primary Contact</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Field label="Email" required>
                  <TextInput name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </Field>
                <Field label="Mobile" required>
                  <TextInput name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+63 999 1234567" />
                </Field>
                <Field label="Location" required>
                  <TextInput name="location" value={formData.location} onChange={handleChange} placeholder="Cebu City, PH" />
                </Field>
              </SimpleGrid>
            </Panel>

            <Panel>
              <SectionLabel mt={0}>Social Profiles</SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Field label="Facebook URL" required>
                  <TextInput name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/username" />
                </Field>
                <Field label="Facebook Username" required>
                  <TextInput name="facebookUsername" value={formData.facebookUsername} onChange={handleChange} placeholder="@username" />
                </Field>
                <Field label="GitHub">
                  <TextInput name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="https://github.com/username" />
                </Field>
                <Field label="LinkedIn">
                  <TextInput name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
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
