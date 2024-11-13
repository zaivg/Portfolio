/// <reference path="Cryptonite.d.ts" />
export { };

/***** CONSTANTS *****/
const MAX_LIST_COINS = 100;
const MAX_RPT_COINS = 5;

const COIN_INFO_KEEP = 2 * 60 * 1000;//2 min
const COIN_INFO_CLEAN = 5 * 60 * 1000;//5 min
const RPT_DATA_PERIOD = 2000;//2 sec.

const INFO_KEY_PREFIX = "info_";
const RPT_KEY_PREFIX = "rpt_";

const URL_COINS = "https://api.coingecko.com/api/v3/coins/";
const URL_PRICES = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=COINS&tsyms=USD";


/***** CLASSES *****/
class Responce {
    public isOk: boolean;
    public data: string;
    constructor(isOK: boolean, data: string) {
        this.isOk = isOK;
        this.data = data;
    }//constructor
}//class Responce


class getData {

    public static getCoinList(): void {
        Spinner.open();
        $.get(URL_COINS + 'list', res => { res })
            .then(res => { setList(new Responce(true, res)); })
            .catch(err => { setList(new Responce(false, getData.getError((err as any).responseText))); })
    }//getCoinList()


    public static getCoinInfo(coinName: string): Promise<Responce> {
        return $.get(URL_COINS + coinName, res => { return res })
            .then(res => { return new Responce(true, res) })
            .catch(err => { return new Responce(false, getData.getError((err as any).responseText)) })
    }//getCoinInfo()


    public static getCoinPrices(coins: string): Promise<Responce> {
        const URL_PRICES_COINS = URL_PRICES.replace("COINS", coins)

        return $.get(URL_PRICES_COINS, res => { return res })
            .then(res => {
                if (res.Response != "Error") {
                    return new Responce(true, res);
                } else {
                   return new Responce(false, getData.setAlert(res.Warning));
                }//else
            })
            .catch(err => { return new Responce(false, getData.getError((err as any).responseText)) })
    }//getCoinPrices()

    public static setAlert(msg: string, isDanger = true): string {
        return `<div class="alert alert-${isDanger ? 'danger' : 'warning'} w-100" role="alert">
            <h5>There is no way to get data!</h5>
            <p>${msg}</p>
            </div>`;
    }//setAlert()

    private static getError(responseText: string): string {
        if (responseText == undefined) {
            return getData.setAlert("Unknow error!");
        } else if (responseText.startsWith("<!DOCTYPE html>")) {
            return responseText;
        } else {
            try {
                return getData.setAlert(JSON.parse(responseText).error);
            } catch{
                return getData.setAlert(responseText);
            }
        }//else
    }//HandleError()

} //class getData


type priceVal = number | string;

class cInfo {
    private _coinId = "";
    private _isInfoFound = false;
    private _info = { coinId: <string>"", img: <string>"", usd: <priceVal>0, eur: <priceVal>0, ils: <priceVal>0, dt: <any>0 };
    private _errAlert = "";
    private static _interval: number = null;

    constructor(coinId: string) { this._coinId = coinId; }

    public get isInfoFound(): boolean { return this._isInfoFound; }
    public get coinInfo(): object { return this._info; }
    public get formattedInfo(): object {
        let frmInfo = Object.assign({}, this._info);
        frmInfo.usd = frmInfo.usd.toLocaleString(undefined, { style: 'decimal' });
        frmInfo.eur = frmInfo.eur.toLocaleString(undefined, { style: 'decimal' });
        frmInfo.ils = frmInfo.ils.toLocaleString(undefined, { style: 'decimal' });
        frmInfo.dt = (new Date(frmInfo.dt)).toLocaleString(undefined, { hour12: false });
        return frmInfo;
    }//get formattedInfo()
    public get errAlert(): string { return this._errAlert; }

