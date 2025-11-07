import Image from "next/image";

export default function RelatedrelatedArticles({ relatedArticles }) {
  return (
    <div className="w-full mt-16">
      <h3 className="text-3xl font-bold font-display text-center mb-8">
        You Might Also Like
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedArticles.map((article, idx) => (
          <div
            key={idx}
            className="bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="relative w-full h-48">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-t-xl"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h4 className="font-display font-bold text-xl mb-2 flex-grow">
                {article.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {article.description}
              </p>
              <a
                className="text-accent font-bold text-sm hover:underline self-start"
                href={article.href}
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
