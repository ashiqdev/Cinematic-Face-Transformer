
import React from 'react';
import type { ReferenceAnalysis } from '../types';

interface JsonViewerProps {
  data: ReferenceAnalysis;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const jsonString = JSON.stringify(data, null, 2);

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-green-400'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-cyan-400'; // key
        } else {
          cls = 'text-purple-300'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-orange-400'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-gray-500'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <pre className="bg-gray-900/70 p-4 rounded-lg text-sm overflow-x-auto ring-1 ring-white/10">
      <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
    </pre>
  );
};