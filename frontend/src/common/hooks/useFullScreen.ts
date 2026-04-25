type UseFullScreenOptions = {
  onExitFullscreen?: () => void;
  onBlur?: () => void;
};

type UseFullScreenReturn = {
  enterFullScreen: () => void;
  exitFullScreen: () => void;
};

export default function useFullScreen(
  { onExitFullscreen, onBlur }: UseFullScreenOptions = {}
): UseFullScreenReturn {
  const enterFullScreen = () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const exitFullScreen = () => {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };

    if (document.exitFullscreen) document.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    else if (doc.msExitFullscreen) doc.msExitFullscreen();
  };

  return { enterFullScreen, exitFullScreen };
}