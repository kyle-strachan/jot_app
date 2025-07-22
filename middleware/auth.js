import jwt from "jsonwebtoken";

export function signAccessToken(userId) {
    return jwt.sign({ sub: userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId) {
    return jwt.sign({ sub: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d"})
}

export function authMiddleware(req, res, next) {
    // debugger;
    const accessToken = req.header("Authorization")?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        // No access token or refresh token provided
        return res.status(401).redirect("/");
    }

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            req.userId = decoded.sub;
            return next();
        } catch (error) {
            // Access token exists but is invalid or expired
            if (
                error.name !== "TokenExpiredError" &&
                error.name !== "JsonWebTokenError"
            ) {
                // Unexpected token error, cannot refresh, new login required
                return res.status(401).redirect("/");
            }
            // Fall through to refresh token below
        }
    }

    if (!refreshToken) {
        // Access token is invalid or expired, no refresh token to refresh. Login required.
        return res.status(401).redirect("/");
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = signAccessToken(decodedRefresh.sub);
        
        res.setHeader("x-access-token", newAccessToken);
        // Set user ID for the current request
        req.userId = decodedRefresh.sub; 
        next();

    } catch (refreshError) {
        // Refresh token exists but is invalid or expired.
        return res.status(401).redirect("/");
    }
}