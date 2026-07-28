#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
flutter create --platforms=android,ios --org mn.ventour --project-name ventour .
flutter pub get
printf '
Platform files created. The existing lib/ and pubspec.yaml are preserved.
'
