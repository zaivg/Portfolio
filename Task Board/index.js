let inputTaskForm = document.body.querySelector("#inputTaskForm");
let inputTaskText = document.body.querySelector("#inputTaskText");
let inputDueDate = document.body.querySelector("#inputDueDate");
let inputDueTime = document.body.querySelector("#inputDueTime");
let noteShelf = document.body.querySelector("#noteShelf");


SetDefaults();
GetStoredNotes();


function SetDefaults() {
    let val = DateTime.GetCurrentLclDate();
    inputDueDate.setAttribute("min", val);
    inputDueDate.setAttribute("value", val);
    HighlightWrongControl(inputTaskText, false);
    HighlightWrongControl(inputDueDate, false);
    HighlightWrongControl(inputDueTime, false);
} //SetDefaults()


function RefreshNotes(optView) {
    //remove all Notes:
    $("#note").className = "note hidden";
    while (noteShelf.hasChildNodes()) {
        noteShelf.removeChild(noteShelf.lastChild);
    }

    //Get Stored Notes:
    setTimeout(function () {
        GetStoredNotes(optView);
    }, 100)
}//RefreshNotes()


function GetStoredNotes(optView = null) {
    if (optView == null) { optView = document.querySelector('input[name="optView"]:checked').value }

    for (key of Object.keys(localStorage)) {
        if (Task.prototype.CheckId(key)) {
            let task = new Task(localStorage.getItem(key));
            switch (task.ErrorCD) {
                case ERROR_CD.OK:
                    if (optView & 1) CreateNewNote(task);
                    break;
                case ERROR_CD.DueDateTimePassed:
                    if (optView & 2) CreateNewNote(task);
                    break;
            }//switch(task.ErrorCD)
        }//CheckId(key)
    }//for val
} //GetStoredNotes()

inputDueDate.addEventListener("input", () => { DateTime.ValidateInputDT(true, inputDueDate) })

inputDueTime.addEventListener("input", () => { DateTime.ValidateInputDT(false, inputDueTime) })

inputTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var arrQuery = $("#inputTaskForm").serializeArray();
    let task = new Task(arrQuery);

     switch (task.ErrorCD) {
        case ERROR_CD.OK:
            HighlightWrongControl(inputTaskText, false);
            HighlightWrongControl(inputDueDate, false);
            HighlightWrongControl(inputDueTime, false);
            CreateNewNote(task);
            inputTaskForm.reset();   
            break;
        case ERROR_CD.TaskTextEmpty:
            ShowMessage(task.ErrorCD);
            HighlightWrongControl(inputTaskText, true);
            HighlightWrongControl(inputDueDate, false);
            HighlightWrongControl(inputDueTime, false);
            break;
        case ERROR_CD.DueDateEmpty:
            ShowMessage(task.ErrorCD);
            HighlightWrongControl(inputTaskText, false);
            HighlightWrongControl(inputDueDate, true);
            HighlightWrongControl(inputDueTime, false);
            break;
        case ERROR_CD.DueDateWrong:
            ShowMessage(task.ErrorCD);
            HighlightWrongControl(inputTaskText, false);
            HighlightWrongControl(inputDueDate, true);
            HighlightWrongControl(inputDueTime, false);
            break;
        case ERROR_CD.DueDateTimePassed:
            ShowMessage(task.ErrorCD);
            HighlightWrongControl(inputTaskText, false);
            HighlightWrongControl(inputDueDate, true);
            HighlightWrongControl(inputDueTime, true);
            break;
    }//switch(task.ErrorCD)
}) //event submit

inputTaskForm.addEventListener("reset", function (e) {
    SetDefaults();
}) //event reset

function ShowMessage(msg) {
    document.body.querySelector("#messageText").innerHTML = msg;
    $("#messageWindow").modal("show");
    setTimeout(function () { $("#messageWindow").modal("hide"); }, 5000);
} //ShowMessage()

function HighlightWrongControl(elm, isWrong) {
    if (isWrong) { elm.classList.add("inputWrong"); }
    else { elm.classList.remove("inputWrong"); }
}//HighlightWrongControl()

function CreateNewNote(task) {
    if (task.ErrorCD == ERROR_CD.OK) {
        localStorage.setItem(task.Id, task.GetJSon());
    }
    let newNote = CreateNoteTemplate(task);
    newNote.querySelector(".btn-close-note").addEventListener("click", btnCloseNote_onClick)
    noteShelf.appendChild(newNote);
    setTimeout(function () { newNote.className = "note visible"; }, 1000)
} //CreateNewNote


function btnCloseNote_onClick(e) {
    let note = e.target.parentElement;
    if (note.parentElement != noteShelf) { note = note.parentElement; }

    note.className = "note hidden";
    setTimeout(function () {
        localStorage.removeItem(note.getAttribute("id"));
        noteShelf.removeChild(note);
    }, 600)
} //btnCloseNote_onClick()

