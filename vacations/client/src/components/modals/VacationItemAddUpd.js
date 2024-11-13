import React, { useEffect, useContext, useState } from 'react';
import ReactDom from 'react-dom';
import { getDispatchParams, getDateFormatted } from '../../modules/Global';
import { SERVER_ROOT, IMG_TYPES, IMG_SIZE_MAX, LBL_MSG_IMG_TYPES_SIZE, LBL_MSG_IMG_NO_CHOISEN } from '../../modules/Options';
import { Row, Col, Button, Card, InputGroup, FAIcon, IcnOK, IcnNo, IcnDelete } from '../../modules/Decoration';
import { ALERT_KIND, ALERT_ACTIONS, ALERT_MSGS } from '../../redusers/alertReducer';
import { AlertContext } from '../../App';

const VacationItemAddUpd = (props) => {
    const [state, setState] = useState({});
    const { alertState, alertDispatch } = useContext(AlertContext);


    const ChangeFieldHandler = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }//ChangeFieldHandler() 


    const ChangeImgHandler = (e) => {
        if (e.target.files.length === 0) return;

        let file = e.target.files[0];
        if (file.size > IMG_SIZE_MAX) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, ALERT_MSGS.ERR_IMG_SIZE));
            return;
        }

        if (IMG_TYPES.every(type => file.type !== type)) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, file.type + ALERT_MSGS.ERR_IMG_TYPES));
            return;
        }

        setState({ ...state, "new_img_file": file, "new_img_preview": undefined });

        let reader = new FileReader();
        reader.onloadend = () => {
            setState({ ...state, "img": undefined, "new_img_file": file, "new_img_preview": reader.result });
        }
        reader.readAsDataURL(file)

    }//ChangeImgHandler() 

    const resetImg = (e) => {
        e.preventDefault();
        setState({ ...state, "img": undefined, "new_img_file": undefined, "new_img_preview": undefined });
    }//resetImg() 

    const getImagePreview = () => {
        if (!state) return (<p>Click to select image ({LBL_MSG_IMG_TYPES_SIZE})</p>);

        if (!!state.new_img_preview) {//new img:
            return (<img src={state.new_img_preview} alt="vacation" className="vacation-img rounded" />);
        } else if (!!state.img) {//old img:
            return (<img src={`${SERVER_ROOT}/${props.vacation.img}`} alt="vacation" className="vacation-img rounded" />);
        } else {//no img:
            return (<p>{LBL_MSG_IMG_NO_CHOISEN}</p>);
        }
    }//getImagePreview


    const doCancel = (e) => {
        setState({});
        props.doExit(false);
    }//doCancel()


    const doSubmit = (e) => {
        e.preventDefault();
        alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_QST_YN, { msg: ALERT_MSGS.QST_SAVE, "callback": doSave }));
    }//doSubmit()


    const doSave = async (isYes = false) => {
        alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
        if (!isYes) return;
        if (!testFields()) return;

        await AddUpdVacation();

        setState({});
        props.doExit(true);
    }//doSave


    const AddUpdVacation = async () => {
        const METHOD = !!props.vacation ? 'PUT' : 'POST'
        let formData = new FormData();
        //console.log("AddUpdVacation()", "METHOD=", METHOD);
        if (state.new_img_file) {
            formData.append(state.new_img_file.name, state.new_img_file);
        }

        state.new_img_file = undefined;
        state.new_img_preview = undefined;
        formData.append("vacation", JSON.stringify(state));
        //console.log("JSON.stringify(state)", JSON.stringify(state));

        try {
            const initObject = {
                credentials: "include",
                method: METHOD,
                body: formData
            };
            let date = await fetch(SERVER_ROOT + "/vacation", initObject);

            if (date.status === 200 || date.status === 201) {
                console.log("addMeeting", "OK");
            } else {
                let text = await date.text()
                console.log("addMeeting", "Failed!", date.status, text);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
            }//?ok
        } catch (err) {
            console.log("addMeeting", "ERROR", err);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
        }
    } //AddUpdVacation


    const testFields = () => {
        const { descr, destination, dt_from, dt_to, price } = state;

        if (!(descr && destination && dt_from && dt_to && (price !== undefined))) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, ALERT_MSGS.ERR_REQUIRED));
            return false;
        }

        if (state.price < 0) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, ALERT_MSGS.ERR_PRICE_NEGTIVE));
            return false;
        }

        if (new Date(dt_from) < new Date((new Date()).toDateString())) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, ALERT_MSGS.ERR_DT_PASS));
            return false;
        }

        if (dt_from > dt_to) {
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, ALERT_MSGS.ERR_DT_FROM_AFTER_TO));
            return false;
        }

        return true;
    }//testFields


    useEffect(() => {
        if (!!props.vacation) setState(props.vacation);
    }, [props.vacation]);


    return props.show ? (
        <div className="VacationItemAddUpd rounded">
            <Card className="container-md container-fluid" >
                <form >
                    <Card.Body>
                        <Card.Title>
                            <Row>
                                <Col md={3} >
                                    <label forHTML="destination">Destination:</label>
                                </Col>
                                <Col md={1} ></Col>
                                <Col md={8} >
                                    <input type="text" value={state.destination} id="input-destination" name="destination" onChange={ChangeFieldHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="w-100" />
                                </Col>
                            </Row>
                        </Card.Title>

                        <Card.Text>
                            <Row>
                                <Col md={3} >
                                    <label forHTML="descr">Description:</label>
                                </Col>
                                <Col md={1} ></Col>
                                <Col md={8} >
                                    <textarea value={state.descr} id="input-descr" name="descr" onChange={ChangeFieldHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="w-100" />
                                </Col>
                            </Row>
                        </Card.Text>

                        <Row>
                            <InputGroup>
                                <div className="custom-file">
                                    <input type="file" variant="primary" className="custom-file-input" id="img-input-btn" data-toggle="tooltip" data-placement="top" title={LBL_MSG_IMG_TYPES_SIZE} accept="image/png, image/jpeg, image/gif" onChange={ChangeImgHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} />
                                    <label variant="primary" className="custom-file-label" for="img-input-btn" aria-describedby="inputGroupFileAddon02">Click to select image</label>
                                </div>
                                <InputGroup.Append>
                                    <Button variant="primary" onClick={resetImg} disabled={alertState.kind !== ALERT_KIND.SILENCE}><FAIcon icon={IcnDelete} size="1x" className="button-icon" /></Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Row>
                        <Row>
                            <div className="mx-auto">
                                {getImagePreview()}
                            </div>
                        </Row>

                        <hr />
                        <InputGroup>
                        <Row>
                        <Col md={5} >
                                <input type="date" value={getDateFormatted(state.dt_from, true)} id="input-dt_from" name="dt_from" onChange={ChangeFieldHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="w-100" />
                        </Col>
                        <Col md={2} >
                        <label> - </label>
                        </Col>
                        <Col md={5} >
                                <input type="date" value={getDateFormatted(state.dt_to, true)} id="input-dt_to" name="dt_to" onChange={ChangeFieldHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} className="w-100" />
                        </Col>
                        </Row>
                         </InputGroup>
                        <hr />
                        <InputGroup>
                            <Col md={3} >
                                <label forHTML="input-price">Price ($):</label>
                            </Col>
                            <Col md={1} ></Col>
                            <Col md={8} >
                                <input type="number" value={state.price} id="input-price" name="price" onChange={ChangeFieldHandler} disabled={alertState.kind !== ALERT_KIND.SILENCE} min="0.00" className="w-100" />
                            </Col>
                        </InputGroup>
                        <hr />

                        <div className="form-group"> {/* BUTTONS: */}
                            <Row>
                                <Col md={2}></Col>
                                <Col md={3}>
                                    <Button variant="secondary" id="input-reset" onClick={doCancel} value="Cancel" disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-control form-lbl-right w-100 btn" >
                                        <FAIcon icon={IcnNo} size="2x" className="button-icon" />
                                    </Button>
                                </Col>
                                <Col md={2}></Col>
                                <Col md={3}>
                                    <Button variant="primary" id="input-submit" onClick={doSubmit} value="Save" disabled={alertState.kind !== ALERT_KIND.SILENCE} className="form-control form-lbl-left w-100 btn" >
                                        <FAIcon icon={IcnOK} size="2x" className="button-icon" />
                                    </Button>
                                </Col>
                                <Col md={2}></Col>
                            </Row>
                        </div>{/* form-group  BUTTONS */}
                    </Card.Body>
                </form>
            </Card >

        </div >
    ) : null //return
}//VacationItemAddUpd()

export default VacationItemAddUpd;
