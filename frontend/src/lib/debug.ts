export function isDebugModeEnabled() {
  const debugFlag = process.env.APP_DEBUG?.toLowerCase();

  return (
    process.env.NODE_ENV === "development" ||
    debugFlag === "1" ||
    debugFlag === "true" ||
    debugFlag === "yes"
  );
}
