class EditorWrapper {
    constructor(editor){
        this.editor = editor
        this.editorWindow = this.editor.contentWindow
        this.callbacks = {}
    }

    registerMessageHandler(key, callback){
        var keyCallbacks = this.callbacks[key]
        if (!keyCallbacks) {keyCallbacks = []; this.callbacks[key] = keyCallbacks}
        keyCallbacks.push(callback)
    }

    sendMessage(key, data){
        this.editorWindow.postMessage({ key: key, data: data }, "*")
    }

    sendButtonMessage(btnId){
        this.sendMessage("pressBtn", { btnId: btnId })
    }
}

class EditMenu {
    constructor(isDesign) {
        this.isDesign = isDesign
        this.prefixMenu = $("#edit-prefix-menu").toggle(isDesign)
        this.topMargin = $("#top-margin")
    }

    displayOnParagraph(idx, y){
        let vw = window.innerWidth
        let vh = window.innerHeight
        let vmin = vw < vh ? vw : vh
        
        this.topMargin.css("height", )
        this.prefixMenu.css("top", )
        this.prefixMenu.show()
    }

    hide(){
        this.topMargin.toggleClass("isFirst", false)
        this.prefixMenu.hide()
    }
}

var _editor = document.getElementById("editor-wrapper")
var editorWrapper = new EditorWrapper(_editor);

var editMenu = new EditMenu(true)

window.addEventListener("message", (e)=>{
    var key = e.data.key
    if (key) {
        var callbacks = editorWrapper.callbacks[key]
        for (var idx = 0; idx < callbacks.length; idx++){
            callbacks[idx](e.data.data)
        }
    }
})

// 메시지 처리 부분
editorWrapper.registerMessageHandler("focus", (data)=>{
    var idx = data.idx;
    var y = data.y;
    console.log("focus", idx, y)
    editMenu.displayOnParagraph(idx, y)
})



// 
// 버튼 등록 부분
//

function registerBtnEvent(id, event){
    $(document).on("click", "#"+id, event)
    editorWrapper.sendButtonMessage(id)
}

function closeEditMenu(){
    return ()=>{editMenu.hide()}
}

function baseBtnPressCallback(btnId, extend){
    return ()=>{
        editorWrapper.editor.contentWindow.focus()
        editorWrapper.sendButtonMessage(btnId)
        if (extend) extend()
    }
}

registerBtnEvent("btnH1", baseBtnPressCallback("btnH1"))
registerBtnEvent("btnH2", baseBtnPressCallback("btnH2"))
registerBtnEvent("btnH3", baseBtnPressCallback("btnH3"))
registerBtnEvent("btnBold", baseBtnPressCallback("btnBold"))
registerBtnEvent("btnItalic", baseBtnPressCallback("btnItalic"))
registerBtnEvent("btnUnderline", baseBtnPressCallback("btnUnderline"))
registerBtnEvent("btnCancelline", baseBtnPressCallback("btnCancelline"))
registerBtnEvent("btnInsertImage", baseBtnPressCallback("btnInsertImage"))

registerBtnEvent("btnEsc", baseBtnPressCallback("btnEsc", closeEditMenu()))
registerBtnEvent("btnAdd", baseBtnPressCallback("btnAdd"))
registerBtnEvent("btnDelete", baseBtnPressCallback("btnDelete"))

