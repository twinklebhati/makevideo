import { Composition } from "remotion";
import { JavaScriptReel } from "./JavaScriptReel";

export const RemotionRoot = () => {
  return (
    <Composition
      id="JsInterviewReel"
      component={JavaScriptReel}
      durationInFrames={1200} // 40 seconds (answer voiceover runs to ~37.5s)
      fps={30}
      width={1080}
      height={1920}
    />
  );
};