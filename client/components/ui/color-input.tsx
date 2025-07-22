import { Label } from "@/components/ui/label";
import { cn } from "@utils/utils";

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const ColorInput = ({ label, value, onChange, className }: ColorInputProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Label className="text-sm" htmlFor="color-input">
                {label}
            </Label>
            <input
                id="color-input"
                data-testid="color-input"
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="h-8 w-8 p-0 border rounded"
            />
        </div>
    );
};

export default ColorInput;
