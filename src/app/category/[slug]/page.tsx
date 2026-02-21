import React from 'react';
import categories from '@/data/categories';
import getIcon from '@/lib/iconMap';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// generateMetadata for better SEO per category
export async function generateMetadata({ params }: any) {
  const slug = params?.slug;
  const category = (categories as any)[slug];

  if (!category) {
    return {
      title: 'Category not found - Toolizio',
    };
  }

  const title = `${category.title} - Toolizio`;
  const description = category.description || 'Fast and free online tools for developers and users.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://toolizio.com/category/${slug}`,
      siteName: 'Toolizio',
    },
    alternates: {
      canonical: `https://toolizio.com/category/${slug}`,
    }
  };
}

export default function CategoryPage(props: any) {
  const params = props.params || {};
  const slug = params.slug;
  const category = (categories as any)[slug];

  if (!category) {
    return (
      <div>
        <Header showBackButton />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold">Category not found</h2>
          <p className="mt-4">The requested category does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* JSON-LD structured data for category */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category.title,
            "description": category.description,
            "url": `https://toolizio.com/category/${slug}`
          })
        }}
      />
      <Header showBackButton />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 bg-${category.color}-100 dark:bg-${category.color}-900 rounded-lg flex items-center justify-center`}>
            {React.createElement(getIcon(category.icon), { className: 'h-6 w-6 text-gray-800 dark:text-gray-200' })}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.tools.map((tool: any) => (
            <Link key={tool.href} href={tool.href} className="group">
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {React.createElement(getIcon(tool.icon), { className: 'h-6 w-6 text-gray-800 dark:text-gray-200' })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{tool.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{tool.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
