import React from "react";
import Head from "next/head";
import PortfolioTab from "../component/portfolio-tab";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz";

const IndexPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "John Michael T. Escarlan",
    url: SITE_URL,
    jobTitle: "Web Developer",
    description:
      "Full-stack web developer specializing in modern web technologies including React, Next.js, Node.js, and MongoDB.",
    sameAs: [],
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "TypeScript",
      "Full-Stack Development",
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "John Michael T. Escarlan | Web Developer Portfolio",
    url: SITE_URL,
    description:
      "Portfolio of John Michael T. Escarlan — a full-stack web developer building modern, high-performance web applications.",
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>John Michael T. Escarlan | Full-Stack Web Developer Portfolio</title>
        <meta
          name="description"
          content="John Michael T. Escarlan — Full-stack web developer specializing in React, Next.js, Node.js & MongoDB. View projects, skills, and experience."
        />
        <meta
          name="keywords"
          content="John Michael Escarlan, web developer, full-stack developer, React developer, Next.js, Node.js, MongoDB, portfolio, JavaScript, TypeScript"
        />
        <meta name="author" content="John Michael T. Escarlan" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="John Michael T. Escarlan | Full-Stack Web Developer"
        />
        <meta
          property="og:description"
          content="Full-stack web developer specializing in React, Next.js, Node.js & MongoDB. View projects, skills, and experience."
        />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="JME Portfolio" />
        <meta property="og:image" content={`${SITE_URL}/icon-512x512.png`} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta
          property="og:image:alt"
          content="John Michael T. Escarlan Portfolio"
        />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="John Michael T. Escarlan | Full-Stack Web Developer"
        />
        <meta
          name="twitter:description"
          content="Full-stack web developer specializing in React, Next.js, Node.js & MongoDB. View projects, skills, and experience."
        />
        <meta name="twitter:image" content={`${SITE_URL}/icon-512x512.png`} />
        <meta
          name="twitter:image:alt"
          content="John Michael T. Escarlan Portfolio"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </Head>
      <PortfolioTab />
    </>
  );
};

export default IndexPage;
