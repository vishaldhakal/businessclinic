import { UseFormReturn } from "react-hook-form";
import { FileText, Tags, Upload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IssueWithBusinessSchema } from "@/schemas/issues-with-business";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industryTypes } from "@/constants/industries";
import { YesNoSelect } from "../../common/yes-no-select";

export const StepOne = ({
  form,
}: {
  form: UseFormReturn<IssueWithBusinessSchema>;
}) => {
  return (
    <div className="space-y-6">
      {/* Issue Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          <h2>Issue Details</h2>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter issue title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your issue in detail"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add the file upload field here */}
        <FormField
          control={form.control}
          name="issue_image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Attach Files
                </div>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    {...field}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    accept="*/*"
                  />
                  {value && (
                    <span className="text-sm text-muted-foreground">
                      {typeof value === "object" && "name" in value
                        ? value.name
                        : ""}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Categorization Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Tags className="h-5 w-5 text-primary" />
          <h2>Issue Categorization</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nature_of_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature of Issue</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="industry_specific_or_common_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is this an industry specific issue?</FormLabel>
                <FormControl>
                  <YesNoSelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policy_related_or_procedural_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is this a policy related issue?</FormLabel>
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