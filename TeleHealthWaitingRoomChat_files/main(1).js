
$(document).ready(function () {
    var stepNum = -1;
   
    stepNum = parseInt($("#hfViewNum").val());

    var myVar = setInterval(topTimer, 1000);
    //alert("stepnum: " + stepNum);
    
    if(parseInt($("#hfPopup").val()) == 1)
    {
        $("#hfPopup").val("0");
        $("#alertModal").modal("show");
    }

    //getVideo();
   
    //if (stepNum == 0)
    //{
    //    $("#txtDob").datepicker({
    //        changeMonth: true,
    //        changeYear: true,
    //        yearRange: "1910:2030",
    //        showOn: "button",
    //        buttonImage: "images/calendar_view_month.png",
    //        buttonImageOnly: true,
    //        buttonText: "Select date"
    //    });
    //}

    var decodedCookie = decodeURIComponent(document.cookie);

    //alert("cookie: " + decodedCookie);

    if (stepNum == 2) {

        $("#divWaiting").show();
        $("#divVirtual").hide();

        $("#divChat").hide();
        //var loaderOpts = {
        //    baseUrl: 'https://lex-web-ui2-codebuilddeploy-d7h5h933-webappbucket-rmne1wglngnj.s3.us-east-1.amazonaws.com/',
        //    shouldLoadMinDeps: true
        //};
        //var loader = new ChatBotUiLoader.IframeLoader(loaderOpts);
        //loader.load()
        //    .catch(function (error) { console.error(error); });

        $("#divVideoLink").hide();
        startPoll();
    }
});

var timer = "";
var count = 0;
var startPoll = function () {    
   // timer = setInterval(getVideo, 5000);
}

var getNotification = function() {    
    var thId = $("#hfApptId").val();
    count = count + 1;
    var videoUrl = "";
   
    $.ajax({
        type: "POST",
        url: 'AjaxWebSvc.asmx/GetNotification',
        data: "{'code':'" + count.toString() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            var retJson = msg.d;
            var jsonObj = JSON.parse(retJson);
            var status = -1;
            var patientName = "";
            if (retJson == "") {
                alert("An error occurred in getting passcode.");
            }
            else {                
                $("#counter").html("This is poll " + count);
                status = parseInt(jsonObj.status);
                if (status == 1) {
                    clearInterval(timer);
                    $("#divWaiting").hide();
                    $("#divVirtual").show();
                    patientName = $("#hfPatientName").val();                  
                    videoUrl = $("#hfVideoUrl").val() + "m=" + jsonObj.meetingid + "&name=" + patientName

                    //alert("passcode: " + retPasscode);
                    $("#frmSeeDr").attr("src", videoUrl);

                    //$("#lbtnWaiting").removeClass("Banner_active");
                    //$("#lbtnSeeDr").removeClass("Banner_disabled");
                    //$("#lbtnWaiting").addClass("Banner_disabled");
                    //$("#lbtnWaiting").css("color", "#212529");
                    //$("#lbtnSeeDr").addClass("Banner_active");
                    //$("#lbtnSeeDr").css("color", "white");

                    //$("#aSeeDoc").removeClass("btn btn-secondary");
                    //$("#aSeeDoc").addClass("btn btn-primary");
                    $("#aSeeDoc").attr("href", videoUrl);
                    //$("#divDrReady").html("Your doctor is in the virtual room. Please click 'See Doctor' button to join the virtual room.");

                    //create status
                    //createVideoStatus();
                }
            }
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });
}

var createVideoStatus = function () {
    var thId = $("#hfApptId").val();
    $.ajax({
        type: "POST",
        url: 'AjaxWebSvc.asmx/CreateVideoStatus',
        data: "{'thId':'" + thId.toString() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            var retCode = msg.d;
            //alert("retcode: " + retCode);
            if (retCode != "0") {
                alert("An error occurred in creating status.");
            }            
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });
}

