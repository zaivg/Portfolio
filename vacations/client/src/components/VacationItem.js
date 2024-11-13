import React from 'react';
import { SERVER_ROOT } from '../modules/Options'
import { Container, Row, Col, Button, Card, ListGroup, ListGroupItem, FAIcon, IcnEdit, IcnDelete } from '../modules/Decoration';

const VacationItemRaw = (props) => {
    return (
        <div className="VacationItemRaw mb-3 mr-3">
            <Card className="card-item" >
                <Card.Body>
                    <Card.Title>{props.vacation.destination}</Card.Title>
                    <Card.Text className="vacataion-descr">{props.vacation.descr}</Card.Text>
                </Card.Body>

                {!!props.vacation.img
                    ? (
                        <Row>
                            <Col>
                                <img src={`${SERVER_ROOT}/${props.vacation.img}`} alt="vacation" className="vacation-img rounded" />
                            </Col>
                        </Row>
                    ) : null
                }

                <ListGroup className="list-group-flush">
                    <ListGroupItem>{(new Date(props.vacation.dt_from)).toLocaleDateString()} - {(new Date(props.vacation.dt_to)).toLocaleDateString()}</ListGroupItem>
                    <ListGroupItem>{props.vacation.price.toFixed(2)}$</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    {props.user.is_admin
                        ? (//for admin:
                            <Row>
                                <Col>
                                    <Button variant="secondary" tag={props.vacation.id} onClick={props.delVacation} disabled={props.disabled} className="form-control w-50 form-lbl-right" >
                                        <FAIcon icon={IcnDelete} size="1x" className="button-icon" />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="primary" tag={props.vacation.id} onClick={props.updVacation} disabled={props.disabled} className="form-control w-50 form-lbl-left" >
                                        <FAIcon icon={IcnEdit} size="1x" className="button-icon" />
                                    </Button>                                </Col>
                            </Row>


                        ) : (//for user:

                            <div className="admin-vctn-control-panel">
                                <div className="custom-control custom-switch mr-1 follow-check">
                                    <input type="checkbox" id={"follow-check-" + props.vacation.id} tag={props.vacation.id} checked={props.vacation.is_follow} onClick={props.doFollowing} disabled={props.disabled} className="custom-control-input" />
                                    <label class="custom-control-label" htmlFor={"follow-check-" + props.vacation.id}></label>
                                </div>
                            </div>
                        )}
                </Card.Body>
            </Card>

        </div >//.VacationItemRaw
    );//return
}//VacationItemRaw()

export default VacationItemRaw;
