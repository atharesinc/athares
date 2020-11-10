# Athares

This is the repo for the (soon to be new) [athar.es](https://www.athar.es) web and native apps. One code base to rule them all!

# Installing

This project uses `expo-cli`, if you don't have that installed you can install it with `npm i -g expo-cli`.

No other downloads are required if developing for the web, but if you're developing for iOS or Android you'll need:

- iOS: Latest XCode, iOS Simulator, and Additional Command Line Utilities (should be prompted for this when running project for the first time)

- Android: Android Studio with a valid AVD or you can run it on a real device with the Expo app

```
git clone https://github.com/atharesinc/athares.git
cd athares
npm install
```

In place of a .env file, Athares requires a vars.js file with the pseudo-sensitive constants, which you will receive securely when added as a collaborator.

Start the application with:

```
npm start
```

Once the QR code is visible, the dev server is ready to build the application, press any of the following to run the application:

- `w` to run it for web, this should open the app in your default browser, logs will appear in the browser's console
- `i` to run it in the ios Simulator, logs will appear in the console from which you ran `npm start`
- `a` to run it in an Android Emulator, logs will appear in the console from which you ran `npm start`

You can run it on device as a native app by downloading the Expo app from the Google Play or App Store and scanning the QR code in-app. 

For a brief overview of expo check out [expo.io](https://expo.io/)