var getVideo = function () {
    var thId = $("#hfApptId").val();
    $.ajax({
        type: "POST",
        url: 'AjaxWebSvc.asmx/GetVideo',
        data: "{'thId':'" + thId.toString() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {            
            var videoUrl = msg.d;
            //alert("url : " + videoUrl);
            if (videoUrl == "") {
                count = count + 1;
                $("#counter").html("Please wait. Notification " + count);
                //if (count == 4) {
                //    clearInterval(timer);
                //    createVideoStatus();                    
                //}                
            }            
            else {                 
                clearInterval(timer);
                //create status
                //createVideoStatus();

                $("#hfVideoUrl").val(videoUrl);
                //show button
                //$("#aSeeDoc").removeClass("btn btn-secondary");
                //$("#aSeeDoc").addClass("btn btn-primary");
                $("#aSeeDoc").attr("href", videoUrl);
                $("#divVideoLink").show();
                //start countdown
                startCountDown();
                
                
                //$("#divWaiting").hide();
                //$("#divVirtual").show();                
                //$("#frmSeeDr").attr("src", videoUrl);
                //$("#aSeeDoc").attr("href", videoUrl);                               
            }                        
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });
}

var countDownTimer;

var startCountDown = function () {
    countDownTimer = setInterval(countDown, 1000);
}

var downCount = 60;

var countDown = function () {
    var videoUrl = "";    
    $("#downCounter").html(downCount);
    if (downCount == 0) {
        clearInterval(countDownTimer);
        videoUrl = $("#hfVideoUrl").val();
        //launch video 
        window.location.replace(videoUrl);
    }
    downCount = downCount - 1;
}

var getChat = function () {

    launchChat();
}

var launchChat = function () {

    var thId = $("#hfApptId").val();
    var userName = $("#hfUserName").val();
    var mrn = $("#hfMrn").val();
    var roleId = 10;
    $.ajax({
        type: "POST",
        url: "AjaxWebSvc.asmx/GetChat",
        data: "{'thId':'" + thId.toString() + "', 'userName':'" + userName + "', 'mrn':'" + mrn + "', 'roleId':'" + roleId.toString() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            var chatUrl = msg.d;
            //alert("url: " + chatUrl);
            if (chatUrl != "") {
                $("#divChat").show();
                $("#frmChat").attr("src", chatUrl);    //"http://www.boston.com"
                $("#aGetChat").hide();
            }
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });
}

var getChatNotification = function () {
    var chatroomId = "A4486F16-94F0-4924-9455-B7F491C94B58";
    var userName = $("#hfUserName").val();
    //alert("hello");

    $.ajax({
        type: "POST",
        url: "AjaxWebSvc.asmx/GetChatNotificaion",
        data: "{'chatroomId':'" + chatroomId + "', 'userName':'" + userName + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            var isReceivedMsg = msg.d;            
            if (isReceivedMsg == true) {
                alert("message received.");
            }
            else {
                alert("no message received.");
            }
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });

}

var pollServer = function () {
    var chatroomId = "A4486F16-94F0-4924-9455-B7F491C94B58";
    var userName = "John Smith";
    var thId = $("#hfApptId").val();
    var chatOn = -1;

    $.ajax({
        type: "POST",
        url: "AjaxWebSvc.asmx/GetPollResult",
        data: "{'thId':'" + thId.toString() + "','chatroomId':'" + chatroomId + "', 'userName':'" + userName + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg, status) {
            var retJson = msg.d;
            var jsonObj = JSON.parse(retJson);
            var videoUrl = jsonObj.videoUrl;
            var msgReceived = jsonObj.msgReceived;
            //alert("video: " + videoUrl + "\nmsgReceived: " + msgReceived);

            if (videoUrl != "" && msgReceived == "True") {
                clearInterval(timer);
                //create status
                //createVideoStatus();

                //set chat hidden to on
                $("#hfChatOn").val("1");

                //open chat
                launchChat();
                //$("#aSeeDoc").removeClass("btn btn-secondary");
                //$("#aSeeDoc").addClass("btn btn-primary");
                //$("#aSeeDoc").attr("href", videoUrl);
                //$("#divDrReady").html("Your doctor is in the virtual room. Please click 'See Doctor' button to join the virtual room.");                
            }
            else if (videoUrl != "" && msgReceived == "False") {
                //alert("video: " + videoUrl + "\nmsgReceived: " + msgReceived);
                clearInterval(timer);
                //create status
                //createVideoStatus();

                //launch video 
                //check chat hidden. if on display link
                chatOn = parseInt($("#hfChatOn").val());
                
                if (chatOn == 0)
                    window.location.replace(videoUrl);
                else {
                    //$("#aSeeDoc").removeClass("btn btn-secondary");
                    //$("#aSeeDoc").addClass("btn btn-primary");
                    //$("#aSeeDoc").attr("href", videoUrl);
                    //$("#divDrReady").html("Your doctor is in the virtual room. Please click 'See Doctor' button to join the virtual room.");
                }
            }
            else if (videoUrl == "" && msgReceived == "True") {
                //set chat hidden to on
                $("#hfChatOn").val("1");

                //open chat
                launchChat();                              
            }
            else { //both none
                count = count + 1;
                $("#counter").html("Please wait. Notification " + count);
            }
        },
        error: function (request, status, error) {
            alert("an error occurred: " + request.statusText);
        }
    });
}

