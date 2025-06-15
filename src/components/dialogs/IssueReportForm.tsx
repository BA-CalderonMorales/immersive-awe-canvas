
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Link } from "lucide-react";

interface IssueReportFormProps {
  onBack: () => void;
  // appVersion is kept for prop compatibility but is unused.
  appVersion: string;
}

const IssueReportForm = ({ onBack }: IssueReportFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogDescription>
          Issue reporting is temporarily disabled while we work on user authentication.
        </DialogDescription>
      </DialogHeader>
      <div className="py-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          We appreciate your interest in helping improve this experience!
          If you've found a bug or have a suggestion, please reach out on LinkedIn.
        </p>
        <Button asChild>
          <a href="https://www.linkedin.com/in/bcalderonmorales-cmoe/" target="_blank" rel="noopener noreferrer">
            <Link className="mr-2 h-4 w-4" /> Contact on LinkedIn
          </a>
        </Button>
      </div>
      <DialogFooter className="pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
      </DialogFooter>
    </>
  );
};

export default IssueReportForm;
