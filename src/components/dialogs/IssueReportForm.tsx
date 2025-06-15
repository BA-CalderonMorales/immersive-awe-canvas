import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertTriangle, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/logger";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_IMAGE_TYPES = ["image/png"];
const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "me.com", "mac.com"];

const deviceItems = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
  { id: "tablet", label: "Tablet" }
] as const;

const issueFormSchema = z.object({
  issueLocation: z.string().min(1, "Please describe where the issue occurred."),
  inUS: z.enum(["yes", "no"], { required_error: "This field is required." }),
  device: z.array(z.enum(["desktop", "mobile", "tablet"])).min(1, { message: "Please select at least one device." }),
  expectedBehavior: z.string().min(10, "Please describe what you expected in at least 10 characters."),
  frequency: z.string().min(1, "Please describe how often this happens."),
  workaround: z.string().optional(),
  canContact: z.enum(["yes", "no"], { required_error: "This field is required." }),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  attachment: z.any()
    .refine((files) => !files?.[0] || files?.[0].size <= MAX_FILE_SIZE, `Max file size is 1MB.`)
    .refine((files) => !files?.[0] || ALLOWED_IMAGE_TYPES.includes(files?.[0].type), "Only .png files are allowed.")
    .optional(),
}).refine(data => data.canContact === 'no' || !!data.email, {
    message: "Email is required if you agree to be contacted.",
    path: ["email"],
}).refine(data => {
    if (data.canContact === 'yes' && data.email) {
      const domain = data.email.split('@')[1];
      return ALLOWED_EMAIL_DOMAINS.includes(domain);
    }
    return true;
}, {
    message: "Only Gmail, Outlook, or Apple emails are allowed.",
    path: ["email"],
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

interface IssueReportFormProps {
  onBack: () => void;
  appVersion: string;
}

const IssueReportForm = ({ onBack, appVersion }: IssueReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      workaround: "",
      email: "",
      inUS: "yes",
      canContact: "yes",
      device: [],
    },
  });

  const canContact = form.watch("canContact");
  const attachmentValue = form.watch("attachment");

  async function onSubmit(data: IssueFormValues) {
    setIsSubmitting(true);
    
    // UI reflects submission instantly, then fires request in background.
    toast.success("Thank you! Your feedback has been submitted.");
    onBack();

    (async () => {
      await logEvent({
        eventType: 'issue_form_submission_started',
        eventSource: 'IssueReportForm',
        metadata: { appVersion }
      });

      try {
        // NOTE: Attachment upload is not implemented as part of this flow.
        const { attachment, ...issueData } = data;

        await logEvent({
          eventType: 'issue_form_submission_invoking_function',
          eventSource: 'IssueReportForm',
          metadata: {
            issueData: {
              ...issueData,
              email: issueData.email ? 'REDACTED' : '', // Avoid logging PII
            },
            appVersion,
          }
        });

        const { error } = await supabase.functions.invoke('create-github-issue', {
          body: { issueData, appVersion },
        });

        if (error) {
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        await logEvent({
          eventType: 'issue_form_submission_sent',
          eventSource: 'IssueReportForm',
          metadata: { appVersion }
        });

      } catch (error: any) {
        console.error("Submission failed silently:", error);
        await logEvent({
          eventType: 'issue_form_submission_failed',
          eventSource: 'IssueReportForm',
          metadata: { error: error.message, cause: error.cause, appVersion }
        });
      }
    })();
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      form.setValue("attachment", files, { shouldValidate: true });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogDescription>
          Your detailed feedback helps improve this experience for everyone.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="-mx-6 px-6 flex-1">
            <div className="space-y-6 py-4 pr-4">
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning: Public Submission</AlertTitle>
                <AlertDescription>
                  Please do not include private or sensitive information. All submitted issues are publicly visible on GitHub.
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="issueLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where is the issue?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., On the home page, in the settings panel..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="device"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>What devices are you seeing this issue on?</FormLabel>
                      <FormDescription>Select all that apply.</FormDescription>
                    </div>
                    {deviceItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="device"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedBehavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you expect to happen?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the expected outcome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How often did this happen?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Every time, sometimes, only once" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workaround"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is there a way you can get around this issue to help others? (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Refreshing the page fixed it..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inUS"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are you in the U.S.?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="canContact"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Would you be willing to be contacted about this issue?</FormLabel>
                    <FormDescription>Priority will be given to issues where we can follow up.</FormDescription>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={cn("transition-opacity duration-300", canContact === "yes" ? "opacity-100" : "opacity-50 pointer-events-none")}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@gmail.com" {...field} disabled={canContact !== 'yes'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="attachment"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <FormItem>
                    <FormLabel>Attach Screenshot (Optional)</FormLabel>
                    <FormDescription>A single .png file, max 1MB. Drag & drop or click to upload.</FormDescription>
                     <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={cn(
                          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                          isDragging ? "border-primary bg-primary/10" : "border-input"
                        )}
                      >
                      <FormControl>
                        <Input
                          type="file"
                          accept=".png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          name={name}
                          onBlur={onBlur}
                          ref={ref}
                          onChange={(event) => onChange(event.target.files)}
                        />
                      </FormControl>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none">
                        {attachmentValue?.[0] ? (
                          <p className="font-semibold text-primary break-all px-2">{attachmentValue[0].name}</p>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG (MAX. 1MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t mt-auto">
            <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>Back</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default IssueReportForm;
