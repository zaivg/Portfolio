/********** Task object **********/
const ERROR_CD = {
    OK: "",
    TaskTextEmpty: "Task Data is required.<br>Please fill it!",
    DueDateEmpty: "Due Date is required.<br>Please fill it!",
    DueDateWrong: "The date is wrong.<br>Please fill correct date!",
    DueDateTimePassed: "Date and time<br>should be in the future!"
}

/* sData is: 
- query of $("#inputTaskForm").serializeArray() 
- or string from JSON.stringify() */
function Task(sData) {
    //public: ---
    this.Id = undefined;
    this.TaskText = undefined;
    this.DueDate = undefined;
    this.DueTime = undefined;
    this.ErrorCD = undefined;

    this.GetJSon = function () {
        let temp = this.ErrorCD;
        this.ErrorCD = undefined;

        let sJSON = JSON.stringify(this);
        this.ErrorCD = temp;

        return sJSON;
    }//this.GetJSon()

    this.GetDateFormatted = function () {
        return (this.DueDateTime == undefined) ? "" : `${(this.DueDateTime.getDate() < 9 ? '0' : "") + this.DueDateTime.getDate()}/${(this.DueDateTime.getMonth() < 9 ? '0' : "") + (this.DueDateTime.getMonth() + 1)}/${this.DueDateTime.getFullYear()}`;
    }//this.GetDateFormatted()

    this.GetTimeFormatted = function () {
        return (this.DueDateTime == undefined) ? "" : `${(this.DueDateTime.getHours() < 10 ? "0" : "") + this.DueDateTime.getHours()}:${(this.DueDateTime.getMinutes() < 10 ? "0" : "") + this.DueDateTime.getMinutes()}`
    }//this.GetDateFormatted()

    //private: ---
    function _FillTaskFromQry() {
        for (let val of sData) {
            switch (val.name.toUpperCase()) {
                case "TaskText".toUpperCase():
                    this.TaskText = val.value;
                    break;
                case "DueDate".toUpperCase():
                    this.DueDate = val.value;
                    break;
                case "DueTime".toUpperCase():
                    this.DueTime = val.value;
                    break;
            }//switch
        }//for

        _VerifayTask.call(this);
        this.Id = _GetID();
    }//_FillTaskFromQry()

    _FillTaskFromJSon = function () {
        let taskJSON;
        try { taskJSON = JSON.parse(sData); }
        catch (e) { console.log(e); }

        Object.assign(this, taskJSON)
        _VerifayTask.call(this);
    }//this.GetJSon()

    function _VerifayTask() {
        this.ErrorCD = ERROR_CD.OK;
        if (this.TaskText == "") this.ErrorCD = ERROR_CD.TaskTextEmpty;
        if (this.DueDate == "") this.ErrorCD = ERROR_CD.DueDateEmpty;

        if (this.ErrorCD == ERROR_CD.OK) {
            this.ErrorCD = DateTime.ValidateDateTime(this.DueDate, this.DueTime);
        }
    }//_VerifayTask()

    function _ClearTask() {
        this.Id = undefined;
        this.TaskText = undefined;
        this.DueDate = undefined;
        this.DateTime = undefined;
    } //_ClearTask()

    function _GetID() {
        return Task.prototype.ID_PREFIX + Date.now();
    } //_GetID()


    //call "constructor":
    if (sData != null) {
        if (sData instanceof Array) { _FillTaskFromQry.call(this); }
        else { _FillTaskFromJSon.call(this); }
    }
}//Task

//static: ---
Task.prototype.ID_PREFIX = "TaskBoard-Note#";
Task.prototype.CheckId = function (sId) { return sId.startsWith(Task.prototype.ID_PREFIX); }

/********** end of: Task object **********/


/********** DateTme object**********/
const PATTERN = { /* 01/01/2000 - 31/12/2999 */
    //DATE:
    separatorD: "(\/)",
    d: "(\\d)",
    dd: "(0[1-9]|[12]\\d|3[01])",
    m: "([01])",
    mm: "(0[1-9]|1[0-2])",
    y: "(2)",
    yy: "([23]\\d)",
    yyy: "([23]\\d\\d)",
    yyyy: "([23]\\d\\d\\d)",
    //TIME:
    separatorT: "(:)",
    h: "([0-2])",
    hh: "([01]\\d|2[0-3])",
    n: "([0-5])",
    nn: "([0-5]\\d)",
}//PATTERN

