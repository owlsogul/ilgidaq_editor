var editorContainer = document.getElementById("editor-container");
var editor = document.getElementById("editor");
var editorData = {
    paragraphCursor: null,
    imageMap: {}
}

var interface = {
    
    // call to platform
    onRequestImageUpload: (id)=>{ console.log("on request image upload") },

    // call from platform

    /**
     * 
     * @param {string} id 
     * @param {string} path if null, remove image
     */
    setImagePath: (id, path)=>{
        if (id == null) {
            alert("잘못된 이미지 입니다.")
        }
    }

}

const isDesign = true;
function isMobile(){
    var UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){
        return true;
    }
    else{
        return false;
    }
}

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

function registerBtnEvent(id, event){
    $(document).on("click", id, event)
}

class EditMenu {
    constructor(isDesign) {
        this.isDesign = isDesign
        this.editMenuContainer = $("#edit-menu-container")
        this.editBalnk = $("edit-blank")
        this.prefixMenu = $("#edit-prefix-menu").toggle(isDesign)
        this.suffixMenu = $("#edit-suffix-menu").toggle(isDesign)
    }

    /**
     * 문단 컨테이너 위에 에디터를 보여주는 메소드
     * @param {*} targetContainer paragraphContainer
     */
    displayOnParagraph(targetContainer){
        var paragraph = $(targetContainer).children(".paragraph")
        this.prefixMenu.insertBefore(paragraph)
        this.suffixMenu.insertAfter(paragraph)
        this.prefixMenu.show()
        this.suffixMenu.show();
    }

    hide(){
        this.suffixMenu.prependTo(editor)
        this.prefixMenu.prependTo(editor)
        this.suffixMenu.hide()
        this.prefixMenu.hide()
    }
}

var editor = $("#editor")
var editMenu = new EditMenu(isDesign)

function toggleFontSize(size){
    let sel = getSelection()
    if (sel.focusNode.parentNode.nodeName == "FONT"){
        document.execCommand("fontSize", false, 3)    
    }
    else {
        document.execCommand("fontSize", false, size)    
    }
}

const focusInEvent = (e)=>{   
    let paraContainer = e.currentTarget
    let para = $(paraContainer).children(".paragraph")
    editMenu.displayOnParagraph(e.currentTarget)
    editorData.paragraphCursor = paraContainer

    // 컴퓨터 환경에서 focus와 click을 동시에 사용하기 위해서 필요함
    if (isMobile() == false && e.target != para) $(e.target).trigger("click") 
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

const onBtnEsc = (e)=>{
    editMenu.hide()
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
        editMenu.hide()
    }
    else { // 2개 이상일 경우
        editMenu.hide()
        let currentParagraph = $(editorData.paragraphCursor)
        currentParagraph.blur()
        let nextParagraph = currentParagraph.prev(".paragraphContainer")
        nextParagraph.children(".paragraph").focus();            
        currentParagraph.remove()
    }
}

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

$(document).on("focusin", "#editor .paragraphContainer", focusInEvent)

registerBtnEvent("#btnH1", onBtnH1)
registerBtnEvent("#btnH2", onBtnH2)
registerBtnEvent("#btnH3", onBtnH3)
registerBtnEvent("#btnBold", onBtnBold)
registerBtnEvent("#btnItalic", onBtnItalic)
registerBtnEvent("#btnUnderline", onBtnUnderline)
registerBtnEvent("#btnCancelline", onBtnCancelline)
registerBtnEvent("#btnInsertImage", onBtnInsertImage)

registerBtnEvent("#btnEsc", onBtnEsc)
registerBtnEvent("#btnAdd", onBtnAdd)
registerBtnEvent("#btnDelete", onBtnDelete)