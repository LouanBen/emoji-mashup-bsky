import { Bot } from "@skyware/bot";
import { generateEmoji } from "./canvas.js";
import emojis from "./emoji-db.js";
import bonus from "./bonus-db.js";
import { CronJob } from "cron";

export interface EmojiBuiler {
  base: string;
  eyes: string;
  mouth: string;
  detail: string;
}

export interface Bonus {
  name: string;
  char: string;
}

const bot = new Bot();
await bot.login({
  identifier: process.env.BSKY_HANDLE as string,
  password: process.env.BSKY_PASSWORD as string,
});

CronJob.from({
  cronTime: "0 * * * *",
  onTick: emojiMashup,
  start: true,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
async function emojiMashup() {
  // Random emoji selector
  const emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
  let tempEmoji2;
  do {
    tempEmoji2 = emojis[Math.floor(Math.random() * emojis.length)];
  } while (emoji1.name == tempEmoji2.name);
  const emoji2 = tempEmoji2;

  // Determine new emoji composition
  const result: EmojiBuiler = {
    base: emoji2.base,
    eyes: emoji1.eyes,
    mouth: "",
    detail: "default",
  };

  let selectedBonus = null;
  const randNum = Math.floor(Math.random() * 7);
  if (randNum < 1) {
    selectedBonus = bonus[Math.floor(Math.random() * bonus.length)];
  }

  if (
    emoji1.base != emoji2.base &&
    ((emoji1.base != "default" && emoji2.base != "smaller") ||
      (emoji2.base != "default" && emoji1.base != "smaller"))
  ) {
    result.mouth = emoji1.mouth;

    if (emoji2.base == "default") {
      result.eyes = emoji2.eyes;
    }
  } else {
    result.mouth = emoji2.mouth;
  }

  if (emoji2.detail != "default") {
    result.detail = emoji2.detail;
  } else {
    result.detail = emoji1.detail;
  }

  // Emoji exceptions
  if (emoji1.base == "hand-over-mouth") {
    // If emoji1 is "hand-over-mouth" it will have no mouth. We then need to let emoji1's detail (its hand)
    result.detail = emoji1.detail;
  } else if (emoji1.base == "skull") {
    // If emoji1 is "skull" it will have no mouth. We then need to take emoji2's mouth.
    result.mouth = emoji2.mouth;
    result.eyes = emoji1.eyes;
  } else if (emoji1.base == "cowboy") {
    // If emoji1 is "cowboy", the final emoji won't be interesting. We then need to take cowboy's base and its mouth but we keep emoji2's eyes.
    result.base = "cowboy";
    result.mouth = emoji1.mouth;
    result.eyes = emoji2.eyes;
  } else if (emoji1.base == "clown" && emoji2.base == "default") {
    // If emoji1 is "clown", the final emoji won't be interesting. We then need to take clown's base and its mouth but we keep emoji2's eyes.
    result.base = "clown";
    result.mouth = emoji1.mouth;
    result.eyes = emoji2.eyes;
  }

  if (emoji2.name === "skull") {
    // If emoji2 is "skull", remove its mouth
    result.mouth = "void";
  }

  let rotation = null;
  if (emoji2.name === "ROFL") {
    rotation = "ROFL";
  } else if (emoji2.name === "upside-down") {
    rotation = "upside-down";
  }

  console.log("generating image");
  // Generate image
  const imgUrl = await generateEmoji(result, selectedBonus, rotation);

  console.log("posting emoji");
  await bot.post({
    text: `${emoji1.char} ${emoji1.name} + ${emoji2.char} ${emoji2.name} ${
      selectedBonus ? `+ ${selectedBonus.char} ${selectedBonus.name}` : ""
    } =`,
    images: [
      {
        data: imgUrl,
        alt: `An Emoji Mashup combining ${emoji1.char} and ${emoji2.char}. ${
          selectedBonus ? `There's also a ${selectedBonus.char}` : ""
        }`,
      },
    ],
  });
}
