
import { SceneConfig } from "@/types/scene";
import { Json } from "@/integrations/supabase/types";

export function isSceneConfig(config: Json | null): config is SceneConfig {
    if (config === null || typeof config !== 'object' || Array.isArray(config)) {
        return false;
    }
    const c = config as any;
    return 'type' in c && typeof c.type === 'string' &&
           'day' in c && typeof c.day === 'object' &&
           'night' in c && typeof c.night === 'object';
}
