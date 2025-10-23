import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckinSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const CheckinSelect: React.FC<CheckinSelectProps> = ({ id, label, value, onValueChange }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Pilih..." />
        </SelectTrigger>
        <SelectContent>
          {RATING_OPTIONS.map((num) => (
            <SelectItem key={num} value={String(num)}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CheckinSelect;
