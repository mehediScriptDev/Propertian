const TermsSidebar = () => {
  const items = [
    { id: "introduction", label: "1. Introduction" },
    { id: "user-obligations", label: "2. User Obligations & Conduct" },
    { id: "intellectual-property", label: "3. Intellectual Property Rights" },
    { id: "disclaimer", label: "4. Disclaimer" },
    { id: "limitation-liability", label: "5. Limitation of Liability" },
    { id: "changes-terms", label: "7. Changes to Terms" },
    { id: "contact-information", label: "8. Contact Information" },
  ];

  return (
    <aside className="w-full lg:w-1/4 sticky top-24 h-screen">
      <nav className="flex flex-col gap-1 p-4 bg-white dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
          Table of Contents
        </h2>
        {items.map(({ id, label }) => (
          <span
            key={id}
            className="text-sm text-charcoal/90 dark:text-soft-grey/90 font-medium px-3 py-2 rounded-md"
          >
            {label}
          </span>
        ))}
      </nav>
    </aside>
  );
};

export default TermsSidebar;
