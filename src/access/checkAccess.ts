import ACCESS_ENUM from "../access/ACCESS_ENUM"

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要检查的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
    const userAccess = loginUser?.userRole;
    console.log("当前用户权限：", userAccess);
    console.log("需要权限：", needAccess);
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
        return true
    }
    // 检查是否为普通用户权限
    if (needAccess === ACCESS_ENUM.USER && userAccess === ACCESS_ENUM.WRITER) {
        console.log("当前用户无权限1: 普通用户只能访问 USER 权限");
        return false;
    }

    // 检查是否为管理员权限
    if (needAccess === ACCESS_ENUM.ADMIN && userAccess !== ACCESS_ENUM.ADMIN) {
        console.log("当前用户无权限2: 非管理员无法访问 ADMIN 权限");
        return false;
    }
    return true;
}

export default checkAccess;