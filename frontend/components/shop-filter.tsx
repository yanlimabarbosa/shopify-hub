"use client";

import { useShops } from "@/hooks/use-shops";
import { Combobox } from "@/components/ui/combobox";

type ShopFilterProps = {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function ShopFilter({ value, onValueChange, className }: ShopFilterProps) {
  const { data: shopsData } = useShops();

  const options = [
    { value: "all", label: "Todas as lojas" },
    ...(shopsData?.map((shop) => ({
      value: shop.shopDomain,
      label: shop.shopDomain,
    })) || []),
  ];

  return (
    <Combobox
      options={options}
      value={value || "all"}
      onValueChange={onValueChange}
      placeholder="Filtrar por domínio da loja..."
      className={className}
    />
  );
}
