import jwt from "jsonwebtoken";

export function signAccessToken(userId) {
    return jwt.sign({ sub: userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId) {
    return jwt.sign({ sub: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d"})
}

export function authMiddleware(req, res, next) {
    const accessToken = req.header("Authorization")?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        // return res.status(401).json({ error: "Access denied; no token provided." });
        return res.status(401).redirect("/");
    }

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            req.userId = decoded.sub;
            return next();
        } catch (error) {
            // Access token is invalid
            if (
                error.name !== "TokenExpiredError" &&
                error.name !== "JsonWebTokenError"
            ) {
                return res.status(401).json({ error: "Invalid access token."});
            }
            // Fall through to refresh token below
        }
    }

    if (!refreshToken) {
        return res.status(401).json({ error: "Access token invalid or expired, and no refresh token found."});
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = signAccessToken(decodedRefresh.sub);
        
        res.setHeader("x-access-token", newAccessToken);
        req.userId = decodedRefresh.sub; // Set user ID for the current request
        next();
    } catch (refreshError) {
        // Refresh token exists but it also invalid or expired.
        return res.status(401).json({ error: "Invalid or expired refresh token; log in access."});
    }
}