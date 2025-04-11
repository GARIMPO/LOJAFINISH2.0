import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Category = {
  id: string;
  name: string;
};

interface CategoriesContextType {
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, name: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem("productCategories");
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (error) {
        console.error("Error parsing saved categories:", error);
        setCategories([]);
      }
    } else {
      // Default categories with timestamp-based IDs to ensure they're treated the same as created categories
      const timestamp = Date.now();
      const defaultCategories: Category[] = [
        { id: `${timestamp + 1}`, name: "Smartphones" },
        { id: `${timestamp + 2}`, name: "Notebooks" },
        { id: `${timestamp + 3}`, name: "Acessórios" },
        { id: `${timestamp + 4}`, name: "Wearables" },
        { id: `${timestamp + 5}`, name: "Tablets" },
        { id: `${timestamp + 6}`, name: "Câmeras" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem("productCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("productCategories", JSON.stringify(categories));
    }
  }, [categories]);

  const addCategory = (name: string) => {
    // Check if category with same name already exists (case insensitive)
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      throw new Error("Uma categoria com este nome já existe");
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    // Encontre a categoria que será excluída
    const categoryToDelete = categories.find(category => category.id === id);
    if (!categoryToDelete) return;

    try {
      // Atualize os produtos que usam essa categoria para "Outros"
      const savedProducts = localStorage.getItem("productList");
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        let needsUpdate = false;
        
        // Verificar se existe a categoria "Outros" ou criar
        let outrosCategory = categories.find(cat => cat.name === "Outros");
        if (!outrosCategory && products.some(p => p.category === categoryToDelete.name)) {
          // Criar categoria "Outros" se não existir
          const newOutrosCategory = {
            id: Date.now().toString(),
            name: "Outros"
          };
          setCategories(prevCategories => [...prevCategories, newOutrosCategory]);
          outrosCategory = newOutrosCategory;
          // Aguardar o próximo ciclo para a categoria "Outros" estar no state
          setTimeout(() => {
            localStorage.setItem("productCategories", JSON.stringify([...categories, newOutrosCategory]));
          }, 0);
        }
        
        // Atualizar produtos da categoria excluída para "Outros"
        const updatedProducts = products.map(product => {
          if (product.category === categoryToDelete.name) {
            needsUpdate = true;
            return {
              ...product,
              category: outrosCategory ? "Outros" : undefined
            };
          }
          return product;
        });
        
        if (needsUpdate) {
          localStorage.setItem("productList", JSON.stringify(updatedProducts));
        }
      }

      // Remover a categoria da lista
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const updateCategory = (id: string, name: string) => {
    // Check if another category with the same name already exists (case insensitive)
    if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase())) {
      throw new Error("Uma categoria com este nome já existe");
    }

    setCategories(
      categories.map(category =>
        category.id === id ? { ...category, name } : category
      )
    );
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}; 