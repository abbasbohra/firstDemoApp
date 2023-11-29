const admin = require('firebase-admin')
const express = require('express')
const app = express()
var serviceAccount = require("./demoapp-747c9-firebase-adminsdk-pwiit-0668a379d4.json");
app.use(express.json())
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});




app.post('https://8de2-103-78-180-237.ngrok.io/send-notify', (req, res) => {
    console.log(req.body)
    const message = {
        notification: {
            title: req.body.title,
            body: req.body.body
        },
        token:'fl5gl1HiSSGxvSirT2F43_:APA91bENN11bCOFCMa0KAprZD-IG1AK29zqxn6M59qdIkp_tlOjsJqRQYIH6npyoEwREXPcsIxKQdCAEPyH4gYkfakoIi5XB-1DC-0TX6ORhrWmqPqopKLVosofnb_zxxRpDpAdwAZAO'
    }

    admin.messaging().send(message).then((res) => {
        console.log('send sucesss')
    }).catch((error) => {
        console.log(error)
    })
})

app.listen(3000, (res) => {
    console.log('server run')
})

