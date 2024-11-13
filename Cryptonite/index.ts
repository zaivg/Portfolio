/// <reference path="Cryptonite.d.ts" />
export { };

$(() => {
    $.ajaxSetup({ timeout: 3000 });

    $(window).on("scroll", _ => {
        if (parseFloat($("#imgSuperman").css("bottom")) <= -parseFloat($("#imgSuperman").css("height"))) {
            $("#imgSuperman").css("top", "0px")
        } else {
            let newTop = window.scrollY / 2 % parseFloat($("body").css("height"));
            if (parseFloat($("#imgSuperman").css("top")) <= newTop) {
                $("#imgSuperman").removeClass("up")
            } else {
                $("#imgSuperman").addClass("up")
            }
            $("#imgSuperman").css("top", newTop + "px");
        }
    })//window on scroll

    $("#frmSearch").on("submit", ev => {
        ev.preventDefault();
    })//$("#frmSearch").on("submit")
    

    $(".nav-link").on("click", ev => {
        Spinner.close(true);
        //current option:
        switch ($(".nav-control.active").prop("id")) {
            case "navHome":
                $("#shelfInfoConst").removeClass("d-inline-flex");//with this class css("display") remains "inline-flex"
                $("#shelfInfoConst").css("display", "none");
                break;
            case "navReports":
                StopRptGetData();
                $("#shelfInfoTemp").empty();
                break;
            case "navAbout":
                $("#shelfInfoTemp").empty()
                break;
        }//switch

        $(".nav-link").removeClass("active");
        $(ev.target).addClass("active");

        //target option:
        switch (ev.target.id) {
            case "navHome":
                $("#frmSearch").css("display", "");
                if ($("#shelfInfoConst").css("display") == "none") {//exists:
                    $("#shelfInfoConst").addClass("d-inline-flex");
                    $("#shelfInfoConst").css("display", "");
                } else {//doesn't exist:
                    getData.getCoinList();
                }
                break;
            case "navReports":
                $("#frmSearch").css("display", "none");
                openCoinReport();
                break;
            case "navAbout":
                $("#frmSearch").css("display", "none");
                openAbout();
                break;
        }//switch
    })//$(".nav-link").on("click")

    /***** Open Home page as default: *****/
    $("#navHome").trigger("click");
}) //$ ready()
