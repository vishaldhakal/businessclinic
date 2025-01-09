import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export const YesNoSelect = React.forwardRef<
  HTMLSelectElement,
  { value: boolean; onChange: (value: boolean) => void }
>(({ value, onChange }, ref) => (
  <Select
    onValueChange={(v) => onChange(v === "true")}
    value={value.toString()}
  >
    <FormControl>
      <SelectTrigger ref={ref as React.Ref<HTMLButtonElement>}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectItem value="true">Yes</SelectItem>
      <SelectItem value="false">No</SelectItem>
    </SelectContent>
  </Select>
));
