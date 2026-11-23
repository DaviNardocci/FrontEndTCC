import { jwtDecode } from "jwt-decode"

interface TokenPayload {
    id: string
    role: string
    exp: number
}

export interface TokenData extends Omit<TokenPayload, 'id'> {
    id: number
}

function getTokenData(): TokenData | null {
    const token = localStorage.getItem("token")
    if (!token) {
        return null
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token)
        return {
            id: Number(decoded.id),
            role: decoded.role,
            exp: decoded.exp,
        }
    } catch {
        return null
    }
}

export default getTokenData
