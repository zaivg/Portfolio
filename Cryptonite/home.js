var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function setList(list) {
    if (list.isOk) {
        sessionStorage.clear();
        for (let i = 0; i < list.data.length && i < MAX_LIST_COINS; i++) {
            $("#shelfInfoConst").append(`
            <div id="${list.data[i].id}" class="coinCard card">
              <div id="cardBody${list.data[i].id}" class="card-body">
                <div class="row">
                  <div class="col">
                    <h4 class="coinCD card-title">${list.data[i].symbol.toUpperCase()}</h4>
                    <p class="coinName card-text">${list.data[i].name.toLowerCase()}</p>
                    <button type="button" id="btnMoreInfo${list.data[i].id}" class="btn btn-primary" style="width: 100px;" onclick="ToggleMoreInfo('${list.data[i].id}')">More Info</button>
                  </div>
                  <div class="col-2">
                    <div class="swithReport custom-control custom-switch mr-1">
                      <input id="swithRpt${list.data[i].id}" type="checkbox" class="custom-control-input" onclick="coinSwithReport(this, '${list.data[i].id}','${list.data[i].symbol.toUpperCase()}','${list.data[i].name.toLowerCase()}')">
                      <label class="custom-control-label" for="swithRpt${list.data[i].id}"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `);
        } //for
    } //list.isOk
    else { // !list.isOk:
        $("main").html(list.data);
    } // !list.isOk
    Spinner.close();
} //setListFunc()
$("#inputSearch").on("search", searchCoins);
$("#navSearch").on("click", searchCoins);
function searchCoins(ev) {
    ev.preventDefault();
    $(".coinCard").prop("hidden", false);
    let sSearch = $("#inputSearch").val().trim();
    $("#inputSearch").val(sSearch);
    if (sSearch != "") {
        $(".coinCard").not((idx, elm) => {
            return $(elm).attr("id").startsWith(sSearch);
        }).prop("hidden", true);
    } //if
} //searchCoins()
function ToggleMoreInfo(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        Spinner.open();
        let btnMoreInfo = $(`#btnMoreInfo${coinId}`);
        if (!$(btnMoreInfo).hasClass("open")) { //info card closed --> open:
            let oInfo = new cInfo(coinId);
            oInfo.searchInStorage();
            if (!oInfo.isInfoFound)
                yield oInfo.asyncGetInfo();
            let cardBody = $(`#cardBody${coinId}`);
            if (oInfo.isInfoFound) {
                oInfo.keepInStorage();
                $(cardBody).append(`
        <div id="info${coinId}" class="infoCard card w-100 Regular shadow " style="position: absolute; z-index: 1; display: none;">
        <div class="card-body">
        <div class="container">
        
        <div class="row align-items-center mb-3  border-bottom">
          <div class="col col-auto">
              <img class="infoCoinImg" height="50px" width="50px"
              src="${oInfo.formattedInfo.img}"
              alt="${coinId}">
          </div>
          <div class="col">
              <h6 class="card-text">Current price:</h6>
          </div>
        </div>
        
        <div class="row align-items-center">
          <div class="col-auto">
            <img height="30px" width="50px" src="Resources/flag_USA.png" alt="USA flag" alt="USA flag">
          </div>
          <div class="col">
            <h6 class="info-usd-price card-text text-right">${oInfo.formattedInfo.usd} &#36;</h6>
          </div>
        </div>
                        
        <div class="row align-items-center">
          <div class="col-auto">
            <img height="30px" width="50px" src="Resources/flag_EU.png" alt="EU flag">
          </div>
          <div class="col">
            <h6 class="info-eur-price card-text text-right">${oInfo.formattedInfo.eur} &#8364;</h6>
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col-auto">
            <img height="30px" width="50px" src="Resources/flag_ISRAEL.png" alt="Israel flag">
          </div>
          <div class="col">
            <h6 class="info-ils-price card-text text-right">${oInfo.formattedInfo.ils} &#8362;</h6>
          </div>
        </div>
        
        <div class="row justify-content-end mt-3 border-top">
          <h6 class="card-text mt-1 mr-3"><i class="infoDT">${oInfo.formattedInfo.dt}</i></h6>
        </div>
        
      </div>
      </div>
      </div>
      `);
            } //oInfo.isInfoFound
            else { //!oInfo.isInfoFound:
                $(cardBody).append(`
        <div id="info${coinId}" class="infoCard card w-100 Regular shadow " style="position: absolute; z-index: 1; display: none;">
          <div class="card-body">
            ${oInfo.errAlert}
          </div>
        </div>
        `);
            } //!oInfo.isInfoFound
            $(`#info${coinId}`).slideDown();
            $(btnMoreInfo).addClass("open");
            $(btnMoreInfo).text("Less Info");
        } //info card closed
        else { //info card opened --> close:
            $(`#info${coinId}`).slideUp();
            setTimeout(_ => {
                $(`#info${coinId}`).remove();
                $(btnMoreInfo).removeClass("open");
                $(btnMoreInfo).text("More Info");
            }, 500);
        } //info card opened
        Spinner.close();
    });
} //ToggleMoreInfo()
function coinSwithReport(elm, coinId, symbol, name) {
    if ($(elm).prop("checked")) {
        RptList.add(elm, coinId, symbol, name);
    }
    else {
        RptList.remove(coinId);
    }
} //coinSwithReport()
