function parametroURL(_par) {

    var _p = null;
    if (location.search) location.search.substr(1).split("&").forEach(function(pllv) {
        var s = pllv.split("="), //separamos llave/valor
            ll = s[0],
            v = s[1] && decodeURIComponent(s[1]); //valor hacemos encode para prevenir url encode
        if (ll == _par) { //solo nos interesa si es el nombre del parametro a buscar
            if (_p == null) {
                _p = v; //si es nula, quiere decir que no tiene valor, solo textual
            } else if (Array.isArray(_p)) {
                _p.push(v); //si ya es arreglo, agregamos este valor
            } else {
                _p = [_p, v]; //si no es arreglo, lo convertimos y agregamos este valor
            }
        }
    });
    return _p;
}
var config = {
    apiKey: "AIzaSyC7k-ZwvRr4r0SW6x-LzAhGT7XnssZy09A",
    authDomain: "saxenda-6f20a.firebaseapp.com",
    databaseURL: "https://saxenda-6f20a.firebaseio.com",
    projectId: "saxenda-6f20a",
    storageBucket: "saxenda-6f20a.appspot.com",
    messagingSenderId: "628276131253",
    appId: "1:628276131253:web:b7f04165b06765beb655fc",
    measurementId: "G-1S39HNYCYQ"
};



if (!firebase.apps.length) {
    firebase.initializeApp(config);
    var db = firebase.firestore();
    otramaneralogin();


    //logarse("email");
    authenticate().then(loadClient);



}

function otramaneralogin() {

    alert("paso");
    firebase.auth().useDeviceLanguage();

    var uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: '#inicio',

        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            //     firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            //   firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: 'index.html',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
            window.location.assign('#inicio');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

}

function authenticate() {


    // get the credentials from the google auth response
    var idToken = firebase.auth().currentUser.getIdToken();
    var creds = firebase.auth.GoogleAuthProvider.credential(idToken);


    // auth in the user 
    firebase.auth().signInWithCredential(creds).then((user) => {
        // you can use (user) or googleProfile to setup the user
        var googleProfile = googleUser.getBasicProfile()
        if (user) {
            // do something with this user
        }
    })
}




var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
var fechayhora;
var timestamp;
var offset;


var offsetRef = firebase.database().ref(".info/serverTimeOffset");
offsetRef.on("value", damefechayhora, errorfecha);

function damefechayhora(snap) {

    offset = snap.val();
    timestamp = new Date().getTime() + offset;
    //	timestamp=db.Timestamp;


    var d = new Date(timestamp);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();


    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    fechayhora = day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

    //$("#fecha").append(" " + fechayhora);



}




function formateofecha(fecha) {

    var day = fecha.getDate();
    var month = fecha.getMonth() + 1;
    var year = fecha.getFullYear();

    var curr_hour = fecha.getHours();
    var curr_min = fecha.getMinutes();
    var curr_sec = fecha.getSeconds();


    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

}

function errorfecha(e) {

    console.log("error" + e);
}










function alta() {

    db.collection("saxenda").add({
            email: email,
            cantidad: cantidad,
            fecha: fechayhora,
            otros: coordenadas,
            ocupacion_actual: ocupacion_actual,

        })
        .then(function(docRef) {


            alertify.success("Se ha añadido correctamente");


        })
        .catch(function(error) {

            console.error("Error adding document: ", error);
        });

}



function borrar(email, dia) {
    var borrar = db.collection('saxenda').where('email', '==', email);
    resul.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        }).catch(function(error) {
            console.error("Error borrando preguntas: ", error);
        });
}


var datos_consult;




function consulta(email) {

    db.collection("saxenda").where("email", "==", email).get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {


                datos_consult = doc.data();


                $("#fecha").val(datos_consult.fecha);
                $("#cantidad").val(datos_consult.provincia);

            });
        });

}





function actualizar(email, fecha, cantidad) {

    db.collection('saxenda').doc(email).set({

        cantidad: aforo_actual,
    }, { merge: true });
    alertify.success("Dato actualizado");
}



//CARGA DE DATOS DE JSON
/*
const collectionKey = "aforo";
if (data && (typeof data === "object")) {
var coleccion = db.collection(collectionKey);
for(var elemento in data[0]){
coleccion.doc(elemento).set(data[0][elemento]);

}
}
*/