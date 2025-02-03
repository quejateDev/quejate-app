export const  JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const AWS_REGION = process.env.AWS_REGION || 'us-east-2';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '';
export const AWS_BUCKET = process.env.AWS_BUCKET || 'quejate-files';