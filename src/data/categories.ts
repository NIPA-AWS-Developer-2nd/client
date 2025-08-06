import {
  Utensils,
  Palette,
  Coffee,
  Dumbbell,
  Gamepad2,
  Camera,
  ShoppingBag,
  Music,
  Heart,
  Plane,
  Cat,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon | null;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "전체", icon: null },
  { id: "food", label: "음식", icon: Utensils },
  { id: "culture", label: "문화/예술", icon: Palette },
  { id: "cafe", label: "카페", icon: Coffee },
  { id: "sports", label: "스포츠", icon: Dumbbell },
  { id: "gaming", label: "게임", icon: Gamepad2 },
  { id: "photo", label: "사진", icon: Camera },
  { id: "shopping", label: "쇼핑", icon: ShoppingBag },
  { id: "music", label: "음악", icon: Music },
  { id: "volunteer_work", label: "봉사활동", icon: Heart },
  { id: "travel", label: "여행", icon: Plane },
  { id: "volunteer", label: "반려동물", icon: Cat },
];

// 전체를 제외한 카테고리만 반환
export const CATEGORIES_WITHOUT_ALL = CATEGORIES.filter(
  (cat) => cat.id !== "all"
);

// 카테고리 ID로 라벨 반환
export const getCategoryLabel = (categoryId: string): string => {
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.label || categoryId;
};

// 카테고리 ID로 아이콘 반환
export const getCategoryIcon = (categoryId: string): LucideIcon | null => {
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.icon || null;
};

// 카테고리 맵
export const CATEGORY_MAP: Record<string, string> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.label;
    return acc;
  },
  {} as Record<string, string>
);
