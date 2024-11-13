import React, { useContext } from 'react';
import ReactDom from 'react-dom';
import { getDispatchParams } from '../../modules/Global';
import { Row, Col, Button, Card, InputGroup, FAIcon, IcnOK, IcnNo, IcnError, IcnQst } from '../../modules/Decoration';
import { ALERT_KIND, ALERT_ACTIONS } from '../../redusers/alertReducer';
import { AlertContext } from '../../App';


const AlertMessage = () => {
    const { alertState, alertDispatch } = useContext(AlertContext);

    const closeMe = (e) => {
        if (e.currentTarget.name.toUpperCase() === "OK") {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
        } else {
            alertState.callback(e.currentTarget.name.toUpperCase() === "YES", alertState.params);
            //NOTES: in callback call: 
            //       alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
        }
    }//closeMe

    return alertState.kind === ALERT_KIND.ERR
        ? (
            <div className="AlertMessage alert-danger w-50" role="alert" >
                <Row>
                    <Col md={1}>
                        <FAIcon icon={IcnError} size="2x" className="button-icon" />
                    </Col>
                    <Col md={11}>
                        <h5>{alertState.message}</h5>
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col md={4}></Col>
                    <Col md={4}>
                        <Button variant="primary" id="input-submit" name="ok" onClick={closeMe} className="form-control form-lbl-left w-50 btn" >
                            <FAIcon icon={IcnOK} size="2x" className="button-icon" />
                        </Button>
                    </Col>
                    <Col md={4}></Col>
                </Row>
            </div>


        ) : alertState.kind === ALERT_KIND.QST_YN
            ? (
                <div className="AlertMessage alert-primary w-50" role="alert" >
                    <Row>
                        <Col md={1}>
                            <FAIcon icon={IcnQst} size="2x" className="button-icon" />
                        </Col>
                        <Col md={11}>
                            <h5>{alertState.message}</h5>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col md={2}></Col>
                        <Col md={4}>
                            <Button variant="secondary" id="input-reset" name="no" onClick={closeMe} className="form-control form-lbl-right w-50 btn" >
                                <FAIcon icon={IcnNo} size="2x" className="button-icon" />
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Button variant="primary" id="input-submit" name="yes" onClick={closeMe} className="form-control form-lbl-left w-50 btn" >
                                <FAIcon icon={IcnOK} size="2x" className="button-icon" />
                            </Button>
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                </div>
            ) : null  //return
}//AlertMessage()

export default AlertMessage;
