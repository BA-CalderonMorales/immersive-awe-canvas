
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_IMAGE_TYPES = ["image/png"];
const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "me.com", "mac.com"];

const issueFormSchema = z.object({
  issueLocation: z.string().min(1, "Please describe where the issue occurred."),
  inUS: z.enum(["yes", "no"], { required_error: "This field is required." }),
  device: z.enum(["desktop", "mobile", "tablet"], { required_error: "Please select a device." }),
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
}

const IssueReportForm = ({ onBack }: IssueReportFormProps) => {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      workaround: "",
      email: "",
    },
  });

  const canContact = form.watch("canContact");

  function onSubmit(data: IssueFormValues) {
    console.log("Issue Report Submitted:", data);
    toast.info("Thank you for your feedback!", {
      description: "This form is for demonstration. Issue submission to GitHub is coming soon.",
    });
  }

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
            <div className="space-y-6 py-4 pr-6">
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What device are you using?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a device" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                      </SelectContent>
                    </Select>
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
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Attach Screenshot (Optional)</FormLabel>
                    <FormDescription>A single .png file, max 1MB.</FormDescription>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept=".png"
                        onChange={(event) => onChange(event.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t mt-auto">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Submit Issue</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default IssueReportForm;
