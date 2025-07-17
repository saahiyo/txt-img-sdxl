// Utility to get user IP address
export function getUserIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}

// Utility to detect device type from user agent
export function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'mobile';
  } else if (ua.includes('tablet')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
} 