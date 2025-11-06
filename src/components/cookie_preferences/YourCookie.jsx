"use client";
import { useCallback, useState } from "react";

const cookieCategories = [
  {
    id: "essential",
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off. They are always active.",
    iconName: "lock",
    mandatory: true,
  },
  {
    id: "analytics",
    title: "Analytics Cookies",
    description:
      "These cookies allow us to count visits and traffic sources to measure and improve the performance of our site.",
    iconName: "bar_chart",
    mandatory: false,
    initialChecked: true,
  },
  {
    id: "marketing",
    title: "Marketing Cookies",
    description:
      "These cookies are used to build a profile of your interests and show you relevant adverts and property recommendations.",
    iconName: "campaign",
    mandatory: false,
    initialChecked: false,
  },
];

/**
 * Cookie Preference Management Modal (YourCookie Component).
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Array<object>} props.cookieCategories // Data array
 */

// **FIX APPLIED HERE:** Destructuring isOpen and onClose from props
export default function YourCookie({ isOpen, onClose }) {
  // --- 1. HOOKS AND STATE DEFINITIONS (Must be at the top) ---

  const initialPreferences = cookieCategories
    .filter((cat) => !cat.mandatory)
    .reduce((acc, cat) => {
      acc[cat.id] = cat.initialChecked || false;
      return acc;
    }, {});

  const [preferences, setPreferences] = useState(initialPreferences);

  const handleToggleChange = useCallback((id) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // --- 2. HANDLER LOGIC ---

  const handleSavePreferences = () => {
    console.log("Saving Preferences:", preferences);
    // onClose is now defined
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted = cookieCategories
      .filter((cat) => !cat.mandatory)
      .reduce((acc, cat) => {
        acc[cat.id] = true;
        return acc;
      }, {});

    console.log("Accepting All:", allAccepted);
    setPreferences(allAccepted);
    // onClose is now defined
    onClose();
  };

  // --- 3. CONDITIONAL RETURN ---

  // isOpen is now defined
  if (!isOpen) {
    return null;
  }

  // --- 4. RENDERED JSX (Map is correct) ---

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:flex lg:gap-10">
        <p className="text-4xl text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus,
          molestiae? Cum sequi, at in modi blanditiis nemo odit ipsam ratione.
          Commodi hic quibusdam expedita magni placeat beatae sit in, est maxime
          doloribus eum ducimus quas soluta officiis ab consectetur? Quibusdam
          veniam saepe inventore iure rerum nobis nesciunt excepturi voluptatum
          quas? Rerum optio mollitia, aliquid eum debitis fugiat explicabo
          atque, eius dolorum quo corporis doloribus, magnam impedit odio nisi
          expedita blanditiis! Repudiandae, quisquam distinctio consequatur
          nostrum, ea rerum dolores reprehenderit magnam optio doloremque
          dolorem modi incidunt labore explicabo rem impedit dolorum
          voluptatibus necessitatibus maxime? Voluptatum hic, ipsum, accusantium
          minima eius, doloribus distinctio culpa nihil libero corrupti quidem!
          Odit illum quas maiores cupiditate voluptatibus maxime nobis libero
          cumque necessitatibus, voluptate facere rem, delectus ipsam alias nemo
          dicta sit rerum officia! Aliquam laborum sapiente accusamus ipsa,
          dolores numquam quam architecto magnam voluptates sit omnis nemo
          voluptatum blanditiis culpa sunt fugit quasi enim maiores harum quia
          soluta, nobis quidem ad? Vero nihil dolor vitae eius impedit, beatae
          laudantium laboriosam provident similique qui fugiat quam fuga rem
          voluptates adipisci dolores molestias pariatur aperiam necessitatibus
          repudiandae! Pariatur, corrupti sit delectus ad quae beatae dicta aut
          repellendus ullam. Eaque quos officia fuga numquam, voluptate
          reiciendis odio ad?
        </p>

        <div
          className="fixed inset-0 w-full flex items-center justify-center p-4 z-[9999]"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSCFYlYxB8h35FnF2HDlS5Xxvj-8UcUBS1TLLSrohAX36u_huMWAQqTdr6cypYeIoVVWwxHr0nHHNi0PzVnB5R_fo7ZT3NBoOGztJSuPbrEYDB4dt-y6teHPX5Bz0e0O1YNku112Gv_5sAdk2jGyzMgA506YzVzrZYGFI_AGEseFE3h6ODfbUzDKt2QFL9-txpAExIhq7rqB_ECMF9ogGGLSIhkpLfS1CgKDR_Up0SQWg_R7_X8vgE9K1Lopyf7yQsnF06_QIj6xI')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            // onClose is now defined
            onClick={onClose}
          />

          {/* Modal Dialog Box */}
          <div
            className="relative z-50 flex w-full max-w-2xl flex-col rounded-xl bg-brand-ivory shadow-2xl dark:bg-[#202932]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h1
                id="modal-title"
                className="text-2xl font-bold text-brand-navy dark:text-white"
              >
                Manage Your Cookie Preferences
              </h1>
              <button
                // onClose is now defined
                onClick={onClose}
                aria-label="Close preferences"
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-6 p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-base text-brand-dark-grey dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. You can control
                your preferences for each category below.
              </p>

              {/* Cookie Category List (The Map is Correct) */}
              <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                {cookieCategories.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 py-4">
                    {/* Icon Container */}
                    <div className="text-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-brand-gold">
                      <span className="material-symbols-outlined text-2xl">
                        {doc.iconName}
                      </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow">
                      <p className="text-base font-medium text-brand-dark-grey dark:text-white">
                        {doc.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.description}
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="shrink-0">
                      <label
                        className={`
                          relative flex h-[31px] w-[51px] items-center rounded-full border-none p-0.5
                          ${
                            doc.mandatory
                              ? "cursor-not-allowed bg-brand-light-grey justify-end dark:bg-gray-600"
                              : "cursor-pointer bg-gray-200 dark:bg-gray-600 transition-colors duration-200 ease-in-out"
                          }
                          ${
                            !doc.mandatory && preferences[doc.id]
                              ? "justify-end bg-brand-navy dark:bg-brand-gold"
                              : ""
                          }
                        `}
                      >
                        <div
                          className={`
                            h-full w-[27px] rounded-full bg-white transition-transform
                            ${
                              doc.mandatory
                                ? "dark:bg-gray-400"
                                : "dark:bg-gray-300"
                            }
                          `}
                          style={{
                            boxShadow: doc.mandatory
                              ? "rgba(0, 0, 0, 0.1) 0px 2px 4px"
                              : "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
                          }}
                        />
                        <input
                          checked={doc.mandatory || preferences[doc.id]}
                          onChange={() =>
                            doc.mandatory ? null : handleToggleChange(doc.id)
                          }
                          disabled={doc.mandatory}
                          className="invisible absolute"
                          type="checkbox"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer / Button Group */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-3 rounded-b-xl bg-gray-50 p-6 dark:bg-[#111921]">
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto rounded-lg bg-brand-navy px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-navy/50 dark:bg-brand-gold dark:text-brand-navy dark:hover:bg-brand-gold/90 dark:focus:ring-brand-gold/50"
              >
                Accept All
              </button>
              <button
                onClick={handleSavePreferences}
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
