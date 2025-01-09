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
  <div className="flex space-x-2">
    <div
      onClick={() => onChange(true)}
      className={`px-4 py-2 rounded-md cursor-pointer focus:outline-none ${
        value ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      Yes
    </div>
    <div
      onClick={() => onChange(false)}
      className={`px-4 py-2 rounded-md cursor-pointer focus:outline-none ${
        !value ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      No
    </div>
  </div>
));
