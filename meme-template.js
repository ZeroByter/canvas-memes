function repeatString(str, times) {
    let result = ""

    for (let i = 0; i < times; i++) {
        result += str
    }

    return result
}

//repeat string is used here in case we want to include this css somewhere not in root
document.body.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" href="${repeatString("../", window.location.pathname.split("/").length - 2)}meme-template.css">`)

document.body.insertAdjacentHTML("beforeend", `<a href=".."><button class="go-back">go back</button></a>`)

const goBackButton = document.querySelector(".go-back")
const hideShowElements = [goBackButton]
let elementsVisible = true

document.body.addEventListener("keydown", function (e) {
    if (e.code == "F1") {
        elementsVisible = !elementsVisible
        for (const element of hideShowElements) {
            element.style.display = elementsVisible ? null : "none"
        }
        e.preventDefault()
    }
})