//var logConsent = function () {
//    var code = $("#hfGuid").val();

//    $.ajax({
//        type: "POST",
//        url: 'AjaxWebSvc.asmx/LogConsent',
//        data: "{'code':'" + code + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (msg, status) {
//            var result = msg.d;
//            if (result == "1") {
//                alert("An error occurred in logging consent.");
//            }
//            else {
//                alert("succeeded in logging consentg=.");
//            }
//        },
//        error: function (request, status, error) {
//            alert("an error occurred: " + request.statusText);
//        }
//    });

//}

//var logConsentMulti = function () {

//    $.ajax({
//        type: "POST",
//        url: 'AjaxWebSvc.asmx/SaveFav',
//        data: "{'reportid':'" + reportId + "', 'userid':'" + userId + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (msg, status) {
//            elem.remove();
//            if (msg.d != "success") {
//                $("#divFavMsg").html(msg.d);
//                popupMessage();
//                //alert(msg.d);
//            }
//        },
//        error: function (request, status, error) {
//            alert("an error occurred: " + request.statusText);
//        }
//    });

//}

var topTimer = function () {
    var d = new Date();
    var t = d.toLocaleTimeString();
    $("#divTimer").html(t);
}

var checkConsent = function ()
{
    //alert("I got called");
    if ($('#chkConsent').is(":checked"))
    {
        $("#alertModal").modal("show");
        return false;
    }
    return true;
}

var gotoVirtual = function()
{
    $("#divWaiting").hide();
    $("#divVirtual").show();
    var patientName = "";
    patientName = $("#hfPatientName").val();
    //$("#frmSeeDr").attr("src", "https://video-app-8029-dev.twil.io?passcode=7621338029&name=" + patientName + "&room=OKOKOKOK");
    //$("#aSeeDoc").attr("href", "https://video-app-8029-dev.twil.io?passcode=7621338029&name=" + patientName + "&room=OKOKOKOK");
    $("#frmSeeDr").attr("src", "https://appstoretst.bidmc.org:8443/?m=meetingID&name=" + patientName);
    $("#aSeeDoc").attr("href", "https://appstoretst.bidmc.org:8443/?m=meetingID&name=" + patientName);
    //create status
    //createVideoStatus();
    //$("#lbtnWaiting").removeClass("Banner_active");
    //$("#lbtnSeeDr").removeClass("Banner_disabled");
    //$("#lbtnWaiting").addClass("Banner_disabled");
    //$("#lbtnWaiting").css("color", "#212529");
    //$("#lbtnSeeDr").addClass("Banner_active");
    //$("#lbtnSeeDr").css("color", "white");
}

