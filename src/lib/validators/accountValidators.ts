
const isEmail = (email: string) => {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(email);
}

const isAlpha = (str: string) => {
    return /^[a-zA-Z]*$/.test(str);
}

const isPassword = (password: string) => {
    return password.length >= 8;
}

const isEmpty = (str: string) => {
    return !(str && str.length > 0)
}

const validateAccount = (email: string, password: string, name: string) => {
    let isEmailValid = isEmpty(email) || isEmail(email)
    let isPassValid = isEmpty(password) || isPassword(password)
    let isNameValid = isEmpty(name) || isAlpha(name)
    return isEmailValid && isPassValid && isNameValid;
}

export { validateAccount }