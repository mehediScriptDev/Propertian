export async function generateMetadata() {
  return {
    title: `Concierge | Q HOMES`,
    description: 'Premium concierge services for your real estate needs.',
  };
}

export default function ConciergePage() {
  return (
    <div className='min-h-screen bg-white py-16 px-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-8 text-charcoal'>
          Concierge Services
        </h1>
        <div className='prose prose-lg mx-auto'>
          <p className='text-lg text-gray-600 text-center mb-12'>
            Premium concierge services for your real estate needs in Côte
            d&apos;Ivoire. Design and content coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
