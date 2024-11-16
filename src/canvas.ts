import fs from "node:fs";
import { createCanvas, loadImage } from "canvas";
import { Bonus, EmojiBuiler } from "./index.js";

const EMOJI_SIZE = 450;

export async function generateEmoji(
  newEmoji: EmojiBuiler,
  selectedBonus: Bonus | null,
  rotation?: string | null
) {
  const canvas = createCanvas(1024, 512);
  const ctx = canvas.getContext("2d");

  const base = await loadImage(
    `./public/images/data/base/${newEmoji.base}.png`
  );
  const eyes = await loadImage(
    `./public/images/data/eyes/${newEmoji.eyes}.png`
  );
  const mouth = await loadImage(
    `./public/images/data/mouth/${newEmoji.mouth}.png`
  );
  const detail = await loadImage(
    `./public/images/data/detail/${newEmoji.detail}.png`
  );
  let bonus = null;
  if (selectedBonus) {
    bonus = await loadImage(
      `./public/images/data/bonus/${selectedBonus.name}.png`
    );
  }

  const xPosition = canvas.width / 2 - EMOJI_SIZE / 2;
  const yPosition = canvas.height / 2 - EMOJI_SIZE / 2;

  let xEyesPosition = xPosition;
  let yEyesPosition = yPosition;
  let xMouthPosition = xPosition;
  let yMouthPosition = yPosition;
  let xDetailPosition = xPosition;
  const yDetailPosition = yPosition;

  if (newEmoji.base === "cowboy") {
    yEyesPosition = yPosition + 74;

    yMouthPosition = yPosition + 44;
  }

  if (newEmoji.base === "lying") {
    xEyesPosition = xPosition - 22;
    yEyesPosition = yPosition - 26;

    xMouthPosition = xPosition - 12;

    xDetailPosition = xPosition - 18;
  }

  if (rotation === "upside-down") {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
  } else if (rotation === "ROFL") {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
  }

  // Drawing images
  ctx.drawImage(base, xPosition, yPosition, EMOJI_SIZE, EMOJI_SIZE);
  ctx.drawImage(eyes, xEyesPosition, yEyesPosition, EMOJI_SIZE, EMOJI_SIZE);
  ctx.drawImage(mouth, xMouthPosition, yMouthPosition, EMOJI_SIZE, EMOJI_SIZE);
  ctx.drawImage(
    detail,
    xDetailPosition,
    yDetailPosition,
    EMOJI_SIZE,
    EMOJI_SIZE
  );
  if (bonus) {
    ctx.drawImage(bonus, 0, 0, canvas.width, canvas.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fs.writeFileSync("out.png", canvas.toBuffer() as any);

  return new Blob([canvas.toBuffer()], { type: "image/png" });
}
