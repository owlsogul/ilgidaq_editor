class EditorWrapper {
    constructor(editor){
        this.editor = editor
        this.editorWindow = this.editor.contentWindow
        this.callbacks = {}
    }

    registerMessageHandler(key, callback){
        var keyCallbacks = callbacks[key]
        if (!keyCallbacks) {keyCallbacks = []; callbacks[key] = keyCallbacks}
        keyCallbacks.push(callback)
    }

    sendMessage(key, data){
        this.editorWindow.postMessage({ key: key, data: data }, "*")
    }

    sendButtonMessage(btnId){
        this.sendMessage("pressBtn", { btnId: btnId })
    }
}

var _editor = document.getElementById("editor-wrapper")
var editorWrapper = new EditorWrapper(_editor);

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




// 
// 버튼 등록 부분
//

function registerBtnEvent(id, event){
    $(document).on("click", "#"+id, event)
    editorWrapper.sendButtonMessage(id)
}

function baseBtnPressCallback(btnId){
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

registerBtnEvent("btnEsc", baseBtnPressCallback("btnEsc"))
registerBtnEvent("btnAdd", baseBtnPressCallback("btnAdd"))
registerBtnEvent("btnDelete", baseBtnPressCallback("btnDelete"))

