import fs from 'fs';

export const auditLogger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${req.user?.id || 'anonymous'}\n`;
  fs.appendFile('audit.log', log, err => {});
  next();
};
