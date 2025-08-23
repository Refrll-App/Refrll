// components/ui/Input.js
import React from "react";

export const Input = ({ placeholder, onChange, className = "", ...props }) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      {...props}
    />
  </div>
);