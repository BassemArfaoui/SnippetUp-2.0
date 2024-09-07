import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';  // Import full highlight.js with all languages

// Import a dark theme
import 'highlight.js/styles/atom-one-dark.css';  // Dark theme

// Define the array of languages
const languages = [
  'javascript',
  'python',
  'java',
  'css',
  'html',
  'bash',
  'csharp',
  'php',
  'ruby',
  'swift',
  'typescript',
  'json',
  'yaml',
  'xml',
  'sql',
  'go',
  'rust',
  'scala',
  'kotlin',
  'haskell'
];

const CodeHighlighter = ({ codeSnippet }) => {
  const [language, setLanguage] = useState(null);
  const codeRef = useRef(null);  // Reference to the <code> block

  useEffect(() => {
    if (codeSnippet && typeof codeSnippet === 'string') {
      // Detect the language and highlight
      const detectionResult = hljs.highlightAuto(codeSnippet, languages);
      setLanguage(detectionResult.language);

      // Apply the highlighting
      if (codeRef.current) {
        codeRef.current.innerHTML = detectionResult.value;  // Set the highlighted HTML
      }
    }
  }, [codeSnippet]);

  if (!codeSnippet) {
    return <div>No code snippet provided.</div>;
  }

  return (
    <pre>
      <code ref={codeRef} className={`language-${language}`}>
        {codeSnippet}
      </code>
    </pre>
  );
};

export default CodeHighlighter;
