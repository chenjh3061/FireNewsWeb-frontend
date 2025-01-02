/**
 * 通用小工具类
 */


// utils.ts
export const adjustFontSize = (size: "small" | "large" | "reset"): number => {
    const sizes = { small: 14, large: 20, reset: 16 };
    return sizes[size];
};

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};
