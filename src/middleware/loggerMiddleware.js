const logger = require('../config/logger');

// Request logging middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log when response is finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };
        
        // Log based on status code
        if (res.statusCode >= 500) {
            logger.error('Server Error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Client Error', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });
    
    next();
};

// User action logging
const logUserAction = (action) => {
    return (req, res, next) => {
        logger.info(`User Action: ${action}`, {
            user_id: req.user?.user_id,
            username: req.user?.username,
            action,
            timestamp: new Date().toISOString()
        });
        next();
    };
};

module.exports = { requestLogger, logUserAction };