import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  SimpleGrid,
  useToast,
  HStack,
  Text,
  Flex,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaPen,
  FaCheck,
} from "react-icons/fa";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Panel,
  Field,
  TextInput,
  PrimaryButton,
  GhostButton,
  SectionLabel,
  Loading,
  COLORS,
} from "../../../component/admin/AdminUI";

function inferHref(label, value, customLink) {
  if (customLink && customLink.trim()) return customLink.trim();
  const v = String(value || "").trim();
  const l = String(label || "").trim().toLowerCase();
  if (!v) return "";
  if (l.includes("mail") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return v.startsWith("mailto:") ? v : `mailto:${v}`;
  }
  if (
    l.includes("phone") ||
    l.includes("mobile") ||
    l.includes("tel") ||
    /^[+\d][\d\s\-()]{6,}$/.test(v)
  ) {
    return v.startsWith("tel:") ? v : `tel:${v.replace(/\s/g, "")}`;
  }
  if (/^https?:\/\//i.test(v)) {
    return v;
  }
  return "";
}

export default function ManageContact() {
  const [details, setDetails] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [facebookUsername, setFacebookUsername] = useState("");
  const [newDetail, setNewDetail] = useState({ label: "", value: "", link: "" });
  const [newSocial, setNewSocial] = useState({ label: "", url: "" });
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
        const d = data.data;
        if (Array.isArray(d.details) && d.details.length > 0) {
          setDetails(
            d.details.map((item) => ({
              label: item.label || "",
              value: item.value || "",
              link: item.link || "",
            }))
          );
        } else {
          const initialDetails = [];
          if (d.email) {
            initialDetails.push({
              label: "EMAIL",
              value: d.email,
              link: `mailto:${d.email}`,
            });
          }
          if (d.mobile) {
            initialDetails.push({
              label: "PHONE",
              value: d.mobile,
              link: `tel:${String(d.mobile).replace(/\s/g, "")}`,
            });
          }
          if (d.location) {
            initialDetails.push({
              label: "BASED",
              value: d.location,
              link: "",
            });
          }
          setDetails(initialDetails);
        }

        if (Array.isArray(d.socialLinks) && d.socialLinks.length > 0) {
          setSocialLinks(
            d.socialLinks.map((item) => ({
              label: item.label || "",
              url: item.url || "",
            }))
          );
        } else {
          const initialSocials = [];
          if (d.githubLink) initialSocials.push({ label: "GitHub", url: d.githubLink });
          if (d.linkedinLink) initialSocials.push({ label: "LinkedIn", url: d.linkedinLink });
          if (d.facebook) initialSocials.push({ label: "Facebook", url: d.facebook });
          setSocialLinks(initialSocials);
        }

        setFacebookUsername(d.facebookUsername || "");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setFetching(false);
    }
  };

  // ─── Contact Details Handlers ──────────────────────────────────────────
  const handleDetailChange = (index, field, val) => {
    setDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleAddDetail = () => {
    const label = newDetail.label.trim();
    const value = newDetail.value.trim();
    if (!label || !value) {
      toast({
        title: "Missing fields",
        description: "Please enter both a Label and a Detail value.",
        status: "warning",
        duration: 2500,
      });
      return;
    }
    setDetails((prev) => [
      ...prev,
      { label: label.toUpperCase(), value, link: newDetail.link.trim() },
    ]);
    setNewDetail({ label: "", value: "", link: "" });
  };

  const handleRemoveDetail = (index) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveDetail = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= details.length) return;
    setDetails((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  // ─── Social Links Handlers ─────────────────────────────────────────────
  const handleSocialChange = (index, field, val) => {
    setSocialLinks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleAddSocial = () => {
    const label = newSocial.label.trim();
    const url = newSocial.url.trim();
    if (!label || !url) {
      toast({
        title: "Missing fields",
        description: "Please enter both a Platform Label and URL.",
        status: "warning",
        duration: 2500,
      });
      return;
    }
    setSocialLinks((prev) => [...prev, { label, url }]);
    setNewSocial({ label: "", url: "" });
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveSocial = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= socialLinks.length) return;
    setSocialLinks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  // ─── Submit / Save ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    // Include any pending text typed into the "Add" row if the user clicked Save directly
    const finalDetails = [...details];
    if (newDetail.label.trim() && newDetail.value.trim()) {
      finalDetails.push({
        label: newDetail.label.trim().toUpperCase(),
        value: newDetail.value.trim(),
        link: newDetail.link.trim(),
      });
      setNewDetail({ label: "", value: "", link: "" });
    }

    const finalSocials = [...socialLinks];
    if (newSocial.label.trim() && newSocial.url.trim()) {
      finalSocials.push({
        label: newSocial.label.trim(),
        url: newSocial.url.trim(),
      });
      setNewSocial({ label: "", url: "" });
    }

    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          details: finalDetails,
          socialLinks: finalSocials,
          facebookUsername,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setDetails(data.data.details || finalDetails);
        setSocialLinks(data.data.socialLinks || finalSocials);
        toast({
          title: "Saved",
          description: "Contact information updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <HStack spacing={2}>
      <GhostButton
        onClick={() => router.push("/admin/dashboard")}
        h="38px"
        px={4}
        fontSize="11px"
      >
        Cancel
      </GhostButton>
      <PrimaryButton
        type="submit"
        form="contact-form"
        isLoading={loading}
        h="38px"
        px={5}
        fontSize="11px"
      >
        Save Changes
      </PrimaryButton>
    </HStack>
  );

  return (
    <AdminLayout
      title="Contact Information"
      subtitle={`${details.length} detail${details.length !== 1 ? "s" : ""} · ${socialLinks.length} social link${socialLinks.length !== 1 ? "s" : ""}`}
      actions={actions}
    >
      {fetching ? (
        <Loading label="Loading contact" />
      ) : (
        <form id="contact-form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch" maxW="1000px">
            {/* ── Contact Details ("Direct Line") ──────────────────────── */}
            <Panel>
              <Flex
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={2}
                mb={4}
              >
                <Box>
                  <SectionLabel mt={0} mb={1}>
                    Direct Line · Contact Details
                  </SectionLabel>
                  <Text fontSize="12px" color={COLORS.muted}>
                    Edit any label or detail value, reorder rows, delete items, or add new contact details below.
                  </Text>
                </Box>
                <Text
                  fontSize="11px"
                  color={COLORS.accent}
                  fontFamily="monospace"
                  letterSpacing="1px"
                >
                  {details.length} {details.length === 1 ? "ITEM" : "ITEMS"}
                </Text>
              </Flex>

              <VStack spacing={3} align="stretch" mb={5}>
                {details.length === 0 ? (
                  <Box
                    p={6}
                    border={`1px dashed ${COLORS.border}`}
                    borderRadius="8px"
                    textAlign="center"
                  >
                    <Text fontSize="13px" color={COLORS.muted}>
                      No contact details yet. Add one below!
                    </Text>
                  </Box>
                ) : (
                  details.map((item, idx) => (
                    <Box
                      key={idx}
                      p={4}
                      bg={COLORS.inputBg}
                      border={`1px solid ${COLORS.border}`}
                      borderRadius="8px"
                      transition="border-color 0.2s"
                      _hover={{ borderColor: COLORS.borderStrong }}
                    >
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        gap={3}
                        align={{ base: "stretch", md: "flex-end" }}
                      >
                        <Box flex={{ base: "1", md: "0 0 180px" }}>
                          <Field label="Label (e.g. EMAIL, PHONE)">
                            <TextInput
                              value={item.label}
                              onChange={(e) =>
                                handleDetailChange(idx, "label", e.target.value)
                              }
                              placeholder="EMAIL"
                            />
                          </Field>
                        </Box>

                        <Box flex="1">
                          <Field label="Detail / Value">
                            <TextInput
                              value={item.value}
                              onChange={(e) =>
                                handleDetailChange(idx, "value", e.target.value)
                              }
                              placeholder="you@example.com or +63 995 7128385"
                            />
                          </Field>
                        </Box>

                        <Box flex="1">
                          <Field label="Optional Link (auto if blank)">
                            <TextInput
                              value={item.link || ""}
                              onChange={(e) =>
                                handleDetailChange(idx, "link", e.target.value)
                              }
                              placeholder="mailto:..., tel:..., or https://..."
                            />
                          </Field>
                        </Box>

                        <HStack
                          spacing={1}
                          justify={{ base: "flex-end", md: "center" }}
                          pb={{ base: 0, md: "2px" }}
                        >
                          <IconButton
                            icon={<FaArrowUp size={11} />}
                            aria-label="Move up"
                            size="sm"
                            variant="ghost"
                            color={COLORS.muted}
                            isDisabled={idx === 0}
                            onClick={() => handleMoveDetail(idx, -1)}
                            _hover={{ color: COLORS.text, bg: COLORS.card }}
                          />
                          <IconButton
                            icon={<FaArrowDown size={11} />}
                            aria-label="Move down"
                            size="sm"
                            variant="ghost"
                            color={COLORS.muted}
                            isDisabled={idx === details.length - 1}
                            onClick={() => handleMoveDetail(idx, 1)}
                            _hover={{ color: COLORS.text, bg: COLORS.card }}
                          />
                          <IconButton
                            icon={<FaTrash size={11} />}
                            aria-label="Delete detail"
                            size="sm"
                            variant="ghost"
                            color="#ef4444"
                            onClick={() => handleRemoveDetail(idx)}
                            _hover={{ bg: "rgba(239,68,68,0.12)" }}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  ))
                )}
              </VStack>

              {/* Add New Contact Detail Box */}
              <Box
                p={4}
                border={`1px dashed ${COLORS.borderStrong}`}
                borderRadius="8px"
                bg="rgba(255,255,255,0.01)"
              >
                <Text
                  fontSize="11px"
                  color={COLORS.accent}
                  fontWeight="600"
                  letterSpacing="1.5px"
                  textTransform="uppercase"
                  mb={3}
                >
                  + Add New Contact Detail
                </Text>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  gap={3}
                  align={{ base: "stretch", md: "flex-end" }}
                >
                  <Box flex={{ base: "1", md: "0 0 180px" }}>
                    <Field label="Label">
                      <TextInput
                        value={newDetail.label}
                        onChange={(e) =>
                          setNewDetail({ ...newDetail, label: e.target.value })
                        }
                        placeholder="e.g. DISCORD, TELEGRAM"
                      />
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field label="Detail / Value">
                      <TextInput
                        value={newDetail.value}
                        onChange={(e) =>
                          setNewDetail({ ...newDetail, value: e.target.value })
                        }
                        placeholder="e.g. @username or +63 999 123 4567"
                      />
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field label="Optional Link">
                      <TextInput
                        value={newDetail.link}
                        onChange={(e) =>
                          setNewDetail({ ...newDetail, link: e.target.value })
                        }
                        placeholder="https://... (optional)"
                      />
                    </Field>
                  </Box>
                  <PrimaryButton
                    type="button"
                    onClick={handleAddDetail}
                    leftIcon={<FaPlus size={11} />}
                    h="42px"
                    px={5}
                    flexShrink={0}
                  >
                    Add Detail
                  </PrimaryButton>
                </Flex>
              </Box>
            </Panel>

            {/* ── Social Profiles ("Elsewhere") ────────────────────────── */}
            <Panel>
              <Flex
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={2}
                mb={4}
              >
                <Box>
                  <SectionLabel mt={0} mb={1}>
                    Elsewhere · Social Profiles
                  </SectionLabel>
                  <Text fontSize="12px" color={COLORS.muted}>
                    Add, edit, reorder, or remove social links shown in the Contact section.
                  </Text>
                </Box>
                <Text
                  fontSize="11px"
                  color={COLORS.accent}
                  fontFamily="monospace"
                  letterSpacing="1px"
                >
                  {socialLinks.length} {socialLinks.length === 1 ? "LINK" : "LINKS"}
                </Text>
              </Flex>

              <VStack spacing={3} align="stretch" mb={5}>
                {socialLinks.map((social, idx) => (
                  <Box
                    key={idx}
                    p={4}
                    bg={COLORS.inputBg}
                    border={`1px solid ${COLORS.border}`}
                    borderRadius="8px"
                    transition="border-color 0.2s"
                    _hover={{ borderColor: COLORS.borderStrong }}
                  >
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      gap={3}
                      align={{ base: "stretch", md: "flex-end" }}
                    >
                      <Box flex={{ base: "1", md: "0 0 220px" }}>
                        <Field label="Platform Label">
                          <TextInput
                            value={social.label}
                            onChange={(e) =>
                              handleSocialChange(idx, "label", e.target.value)
                            }
                            placeholder="GitHub"
                          />
                        </Field>
                      </Box>

                      <Box flex="1">
                        <Field label="Profile URL">
                          <TextInput
                            value={social.url}
                            onChange={(e) =>
                              handleSocialChange(idx, "url", e.target.value)
                            }
                            placeholder="https://github.com/username"
                          />
                        </Field>
                      </Box>

                      <HStack
                        spacing={1}
                        justify={{ base: "flex-end", md: "center" }}
                        pb={{ base: 0, md: "2px" }}
                      >
                        <IconButton
                          icon={<FaArrowUp size={11} />}
                          aria-label="Move up"
                          size="sm"
                          variant="ghost"
                          color={COLORS.muted}
                          isDisabled={idx === 0}
                          onClick={() => handleMoveSocial(idx, -1)}
                          _hover={{ color: COLORS.text, bg: COLORS.card }}
                        />
                        <IconButton
                          icon={<FaArrowDown size={11} />}
                          aria-label="Move down"
                          size="sm"
                          variant="ghost"
                          color={COLORS.muted}
                          isDisabled={idx === socialLinks.length - 1}
                          onClick={() => handleMoveSocial(idx, 1)}
                          _hover={{ color: COLORS.text, bg: COLORS.card }}
                        />
                        <IconButton
                          icon={<FaTrash size={11} />}
                          aria-label="Delete social link"
                          size="sm"
                          variant="ghost"
                          color="#ef4444"
                          onClick={() => handleRemoveSocial(idx)}
                          _hover={{ bg: "rgba(239,68,68,0.12)" }}
                        />
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>

              {/* Add New Social Link Box */}
              <Box
                p={4}
                border={`1px dashed ${COLORS.borderStrong}`}
                borderRadius="8px"
                bg="rgba(255,255,255,0.01)"
              >
                <Text
                  fontSize="11px"
                  color={COLORS.accent}
                  fontWeight="600"
                  letterSpacing="1.5px"
                  textTransform="uppercase"
                  mb={3}
                >
                  + Add New Social Link
                </Text>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  gap={3}
                  align={{ base: "stretch", md: "flex-end" }}
                >
                  <Box flex={{ base: "1", md: "0 0 220px" }}>
                    <Field label="Platform Label">
                      <TextInput
                        value={newSocial.label}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, label: e.target.value })
                        }
                        placeholder="e.g. Instagram, X, Facebook"
                      />
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field label="Profile URL">
                      <TextInput
                        value={newSocial.url}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </Field>
                  </Box>
                  <PrimaryButton
                    type="button"
                    onClick={handleAddSocial}
                    leftIcon={<FaPlus size={11} />}
                    h="42px"
                    px={5}
                    flexShrink={0}
                  >
                    Add Social
                  </PrimaryButton>
                </Flex>
              </Box>
            </Panel>

            {/* ── Live Preview of Public Contact Stack ─────────────────── */}
            <Panel>
              <SectionLabel mt={0} mb={3}>
                Live Preview · Public Contact Card
              </SectionLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box bg="#0d0d0d" border="1px solid #1f1f1f" p={5}>
                  <HStack spacing={2} mb={4}>
                    <Box w="6px" h="6px" borderRadius="50%" bg="#e0e0e0" />
                    <Text
                      fontSize="10px"
                      color="#888888"
                      letterSpacing="3px"
                      textTransform="uppercase"
                      fontWeight="500"
                    >
                      Direct Line
                    </Text>
                  </HStack>
                  {details.map((item, i) => {
                    const href = inferHref(item.label, item.value, item.link);
                    return (
                      <Box
                        key={i}
                        py={2.5}
                        borderBottom={
                          i === details.length - 1 ? "none" : "1px solid #1f1f1f"
                        }
                      >
                        <Text
                          fontSize="9px"
                          color="#555555"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontWeight="500"
                          mb={1}
                          fontFamily="monospace"
                        >
                          {item.label || "LABEL"}
                        </Text>
                        <Text
                          fontSize="13px"
                          color="#e0e0e0"
                          textDecoration={href ? "underline" : "none"}
                          textDecorationColor="#444"
                        >
                          {item.value || "—"}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>

                <Box bg="#0d0d0d" border="1px solid #1f1f1f" p={5}>
                  <Text
                    fontSize="10px"
                    color="#888888"
                    letterSpacing="3px"
                    textTransform="uppercase"
                    fontWeight="500"
                    mb={4}
                  >
                    Elsewhere
                  </Text>
                  <VStack spacing={0} align="stretch">
                    {socialLinks.map((social, i) => (
                      <Flex
                        key={i}
                        py={2.5}
                        borderBottom={
                          i === socialLinks.length - 1
                            ? "none"
                            : "1px solid #1f1f1f"
                        }
                        justify="space-between"
                        align="center"
                      >
                        <Text
                          fontSize="12px"
                          color="#888888"
                          fontWeight="500"
                          letterSpacing="2px"
                          textTransform="uppercase"
                        >
                          {social.label || "Platform"}
                        </Text>
                        <Text fontSize="12px" color="#444444">
                          →
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </SimpleGrid>
            </Panel>

            <Box>
              <PrimaryButton type="submit" isLoading={loading} w={{ base: "100%", md: "auto" }} px={8}>
                Save Contact Information
              </PrimaryButton>
            </Box>
          </VStack>
        </form>
      )}
    </AdminLayout>
  );
}
