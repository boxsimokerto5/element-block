# Android Build Setup (GitHub Actions)

This project is configured to automatically build an Android APK using GitHub Actions.

## How it works
Every time you push to the `main` branch, GitHub Actions will:
1.  Build the React web app.
2.  Sync it with Capacitor.
3.  Generate a release APK.
4.  **Automatically generate a keystore** if it doesn't exist (using `keytool`).
5.  Sign the APK.
6.  Upload the APK as a build artifact.

## GitHub Secrets (Optional but Recommended)
To ensure your app signature remains consistent (so you can update the app on Play Store), you should set these secrets in your GitHub Repository:

1.  Go to **Settings > Secrets and variables > Actions**.
2.  Add these **Repository secrets**:
    -   `KEYSTORE_PASSWORD`: Password for the keystore (e.g., `mypassword`).
    -   `KEY_PASSWORD`: Password for the key (e.g., `mypassword`).

If you don't set these, the build will use `android` as the default password.

## Local Development
To open the Android project in Android Studio:
```bash
npm run cap:open
```

To sync changes from the web app to the Android app:
```bash
npm run build
npm run cap:sync
```
