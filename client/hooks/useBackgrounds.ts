import { supabase } from "@database/supabase/client";
import type { Database } from "@database/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
    parseBackgroundRows,
    parseBackgroundRow,
} from "@database/shared/config-parsers";
import type {
    ParsedBackground,
    UseBackgroundsReturn,
} from "@database/shared/types";

type BackgroundRow = Database["public"]["Tables"]["backgrounds"]["Row"];

const fetchBackgrounds = async (): Promise<ParsedBackground[]> => {
    const { data, error } = await supabase
        .from("backgrounds")
        .select("*")
        .eq("is_featured", true)
        .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    return parseBackgroundRows(data || []);
};

export const useBackgrounds = (): UseBackgroundsReturn => {
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const {
        data: backgrounds,
        isLoading,
        isError,
        error,
    } = useQuery<ParsedBackground[]>({
        queryKey: ["backgrounds"],
        queryFn: fetchBackgrounds,
    });

    const currentBackground = useMemo(() => {
        if (!backgrounds || backgrounds.length === 0) return null;
        return backgrounds[currentBackgroundIndex];
    }, [backgrounds, currentBackgroundIndex]);

    const changeBackground = useCallback(
        (direction: "next" | "prev") => {
            if (isTransitioning || !backgrounds || backgrounds.length === 0)
                return;

            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentBackgroundIndex(prevIndex => {
                    if (!backgrounds) return 0;
                    const newIndex =
                        direction === "next"
                            ? (prevIndex + 1) % backgrounds.length
                            : (prevIndex - 1 + backgrounds.length) %
                              backgrounds.length;
                    console.log(
                        "Changing background from index",
                        prevIndex,
                        "to",
                        newIndex
                    );
                    return newIndex;
                });

                setTimeout(() => {
                    setIsTransitioning(false);
                }, 400);
            }, 200);
        },
        [isTransitioning, backgrounds]
    );

    const jumpToBackground = useCallback(
        (index: number) => {
            if (
                isTransitioning ||
                !backgrounds ||
                backgrounds.length === 0 ||
                index === currentBackgroundIndex ||
                index < 0 ||
                index >= backgrounds.length
            ) {
                return;
            }

            console.log(
                "Jumping to background index:",
                index,
                "from current index:",
                currentBackgroundIndex
            );
            setIsTransitioning(true);

            setTimeout(() => {
                setCurrentBackgroundIndex(index);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 400);
            }, 200);
        },
        [isTransitioning, backgrounds, currentBackgroundIndex]
    );

    return {
        backgrounds,
        isLoading,
        isError,
        currentBackground,
        currentBackgroundIndex,
        isTransitioning,
        changeBackground,
        jumpToBackground,
    };
};
