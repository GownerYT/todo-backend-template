
function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Tasks API"');
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    const encodedCredentials = authHeader.slice(6);
    const credentials = Buffer
        .from(encodedCredentials, 'base64')
        .toString('utf8');

    const separatorIndex = credentials.indexOf(':');

    if (separatorIndex === -1) {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    const expectedUser = process.env.AUTH_USER;
    const expectedPassword = process.env.AUTH_PASSWORD;

    if (!expectedUser || !expectedPassword) {
        console.error('Authentication environment variables are missing');
        return res.status(500).json({
            error: 'Authentication is not configured'
        });
    }

    if (
        username !== expectedUser ||
        password !== expectedPassword
    ) {
        res.set('WWW-Authenticate', 'Basic realm="Tasks API"');
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }

    next();
}

module.exports = basicAuth;
