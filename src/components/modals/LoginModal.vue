<template>
    <div v-if="visible" class="login-modal">
        <div class="login-form">
            <button class="close-button" @click="closeModal">&times;</button>
            <h2 class="login-title">{{ isRegister ? '注册' : '登录' }}</h2>

            <a-form @submit.prevent="submitForm">
                <a-form-item class="input-container">
                    <span :class="{ label: true, active: userForm.userAccount || isFocused.userAccount }">
                        请输入用户名
                    </span>
                    <input
                        class="input"
                        @focus="onFocus('userAccount')"
                        @blur="onBlur('userAccount')"
                        v-model="userForm.userAccount"
                        type="text"
                    />
                    <div :class="{ line: true, active: isFocused.userAccount }"></div>
                </a-form-item>

                <a-form-item class="input-container">
                    <span :class="{ label: true, active: userForm.password || isFocused.password }">
                        请输入密码
                    </span>
                    <template class="password-wrapper">
                        <input
                            class="input"
                            @focus="onFocus('password')"
                            @blur="onBlur('password')"
                            v-model="userForm.password"
                            :type="showPassword ? 'text' : 'password'"
                        />
                        <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                            {{ showPassword ? '隐藏' : '显示' }}
                        </button>
                    </template>
                    <div :class="{ line: true, active: isFocused.password }"></div>
                </a-form-item>

                <label v-if="isRegister" class="input-container">
                    <span :class="{ label: true, active: userForm.checkPassword || isFocused.checkPassword }">
                        请确认密码
                    </span>
                    <input
                        class="input"
                        @focus="onFocus('confirmPassword')"
                        @blur="onBlur('confirmPassword')"
                        v-model="userForm.checkPassword"
                        type="password"
                    />
                    <div class="password-strength">
                            密码强度：
                        <span :style="{ color: getColor(strength) }">{{ strengthText }}</span>
                    </div>

                    <div :class="{ line: true, active: isFocused.checkPassword }"></div>
                </label>

                <button class="login-button" type="submit">
                    {{ isRegister ? '注册' : '登录' }}
                </button>
            </a-form>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p @click="toggleForm" class="toggle-form">
                {{ isRegister ? '已有账号？点击登录' : '没有账号？点击注册' }}
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import { defineProps, defineEmits } from "vue";
import {useUserCryptoStore, useUserStore} from "../../store";
import myAxios from "../../plugins/myAxios";
import {message} from "ant-design-vue";
import router from "@/router";
import {
  validatePassword,
  getPasswordStrength,
  getPasswordStrengthText,
  setPublicKey,
  rsaEncrypt, aesEncrypt
} from '../../utils/crypto.js';

const userStore = useUserStore();

const props = defineProps({
    visible: Boolean,
});

const emit = defineEmits(["close", "login"]);

const userForm = ref({
    userAccount: "",
    password: "",
    checkPassword: "",
});
const isFocused = ref({
    userAccount: false,
    password: false,
    checkPassword: false,
});
const errorMessage = ref("");
const showPassword = ref(false);
const isRegister = ref(false); // 切换登录和注册表单

const strength = ref(0); // 密码强度
const strengthText = ref(""); // 密码强度文本

watch(() => userForm.value.password, (newPassword) => {
  if (isRegister.value) {
    strength.value = getPasswordStrength(newPassword);
    strengthText.value = getPasswordStrengthText(strength.value);
  }
});

const onFocus = (field: "userAccount" | "password" | "confirmPassword") => {
    isFocused.value[field] = true;
};

const onBlur = (field: "userAccount" | "password" | "confirmPassword") => {
    if (!userForm.value[field]) {
        isFocused.value[field] = false;
    }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const userCryptoStore = useUserCryptoStore();
const submitForm = async () => {
  // 密码长度验证
  if (!validatePassword(userForm.value.password)) {
    errorMessage.value = "密码长度需在6-18位之间";
    return;
  }

  // 注册时确认密码验证
  if (isRegister.value && userForm.value.password !== userForm.value.checkPassword) {
    errorMessage.value = "两次输入的密码不一致";
    return;
  }
  // 如果缓存中没有才请求
  if (!userCryptoStore.publicKey) {
    const res = await myAxios.get("/user/getPublicKey")
    userCryptoStore.setPublicKey(res.data.data)
  }

  setPublicKey(userCryptoStore.publicKey)


  const encryptedPwd = aesEncrypt(userForm.value.password);
  if (!encryptedPwd) {
    alert("加密失败，请刷新页面或稍后再试");
    return;
  }
  console.log(userForm.value.password, encryptedPwd)

  const apiUrl = isRegister.value ? "/user/register" : "/user/login";
  userForm.value.password = encryptedPwd;
  userForm.value.checkPassword = aesEncrypt(userForm.value.checkPassword);
  try {
    myAxios.post(apiUrl, userForm.value,
        {
          headers: {'Content-Type': 'application/json'}
        }).then((res) => {
      if (res.data.code === 0) {
        userStore.userInfo = res.data.data;
        userForm.value = {
          userAccount: "",
          password: "",
          checkPassword: ""
        };
        if (isRegister.value) {
          message.info("注册成功！登录后请到个人页面完善个人信息！")
          router.go(0);
        } else {
          message.info("登录成功！")
          router.go(0);
        }
        console.log(isRegister.value ? "注册成功" : "登录成功", userStore.userInfo);
      } else {
        message.error(res.data.message);
      }
    });
  } catch (err) {
    errorMessage.value = isRegister.value ? "注册失败，请检查网络连接！" : "登录失败，请检查网络连接！";
  }
  closeModal();

};



const closeModal = () => {
    emit("close");
};

const toggleForm = () => {
    isRegister.value = !isRegister.value;
    errorMessage.value = ""; // 清空错误信息
};

const getColor = (level: number) => {
  switch (level) {
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'green';
    default:
      return '#999';
  }
};

</script>

<style scoped>
.login-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.login-form {
    position: relative;
    width: 50rem;
    background: linear-gradient(145deg, #ffffff, #f1f1f1);
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    padding: 30px;
    text-align: center;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
}

.login-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
}

.input-container {
    margin-top: 20px;
    margin-bottom: 20px;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    border-bottom: 2px solid #ddd;
}
.password-strength {
  font-size: 14px;
  margin-top: 5px;
}

.input {
    width: 100%;
    font-size: 16px;
    top: 10px;
    padding: 10px 0;
    border: none;
    outline: none;
    background: none;
    color: #333;
}

.label {
    position: relative;
    display: flex;
    white-space: nowrap;
    margin-top: 20px;
    font-size: 16px;
    left: 0;
    color: #aaa;
    user-select: none;
    font-weight: 500;
    transition: all 0.2s ease;
}

.label.active {
    top: -10px;
    font-size: 18px;
    color: #007bff;
}

.line {
    height: 3px;
    width: 0;
    bottom: 0;
    left: 0;
    background-color: #007bff;
    transition: width 0.3s ease;
}

.line.active {
    width: 100%;
}

.password-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #ddd;
}

.toggle-password {
    display: flex;
    background: none;
    border: none;
    color: #007bff;
    font-size: 14px;
    cursor: pointer;
    padding-left: 5px;
    margin: 5px;
}

.login-button {
    display: block;
    width: 100%;
    height: 40px;
    padding: 12px;
    font-size: 16px;
    background-color: #007bff;
    margin-top: 30px;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: #0056b3;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 10px;
}

.toggle-form {
    margin-top: 15px;
    color: #007bff;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
}
</style>
