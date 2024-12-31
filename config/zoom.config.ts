import { registerAs } from '@nestjs/config';

export default registerAs('zoom', () => ({
    zoomApiUrl : process.env.ZOOM_API_URL.toString(),
    zoomAccountId: process.env.ZOOM_ACCOUNT_ID.toString(),
    zoomClientId: process.env.ZOOM_CLIENT_ID.toString(),
    zoomClientSecret: process.env.ZOOM_CLIENT_SECRET.toString(),
  
}));