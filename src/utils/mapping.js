// src/utils/mappings.js
export const reviewStatusMapping = (record) => {
    const statusMap = {
        0: {color: 'blue', text: '未审核'},
        1: {color: 'green', text: '审核通过'},
        2: {color: 'red', text: '拒绝'}
    };
    return statusMap[record.reviewStatus] || {color: 'gray', text: '未知状态'};
};

export const userRoleMapping = (record) => {
    const roleMap = {
        admin: {color: 'geekblue', text: '管理员'},
        writer: {color: 'volcano', text: '编辑'},
        user: {color: 'green', text: '普通用户'}
    };
    return roleMap[record.userRole] || {color: 'gray', text: '未知角色'};
};

export const categoryMapping = (record) => {
    const categoryMap = {
        0: {color: 'blue', text: '新闻文章'},
        1: {text: '科普文章'},
        2: {text: '通知'},
        3: {text: '娱乐'}
    };
    return categoryMap[record.articleCategory] || '未知类别';
}

export const isCarouselMapping = (record) => {
    const isCarouselMap = {
        0: {color: 'volcano', text: '未轮播'},
        1: {color: 'green', text: '轮播中'}
    };
    return isCarouselMap[record.isCarousel] || '未知状态';
}

// 如果有其他字段的映射，可以继续添加：
export const otherFieldMapping = (record) => {
    // 添加其他字段的映射逻辑
    return {color: 'black', text: '未定义'};
};

// 创建一个映射总集合，便于管理
export const fieldMappings = {
    reviewStatus: reviewStatusMapping,
    userRole: userRoleMapping,
    articleCategory: categoryMapping,
    isCarousel: isCarouselMapping,
    // 其他字段映射
};
