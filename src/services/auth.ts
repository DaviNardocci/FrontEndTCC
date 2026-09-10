import { jwtDecode } from "jwt-decode"

interface TokenPayload {
    id: string
    role: string
    exp: number
}

function getTokenData() {
    const token = localStorage.getItem("token")
    if (!token) {
        return null
    }
    const decoded = jwtDecode<TokenPayload>(token)
    return decoded
}

export default getTokenData
