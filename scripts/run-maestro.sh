#!/bin/bash
# Wrapper script to run Maestro with Java from jabba

set -e

# Source jabba if available
if [ -f ~/.jabba/jabba.sh ]; then
  source ~/.jabba/jabba.sh
  
  # Use Java version from .jabbarc if it exists, otherwise use default
  if [ -f .jabbarc ]; then
    JAVA_VERSION=$(cat .jabbarc | tr -d '\n' | tr -d '\r')
  else
    JAVA_VERSION="openjdk@1.17.0"
  fi
  
  # Activate Java version
  jabba use "$JAVA_VERSION"
  
  # Set JAVA_HOME and update PATH
  JAVA_PATH=$(jabba which)
  
  # Check if this is a macOS-style Java installation (with Contents/Home)
  if [ -d "$JAVA_PATH/Contents/Home" ]; then
    export JAVA_HOME="$JAVA_PATH/Contents/Home"
  else
    export JAVA_HOME="$JAVA_PATH"
  fi
  
  export PATH="$JAVA_HOME/bin:$PATH"
  
  # Verify JAVA_HOME points to a valid directory
  if [ ! -d "$JAVA_HOME" ]; then
    echo "Error: JAVA_HOME is not a valid directory: $JAVA_HOME"
    exit 1
  fi
  
  # Verify java executable exists
  if [ ! -f "$JAVA_HOME/bin/java" ]; then
    echo "Error: Java executable not found at $JAVA_HOME/bin/java"
    exit 1
  fi
  
  # Verify Java is available
  if ! command -v java &> /dev/null; then
    echo "Error: Java is not available after jabba setup"
    exit 1
  fi
else
  echo "Error: Jabba not found. Please install Java via jabba."
  echo "Visit https://github.com/shyiko/jabba for installation instructions."
  exit 1
fi

# Check if app is installed before running tests
if [[ "$*" == *"test"* ]]; then
  APP_ID="com.battleblocks.scorecard"
  APP_FOUND=false
  DEVICE_FOUND=false
  
  # Check iOS simulator
  if command -v xcrun &> /dev/null; then
    BOOTED_SIMULATORS=$(xcrun simctl list devices | grep "Booted" | head -1)
    if [ -n "$BOOTED_SIMULATORS" ]; then
      DEVICE_FOUND=true
      SIMULATOR_UDID=$(echo "$BOOTED_SIMULATORS" | grep -oE '[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}' | head -1)
      if [ -n "$SIMULATOR_UDID" ]; then
        # Check if app is installed (listapps returns bundle IDs)
        if xcrun simctl listapps "$SIMULATOR_UDID" 2>/dev/null | grep -q "$APP_ID"; then
          APP_FOUND=true
        fi
      fi
    fi
  fi
  
  # Check Android emulator
  if [ "$APP_FOUND" = false ] && command -v adb &> /dev/null; then
    if adb devices 2>/dev/null | grep -qE "device$|emulator"; then
      DEVICE_FOUND=true
      if adb shell pm list packages 2>/dev/null | grep -q "$APP_ID"; then
        APP_FOUND=true
      fi
    fi
  fi
  
  if [ "$APP_FOUND" = false ]; then
    if [ "$DEVICE_FOUND" = false ]; then
      echo ""
      echo "❌ Error: No simulator or emulator is running."
      echo ""
      echo "Please start a device first:"
      echo ""
      echo "  iOS:   open -a Simulator"
      echo "         # Or: xcrun simctl boot <device-id>"
      echo ""
      echo "  Android: Start an emulator from Android Studio"
      echo ""
    else
      echo ""
      echo "❌ Error: App '$APP_ID' is not installed on the running device."
      echo ""
      echo "To fix this, build and install the app:"
      echo ""
      echo "  iOS:   npx expo run:ios"
      echo "  Android: npx expo run:android"
      echo ""
      echo "After the app is installed, run the tests again:"
      echo "  pnpm run test:e2e"
      echo ""
      exit 1
    fi
  fi
fi

# Run maestro with all passed arguments
exec maestro "$@"
