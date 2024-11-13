/// <reference path="Cryptonite.d.ts" />
export { };

const RPT_DATA_KEEP_MAX_CNT = 15;//times
const HEADER_RELEATIVE_POINT = 666;
const RPT_MRG_BTM = 15;
const RPT_COLORS = ["red", "blue", "green", "orange", "gray"];

interface IFontSizes {
    title: number, 
    axisXTitle: number, axisXLabel: number, 
    axisYTitle: number, axisYLabel: number, 
    legend: number
}//interface IFontSizes

let chart: any;
let rptDataKeepCnt = 0;
let arrData = [];
let currInterval: number = null;

class cDataPoint {
    public x: any;
    public y: number;

    constructor(x: any, y: number) {
        this.x = x.getTime();
        this.y = y;
    }
}//class cDataPoint


class cData {
    type = "line";
    name = "";
    color = "";
    showInLegend = true;
    xValueType = "dateTime";
    yValueType = "number";
    yValueFormatString = "$#,##0.#";
    xValueFormatString = "hh:mm:ss TT";
    dataPoints = [];

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}//class cData



function toggleDataSeries(ev): void {
    if (typeof (ev.dataSeries.visible) === "undefined" || ev.dataSeries.visible) {
        ev.dataSeries.visible = false;
    } else {
        ev.dataSeries.visible = true;
    }
    ev.chart.render();
}//toggleDataSeries()


async function SetDataPoints() {
    Spinner.open(true);

    let oRes = await getData.getCoinPrices(RptList.getCoinsURL());
    if (oRes.isOk) {
        $("#shelfInfoTemp .alert").remove();
        let dtCurrent: any = new Date();
        let arrCoins: string[] = RptList.getCoinArrSymbol();
        for (let i = 0; i < arrCoins.length; i++) {
            if (rptDataKeepCnt >= RPT_DATA_KEEP_MAX_CNT) arrData[i].dataPoints.shift();
            let price: any = (<any>oRes).data[arrCoins[i]];
            price = price == undefined ? null : price.USD;
            try {
                arrData[i].dataPoints.push(new cDataPoint(dtCurrent, price));
            } catch{//in case the report is aborted during the jump to another tab:
                return;
            }
        }//for
        chart.render();
        rptDataKeepCnt++;
    } else {
        $("#shelfInfoTemp .alert").remove();
        $("#shelfInfoTemp").prepend(oRes.data);
    }
    Spinner.close(true);
}//SetDataPoints()

function RunRptGetData(): void {
    if (currInterval == null) {
        currInterval = setInterval(SetDataPoints, RPT_DATA_PERIOD);
    }//if
}//RunRptGetData()

function StopRptGetData(): void {
    if (currInterval != null) {
        clearInterval(currInterval);
        currInterval = null;
        rptDataKeepCnt = 0;
        arrData = [];
        chart=null;
    }//if
    $(window).off("resize");
}//StopRptGetData()


function setRptHeight(): void {
    $("#graphCoins").css("height", getRptHeight());
    setFontSizes();
}//setRptHeight()

function getRptHeight(): string {
    return $(window).height() - ($(window).height() > HEADER_RELEATIVE_POINT ? $("header").height() : 0) - RPT_MRG_BTM + "px";
}//getRptHeight()


function setFontSizes(): void {
    if (chart == null) return;

    let fontSizes = getFontSizes();
    chart.title.set("fontSize", fontSizes.title);
    chart.axisX[0].set("titleFontSize", fontSizes.axisXTitle);
    chart.axisX[0].set("labelFontSize", fontSizes.axisXTitle);
    chart.axisY[0].set("titleFontSize", fontSizes.axisYTitle);
    chart.axisY[0].set("labelFontSize", fontSizes.axisYTitle);
    chart.legend.set("fontSize", fontSizes.legend);
}//getFontSize()

function getFontSizes(): IFontSizes {
    if ($("header").height() <= 992 || $("header").width() <= 500) {//small:
        return { title: 15, axisXTitle: 15, axisXLabel: 10, axisYTitle: 15, axisYLabel: 10, legend: 15 };
    } else {//big:
        return { title: 25, axisXTitle: 25, axisXLabel: 20, axisYTitle: 25, axisYLabel: 20, legend: 25 };
    }
}//getFontSize()



function openCoinReport() {
    if (RptList.getQty() > 0) {
        Spinner.open();
        $(window).on("resize", setRptHeight);

        $("#shelfInfoTemp").append(`
        <div id="graphCoins" class="w-100" style="height:${getRptHeight()}"</div>
        `);

        let arrCoins: string[] = RptList.getCoinArrSymbol();
        for (let i = 0; i < arrCoins.length; i++) {
            arrData.push(new cData(arrCoins[i], RPT_COLORS[i]));
        }//for

        let fontSizes = getFontSizes();
        let options = {
            exportEnabled: true,
            animationEnabled: true,
            zoomEnabled: false,
            title: {
                fontSize: fontSizes.title,
                text: RptList.getCoinsTitle()
            }/*title*/,
            axisX: {
                titleFontSize: fontSizes.axisXTitle,
                labelFontSize: fontSizes.axisXLabel,
                title: "time line (mm:ss)",
                titleFontColor: "darkcyan",
                lineColor: "darkcyan",
                labelFontColor: "darkcyan",
                tickColor: "darkcyan",
                includeZero: false,
                interval: 5,
                intervalType: "second",
                labelFormatter: function (e) {
                    return CanvasJS.formatDate(e.value, "mm:ss");
                }
            }/*axisX*/,
            axisY: {
                titleFontSize: fontSizes.axisYTitle,
                labelFontSize: fontSizes.axisYLabel,
                title: "Coin Value ($)",
                titleFontColor: "darkcyan",
                lineColor: "darkcyan",
                labelFontColor: "darkcyan",
                tickColor: "darkcyan",
                includeZero: true
            }/*axisY*/,
            toolTip: {
                shared: true
            },
            legend: {
                fontSize: fontSizes.legend,
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: arrData /*data*/
        }/*options*/;

        chart = new (<any>CanvasJS).Chart("graphCoins", options);

        SetDataPoints();
        RunRptGetData();

    }//RptList.getQty > 0
    else {//RptList.getQty == 0:
        $("#shelfInfoTemp").append(`
        ${getData.setAlert("No coin selected for reporting!", false)}
        `);
    }//RptList.getQty == 0

    Spinner.close();
}//openCoinReport()
