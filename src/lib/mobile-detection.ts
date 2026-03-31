export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  if (
    /iPad|iPhone|iPod/.test(userAgent) &&
    !(window as any).MSStream
  ) {
    return true;
  }

  // Android detection
  if (
    /android/i.test(userAgent)
  ) {
    return true;
  }

  // Windows Phone detection
  if (
    /Windows Phone/i.test(userAgent)
  ) {
    return true;
  }

  return false;
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};