// Generates the voiceover clips into public/voice/ using Microsoft Edge's free neural TTS.
// Run with: npm run voice
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { createWriteStream, mkdirSync, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";

const VOICE = "en-US-AndrewNeural";
const OUT_DIR = "public/voice";

// Keep in sync with the <Sequence from={...}> timings in src/JavaScriptReel.tsx
const clips = {
  intro:
    "Here's a classic JavaScript interview question. What does this code print? Drop your answer in the comments!",
  three: "Three.",
  two: "Two.",
  one: "One.",
  answer:
    "The answer is: one, four, three, two. " +
    "One and four print first, because they're synchronous and run straight on the call stack. " +
    "Three is next, because promise callbacks go into the microtask queue, which empties right after the current script. " +
    "And two comes last. setTimeout is a macrotask, so even with zero delay, it waits for the next turn of the event loop.",
};

mkdirSync(OUT_DIR, { recursive: true });

const tts = new MsEdgeTTS();
await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

for (const [name, text] of Object.entries(clips)) {
  const file = `${OUT_DIR}/${name}.mp3`;
  const { audioStream } = tts.toStream(text, { rate: "+5%" });
  await pipeline(audioStream, createWriteStream(file));
  // 48 kbit/s constant bitrate, so size gives a close duration estimate
  const seconds = (statSync(file).size * 8) / 48000;
  console.log(`${file}  ~${seconds.toFixed(1)}s`);
}

tts.close();
