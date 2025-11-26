import React from 'react';

const AIPrompt = ({ value, onChange, disabled}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">AI Scoring Prompt</label>
      <textarea
        rows={4}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Describe the behavior you want the AI grader to look for (e.g., focus on correctness, depth, or style)."
        className="w-full border rounded px-3 py-2 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <p className="text-xs text-slate-500 mt-1">
        This prompt is sent alongside submissions so the AI grader knows what to prioritize.
      </p>
    </div>
  );
};

export default AIPrompt;
