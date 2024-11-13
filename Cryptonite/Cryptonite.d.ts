/***** CONSTANTS *****/
declare const MAX_LIST_COINS: number; //globals, home
declare const RPT_DATA_PERIOD: number; //globals, report


/***** CLASSES *****/
declare class Responce {
    public isOk: boolean;
    public data: string;
    constructor(isOK: boolean, data: string);
}//class Responce //globals, home

declare class getData {
    public static getCoinList(): void;
    public static getCoinInfo(coinName: string): Promise<Responce>;
    public static getCoinPrices(coins: string): Promise<Responce>;
    public static setAlert(msg: string, isDanger?: boolean): string;
} //class getData //globals, report


declare class cInfo {
    constructor(coinId: string);
    public get isInfoFound(): boolean;
    public get coinInfo(): object;
    public get formattedInfo(): object;
    public get errAlert(): string;
    public searchInStorage(): void;
    public keepInStorage(): void;
    public asyncGetInfo(): Promise<void>;
    public static openInfoCleanning(): void;
    public static closeCleaning(): void;
}//class cInfo  //globals


declare class RptList {
    public static getQty(): number;
    public static add(elm: Object, coinId: string, symbol: string, name: string): void;
    public static remove(coinId: string): void;
    public static updateRptList(): void;
    public static getCoinsURL(): string;
    public static getCoinsTitle(): string;
    public static getCoinArr(): string[];
    public static getCoinArrSymbol(): string[];
    public static getCoinArrId(): string[];
}//class RptList  //globals, home, report


declare class Spinner {
    static open(delay?: boolean, isEndTOut?: boolean): void;
    static close(isStopAll?: boolean): void;
}//class Spinner //globals, index, home, report


declare class CanvasJS {
    static formatDate(time: any, format: string): string;
}//class CanvasJS //globals, report
    


/***** FUNCTIONS *****/
declare function setList( responce: Responce): void;//globals, home
declare function openCoinReport(): void; //index, report
declare function StopRptGetData(): void; //index, report
declare function openAbout(): void;//index, about

