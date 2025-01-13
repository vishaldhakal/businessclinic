import { Controller, UseFormReturn } from "react-hook-form";
import { FileText, Tags, Upload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IssueWithoutBusinessSchema } from "@/schemas/issues-without-business";
import { FloatingInput } from "@/components/ui/floatingInput";
import { FloatingLabel } from "@/components/ui/floatingInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industryTypes } from "@/constants/industries";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap/minimal-tiptap";

export const StepOne = ({
  form,
}: {
  form: UseFormReturn<IssueWithoutBusinessSchema>;
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingInput id="issue-title" placeholder=" " {...field} />
                  <FloatingLabel htmlFor="issue-title">
                    Issue Title
                  </FloatingLabel>
                </div>
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
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <MinimalTiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      className="min-h-[550px] border rounded-md"
                      editorContentClassName="p-4"
                      output="html"
                      content={field.value}
                      placeholder="Describe your issue in detail"
                      autofocus={false}
                      editable={true}
                      editorClassName="focus:outline-none prose prose-sm dark:prose-invert max-w-none"
                    />
                  )}
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
                    className="file:mr-4  file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary pb-5 file:text-primary-foreground hover:file:bg-primary/90"
                    accept="*/*"
                  />
                  {value && (
                    <span className="text-sm text-muted-foreground truncate">
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
    </div>
  );
};
