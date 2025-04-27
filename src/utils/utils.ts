/**
 * 通用小工具类
 */
import dayjs from "dayjs";
import {ref} from "vue";

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

export function extractIdAndName(text: string) {
    if (!text) return null;

    // 清理左右中括号（如果有）
    text = text.trim();
    if (text.startsWith('[')) text = text.slice(1);
    if (text.endsWith(']')) text = text.slice(0, -1);

    // 获取 DTO 类型
    const typeMatch = text.match(/^(\w+DTO)\(/);
    if (!typeMatch) return null;

    const type = typeMatch[1];
    const result: { type: string; id: string | null; name: string | null } = {
        type: '',
        id: null,
        name: null,
    };

    // 用更宽松的正则处理中文和部分截断问题
    const matchValue = (pattern: RegExp): string | null => {
        const m = text.match(pattern);
        return m ? m[1].trim() : null;
    };

    switch (type) {
        case 'ArticleDTO':
            result.type = 'Article';
            result.id = matchValue(/articleId=(\d+)/);
            result.name = matchValue(/articleTitle=([^,]+?)(?=,|\)|$)/);
            break;
        case 'UserDTO':
            result.type = 'User';
            result.id = matchValue(/userId=(\d+)/);
            result.name = matchValue(/userName=([^,]+?)(?=,|\)|$)/);
            break;
        case 'CommentDTO':
            result.type = 'Comment';
            result.id = matchValue(/commentId=(\d+)/);
            result.name = matchValue(/commentContent=([^,]+?)(?=,|\)|$)/);
            break;
        case 'NotionDTO':
            result.type = 'Notion';
            result.id = matchValue(/notionId=(\d+)/);
            result.name = matchValue(/notionTitle=([^,]+?)(?=,|\)|$)/);
            break;
        default:
            result.type = 'Unknown';
    }

    return result.id && result.name ? result : null;
}


