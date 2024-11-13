export const ALERT_KIND = {
    SILENCE: 0,
    ERR: 1,
    QST_YN: 2,
}


export const ALERT_ACTIONS = {
    SHOW_ERR: "SHOW_ERR",
    SHOW_QST_YN: "SHOW_QST_YN",
    CLEAR_ALERT: "CLEAR_ALERT"
}//ALERT_ACTIONS


export const ALERT_MSGS = {
    ERR_IMG_TYPES: ' is not a supported format (allowed png, jpeg, gif only)',
    ERR_IMG_SIZE: 'The image size is greater than the limit of 5 megabytes',
    ERR_REQUIRED: 'All fields except the image are required',
    ERR_PRICE_NEGTIVE: 'The price must be positive',
    ERR_DT_PASS: 'Vacation start date cannot be in the past',
    ERR_DT_FROM_AFTER_TO: 'Vacation end date is after the start date',
    QST_SAVE: 'Are you sure you want to save those changes?',
    QST_DELETE: 'Are you sure you want to delete this vacation?'
} //ALERTS


export const initialStateAlert = {kind: ALERT_KIND.SILENCE, message: "", callback: undefined, params: undefined};

// {kind, message}:
export function alertReducer(state = initialStateAlert, action) {
    switch (action.type) {
        case ALERT_ACTIONS.SHOW_ERR:
            return {kind: ALERT_KIND.ERR, message: action.payload};
        case ALERT_ACTIONS.SHOW_QST_YN:
            return {kind: ALERT_KIND.QST_YN, message: action.payload.msg, callback: action.payload.callback, params: action.payload.params};
        case ALERT_ACTIONS.CLEAR_ALERT:
            return initialStateAlert;
        default:
            return initialStateAlert;
    }//switch
}//alertReducer()
