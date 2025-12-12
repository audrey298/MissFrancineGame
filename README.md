
Miss Francine Game - Expo SDK 54 project (simplified)
====================================================

What this project contains:
- Expo SDK 54 compatible project template
- Simple multi-screen app:
  1. Identity (first name only)
  2. Top 5 Miss France (5 dropdowns)
  3. Top 10 Miss Francine (10 dropdowns)
  4. Passages (select who passed)
  5. Summary + save locally (AsyncStorage)

How to use:
1. Unzip the archive.
2. Upload the files to a GitHub repository (root files must be at repository root).
3. Connect the repo to expo.dev (Account -> Projects -> Import from GitHub).
4. Use EAS Build (expo.dev) to build Android (AAB) or APK.

Local testing (if you have Node):
- Install dependencies: npm install
- Start: expo start

Notes:
- This template uses @react-native-picker/picker for dropdowns.
- Data is stored locally using AsyncStorage.
