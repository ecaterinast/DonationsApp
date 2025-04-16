npm install -g @ionic/cli@6.20.8
npm i -g native-run

https://developer.android.com/studio
dowlaod  commandlinetools-win-13114758_latest.zip

https://gradle.org/next-steps/?version=8.13&format=all

new sys variable
ANDROID_HOME
C:\Users\andrei/katea\AppData\Local\Android\Sdk


"adminEmail": "admin@email.com",
"adminPassword": "greatPassowrd",
"emailAddress": "supportURL@email.com",



Step 1: Install Android SDK
Download and install Android Studio.
During installation, ensure the Android SDK and Command-line tools are installed.
Step 2: Set Environment Variables
Set the ANDROID_SDK_ROOT environment variable to the Android SDK installation path. For example:
C:\Users\<YourUsername>\AppData\Local\Android\Sdk
Add the platform-tools directory to your PATH. For example:
C:\Users\<YourUsername>\AppData\Local\Android\Sdk\platform-tools
Step 3: Verify Installation
Run the following commands to verify the setup:


install java jdk 8
https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html
https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html#license-lightbox
adb --version
sdkmanager --list

Step 4: Rebuild the Project
After configuring the Android SDK, rebuild the project:

ionic cordova build android --device


export ANDROID_HOME=C:\Users\Lena\AppData\Local\Android\Sdk
