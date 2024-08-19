document.addEventListener("DOMContentLoaded", manageOverlay);










function manageOverlay() {
    actionBtnConv();
    OpenclosePannel()
}
function actionBtnConv() {
    let isOn = false
    const btn = document.querySelector(".border-btn");
    btn.addEventListener("click", e => {
        const btnCircle = document.querySelector(".circle-btn");
        const ask = document.querySelector(".title-ask")
        btnCircle.style.transition = "all 0.25s ease";
        btn.style.backgroundColor = !isOn ? "#dfe6f5" : "#231e8f";
        btnCircle.style.left = !isOn ? "100%" : "50%";
        btnCircle.style.backgroundColor = !isOn ? "#231e8f" : "#dfe6f5";
        ask.textContent = !isOn ? "SIM" : "NÃO";
        isOn = !isOn;

        items = items.map(it => {
            const num = convNumerical(it.realPrice);            
            if (it.done && num > 0) return { id: it.id, name: it.name, estPrice: it.realPrice, done: it.done, realPrice: it.estPrice } 

            return it
        });
        
        feedingList(items)
    })
}
function OpenclosePannel() {
    const btnClose = document.querySelector(".wrap-circle-x");
    btnClose.addEventListener("click", () => {
        document.querySelector(".overlay-settings").style.display = "none";
    })

    const btnOpen = document.querySelector(".fa-gear");
    btnOpen.addEventListener("click", () => {
        document.querySelector(".overlay-settings").style.display = "flex";
    })
}

