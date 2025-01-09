import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industrySizes } from "@/constants/industries";
import { IssueWithBusinessSchema } from "@/schemas/issues-with-business";
import { Building, Building2 } from "lucide-react";
import { IndustryCategory, IndustrySubCategory } from "@/types";
import { YesNoSelect } from "../../common/yes-no-select";

type StepTwoProps = {
  form: UseFormReturn<IssueWithBusinessSchema>;
  categories: IndustryCategory[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number) => void;
  subCategories: IndustrySubCategory[];
};

export const StepTwo = ({
  form,
  categories,
  selectedCategory,
  setSelectedCategory,
  subCategories,
}: StepTwoProps) => {
  return (
    <div className="space-y-6">
      {/* Industry Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Building className="h-5 w-5 text-primary" />
          <h2>Industry Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industrySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nature_of_industry_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategory(Number(value));
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nature_of_industry_sub_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Sub-Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry sub-category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem
                        key={subCategory.id}
                        value={subCategory.id.toString()}
                      >
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Company Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Building2 className="h-5 w-5 text-primary" />
          <h2>Company Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name_of_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="member_of_CIM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you a member of CIM?</FormLabel>
                <FormControl>
                  <YesNoSelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