function DateTime() { }
DateTime.GetPATTERN = function (isDate, length) {
    if (isDate) {
        switch (length) {
            case 0: return ""; //break is not needed due to return
            //day:
            case 1: return Wrap(PATTERN.d);
            case 2: return Wrap(PATTERN.dd);
            case 3: return Wrap(PATTERN.dd + PATTERN.separatorD);
            //months:
            case 4: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.m);
            case 5: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm);
            case 6: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm + PATTERN.separatorD);
            //year:
            case 7: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm + PATTERN.separatorD + PATTERN.y);
            case 8: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm + PATTERN.separatorD + PATTERN.yy);
            case 9: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm + PATTERN.separatorD + PATTERN.yyy);
            case 10: return Wrap(PATTERN.dd + PATTERN.separatorD + PATTERN.mm + PATTERN.separatorD + PATTERN.yyyy);
            default: return null;
        }//switch
    }//is Date
    else {//is Time:
        switch (length) {
            case 0: return ""; //break is not needed due to return
            //hours:
            case 1: return Wrap(PATTERN.h);
            case 2: return Wrap(PATTERN.hh);
            case 3: return Wrap(PATTERN.hh + PATTERN.separatorT);
            //minutes:
            case 4: return Wrap(PATTERN.hh + PATTERN.separatorT + PATTERN.n);
            case 5: return Wrap(PATTERN.hh + PATTERN.separatorT + PATTERN.nn);
            default: return null;
        }//switch       
    }//is Time

    function Wrap(inputDueDate) { return "^(" + inputDueDate + ")$"; }
}//DateTime.GetPATTERN()

DateTime.ConvertLclToSys = function (sDate, sTime) {//dd/mm/yyyy hh:mm ==> yyyy-mm-ddThh:mm
    if (sTime == "") sTime = "23:59:59"
    return `${sDate.substring(6, 10)}-${sDate.substring(3, 5)}-${sDate.substring(0, 2)}T${sTime.substring(0, 2)}:${sTime.substring(3, 5)}:00`;
}//DateTime.ConvertLclToSys()

DateTime.ValidateInputDT = function (isDate, elDT) {
    let pattern = DateTime.GetPATTERN(isDate, elDT.value.length);

    if (pattern == null) {
        elDT.value = elDT.getAttribute("oldValue");
    }
    else {
        re = new RegExp(pattern);
        if (re.test(elDT.value)) {
            elDT.setAttribute("oldValue", elDT.value);
            if(isDate){
                if(elDT.value.length == 2 || elDT.value.length == 5) elDT.value += "/";
            }//isDate
            else{//Time:
                if(elDT.value.length == 2) elDT.value += ":";
            }//Time
        } //included elDT is OK
        else {//included elDT is Wrong ==> return previous elDT:
            elDT.value = elDT.getAttribute("oldValue");
        }
    }//pattern OK
}//DateTime.ValidateInputDT()

DateTime.ValidateDateTime = function (sDate, sTime) {
    let errorCD = ERROR_CD.OK;

    let dt = new Date(DateTime.ConvertLclToSys(sDate, sTime))
    if (dt == "Invalid Date") errorCD = ERROR_CD.DueDateWrong;
    if (dt.getMonth() + 1 != sDate.substring(3, 5)) errorCD = ERROR_CD.DueDateWrong;

    if (errorCD == ERROR_CD.OK && dt <= new Date()) errorCD = ERROR_CD.DueDateTimePassed;

    return errorCD;

    function IsEmpty(str) { return (str == null || str == undefined || str == ""); }

}//DateTime.ValidateDateTime()

DateTime.GetCurrentLclDate = function () {
    let dtCur = new Date();
    return `${(dtCur.getDate() < 10 ? '0' : "") + dtCur.getDate()}/${(dtCur.getMonth() < 9 ? '0' : "") + (dtCur.getMonth() + 1)}/${dtCur.getFullYear()}`;
} // DateTime.GetCurrentLclDate()

/********** end of: DateTme object**********/


/********** Note Template element **********/
function CreateNoteTemplate(task) {
    let note = document.createElement('div');
    note.id = task.Id;
    note.className = "note hidden";
    note.setAttribute("opacity", "0");

    let button = document.createElement('button');
    button.className = "btn-close-note close";
    button.setAttribute("aria-label", "Close Note");

    let icoButton = document.createElement('i');
    icoButton.className = "fas fa-times";

    button.appendChild(icoButton);

    let text = document.createElement('div');
    text.className = "note-text textFont";
    text.textContent = task.TaskText;

    let date = document.createElement('div');
    date.className = "note-date labelFont";
    date.textContent = task.DueDate;

    let time = document.createElement('div');
    time.className = "note-time labelFont";
    time.textContent = task.DueTime;

    note.appendChild(button);
    note.appendChild(text);
    note.appendChild(date);
    note.appendChild(time);

    return note;
} //CreateNoteTemplate()
/********** end of: Note Template element **********/