    public searchInStorage(): void {
        this._isInfoFound = false;
        let tmpInfo = JSON.parse(sessionStorage.getItem(this._getKey(this._coinId)));
        if (tmpInfo != null) {
            if (<any>(new Date()) - <any>(new Date(tmpInfo.dt)) > COIN_INFO_KEEP) {
                sessionStorage.removeItem(this._getKey(this._coinId));
            } else {
                this._info = Object.assign({}, tmpInfo);
                this._isInfoFound = true;
            }//?tmpInfo.dt
        }//tmpInfo != null
    }//searchInStorage()

    public keepInStorage(): void {
        sessionStorage.setItem(this._getKey(this._coinId), JSON.stringify(this._info));
        cInfo.openInfoCleanning();
    }//keepInStorage()

    private _getKey(coin): string { return `${INFO_KEY_PREFIX}${coin}`; }

    public async asyncGetInfo(): Promise<void> {
        this._isInfoFound = false;
        let coin = <any>await getData.getCoinInfo(this._coinId);
        if (coin.isOk) {
            this._info.coinId = coin.data.id;
            this._info.img = coin.data.image.small;
            this._info.usd = coin.data.market_data.current_price.usd;
            this._info.eur = coin.data.market_data.current_price.eur;
            this._info.ils = coin.data.market_data.current_price.ils;
            this._info.dt = new Date();
            this._errAlert = "";
            this._isInfoFound = true;
        }//coin.isOk
        else {//!coin.isOk:
            this._errAlert = coin.data;
        }//!coin.isOk
    }//asyncGetInfo()

    public static openInfoCleanning(): void {
        if (cInfo._interval == null) {
            cInfo._interval = setInterval(_ => {
                for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(INFO_KEY_PREFIX))) {
                    let tmpInfo = JSON.parse(sessionStorage.getItem(key)
                    );
                    if (<any>(new Date()) - <any>(new Date(tmpInfo.dt)) > COIN_INFO_KEEP) {
                        sessionStorage.removeItem(key);
                    }
                }//for
                if (Object.keys(sessionStorage).filter(value => value.startsWith(INFO_KEY_PREFIX)).length == 0) {
                    cInfo.closeCleaning();
                }//if
            }, COIN_INFO_CLEAN);
        }
    }//openInfoCleanning()

    public static closeCleaning(): void {
        if (cInfo._interval != null) clearInterval(cInfo._interval);
    }//closeCleaning()

}//class cInfo


class RptList {

