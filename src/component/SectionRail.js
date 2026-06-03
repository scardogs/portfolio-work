import React from "react";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";

// Vertical scroll-spy rail (desktop only). Shows every section as a dot;
// the active one expands and reveals its label. Click to jump.
export default function SectionRail({ sections = [], activeSection }) {
  const jump = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Box
      display={{ base: "none", lg: "block" }}
      position="fixed"
      right="28px"
      top="50%"
      transform="translateY(-50%)"
      zIndex={900}
    >
      <VStack spacing={4} align="end">
        {sections.map((s) => {
          const active = activeSection === s.id;
          return (
            <HStack
              as="button"
              key={s.id}
              onClick={() => jump(s.id)}
              role="group"
              spacing={3}
              justify="end"
              aria-label={`Go to ${s.label}`}
            >
              <Text
                fontSize="10px"
                letterSpacing="2px"
                textTransform="uppercase"
                fontWeight="500"
                color={active ? "#e0e0e0" : "#666666"}
                opacity={active ? 1 : 0}
                transform={active ? "translateX(0)" : "translateX(8px)"}
                transition="all 0.3s ease"
                _groupHover={{ opacity: 1, transform: "translateX(0)", color: "#e0e0e0" }}
                whiteSpace="nowrap"
              >
                {s.label}
              </Text>
              <Box
                w={active ? "24px" : "8px"}
                h="2px"
                borderRadius="999px"
                bg={active ? "#e0e0e0" : "#3a3a3a"}
                transition="all 0.35s cubic-bezier(0.22,1,0.36,1)"
                _groupHover={{ bg: "#e0e0e0" }}
              />
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
}
