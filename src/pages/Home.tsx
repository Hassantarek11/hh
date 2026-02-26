import React, { useState, useEffect } from 'react';
import { Product } from '../data/mock';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import { motion } from 'motion/react';

interface HomeProps {
  category: string;
  searchQuery: string;
  maxPrice: number;
}

export default function Home({ category, searchQuery, maxPrice }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Only show Hero on 'all' category and no search */}
      {category === 'all' && !searchQuery && <Hero />}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          {searchQuery ? `نتائج البحث عن "${searchQuery}"` : 
           category === 'all' ? 'منتجات مميزة' : category}
        </h2>
        <span className="text-gray-400 text-sm">
          {filteredProducts.length} منتجات
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">لا توجد منتجات تطابق بحثك.</p>
        </div>
      )}
    </div>
  );
}
