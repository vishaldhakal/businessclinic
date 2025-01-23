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
import { IssueWithBusinessSchema } from "@/schemas/issues-with-business";

import { Controller } from "react-hook-form";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industryTypes } from "@/constants/industries";
import { FloatingLabel } from "@/components/ui/floatingInput";
import { FloatingInput } from "@/components/ui/floatingInput";

export const StepOne = ({
  form,
}: {
  form: UseFormReturn<IssueWithBusinessSchema>;
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Issue Details Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2>Issue Details</h2>
        </div>
        <FormField
          control={form.control}
          name="nature_of_issue"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm sm:text-base">Nature of Issue</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industryTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-sm sm:text-base">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput 
                    id="issue-title" 
                    placeholder=" " 
                    {...field}
                    className="h-10 sm:h-11 text-sm sm:text-base" 
                  />
                  <FloatingLabel htmlFor="issue-title" className="text-sm sm:text-base">
                    Issue Title
                  </FloatingLabel>
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Job Description</FormLabel>
              <FormControl>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <MinimalTiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      className="min-h-[300px] sm:min-h-[400px] md:min-h-[550px] border rounded-md"
                      editorContentClassName="p-3 sm:p-4"
                      output="html"
                      content={field.value}
                      placeholder="Describe your issue in detail"
                      autofocus={false}
                      editable={true}
                      editorClassName="focus:outline-none prose prose-sm sm:prose-base dark:prose-invert max-w-none text-sm sm:text-base"
                    />
                  )}
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {/* Add the file upload field here */}
        <FormField
          control={form.control}
          name="issue_image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  Attach Files
                </div>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <Input
                    type="file"
                    {...field}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    className="file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-xs sm:text-sm"
                    accept="*/*"
                  />
                  {value && (
                    <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-full">
                      {typeof value === "object" && "name" in value
                        ? value.name
                        : ""}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
