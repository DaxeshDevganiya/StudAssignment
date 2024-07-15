const DTM = require("../models/deviceTokenModel")
var FCM = require("fcm-node");
let notification={
    sendNotification:async (data)=>{
        let tokens=[]
        if(!data.token){
            let get=await DTM.find(data.condition)
            tokens=get.map((m)=>{ return m.token })
        }else{
            tokens=[data.token];
        }
        console.log("tokens",tokens);
        let ndata={}
        if(data.from){
            ndata["redirect"]=data.from;
        }
        var fcm = new FCM(`AAAAHnnbaCU:APA91bHxqsishd-3k7PZsImkXMDQK_QEj2gf9CRCN0G2qCOyAy1kNhHutUoIhkp8X6L_Pjv3ket7zjit_kqjIKphkp3ujGkX0VFEuTobGarZ_XJ1ufePye_WTr-Kst8xfDCjhKR_iSbx`);
        var message = {
            registration_ids: tokens,
            notification: {
                title: data.title,
                body: data.msg,
            },
            data:ndata
        };
        fcm.send(message, function (err, response) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });

    }
}
module.exports=notification;