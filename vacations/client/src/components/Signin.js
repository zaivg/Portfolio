import React, { useContext, useState } from 'react';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { SERVER_ROOT } from '../modules/Options'
import { getDispatchParams } from '../modules/Global';
import { Container, Row, Col, Button, FAIcon, IcnOK, IcnNo } from '../modules/Decoration';

import { ALERT_KIND, ALERT_ACTIONS } from '../redusers/alertReducer';
import { USER_ACTIONS } from '../redusers/userReducer';
import { AlertContext, UserContext } from '../App';


const Signin = () => {

    const initialState = { f_name: "", l_name: "", login: "", psw: "" };
    const [state, setState] = useState(initialState);

    const { alertState, alertDispatch } = useContext(AlertContext);
    const { userState, userDispatch } = useContext(UserContext);

    const fieldChanged = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }//fieldChanged()


    const doReset = (e) => {
        e.preventDefault();
        setState(initialState);
    } //doReset()


    const doSubmit = async (e) => {
        e.preventDefault();

        const initObject = {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(state)
        };
        try {
            let data = await fetch(SERVER_ROOT + "/users/signin", initObject);
            //console.log("Login : data", data);

            if (data.status === 201) {//Created
                let dataJSON = await data.json();
                userDispatch(getDispatchParams(USER_ACTIONS.LOAD_USER, dataJSON));
                alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
                setState({ isLoggedIn: true });
            } else {
                let text = await data.text();
                console.log("doSubmit: text=", text);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
                setState(initialState);
            }
        } catch (err) {
            console.log("ERROR : ", err);
            userDispatch(getDispatchParams(USER_ACTIONS.CLEAR_USER));
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
            setState(initialState);
        }
    }//doSubmit()


    return state.isLoggedIn ? (<Redirect to="/vacation/list" />)
        : (
            <div className="Signin">
                <Container cldssName="container-fluid">
                    <Row className="justify-content-center">
                        <h4 className="page-caption">Registration</h4>
                    </Row>
                    <Row className="justify-content-center ">
                        <form className="w-75 p-5">
                            <div className="form-group">
                                <Row>
                                    <Col md={4}>
                                        <label htmlFor="f_name" className="form-lbl w-100 col-form-label text-left">Name</label>
                                    </Col>
                                    <Col md={8}>
                                        <input type="text" id="f_name" name="f_name" onChange={fieldChanged} value={state.f_name} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-field form-control shadow-sm" />
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col md={4}>
                                        <label htmlFor="l_name" className="form-lbl w-100 col-form-label text-left">Last Name</label>
                                    </Col>
                                    <Col md={8}>
                                        <input type="text" id="l_name" name="l_name" onChange={fieldChanged} value={state.l_name} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-field form-control shadow-sm" />
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col md={4}>
                                        <label htmlFor="from_dt" className="form-lbl w-100 col-form-label text-left" >User name:</label>
                                    </Col>
                                    <Col md={8}>
                                        <input type="text" id="login" name="login" onChange={fieldChanged} value={state.login} value={state.login} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-field form-control shadow-sm w-50" />
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col md={4}>
                                        <label htmlFor="psw" className="form-lbl w-100 col-form-label text-left" >Password</label>
                                    </Col>
                                    <Col md={8}>
                                        <input type="password" id="psw" name="psw" onChange={fieldChanged} value={state.psw} value={state.psw} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-field form-control shadow-sm w-50" />
                                    </Col>
                                </Row>
                            </div> {/* .form-group */}
                            <div className="form-group"> {/* BUTTONS: */}
                                <Row>
                                    <Col md={3}></Col>
                                    <Col md={2}>
                                        <Button variant="secondary" id="signin-reset" onClick={doReset} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-control form-lbl-right w-100 btn" >
                                            <FAIcon icon={IcnNo} size="2x" className="button-icon" />
                                        </Button>
                                    </Col>
                                    <Col md={2}></Col>
                                    <Col md={2}>
                                        <Button variant="primary" id="signin-submit" onClick={doSubmit} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-control form-lbl-left w-100 btn" >
                                            <FAIcon icon={IcnOK} size="2x" className="button-icon" />
                                        </Button>
                                    </Col>
                                    <Col md={3}></Col>
                                </Row>
                            </div>{/* form-group  BUTTONS */}

                            <Row className="justify-content-center">
                                <Link key="signin" to={`/login`} disabled={alertState.kind !== ALERT_KIND.SILENCE} > Already registered? login</Link>
                            </Row>
                        </form>
                    </Row>
                </Container>
            </div>//.Signin
        );//return
}//Signin()

export default Signin;
