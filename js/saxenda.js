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


    // logarse("email");
    //authenticate().then(loadClient);



}


function otramaneralogin() {


    firebase.auth().useDeviceLanguage();

    var uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: 'index.html#inicio',

        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            //     firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            //   firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: 'terminos.html',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
            window.location.assign('terminos.html');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

}



function desconectar() {

    firebase.auth().signOut().then(function() {
        alertify.success("desconectado");

        $.mobile.changePage("#login", {
            transition: "slide",
            reverse: true
        });
    }).catch(function(error) {
        alertify.error("ha habido un error" + error);
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var name = user.displayName;

        /* If the provider gives a display name, use the name for the
        personal welcome message. Otherwise, use the user's email. */
        var welcomeName = name ? name : user.email;

        userIdToken = user.getIdToken();


    }
});


var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
var fechayhora;
var fecha;
var fechareves;
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
    fecha = day + "/" + month + "/" + year;
    fechareves = year + "-" + month + "-" + day;

    $('#fecha').val(fechareves);
    //$("#fecha").append(fecha);



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
$(function() {

    $('#fecha').val(fecha);
    $("#pinchar").click(function() {


        var email = firebase.auth().currentUser.email;
        alta(email);

    });

});



function verhistorico() {
    var email = firebase.auth().currentUser.email;
    cargaresultado(email);
    $.mobile.changePage("#resultados", {
        transition: "slide",
        reverse: true
    })

}


function alta(email) {
    var cantidad = $('#cantidad').val();
    var fecha = $('#fecha').val();
    var peso = $('#peso').val();
    var glucosa = $('#glucosa').val();
    var presion = $('#presion').val();
    var hba = $('#hba').val();
    var otro = $('#otro').val();


    db.collection("saxenda").add({
            email: email,
            cantidad: cantidad,
            peso: peso,
            fechareal: fechayhora,
            fecha: fecha,
            glucosa: glucosa,
            hba: hba,
            presion: presion,
            otros: otros

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



function cargaresultado(email) {
    $("#tbodyresultado").empty();

    let res = "";

    db.collection("saxenda").where("email", "==", email).get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {


                res = doc.data();

                $("#tbodyresultado").append("<tr id='trdentro'><td >" + res.fecha + "<td>" + res.cantidad + "</td><>" + res.peso + "</td><td>" + res.glucosa + "</td><>" + res.presion + "</td><td>" + "</td><>" + res.hba + "</td><td>" + "</td><>" + res.otros + "</td><td></tr>");

                $("#tbodyresultado").trigger("create");
                $("#tablaresultados").table("refresh");

            });

            $("#tbodyresultado").trigger("create");
        });

}

//CARGA DE DATOS DE JSON
/*
const collectionKey = "aforo";
if (data && (typeof data === "object")) {
var coleccion = db.collection(collectionKey);
for(var elemento in data[0]){
coleccion.doc(elemento).set(data[0][elemento]);

}   
*/