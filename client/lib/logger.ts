import { supabase } from "@database/supabase/client";
import { sanitizeLogData } from "./security";
import type { Json } from "@database/supabase/types";

export const logEvent = async ({
    eventType,
    eventSource,
    metadata,
}: {
    eventType: string;
    eventSource?: string;
    metadata?: Record<string, unknown>;
}) => {
    try {
        // Sanitize all inputs
        const sanitizedEventType = eventType?.slice(0, 100) || "unknown";
        const sanitizedEventSource = eventSource?.slice(0, 100);
        const sanitizedMetadata = metadata ? sanitizeLogData(metadata) : null;

        const { error } = await supabase.from("logs").insert([
            {
                event_type: sanitizedEventType,
                event_source: sanitizedEventSource,
                metadata: sanitizedMetadata as Json,
            },
        ]);

        if (error) {
            console.error("Error logging event:", error.message);
        }
    } catch (err) {
        console.error("Failed to log event:", err);
    }
};
