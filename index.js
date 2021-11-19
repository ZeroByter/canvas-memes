//I like React, I really like React, I'm so used to React I'm gonna copy it here, sort of.

function cleanHTMLTemplate(template) {
    return template//.replace(/^[\n\r\t ]*/gm, "");
}

function generateMemes(data) {
    const container = document.querySelector(".memes-container")

    for (const meme of data) {
        container.insertAdjacentHTML("beforeend", cleanHTMLTemplate(`
            <div class="meme-container">
                <a href="./${meme.url || meme.name}.html">
                    <div class="meme-name">${meme.name}</div>
                    <div class="meme-desc">${meme.desc}</div>
                </a>
            </div>
        `))
    }
}

generateMemes([
    {
        url: "2d-excavator/index",
        name: "2d-excavator",
        desc: "2d excavator simulator... thing..."
    },
    {
        name: "bring resources",
        desc: "Meant to be a thing showing robots carrying things, inspired by the <del>slaves</del>drones in Factorio. Press number keys 1-3 to change tool"
    },
    {
        name: "closest point",
        desc: "click on the screen to create points ( ͡° ͜ʖ ͡°)"
    },
    {
        name: "color circles",
        desc: "Sort of inspired by color lines, but it's a circle. Press W/S to change modes, left/right arrows to change offset, up/down arrows to change line thickness"
    },
    {
        name: "color lines",
        desc: "It's a line, it's colorful, it moves"
    },
    {
        name: "color screen",
        desc: "Drawing a bunch of colorful lines on a screen without clearing it"
    },
    {
        name: "funky",
        desc: "Just something funky"
    },
    {
        name: "influence copy",
        desc: "Trying to create a copy of the mobile Influence game, abandoned..."
    },
    {
        name: "jumpy",
        desc: "Click on the screen to create points, a red boi will jump across all over them."
    },
    {
        name: "lotta explodey",
        desc: "Was meant to be a clone of an old Java meme I made, kinda weird"
    },
    {
        name: "power",
        desc: "Testing arcade power distribution across nodes (Factorio inspired)"
    },
    {
        name: "random-test",
        desc: "It's not a random test, it's a literal test of randomness. Trying to test different types of random occurance methods"
    },
])