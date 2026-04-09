export interface CategoryDefinition {
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Home & Kitchen', icon: '🏠' },
  { name: 'Beauty & Personal Care', icon: '💄' },
  { name: 'Sports & Outdoors', icon: '🏋️' },
  { name: 'Groceries', icon: '🍔' },
  { name: 'Gaming', icon: '🎮' },
];

export const getCategoryIcon = (categoryName: string): string => {
  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  return category ? category.icon : '📦'; // Default icon
};
