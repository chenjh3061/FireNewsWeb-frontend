/**
 * 通用小工具类
 */
import dayjs from "dayjs";

// utils.ts
export const adjustFontSize = (size: "small" | "large" | "reset"): number => {
    const sizes = { small: 14, large: 20, reset: 16 };
    if (!sizes.hasOwnProperty(size)) {
        throw new Error(`Invalid size parameter: ${size}`);
    }
    return sizes[size];
};

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return dayjs(date).format("YYYY-MM-DD HH:mm");
};
