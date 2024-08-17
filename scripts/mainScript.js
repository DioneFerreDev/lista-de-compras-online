let items = [];
let ePrice = 0;
let rPrice = 0;
let tPrice = 0;
document.addEventListener("DOMContentLoaded", () => {
    manageFuncion();
});

















function manageFuncion() {
    let itemsObj = localStorage.getItem("items");
    itemsObj = JSON.parse(itemsObj);
    if (itemsObj.length > 0) {
        let itemsObj = localStorage.getItem("items");
        itemsObj = JSON.parse(itemsObj);
        items = itemsObj;
        let lastId = 0;
        items.forEach(it => {
            if (it.id > lastId) lastId = it.id
        });
        console.log(lastId)
        lastId = lastId + 1;
        console.log(lastId)
        console.log(items)
        Item.id = lastId;
        feedingList(items)
    } else {
        localStorage.removeItem("items")
    }
    audio()
    $('#est-price').mask("#.##0,00", { reverse: true });
    $('#real-price').mask("#.##0,00", { reverse: true });
}
function audio() {
    const isMob = isMobileDevice();
    let isRecord = false;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;


    // adicionar
    const producNametMic = document.querySelector(".product-name-mic");
    producNametMic.addEventListener('click', e => {
        if (!isRecord) {
            producNametMic.style.borderRadius = "50%"
            producNametMic.style.color = "greenyellow";
            let transcript = null;

            if (!('webkitSpeechRecognition' in window)) {
                alert("Seu navegador não suporta a API")
                return
            }

            recognition.onend = () => {
                producNametMic.style.borderRadius = "5px";
                producNametMic.style.color = "white";
            }

            recognition.onresult = e => {                
                transcript = e.results[0][0].transcript;
                document.getElementById('product-name').value = transcript                
            }
            recognition.start();
        } else {
            producNametMic.style.borderRadius = "5px";
            producNametMic.style.color = "white";
            recognition.stop()
        }
        isRecord = !isRecord
    })



    // atualizar
    const productMic = document.querySelector(".product-mic");
    productMic.addEventListener('click', e => {

        if (!isRecord) {
            productMic.style.borderRadius = "50%"
            productMic.style.color = "greenyellow";
            let transcript = null;

            if (!('webkitSpeechRecognition' in window)) {
                alert("Seu navegador não suporta a API")
                return
            }

            recognition.onend = () => {
                productMic.style.borderRadius = "5px";
                productMic.style.color = "white";
            }

            recognition.onresult = e => {                
                transcript = e.results[0][0].transcript
                document.getElementById('product').value = transcript                
            }
            recognition.start();
        } else {
            productMic.style.borderRadius = "5px";
            productMic.style.color = "white";
            recognition.stop()
        }
        isRecord = !isRecord
    })

    function isMobileDevice() {
        // Verifica se o userAgent contém uma string típica de dispositivos móveis
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
function functionHeader() {
    document.querySelector(".overlay").style.display = "flex";
}
function hideModal() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".overlay-atualizar").style.display = "none";
    new resetarForm("product-form");
    new resetarForm("form-atualizar");
}
function addAction(e) {
    const product = document.getElementById("product-name").value;
    let estPrice = document.getElementById("est-price").value;

    if (product === "" || product === null) return
    if (estPrice === "" || estPrice === null) estPrice = 0;

    const item = new Item(product, estPrice);
    items.push(item)
    zerarCampos();
    feedingList(items);
}
function zerarCampos() {
    document.getElementById("product-name").value = "";
    document.getElementById("est-price").value = "";
}
function feedingList(items) {
    const itemsStr = JSON.stringify(items)
    localStorage.setItem("items", itemsStr)
    items = new ReorganizarAlfabeticamente(items);
    const ul = document.getElementById("items-list");
    ul.innerHTML = "";

    const liItems = items.map(item =>
        `
        <li id=${item.id}><div class='col-name'><div class='red-line' style='display:${item.done ? "block" : "none"}'></div>${item.name}</div>
            <div class='col-price'><label class='label-first-price'>${item.estPrice}</label>
            <label class='label-real-price'>${item.realPrice}</label>
                <div class='under-price'>
                    <i class="fa-solid fa-pencil" onClick='editProduct(${item.id})'></i>
                    <i class='${!item.done ? "fa-regular fa-thumbs-up" : "fa-sharp fa-solid fa-thumbs-up"}' onClick='isDone(${item.id})'></i>
                    <i class="fa-regular fa-trash-can" onClick="deleteItem(${item.id})"></i>
                </div>
            </div>
        </li>
        `
    ).join('');
    ul.innerHTML = liItems;
    calcEst(items)
    calcTotal(items);
    calcSaldo(tPrice)
}
function editProduct(id) {
    const item = items.filter(it => it.id === id)[0];
    const inputTemporario = $("<input>");
    inputTemporario.mask("#.##0,00", { reverse: true });
    inputTemporario.val(item.realPrice);
    item.realPrice = inputTemporario.val();
    if(item.realPrice == 0) item.realPrice =  ""
    const overlay = document.querySelector(".overlay-atualizar");
    overlay.style.display = "flex";
    document.getElementById("product").value = item.name;
    document.getElementById("real-price").value = item.realPrice;
    const itemString = JSON.stringify(item);
    document.getElementById("hidden-product").value = itemString
}
function atualizar() {
    const name = document.getElementById("product").value;
    let realPrice = document.getElementById("real-price").value;
    if(realPrice === "") realPrice = "0";

    const itemString = document.getElementById("hidden-product").value;
    const itemObj = JSON.parse(itemString);
    items = items.filter(it => it.id !== itemObj.id);
    items.push({ id: itemObj.id, done: itemObj.done, estPrice: itemObj.estPrice, name, realPrice });
    feedingList(items);
    hideModal();
}
function isDone(id) {
    items = items.map(item => {
        if (item.id === id) return { id: item.id, name: item.name, estPrice: item.estPrice, done: !item.done, realPrice: item.realPrice }
        return item
    });
    feedingList(items);
}
function calcEst(items) {
    let estPriceFinal = 0;
    items.forEach(item => {
        if (item.done) estPriceFinal += convNumerical(item.realPrice)
    })
    estPriceFinal = estPriceFinal.toFixed(2)
    estPriceFinal = Number(estPriceFinal)

    tPrice = estPriceFinal;
    const formattedPrice = formatToCurrency(estPriceFinal);
    document.getElementById("realPrice").innerHTML = formattedPrice;
}
function convNumerical(valorInicial) {
    let normalizedPrice = valorInicial.replace(/\./g, "");
    normalizedPrice = normalizedPrice.replace(",", ".");
    const decimalPrice = new Decimal(normalizedPrice);
    const valor = decimalPrice.toNumber()
    return valor
}
function calcTotal(items) {
    let estPriceFinal = 0;
    items.forEach(item => {
        estPriceFinal += convNumerical(item.estPrice);
    })
    estPriceFinal = estPriceFinal.toFixed(2)
    estPriceFinal = Number(estPriceFinal)
    tPrice = estPriceFinal - tPrice
    const formattedPrice = formatToCurrency(estPriceFinal);
    document.getElementById("estimated-price").innerHTML = formattedPrice;

}
function calcSaldo(saldo) {
    saldo = formatToCurrency(saldo);
    const divSaldo = document.getElementById("saldo");
    divSaldo.innerHTML = saldo;
    saldo = convNumerical(saldo)
    if (saldo < 0) {
        divSaldo.style.color = "red"
    } else {
        divSaldo.style.color = "green"
    }
}
function deleteItem(id) {
    console.log(id)
    items = items.filter(item => item.id !== id)

    feedingList(items);
}
function formatToCurrency(value) {
    // Garante que o número tenha duas casas decimais
    let [integerPart, decimalPart] = value.toFixed(2).split('.');

    // Adiciona separador de milhar (ponto) na parte inteira
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Substitui o ponto decimal por uma vírgula
    return `${integerPart},${decimalPart}`;
}








