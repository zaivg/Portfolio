import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { SERVER_ROOT } from '../modules/Options'
import { getDispatchParams } from '../modules/Global';
import { Container, Row, Col, FAIcon, IcnExit, Navbar, Nav, Button } from '../modules/Decoration';

import { ALERT_KIND, ALERT_ACTIONS } from '../redusers/alertReducer';
import { USER_ACTIONS } from '../redusers/userReducer';
import { AlertContext, UserContext } from '../App';
import AlertMessage from './modals/AlertMessage';

import favicon from '../public/icons/favicon.png';

const Header = () => {
    const { alertState, alertDispatch } = useContext(AlertContext);
    const { userState, userDispatch } = useContext(UserContext);

    const closeSession = async () => {
        console.log("closeSession()");

        try {
            const initObject = {
                credentials: "include",
                method: 'GET'
            };
            let data = await fetch(SERVER_ROOT + "/users/unlogin", initObject);
            //console.log("closeSession()", "data=", data);

            if (data.status === 200) {//200=OK
                console.log("closeSession()", "OK");
                userDispatch(getDispatchParams(USER_ACTIONS.CLEAR_USER));
                alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
            } else {
                let text = await data.text();
                console.log("closeSession()", "Failed!", data.status, text);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
            }//?ok
        } catch (err) {
            console.log("closeSession()", "ERROR", err);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
        }
    }//closeSession()


    return (
        <div className="Header">
            <Container fluid="true" >
                <Navbar expand="md" bg="success" variant="dark" className="shadow" >

                    <Navbar.Brand >
                        <img src={favicon} alt="logo" width="35" height="35" className="d-inline-block align-top" />
                        &nbsp;Vacations
                        </Navbar.Brand>

                    <Nav className="mr-auto">
                        <Nav.Link href="/vacation/list">Vacation List</Nav.Link>
                        {!userState.is_admin ? null
                            :
                            <Nav.Link href="/report">Report</Nav.Link>
                        }
                    </Nav>

                    {userState.id <= 0 ? null
                        : <Navbar.Text variant="light">
                            Hi  {userState.f_name} ({userState.login})! &nbsp;
                            <Button variant="outline-danger" onClick={closeSession} disabled={alertState.kind !== ALERT_KIND.SILENCE} >
                                <FAIcon icon={IcnExit} size="1x" />
                            </Button>
                        </Navbar.Text>
                    }
                </Navbar>
                {/* <AlertMessage />   */}
            </Container>
        </div>
    );//return
}//Header()

export default Header;
