import ACCESS_ENUM from "../access/ACCESS_ENUM"

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要检查的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
    const userAccess = loginUser?.userRole;

    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
        return true
    } else if (needAccess === ACCESS_ENUM.USER) {
        if (userAccess === ACCESS_ENUM.NOT_LOGIN){
            return false
        }
    } else {
        if (userAccess !== ACCESS_ENUM.ADMIN) {
            return false
        }
    }
    return true;
}

export default checkAccess;