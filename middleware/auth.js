import jwt from "jsonwebtoken";

export function signAccessToken(userId) {
    return jwt.sign({ sub: userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId) {
    return jwt.sign({ sub: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d"})
}

export function authMiddleware(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        // No access token or refresh token provided, return to login
        return res.status(401).redirect("/");
    }

    if (accessToken) {
        // accessToken present, check if it's still valid
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            req.userId = decoded.sub;
            return next();
        } catch (error) {
            // Access token exists, but is invalid or expired
            // Check for expected errors
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

    // Check if accessToken can be refreshed with valid refreshToken
    if (!refreshToken) {
        // No refresh token exto refresh, cannot reissue accessToken, new login required
        return res.status(401).redirect("/");
    }

    try {
        // refreshToken exists, verify if still valid.
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = signAccessToken(decodedRefresh.sub);
        
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 15 * 60 * 1000 // 15 mins
        });
        // Set user ID for the current request
        req.userId = decodedRefresh.sub; 
        next();

    } catch (refreshError) {
        // Refresh token exists but is invalid or expired, new login required.
        return res.status(401).redirect("/");
    }
}