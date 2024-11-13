var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const RPT_DATA_KEEP_MAX_CNT = 15; //times
const HEADER_RELEATIVE_POINT = 666;
const RPT_MRG_BTM = 15;
const RPT_COLORS = ["red", "blue", "green", "orange", "gray"];
let chart;
let rptDataKeepCnt = 0;
let arrData = [];
let currInterval = null;
class cDataPoint {
    constructor(x, y) {
        this.x = x.getTime();
        this.y = y;
    }
} //class cDataPoint
class cData {
    constructor(name, color) {
        this.type = "line";
        this.name = "";
        this.color = "";
        this.showInLegend = true;
        this.xValueType = "dateTime";
        this.yValueType = "number";
        this.yValueFormatString = "$#,##0.#";
        this.xValueFormatString = "hh:mm:ss TT";
        this.dataPoints = [];
        this.name = name;
        this.color = color;
    }
} //class cData
function toggleDataSeries(ev) {
    if (typeof (ev.dataSeries.visible) === "undefined" || ev.dataSeries.visible) {
        ev.dataSeries.visible = false;
    }
    else {
        ev.dataSeries.visible = true;
    }
    ev.chart.render();
} //toggleDataSeries()
function SetDataPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        Spinner.open(true);
        let oRes = yield getData.getCoinPrices(RptList.getCoinsURL());
        if (oRes.isOk) {
            $("#shelfInfoTemp .alert").remove();
            let dtCurrent = new Date();
            let arrCoins = RptList.getCoinArrSymbol();
            for (let i = 0; i < arrCoins.length; i++) {
                if (rptDataKeepCnt >= RPT_DATA_KEEP_MAX_CNT)
                    arrData[i].dataPoints.shift();
                let price = oRes.data[arrCoins[i]];
                price = price == undefined ? null : price.USD;
                try {
                    arrData[i].dataPoints.push(new cDataPoint(dtCurrent, price));
                }
                catch ( //in case the report is aborted during the jump to another tab:
                _a) { //in case the report is aborted during the jump to another tab:
                    return;
                }
            } //for
            chart.render();
            rptDataKeepCnt++;
        }
        else {
            $("#shelfInfoTemp .alert").remove();
            $("#shelfInfoTemp").prepend(oRes.data);
        }
        Spinner.close(true);
    });
} //SetDataPoints()
function RunRptGetData() {
    if (currInterval == null) {
        currInterval = setInterval(SetDataPoints, RPT_DATA_PERIOD);
    } //if
} //RunRptGetData()
function StopRptGetData() {
    if (currInterval != null) {
        clearInterval(currInterval);
        currInterval = null;
        rptDataKeepCnt = 0;
        arrData = [];
        chart = null;
    } //if
    $(window).off("resize");
} //StopRptGetData()
function setRptHeight() {
    $("#graphCoins").css("height", getRptHeight());
    setFontSizes();
} //setRptHeight()
function getRptHeight() {
    return $(window).height() - ($(window).height() > HEADER_RELEATIVE_POINT ? $("header").height() : 0) - RPT_MRG_BTM + "px";
} //getRptHeight()
function setFontSizes() {
    if (chart == null)
        return;
    let fontSizes = getFontSizes();
    chart.title.set("fontSize", fontSizes.title);
    chart.axisX[0].set("titleFontSize", fontSizes.axisXTitle);
    chart.axisX[0].set("labelFontSize", fontSizes.axisXTitle);
    chart.axisY[0].set("titleFontSize", fontSizes.axisYTitle);
    chart.axisY[0].set("labelFontSize", fontSizes.axisYTitle);
    chart.legend.set("fontSize", fontSizes.legend);
} //getFontSize()
function getFontSizes() {
    if ($("header").height() <= 992 || $("header").width() <= 500) { //small:
        return { title: 15, axisXTitle: 15, axisXLabel: 10, axisYTitle: 15, axisYLabel: 10, legend: 15 };
    }
    else { //big:
        return { title: 25, axisXTitle: 25, axisXLabel: 20, axisYTitle: 25, axisYLabel: 20, legend: 25 };
    }
} //getFontSize()
function openCoinReport() {
    if (RptList.getQty() > 0) {
        Spinner.open();
        $(window).on("resize", setRptHeight);
        $("#shelfInfoTemp").append(`
        <div id="graphCoins" class="w-100" style="height:${getRptHeight()}"</div>
        `);
        let arrCoins = RptList.getCoinArrSymbol();
        for (let i = 0; i < arrCoins.length; i++) {
            arrData.push(new cData(arrCoins[i], RPT_COLORS[i]));
        } //for
        let fontSizes = getFontSizes();
        let options = {
            exportEnabled: true,
            animationEnabled: true,
            zoomEnabled: false,
            title: {
                fontSize: fontSizes.title,
                text: RptList.getCoinsTitle()
            } /*title*/,
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
            } /*axisX*/,
            axisY: {
                titleFontSize: fontSizes.axisYTitle,
                labelFontSize: fontSizes.axisYLabel,
                title: "Coin Value ($)",
                titleFontColor: "darkcyan",
                lineColor: "darkcyan",
                labelFontColor: "darkcyan",
                tickColor: "darkcyan",
                includeZero: true
            } /*axisY*/,
            toolTip: {
                shared: true
            },
            legend: {
                fontSize: fontSizes.legend,
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: arrData /*data*/
        } /*options*/;
        chart = new CanvasJS.Chart("graphCoins", options);
        SetDataPoints();
        RunRptGetData();
    } //RptList.getQty > 0
    else { //RptList.getQty == 0:
        $("#shelfInfoTemp").append(`
        ${getData.setAlert("No coin selected for reporting!", false)}
        `);
    } //RptList.getQty == 0
    Spinner.close();
} //openCoinReport()
