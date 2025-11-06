const MainContent = ({ terms }) => {
  return (
    <main className="w-full lg:w-3/4 space-y-8 lg:mt-0 md:mt-12 sm:mt-10 mt-8">
      <header>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          Privacy Policy
        </h2>
        <p className="text-sm text-charcoal/80 dark:text-soft-grey/80 mb-4">
          Last Updated: October 26, 2023
        </p>
        <p className="font-normal text-sm sm:text-base text-charcoal/90 dark:text-soft-grey/90">
          At Q Homes, we are committed to protecting your privacy and ensuring
          the security of your personal information. This Privacy Policy
          outlines how we collect, use, share, and protect your data when you
          use our services. By accessing or using our platform, you agree to the
          terms of this Privacy Policy.
        </p>
      </header>

      <section className="md:space-y-14 sm:space-y-12 space-y-10">
        {terms.map((item) => (
          <div key={item.id || item.title}>
            <h3 className="text-xl lg:text-2xl font-bold tracking-tight mb-3">
              {item.title}
            </h3>
            <p className="font-normal text-sm sm:text-base text-charcoal/90 dark:text-soft-grey/90 mb-3">
              {item.description}
            </p>
            {item.short_Description && (
              <p className="font-normal text-sm sm:text-base text-charcoal/90 dark:text-soft-grey/90">
                {item.short_Description}
              </p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default MainContent;
