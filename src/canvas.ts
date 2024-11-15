import { createCanvas, loadImage } from 'canvas'

export function handleCanvas() {
    const canvas = createCanvas(1080, 720)
    const ctx = canvas.getContext('2d')

    ctx.font = '30px Impact'
    ctx.rotate(0.1)
    ctx.fillText('Hello World!', 50, 100)

    loadImage('src/test-light.png').then((image) => {
        ctx.drawImage(image, 50, 0, 70, 70)

        console.log(canvas.toDataURL())
    })

    return canvas.toDataURL()
}