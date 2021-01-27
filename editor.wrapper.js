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
		console.log(idx, y, this.topMargin)
		
		let vw = window.innerWidth
		let vh = window.innerHeight
		let vmin = vw < vh ? vw : vh
		
		// TODO: resizing when screen size is changed
		this.topMargin.height("7vmin").height(`-=${y}`)
        if (y > 0.07*vmin)  this.prefixMenu.css("top", y).css("top", "-=7vmin")
		else this.prefixMenu.css("top", 0)
        this.prefixMenu.show()
    }

    hide(){
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

function closeEditMenu(btnId){
    return ()=>{
        editorWrapper.sendButtonMessage(btnId)
		editMenu.hide()
	}
}

function baseBtnPressCallback(btnId, extend){
    return ()=>{
        editorWrapper.editor.contentWindow.focus()
        editorWrapper.sendButtonMessage(btnId)
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

registerBtnEvent("btnEsc", closeEditMenu("btnEsc"))
registerBtnEvent("btnAdd", baseBtnPressCallback("btnAdd"))
registerBtnEvent("btnDelete", baseBtnPressCallback("btnDelete"))

