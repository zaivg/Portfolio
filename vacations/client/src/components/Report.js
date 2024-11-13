import React, { useEffect, useContext, useState } from 'react';
import { SERVER_ROOT } from '../modules/Options'
import { getDispatchParams, subscribeToRefreshInfo } from '../modules/Global';
import Loading from "../public/images/Loading.gif";
import { ALERT_ACTIONS } from '../redusers/alertReducer';
import { USER_ACTIONS } from '../redusers/userReducer';
import { AlertContext, UserContext } from '../App';
import Chart from 'chart.js'


const Report = () => {
    const [state, setState] = useState([]);
    const STEP_LOADING = { DO_LOADING: 0, DO_LOGIN: 1, LOADED: 2 }
    const [stepLoading, setStepLoading] = useState(STEP_LOADING.DO_LOADING);
    const { alertstate, alertDispatch } = useContext(AlertContext);
    const { userState, userDispatch } = useContext(UserContext);


    const getReportData = async () => {
        if (stepLoading !== STEP_LOADING.DO_LOADING) return;

        try {
            const initObject = {
                credentials: "include",
                method: 'GET'
            };
            let data = await fetch(SERVER_ROOT + "/report", initObject);
            //console.log("getReportData()", "data=", data);

            if (data.status === 200) {//200=OK
                console.log("getReportData()", "OK");
                let jsnData = await data.json();
                //Set User:
                console.log("getReportData(), user=", jsnData.user);
                userDispatch(getDispatchParams(USER_ACTIONS.LOAD_USER, jsnData.user));
                //Set vacations:
                console.log("getVacations()", "OK", "vacations.length:", jsnData.vacations.length);
                setState(jsnData.vacations);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.CLEAR_ALERT));
                setStepLoading(STEP_LOADING.LOADED);

            } else {
                let text = await data.text();
                console.log("getReportData()", "Failed!", data.status, text);
                setState([]);
                alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, text));
                if (data.status === 403/*Forbidden*/) {
                    userDispatch(getDispatchParams(USER_ACTIONS.CLEAR_USER));
                    setStepLoading(STEP_LOADING.DO_LOGIN);
                } else {
                    setStepLoading(STEP_LOADING.LOADED);
                }
            }//?ok
        } catch (err) {
            console.log("getReportData()", "ERROR", err);
            setState([]);
            alertDispatch(getDispatchParams(ALERT_ACTIONS.SHOW_ERR, err.toString()));
            setStepLoading(STEP_LOADING.LOADED);
        }
    }//getReportData()


    const getAxisData = (isAxisX) => {
        return Array.from(state, i => i[isAxisX ? 'x' : 'y']);
    }//getAxisData


    useEffect(() => {
        const getData = async () => {
            await getReportData();
            createReport();
        }
        getData();
    }, [stepLoading])//useEffect()

    subscribeToRefreshInfo( () => {
        setStepLoading(STEP_LOADING.DO_LOADING);
    });


    const createReport = () => {
        const canvasChart = document.getElementById('reportChart');
        if (canvasChart === null) return;
        const ctx = canvasChart.getContext('2d');
        Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(255, 99, 132, 0.2)'
        Chart.defaults.global.elements.rectangle.borderColor = 'rgba(255, 99, 132, 1)'

        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: getAxisData(true),
                datasets: [{
                    label: 'Rating of Vacations',
                    data: getAxisData(false),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        chart.canvas.parentNode.style.width = '90%';
        chart.canvas.parentNode.style.height = '90%';
    }//createReport()


    return stepLoading === STEP_LOADING.DO_LOADING
        ? (<img src={Loading} alt="Loading"></img>)
        : (
            <div className="Report">
                <canvas id="reportChart" style={{ "border": "3px solid green" }} ></canvas>
            </div>//.Report
        );//return
}//Report()

export default Report;
