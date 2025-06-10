// pages/help.tsx

"use client";

import React, { useState } from "react";
import Head from "next/head";

const RuleSection: React.FC<{ title: string; rules: string[] }> = ({
  title,
  rules,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-blue-300 flex justify-between items-center">
          {title}
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-gray-800 rounded-lg">
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const HelpPage: React.FC = () => {
  const generalRules = [
    "Community guidelines are enforced throughout the platform to maintain a positive learning environment for all students and educators.",
    "Academic integrity is paramount. Plagiarism, cheating, and dishonest academic practices are strictly prohibited and will result in disciplinary action.",
    "Respect for all community members is required. Harassment, discrimination, or offensive behavior towards students, teachers, or staff will not be tolerated.",
    "Privacy and personal information must be protected. Sharing personal details of other users without consent is forbidden.",
    "Appropriate language and content are expected at all times. Profanity, inappropriate content, or offensive material will be removed.",
    "Multiple accounts are not permitted. Each student should maintain only one active account on the platform.",
    "Impersonation of other students, teachers, or staff members is strictly prohibited.",
    "System abuse, including attempts to hack, spam, or disrupt platform functionality, will result in immediate account suspension.",
    "Copyright and intellectual property rights must be respected. Unauthorized sharing of copyrighted materials is prohibited.",
    "Students are responsible for maintaining the confidentiality of their login credentials and account security.",
    "False reporting or misuse of the reporting system to harass other users is not allowed.",
    "Commercial activities and advertising are not permitted unless specifically authorized by the institution.",
    "Students must follow their institution's code of conduct and academic policies while using this platform.",
  ];

  const postingRules = [
    "Violations may result in warnings, content removal, or account restrictions depending on severity.",
    "Spam posting, including repetitive or irrelevant content, is prohibited across all platform areas.",
    "Content must be posted in the appropriate course sections or discussion areas to maintain organization.",
    "Use respectful and constructive language in all communications and discussions.",
    "Academic discussions should remain on-topic and contribute meaningfully to the learning experience.",
    "When sharing external links, ensure they are relevant, educational, and from reputable sources.",
    "Include proper citations and references when sharing academic content or research materials.",
    "Group project collaborations should be conducted in designated spaces and follow assignment guidelines.",
    "Cross-posting identical content across multiple courses or sections is discouraged unless relevant.",
    "Discussion titles should clearly reflect the content and purpose of the post.",
    "Students are responsible for all content they post and must ensure it meets academic standards.",
    "Personal disputes should be resolved privately or through appropriate channels, not in public forums.",
    "Sharing of assignment solutions or exam answers is considered academic dishonesty and is prohibited.",
    "Content that violates copyright or academic integrity policies will be removed immediately.",
    "Posts should contribute to the educational environment and support collaborative learning.",
    "Formatting should be clear and professional to enhance readability and communication.",
    "When asking for help, provide sufficient context and show evidence of your own efforts first.",
    "Peer assistance is encouraged, but direct provision of assignment answers is not permitted.",
    "Course-specific guidelines and posting requirements must be followed for each class.",
  ];

  const collaborationRules = [
    "Group work and peer collaboration are encouraged within the guidelines set by individual courses.",
    "Requests for study groups should be made in appropriate course sections or designated collaboration areas.",
    "Academic assistance should focus on understanding concepts rather than providing direct answers.",
    "All collaborative work must comply with individual course policies regarding group assignments.",
    "Peer tutoring and study sessions should be conducted in accordance with institutional guidelines.",
    "Sharing of course materials should only occur as permitted by instructors and institutional policy.",
    "Students should respect intellectual property when collaborating on projects and assignments.",
    "Group project coordination should use designated platform tools and communication channels.",
    "Collaborative discussions should maintain focus on educational objectives and learning outcomes.",
    "Peer feedback should be constructive, respectful, and aimed at supporting academic growth.",
    "Study material exchanges must comply with copyright laws and course-specific sharing policies.",
    "Online study sessions should be conducted in appropriate virtual spaces provided by the platform.",
    "Academic integrity must be maintained in all collaborative activities and group work.",
    "Resource sharing should prioritize educational value and support learning objectives.",
    "Cross-course collaboration should be approved by relevant instructors when appropriate.",
  ];

  const communicationRules = [
    "All platform communication guidelines apply to messaging, forums, and live chat features.",
    "Academic discussions should remain professional and focused on educational content.",
    "Personal conversations should be kept to private messaging when appropriate.",
    "Extended debates or disagreements should be moved to private channels or resolved with instructor guidance.",
    "Inappropriate use of communication features may result in restricted access to these tools.",
    "Requests for academic help should be directed to appropriate channels (instructor, TA, or designated help forums).",
    "Spam messaging, excessive notifications, or communication abuse is strictly prohibited.",
    "Course announcements and important communications should not be obscured by casual conversation.",
    "Professional language standards should be maintained in all course-related communications.",
    "Emergency or urgent academic matters should be communicated through proper institutional channels.",
    "Communication should support the learning environment and respect all participants' time and focus.",
    "Language other than the course instruction language should be used only when specifically permitted.",
    "Voice and video communication should follow the same respectful guidelines as text-based interaction.",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <Head>
        <title>VEC Platform - Help & Information</title>
        <meta
          name="description"
          content="Help and information for VEC learning platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          Welcome to VEC Learning Platform
        </h1>

        <nav className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="#about-us" className="text-blue-300 hover:underline">
                About Our Platform
              </a>
            </li>
            <li>
              <a
                href="#general-rules"
                className="text-blue-300 hover:underline"
              >
                Community Guidelines
              </a>
            </li>
            <li>
              <a
                href="#posting-rules"
                className="text-blue-300 hover:underline"
              >
                Content Guidelines
              </a>
            </li>
            <li>
              <a
                href="#collaboration-rules"
                className="text-blue-300 hover:underline"
              >
                Collaboration Guidelines
              </a>
            </li>
            <li>
              <a
                href="#communication-rules"
                className="text-blue-300 hover:underline"
              >
                Communication Guidelines
              </a>
            </li>
          </ul>
        </nav>

        <section id="about-us" className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            About Our Platform
          </h2>
          <p className="text-gray-300 mb-4">
            VEC (Virtual Education and Communication) is a comprehensive educational platform designed to facilitate 
            effective online learning and collaboration between students, educators, and academic institutions. 
            Our mission is to create an engaging, accessible, and supportive digital learning environment that 
            enhances educational outcomes for learners of all levels.
          </p>
          <p className="text-gray-300 mb-4">
            Our platform supports a wide range of educational activities and features:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Interactive course content and multimedia resources</li>
            <li>Collaborative project spaces and group work tools</li>
            <li>Discussion forums for academic discourse</li>
            <li>Assignment submission and feedback systems</li>
            <li>Virtual classroom and video conferencing capabilities</li>
            <li>Progress tracking and assessment tools</li>
            <li>Peer-to-peer learning and study group formation</li>
            <li>Academic resource sharing and library integration</li>
            <li>Mobile-friendly access for learning on-the-go</li>
          </ul>
          <p className="text-gray-300 mb-4">
            As our platform continues to evolve, we aim to implement advanced features such as 
            AI-powered learning recommendations, integrated academic integrity tools, enhanced 
            accessibility features, and seamless integration with institutional systems.
          </p>
          <p className="text-gray-300">
            We are committed to maintaining a safe, inclusive, and academically rigorous environment 
            where all members of our learning community can thrive. Our dedicated support team and 
            robust moderation systems ensure that our platform remains focused on educational excellence 
            and positive learning experiences for everyone.
          </p>
        </section>

        <section id="general-rules" className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2
            id="general-rules"
            className="text-2xl font-semibold mb-4 text-blue-400"
          >
            Platform Guidelines
          </h2>
          <RuleSection title="Community Guidelines" rules={generalRules} />
          <RuleSection title="Content Guidelines" rules={postingRules} />
          <RuleSection title="Collaboration Guidelines" rules={collaborationRules} />
          <RuleSection title="Communication Guidelines" rules={communicationRules} />
        </section>

        <section className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Terms of Service
          </h2>
          <ol className="list-decimal list-inside text-gray-300">
            <li>
              The institution reserves the right to modify these Terms of Service 
              with appropriate notice to users.
            </li>
            <li>
              All educational content and user contributions are subject to institutional 
              academic policies and intellectual property guidelines.
            </li>
            <li>
              The institution reserves the right to suspend or terminate user accounts 
              for violations of academic integrity or platform guidelines.
            </li>
            <li>
              Content that violates academic standards or institutional policies is prohibited.</li>
            <li>
              Failure to comply with academic integrity policies may result in 
              disciplinary action according to institutional procedures.
            </li>
            <li>
              Users are responsible for maintaining the security and appropriate use of their accounts.
            </li>
            <li>
              The institution is not liable for academic or personal losses that may occur 
              through platform use, though we strive to provide reliable service.
            </li>
            <li>
              By using this platform, users agree to comply with all applicable educational 
              policies and local regulations.
            </li>
          </ol>
        </section>

        <section className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Contact Us
          </h2>
          <p className="text-gray-300">
            For technical support, academic assistance, or general inquiries, please contact us at:{" "}
            <a
              href="mailto:support@vec-platform.edu"
              className="text-blue-400 hover:underline"
            >
              support@vec-platform.edu
            </a>
          </p>
          <p className="mt-4 p-4 bg-blue-900 text-gray-300 rounded-lg italic">
            For urgent academic matters or emergency situations, please contact your 
            instructor directly or use your institution's emergency communication channels.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HelpPage;
