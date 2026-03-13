import { useState, useRef, useEffect, useCallback } from "react";
import { useCreateCompanyMutation } from "../../features/company/companyApi.js";
import toast from "react-hot-toast";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const TYPE_LABELS = {
  company: "Company",
  hr_firm: "HR Firm",
  consultancy: "Consultancy",
};

const TYPE_COLORS = {
  company: "bg-accent-soft text-accent",
  hr_firm: "bg-emerald-soft text-emerald-700",
  consultancy: "bg-amber-soft text-amber-700",
};

export default function CompanySearchInput({ value, onChange, placeholder = "Search company name..." }) {

  const [inputText, setInputText] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompanyType, setNewCompanyType] = useState("company");

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();

  const wrapperRef = useRef(null);
  const debouncedText = useDebounce(inputText, 300);

  useEffect(() => {
    if (!value) setInputText("");
    else if (value.name !== inputText) setInputText(value.name);
  }, [value]);

  useEffect(() => {
    if (!debouncedText || debouncedText.length < 1 || value?.name === debouncedText) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const search = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/companies/search?q=${encodeURIComponent(debouncedText)}`);
        const data = await res.json();
        setResults(data.companies || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsFetching(false);
      }
    };

    search();
  }, [debouncedText]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
        if (!value) setInputText("");
        else setInputText(value.name);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  const handleSelect = (company) => {
    onChange(company);
    setInputText(company.name);
    setIsOpen(false);
    setShowCreateForm(false);
    setResults([]);
  };

  const handleClear = () => {
    onChange(null);
    setInputText("");
    setResults([]);
    setIsOpen(false);
  };

  const handleCreateNew = async () => {
    if (!inputText.trim() || inputText.trim().length < 2) {
      toast.error("Company name must be at least 2 characters");
      return;
    }
    try {
      const result = await createCompany({
        name: inputText.trim(),
        type: newCompanyType,
      }).unwrap();

      if (result.existed) {
        toast.success(`Found existing: ${result.company.name}`);
      } else {
        toast.success(`Created: ${result.company.name}`);
      }
      handleSelect(result.company);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create company");
    }
  };

  const isSelected = !!value;

  return (
    <div className="space-y-1.5" ref={wrapperRef}>
      <label className="block text-sm font-medium text-ink">Current Company</label>

      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (value) onChange(null); // clear selection when user starts retyping
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-all ${
            isSelected
              ? "border-emerald-400 bg-emerald-soft/30 focus:border-emerald-400 focus:ring-emerald-100"
              : "border-default bg-white focus:border-accent focus:ring-accent/10"
          }`}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isFetching && (
            <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          )}
          {isSelected && (
            <button
              type="button"
              onClick={handleClear}
              className="text-ink-faint hover:text-ink transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (inputText.length > 0) && (
          <div className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-default shadow-card-hover overflow-hidden">
            {results.length > 0 ? (
              <ul className="max-h-56 overflow-y-auto py-1">
                {results.map((company) => (
                  <li key={company._id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(company)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-surface-alt transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center text-accent font-display font-bold text-xs flex-shrink-0">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{company.name}</p>
                          {company.industry && (
                            <p className="text-xs text-ink-faint">{company.industry}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {company.isVerified && (
                          <span className="text-emerald-500 text-xs" title="Verified">✓</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[company.type] || TYPE_COLORS.company}`}>
                          {TYPE_LABELS[company.type] || company.type}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !isFetching && (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs text-ink-faint">No matches found for "{inputText}"</p>
                </div>
              )
            )}

            {/* Always show "Add as new" option at bottom */}
            {!isFetching && inputText.trim().length >= 2 && (
              <div className="border-t border-default">
                {!showCreateForm ? (
                  <div>
                    <div className="px-4 py-2 bg-amber-soft border-b border-amber-100">
                      <p className="text-xs text-amber-700 font-medium">⚠️ Don't create a duplicate!</p>
                      <p className="text-xs text-amber-600 mt-0.5">Check if your company already appears in the list above before adding a new one.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(true)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-surface-alt text-sm font-medium text-accent transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center text-base leading-none flex-shrink-0">+</span>
                      Add "{inputText.trim()}" as new
                    </button>
                  </div>
                ) : (
                  <div className="p-3 space-y-2.5">
                    <p className="text-xs font-semibold text-ink">What type of organisation is this?</p>
                    <div className="flex gap-2">
                      {Object.entries(TYPE_LABELS).map(([k, label]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setNewCompanyType(k)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all ${
                            newCompanyType === k
                              ? "border-accent bg-accent text-white"
                              : "border-default text-ink-muted hover:border-accent/40"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      disabled={isCreating}
                      className="w-full bg-accent text-white text-sm font-medium py-2 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-60"
                    >
                      {isCreating ? "Creating..." : `Create "${inputText.trim()}"`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected company chip */}
      {isSelected && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-emerald-600">✓ Selected:</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[value.type] || TYPE_COLORS.company}`}>
            {value.name} · {TYPE_LABELS[value.type] || value.type}
          </span>
        </div>
      )}
    </div>
  );
}
