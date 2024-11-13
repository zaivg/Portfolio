import React, { useEffect, useContext, useState } from 'react';
import { SERVER_ROOT } from '../modules/Options'
import { Container, Row, Col, Button, FAIcon, IcnAdd } from '../modules/Decoration';

import { getDispatchParams, subscribeToRefreshInfo, sendClientAction } from '../modules/Global';
import Loading from "../public/images/Loading.gif";
import VacationItem from './VacationItem';
import VacationItemAddUpd from './modals/VacationItemAddUpd';
import { ALERT_KIND, ALERT_ACTIONS, ALERT_MSGS } from '../redusers/alertReducer';
import { USER_ACTIONS } from '../redusers/userReducer';
import { AlertContext, UserContext } from '../App';

let vacationForUpd;

const VacationList = () => {
    const [stateVacations, setStateVacations] = useState([]);
    const STEP_LOADING = { LOAD_VACATIONS: 0, DO_LOGIN: 1, LOADED: 2, SHOW_MODAL: 3 }
    const [stepLoading, setStepLoading] = useState(STEP_LOADING.LOAD_VACATIONS);
    const { alertState, alertDispatch } = useContext(AlertContext);
    const { userState, userDispatch } = useContext(UserContext);



    const getVacations = async () => {
        if (stepLoading !== STEP_LOADING.LOAD_VACATIONS) return;

        try {
            const initObject = {
                credentials: "include",
                method: 'GET'
            };
            let data = await fetch(SERVER_ROOT + "/following/vacations", initObject);
            //console.log("getVacations()", "data=", data);

            if (data.status === 200) {//200=OK
                console.log("getVacations()", "OK");
                let jsnData = await data.json();
                //Set User:
                console.log("getVacations(), user=", jsnData.user);
                userDispatch(getDispatchParams(USER_ACTIONS.LOAD_USER, jsnData.user));
                //Set vacations:
                console.log("getvacations()", "OK", "vacations.length:", jsnData.vacations.length);
                setStateVacations(jsnData.vacations);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
                setStepLoading(STEP_LOADING.LOADED);

            } else {
                let text = await data.text();
                console.log("getVacations()", "Failed!", data.status, text);
                setStateVacations([]);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
                if (data.status === 403/*Forbidden*/) {
                    userDispatch(getDispatchParams(USER_ACTIONS.CLEAR_USER));
                    setStepLoading(STEP_LOADING.DO_LOGIN);
                } else {
                    setStepLoading(STEP_LOADING.LOADED);
                }
            }//?ok
        } catch (err) {
            console.log("getVacations()", "ERROR", err);
            setStateVacations([]);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
            setStepLoading(STEP_LOADING.LOADED);
        }
    }//getVacations()


    /***** ADD / UPDATE (by Admin) *************/
    const showAddUpdModal = () => {
        setStepLoading(STEP_LOADING.SHOW_MODAL);
    }//showAddUpdModal()


    const exitAddUpdModal = (isSaved = false) => {
        setStepLoading(isSaved ? STEP_LOADING.LOAD_VACATIONS : STEP_LOADING.LOADED);
        vacationForUpd = undefined;
        if (isSaved) sendClientAction();
    }//exitAddUpdModal()


    const updVacation = (e) => {
        vacationForUpd = stateVacations.find(vacation => vacation.id === +e.currentTarget.attributes["tag"].value);
        console.log("updVacation()", "vacationForUpd = ", vacationForUpd);
        showAddUpdModal();
    }//updVacation()


    const delVacation = async (e) => {
        const id = e.currentTarget.attributes["tag"].value
        alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_QST_YN, { msg: ALERT_MSGS.QST_DELETE, callback: doDelVacation, params: id }));
    }//delVacation


    const doDelVacation = async (isYes = false, id) => {
        //console.log("doDelVacation", "isYes = ", isYes, "id = ", id);
        alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));

        try {
            const initObject = {
                credentials: "include",
                method: "DELETE",
            };
            let date = await fetch(SERVER_ROOT + "/vacation/" + id, initObject);

            if (date.status === 200) {
                console.log("doDelVacation ", "OK");
                setStepLoading(STEP_LOADING.LOAD_VACATIONS);
                sendClientAction();
            } else {
                let text = await date.text()
                console.log("doDelVacation ", "Failed!", date.status, text);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
            }//?ok
        } catch (err) {
            console.log("doDelVacation ", "ERROR", err);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
        }
    }//doDelVacation()
    /***** end of: ADD / UPDATE (by Admin) *****/


    /***** FOLLOW / UNFOLLOW (by User) ***********/
    const doFollowing = async (e) => {
        const vacationId = e.currentTarget.attributes["tag"].value;
        const isFollow = e.currentTarget.checked;
        //console.log("doFollowing()", "userId = ", userState.id, "vacationId = ", vacationId, "isFollow = ", isFollow);

        try {
            const initObject = {
                credentials: "include",
                method: "PUT",
            };
            let date = await fetch(SERVER_ROOT + `/following/${vacationId}/${+isFollow}`, initObject);

            if (date.status === 200) {
                console.log("doFollowing() ", "OK");
                setStepLoading(STEP_LOADING.LOAD_VACATIONS);
                sendClientAction();
            } else {
                let text = await date.text()
                console.log("doFollowing() ", "Failed!", date.status, text);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
            }//?ok
        } catch (err) {
            console.log("doFollowing() ", "ERROR", err);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
        }

    }//doFollowing()
    /***** end of: FOLLOW / UNFOLLOW (by User) ***/


    const getDisabled = () => {
        return (alertState.kind !== ALERT_KIND.SILENCE || stepLoading === STEP_LOADING.SHOW_MODAL);
    }//getDisabled()


    useEffect(() => {
        const getData = async () => {
            await getVacations();
        }
        getData();
    }, [stepLoading])//useEffect()

    subscribeToRefreshInfo( () => {
        setStepLoading(STEP_LOADING.LOAD_VACATIONS);
    });


    return stepLoading === STEP_LOADING.LOAD_VACATIONS
        ? (<img className="loading-img" src={Loading} alt="Loading"></img>)
        : (
            <div className="VacationList">
                {userState.is_admin
                    ? (<>
                        <Row>
                            <VacationItemAddUpd vacation={vacationForUpd} show={stepLoading === STEP_LOADING.SHOW_MODAL} doExit={exitAddUpdModal} />
                        </Row>

                        <Row id="add-vacation-panel">
                            <Button variant="primary" id="add-vacation" onClick={showAddUpdModal} disabled={getDisabled()} size="sm"  >
                                <FAIcon icon={IcnAdd} size="2x" className="button-icon" />
                            </Button>
                        </Row>
                    </>) : (null)
                }

                <Container fluid="true">
                    <Row>
                        {stateVacations.map(vacation => (
                            <VacationItem key={vacation.id} user={userState} vacation={vacation} delVacation={delVacation} updVacation={updVacation} doFollowing={doFollowing} disabled={getDisabled()} />
                        ))}
                    </Row>
                </Container>
            </div>//.VacationList
        )//return
}//VacationList()

export default VacationList;
