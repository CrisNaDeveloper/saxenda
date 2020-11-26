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

    alert("otramanera");
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

function logarse(provider) {



    firebase.auth().useDeviceLanguage();

    if (provider == "google") {
        provider = new firebase.auth.GoogleAuthProvider();


    }
    if (provider == "facebook") {
        provider = new firebase.auth.FacebookAuthProvider();
    }

    if (provider == "email") {
        provider = new firebase.auth.EmailAuthProvider();
    }
    // Step 1.
    // User tries to sign in to Google.
    firebase.auth().signInWithPopup(provider).catch(function(error) {
        // An error happened.
        if (error.code === 'auth/account-exists-with-different-credential') {
            // Step 2.
            // User's email already exists.
            // The pending Google credential.
            var pendingCred = error.credential;
            // The provider account's email address.
            var email = error.email;
            // Get sign-in methods for this email.
            firebase.auth().fetchSignInMethodsForEmail(email).then(function(methods) {
                // Step 3.
                // If the user has several sign-in methods,
                // the first method in the list will be the "recommended" method to use.
                if (methods[0] === 'password') {
                    // Asks the user their password.
                    // In real scenario, you should handle this asynchronously.
                    var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
                    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                        // Step 4a.
                        return user.linkWithCredential(pendingCred);
                    }).then(function() {
                        // Google account successfully linked to the existing Firebase user.
                        goToApp();
                    });
                    return;
                }
                // All the other cases are external providers.
                // Construct provider object for that provider.
                // TODO: implement getProviderForProviderId.
                var provider = getProviderForProviderId(methods[0]);
                // At this point, you should let the user know that they already has an account
                // but with a different provider, and let them validate the fact they want to
                // sign in with this provider.
                // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                // so in real scenario you should ask the user to click on a "continue" button
                // that will trigger the signInWithPopup.
                firebase.auth().signInWithPopup(provider).then(function(result) {
                    // Remember that the user may have signed in with an account that has a different email
                    // address than the first one. This can happen as Firebase doesn't control the provider's
                    // sign in flow and the user is free to login using whichever account they own.
                    // Step 4b.
                    // Link to Google credential.
                    // As we have access to the pending credential, we can directly call the link method.
                    result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
                        // Google account successfully linked to the existing Firebase user.
                        goToApp();
                    });
                });
            });
        }
    });

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