"use client";
import React, { useState } from "react";

const PolicySideBar = ({ items }) => {
  // Default to the first item on page load (ignore URL hash)
  const [activeId, setActiveId] = useState(() => items?.[0]?.id ?? null);

  // Note: We intentionally do NOT observe scroll/visibility.
  // Active state is controlled only via clicks on the sidebar links.

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      try {
        window.history.replaceState(null, "", `#${id}`);
      } catch {}
    } else {
      // fallback to default navigation if element not present
      try {
        window.location.assign(`#${id}`);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
      <nav className="flex flex-col gap-1 p-4 bg-white/50 dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-3 pb-2 border-b border-gray-200 dark:border-gray-700 mb-2">
          On this page
        </h3>
        {items.map(({ id, label }) => {
          const isActive = id === activeId;
          const base =
            "text-base px-3 py-2 rounded-md transition-colors duration-150";
          const inactiveStyles = "text-gray-600 dark:text-gray-400 hover:bg-primary/10 dark:hover:bg-primary/20 font-medium";
          const activeStyles = "bg-primary/10 dark:bg-primary/20 text-primary dark:text-yellow-200 font-semibold";

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              aria-current={isActive ? "true" : undefined}
              className={`${base} ${isActive ? activeStyles : inactiveStyles}`}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default PolicySideBar;