import { Bot } from "@skyware/bot";
import imgBase64 from "./test-base64.js"
import { handleCanvas } from "./canvas.js";

const bot = new Bot();
await bot.login({
	identifier: process.env.BSKY_USERNAME as string,
	password: process.env.BSKY_PASSWORD as string,
});

const imgUrl = handleCanvas()

await bot.post({
	text: "Check out this image!",
	images: [
		{
			data: imgUrl,
			alt: "Emoji Mashup",
		},
	],
});

await bot.on('mention', async (mention) => {
	await mention.reply({text: 'Well received!'})
})

