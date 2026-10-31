const { createRemoteJWKSet, jwtVerify } = require("jose");

const JWKS = createRemoteJWKSet(
    new URL("http://localhost:8080/realms/kanrealm/protocol/openid-connect/certs")
);

const authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing Token" });
        }

        const token = auth.substring(7);

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: "http://localhost:8080/realms/kanrealm"
        });

        req.user = payload;
        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = {
    authenticate
};