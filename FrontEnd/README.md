# Pump Calculator Mobile App

A React-based pump reading calculation application that can be built as both a web app and mobile APK.

## Features

- Pump reading calculations
- Denomination calculator
- Bills and deduction management
- Dark/Light mode toggle
- Print functionality
- Mobile-optimized interface

## Development

### Web Development
```bash
npm run dev
```

### Mobile Development

#### Prerequisites
1. Install Android Studio
2. Install Java Development Kit (JDK) 11 or higher
3. Set up Android SDK

#### Build for Mobile
```bash
# Build the web app and sync with Capacitor
npm run build:mobile

# Open Android Studio to build APK
npm run open:android

# Or run directly on connected device
npm run android
```

#### Building APK

1. **First time setup:**
   ```bash
   npx cap add android
   npm run build
   npx cap sync
   ```

2. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

3. **In Android Studio:**
   - Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

4. **Install APK on device:**
   - Transfer the APK file to your Android device
   - Enable "Install from unknown sources" in device settings
   - Install the APK

#### Alternative: Command Line Build
```bash
# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

## Mobile-Specific Features

- Safe area insets for notched devices
- Touch-optimized interface
- Responsive design for mobile screens
- Native mobile app packaging

## App Configuration

The app is configured in `capacitor.config.ts`:
- App ID: `com.pumpapp.calculator`
- App Name: `Pump Calculator`
- Splash screen with brand colors

## Technologies Used

- React 19
- Redux Toolkit
- React Icons
- Vite
- Capacitor (for mobile)
- Android SDK

## File Structure

```
src/
├── Components/          # React components
├── Styles/             # CSS files
├── Store.js            # Redux store
└── App.jsx             # Main app component

android/                # Android project files
capacitor.config.ts     # Capacitor configuration
```

## Building for Production

1. **Web Build:**
   ```bash
   npm run build
   ```

2. **Mobile Build:**
   ```bash
   npm run build:mobile
   npm run open:android
   ```

## Troubleshooting

- Ensure Android SDK is properly installed
- Check that ANDROID_HOME environment variable is set
- Verify Java JDK version compatibility
- Clear Capacitor cache: `npx cap sync --force`