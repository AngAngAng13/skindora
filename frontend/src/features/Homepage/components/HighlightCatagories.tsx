import { ChevronRight, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sampleCategories = [
  {
    title: "Chăm sóc da mặt",
    description: "Các sản phẩm làm sạch, dưỡng ẩm và điều trị đặc biệt cho da mặt.",
  },
  {
    title: "Chống nắng & Chống lão hóa",
    description: "Bảo vệ da khỏi tác hại của tia UV và các dấu hiệu lão hóa.",
  },
  {
    title: "Da nhạy cảm",
    description: "Sản phẩm dịu nhẹ đặc biệt dành cho da nhạy cảm, dễ kích ứng.",
  },
];

function CategoryLoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
    </div>
  );
}

function CategoryCardGrid({ categories }: { categories: typeof sampleCategories }) {
  const bgColors = ["bg-purple-50", "bg-blue-50", "bg-amber-50"];
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, idx) => (
        <CategoryCard
          key={cat.title + idx}
          title={cat.title}
          description={cat.description}
          bgColor={bgColors[idx % bgColors.length]}
        />
      ))}
    </div>
  );
}

export default function HighlightCatagories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<typeof sampleCategories>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(sampleCategories);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="prose-h2 text-2xl font-bold">Danh mục nổi bật</h2>
      </div>
      {loading ? <CategoryLoadingSpinner /> : <CategoryCardGrid categories={categories} />}
    </div>
  );
}

function CategoryCard({
  title,
  description,
  bgColor,
}: {
  title: string;
  description: string;
  bgColor: string;
}): React.JSX.Element {
  return (
    <Card className={cn(bgColor, "border-0 opacity-90 shadow-none")}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <button className="text-primary hover:underline">Khám phá ngay</button>
        <ChevronRight className="text-primary ml-2 inline h-4 w-4" />
      </CardFooter>
    </Card>
  );
}
