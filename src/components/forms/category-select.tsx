"use client";

import { Icon } from "@/components/shared/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
 
};

export function CategorySelect({ value, onChange, id, disabled }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} className="h-12 bg-background shadow-sm">
        <span className="flex items-center gap-3">
          <Icon name="category" size={20} className="text-muted-foreground" />
          <SelectValue placeholder="Choose a category" />
        </span>
      </SelectTrigger>
      <SelectContent>
       
          </SelectItem>
        {CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            <span className="flex items-center gap-3">
              <Icon name={category.icon} size={20} className="text-muted-foreground" />
              {category.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>   
  );
}
