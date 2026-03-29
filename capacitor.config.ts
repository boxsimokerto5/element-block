import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elementblocks.galaxy',
  appName: 'Element Blocks',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
