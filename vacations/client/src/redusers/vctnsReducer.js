export const VCTNS_ACTIONS = {
    LOAD_VCTNS: "LOAD_VCTNS",
    CLEAR_VCTNS: "CLEAR_VCTNS",

    ADD_VCTN: "ADD_VCTN",
    UPDATE_VCTN: "UPDATE_VCTN",
    DELETE_VCTN: "DELETE_VCTN",

    FOLLOW_VCTN: "FOLLOW_VCTN",
    UNFOLLOW_VCTN: "UNFOLLOW_VCTN"
}//VCTNS_ACTIONS


export const initialStateVctns = [];


export function vctnsReducer(state = initialStateVctns, action) {
    switch (action.type) {
        case VCTNS_ACTIONS.LOAD_VCTNS: /* payload: [] <{}> */
            return action.payload;
        case VCTNS_ACTIONS.CLEAR_VCTNS: /* no payload */
            return initialStateVctns;

        case VCTNS_ACTIONS.ADD_VCTN: /* payload: {} */
            return [...state, action.payload];
        case VCTNS_ACTIONS.UPDATE_VCTN: /* payload: {} */
            return state.map(item =>
                item.id === action.payload.id ?
                    action.payload : item);
        case VCTNS_ACTIONS.DELETE_VCTN: /* payload: id */
            return state.filter(item =>
                item.id !== action.payload);

        case VCTNS_ACTIONS.FOLLOW_VCTN: /* payload: id */
            return state.map(item =>
            item.id === action.payload ?
                { ...item, is_follow: 1 } : item);

        case VCTNS_ACTIONS.UNFOLLOW_VCTN: /* payload: id */
            return state.map(item =>
                item.id === action.payload ?
                    { ...item, is_follow: 0 } : item);


        default:
            return initialStateVctns;
    }//switch
}//vctnsReducer()
