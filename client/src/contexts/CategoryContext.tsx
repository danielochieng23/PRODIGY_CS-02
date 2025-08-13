import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categoriesAPI } from '../utils/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  parentCategory?: string;
  subcategories?: Category[];
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  adCount: number;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const getCategoryBySlug = (slug: string): Category | undefined => {
    const findCategory = (cats: Category[]): Category | undefined => {
      for (const cat of cats) {
        if (cat.slug === slug) return cat;
        if (cat.children && cat.children.length > 0) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findCategory(categories);
  };

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    refreshCategories,
    getCategoryBySlug,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};