import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';  

import 'highlight.js/styles/atom-one-dark.css';  

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
  const codeRef = useRef(null); 
  useEffect(() => {
    if (codeSnippet && typeof codeSnippet === 'string') {
      const detectionResult = hljs.highlightAuto(codeSnippet, languages);
      setLanguage(detectionResult.language);

      if (codeRef.current) {
        codeRef.current.innerHTML = detectionResult.value;  
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
