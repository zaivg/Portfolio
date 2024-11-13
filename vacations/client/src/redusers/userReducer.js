export const USER_ACTIONS = {
    LOAD_USER: "LOAD_USER",
    CLEAR_USER: "CLEAR_USER"
}//USER_ACTIONS


export const initialStateUser = {id: 0};
export const clearedStateUser = {id: -1};


export function userReducer(state = initialStateUser, action) {
    switch (action.type) {
        case USER_ACTIONS.LOAD_USER: /* payload: {} */
            return action.payload;
        case USER_ACTIONS.CLEAR_USER:
            return clearedStateUser;
        default:
            return clearedStateUser;
    }//switch
}//userReducer()
