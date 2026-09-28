"use client";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/lib/use-debounce";

type SchoolResult = { id: string; name: string; district: string };

export function SchoolAutocomplete({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (school: SchoolResult) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 3) { setResults([]); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/schools/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => { setResults(data.results ?? []); setLoading(false); })
      .catch(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        id="school-autocomplete"
        className="spark-input"
        value={query}
        placeholder="Start typing your school name..."
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        aria-label="School name search"
        aria-autocomplete="list"
        aria-controls="school-results"
        aria-expanded={open && results.length > 0}
      />
      {loading && query.length >= 3 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-spark-ink-muted">Searching…</div>
      )}
      {open && results.length > 0 && (
        <ul id="school-results" className="spark-autocomplete-list" role="listbox" aria-label="School suggestions">
          {results.map((school) => (
            <li
              key={school.id}
              role="option"
              aria-selected={false}
              className="spark-autocomplete-item"
              onClick={() => {
                setQuery(`${school.name} — ${school.district}`);
                setOpen(false);
                onSelect(school);
              }}
            >
              <span className="font-medium">{school.name}</span>{" "}
              <span className="spark-muted">— {school.district}</span>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && debouncedQuery.length >= 3 && results.length === 0 && (
        <div className="spark-autocomplete-list p-3 text-sm text-spark-ink-muted">No schools found. Try a different spelling.</div>
      )}
    </div>
  );
}