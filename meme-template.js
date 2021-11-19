document.body.onload = function () {
    document.body.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" href="/meme-template.css">`)

    document.body.insertAdjacentHTML("beforeend", `<a href="/"><button class="go-back">go back</button></a>`)

    const goBackButton = document.querySelector(".go-back")
    const hideShowElements = [goBackButton]
    let elementsVisible = true

    document.body.addEventListener("keydown", function (e) {
        if(e.code == "F1"){
            elementsVisible = !elementsVisible
            for(const element of hideShowElements){
                element.style.display = elementsVisible ? null : "none"
            }
            e.preventDefault()
        }
    })
}