    public static getQty(): number {
        return Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX)).length;
    }//getQty()

    public static add(elm: Object, coinId: string, symbol: string, name: string): void {
        if (sessionStorage.getItem(RptList._getKey(coinId)) == null) {
            if (RptList.getQty() < MAX_RPT_COINS) {
                let coin = { coinId: coinId, symbol: symbol, name: name };
                sessionStorage.setItem(RptList._getKey(coinId), JSON.stringify(coin));
            }
            else {//MAX_RPT_COINS:
                $(elm).prop("checked", false);
                RptList._openModalRpt();
            }
        }
    }//add()

    public static remove(coinId: string): void {
        if (sessionStorage.getItem(RptList._getKey(coinId)) != null) {
            sessionStorage.removeItem(RptList._getKey(coinId))
        }
    }//remove()

    public static updateRptList(): void {
        for (let i = 1; i <= MAX_RPT_COINS; i++) {
            let elm = $(`#modalRpt #swithRptModal${i}`);
            if (!$(elm).prop("checked")) {
                let coinId = $(elm).attr("coinid");
                RptList.remove(coinId);
                $(`#swithRpt${coinId}`).prop("checked", false);
            }
        }//for
        ($('#modalRpt') as any).modal('hide');
    }//UpdateRptList()

    public static getCoinsURL(): string {
        let list = "";
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            let coin = JSON.parse(sessionStorage.getItem(key));
            list += `${coin.symbol},`;
        }//for
        if (list != "") list = list.slice(0, -1);
        return list;
    }//getCoinsURL()

    public static getCoinsTitle(): string {
        let list = "";
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            let coin = JSON.parse(sessionStorage.getItem(key));
            list += `${coin.symbol} (${coin.name}), `;
        }//for
        if (list != "") list = list.slice(0, -2);
        return list;
    }//getCoinsTitle()

    public static getCoinArr(): string[] {
        let arr = [];
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            arr.push(JSON.parse(sessionStorage.getItem(key)).symbol);
        }//for
        return arr;
    }//getCoinList()

    public static getCoinArrSymbol(): string[] {
        let arr = [];
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            arr.push(JSON.parse(sessionStorage.getItem(key)).symbol);
        }//for
        return arr;
    }//getCoinArrSymbol()

    public static getCoinArrId(): string[] {
        let arr = [];
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            arr.push(JSON.parse(sessionStorage.getItem(key)).coinId);
        }//for
        return arr;
    }//getCoinArrId()

    private static _openModalRpt(): void {
        $("body").append(
            `
            <div id="modalRpt" class="modal fade} " tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header mq-listener pt-1 pb-1 pt-lg-3 pb-lg-3">
                        <h5 class="modal-title">Coins chosen to Live Reports</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body mq-listener pt-1 pb-1 pt-lg-3 pb-lg-3">
                        <p>A limit of 5 coins has been reached.<br>
                            To select an another coin, cancel one / some of the selected:</p>

                        ${RptList._fillCoins()}

                    </div>
                    <div class="modal-footer mq-listener pt-1 pb-1 pt-lg-3 pb-lg-3">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            style="width: 80px;">Cancel</button>
                        <button type="button" class="btn btn-primary" style="width: 80px;" onclick="RptList.updateRptList()">Save</button>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        $('#modalRpt').on('hidden.bs.modal', _ => {
            $('#modalRpt').remove();
            $('#modalRpt').modal('dispose');
        });
        </script>
        `);

        ($('#modalRpt') as any).modal('show')

    }//_openModalRpt()

    private static _fillCoins(): string {
        let elmsCoins = "";
        let i = 0;
        for (let key of Object.keys(sessionStorage).filter(value => value.startsWith(RPT_KEY_PREFIX))) {
            let coin = JSON.parse(sessionStorage.getItem(key));
            i++;
            elmsCoins +=
                `
            <div class="row">
            <div class="col col-2"><h6>${coin.symbol}</h6></div>
            <div class="col"><h6>${coin.name}</h6></div>
            <div class="col col-auto">
            <div class="swithReport custom-control custom-switch">
            <input id="swithRptModal${i}" type="checkbox" class="custom-control-input" checked="true"
            coinid="${coin.coinId}">
            <label class="custom-control-label" for="swithRptModal${i}"></label>
            </div>
            </div>
            </div>
            `;
        }//for key 
        return elmsCoins;
    }//fillCoins()    

    private static _getKey(coin: string): string { return `${RPT_KEY_PREFIX}${coin}`; }

}//class RptList


class Spinner {
    private static _isOpened = false;
    private static _queue = 0;
    private static _timeOutFunc: number = null;
    private static _spinner = `
        <div id="spinner" class="spinner-border text-danger" role="status">
            <span> <img src="Resources/Superman.png"> </span>
        </div>
        `

    public static open(isDelay = false, isEndTOut = false ): void {
        if(!isEndTOut) Spinner._queue++;

        if (isDelay){          
            if(Spinner._timeOutFunc == null) {
                Spinner._timeOutFunc = setTimeout(Spinner.open, RPT_DATA_PERIOD, false, true)
            }//_timeOutFunc == null
        }//isDelay
        else {//!isDelay:
            if(!Spinner._isOpened) {
                $("body").append(Spinner._spinner);
                Spinner._isOpened = true;
            }//!Spinner._isOpened
        }//!isDelay

    }//open()


    public static close(isStopAll = false): void {

        if(isStopAll) Spinner._queue = 0;
        else if(Spinner._queue > 0) Spinner._queue--;

        if(Spinner._queue == 0){
            if (Spinner._timeOutFunc != null) {
                clearTimeout(Spinner._timeOutFunc);
                Spinner._timeOutFunc = null;
            }//_timeOutFunc != null
            
            if(Spinner._isOpened) {
                $("#spinner").remove();
                Spinner._isOpened = false;
            }//_isOpened
        }//_qtyOpened == 0
    }//close()

}//class Spinner
