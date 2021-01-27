var editorContainer = document.getElementById("editor-container");
var editor = document.getElementById("editor");
var editorData = {
    paragraphCursor: null,
    lastFocus: null,
    imageMap: {}
}
var msgEvents = {}
function registerMsgEvent(key, callback){
    var callbacks = msgEvents[key];
    if (!callbacks) { callbacks = []; msgEvents[key] = callbacks; }
    callbacks.push(callback);
}

function sendMessage(key, data){
    window.parent.postMessage({ key: key, data: data }, "*")
}

function isMobile(){
    var UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){
        return true;
    }
    else{
        return false;
    }
}

const focusInEvent = (e)=>{   
    let paraContainer = e.currentTarget
    let _paraContainer = $(paraContainer)
    let para = _paraContainer.children(".paragraph")
    editorData.paragraphCursor = paraContainer
    
    let idx = $(".paragraphContainer").index(paraContainer)
    let y = _paraContainer[0].offsetTop

    sendMessage("focus", { idx: idx, y: y })

    // 컴퓨터 환경에서 focus와 click을 동시에 사용하기 위해서 필요함
    if (isMobile() == false && e.target != para) $(e.target).trigger("click") 
}
$(document).on("focusin", "#editor .paragraphContainer", focusInEvent)


window.addEventListener("message", (e)=>{
    var key = e.data.key
    var data = e.data.data;
    console.log(e.data)
    if (msgEvents[key]){
        var callbacks = msgEvents[key];
        for(var idx = 0; idx < callbacks.length; idx++){
            callbacks[idx](data)
        }
    }
})


function buildParagraph(){
    return `
        <div class="paragraphContainer">
            <div class="paragraph" contenteditable="true"></div>
        </div>
    `
}

function buildImage(id){
    return `
        <div class="imageContainer" id="${id}" contenteditable="false">
            <img id="${id}" src="./test.jpg"/>
        </div>
    `
}

function toggleFontSize(size){
    let sel = getSelection()
    if (sel.focusNode.parentNode.nodeName == "FONT"){
        // TODO 같은 크기일 경우만 3으로 되돌리게 하기
        document.execCommand("fontSize", false, 3)    
    }
    else {
        document.execCommand("fontSize", false, size)    
    }
}

const onBtnH1 = (e)=>{
    toggleFontSize(7)
}
const onBtnH2 = (e)=>{
    toggleFontSize(5)
}
const onBtnH3 = (e)=>{
    toggleFontSize(3)
}

const onBtnBold = (e)=>{
    document.execCommand("bold", false, true)
}

const onBtnItalic = (e)=>{
    document.execCommand("italic", false, true)
}

const onBtnUnderline = (e)=>{
    document.execCommand("underline", false, true)
}

const onBtnCancelline = (e)=>{
    document.execCommand("strikeThrough", false, true)
}

const onBtnAdd = (e)=>{
    let newParagraph = $(buildParagraph())
    let currentParagraph = $(editorData.paragraphCursor)
    newParagraph.insertAfter(currentParagraph)
    currentParagraph.blur()
    newParagraph.children(".paragraph").focus()
}

const onBtnDelete = (e)=>{
    let containers = $(".paragraphContainer")
    let num = containers.length
    if (num == 1){ // 1개 밖에 없었을 경우
        containers.children(".paragraph").text("")
    }
    else { // 2개 이상일 경우
        let currentParagraph = $(editorData.paragraphCursor)
        currentParagraph.blur()
        let nextParagraph = currentParagraph.prev(".paragraphContainer")
        nextParagraph.children(".paragraph").focus();            
        currentParagraph.remove()
    }
}

const onBtnEsc = (e)=>{ console.log("exit"); }

const onBtnInsertImage = (e)=>{
    
    if (editorData.paragraphCursor != null){
        let sel = getSelection()
        let imageId = Date.now()

        document.execCommand("insertHtml", false, buildImage(imageId))
        editorData.imageMap[imageId] = false

        console.log(imageId, sel)
        interface.onRequestImageUpload()
    }
    
}
registerMsgEvent("pressBtn", (data)=>{
    if (data.btnId != "btnEsc") $(editorData.paragraphCursor).children(".paragraph").focus()
    switch(data.btnId){
        case "btnH1": onBtnH1(); break;
        case "btnH2": onBtnH2(); break;
        case "btnH3": onBtnH3(); break;
        case "btnBold": onBtnBold(); break;
        case "btnItalic": onBtnItalic(); break;
        case "btnUnderline": onBtnUnderline(); break;
        case "btnCancelline": onBtnCancelline(); break;
        case "btnInsertImage": onBtnInsertImage(); break;
        case "btnEsc": onBtnEsc(); break;
        case "btnAdd": onBtnAdd(); break;
        case "btnDelete": onBtnDelete(); break;
    }
})




