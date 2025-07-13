// src/context/SearchContext.tsx
import { createContext, useContext, useState } from 'react';
import { Product } from '../models/product';

type SearchContextType = {
  query: string;
  setQuery: (query: string) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const SearchContext = createContext<SearchContextType>({} as SearchContextType);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <SearchContext.Provider value={{ query, setQuery, products, setProducts, loading, setLoading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);