// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const loginButton = document.getElementById("loginButton");
const loginDiv = document.getElementById("loginDiv");
const quoteForm = document.getElementById('quoteForm');
const logoutButton = document.getElementById('logoutButton');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDUXyYlOyF7oceLel6ivEf2t92SoxRZ0Qk",
    authDomain: "quotable-69f41.firebaseapp.com",
    projectId: "quotable-69f41",
    storageBucket: "quotable-69f41.firebasestorage.app",
    messagingSenderId: "459676375613",
    appId: "1:459676375613:web:f406cf1a2b54b0f34c2854"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

let curUser = null;

loginButton.addEventListener("click", async () =>{
    let username = document.getElementById("username").value;
    const userDocRef = doc(db, "users/" + username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, {createdAt: new Date()});
        document.getElementById("status").innerHTML = `User ${document.getElementById("username").value} created`;
    }

    curUser = username;
    displayQuotes();
    loginDiv.style.display = "none";
    quoteForm.style.display = 'block';
    logoutButton.style.display = 'block';
})


export default async function login(username){
    const userDocRef = doc(db, "users/" + username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, {createdAt: new Date()});

    }

    curUser = username;
    displayQuotesToConsole(curUser);


}

export  async function addQuote(username, title, artist, quote){
    try{
        await addDoc(collection(db,`users/${username}/quotes`),{
            title,
            artist,
            quote
        });
        displayQuotesToConsole(username);
    } catch (e){
        console.error(e);
    }
}


export  async function displayQuotesToConsole(){
    const snapshot = await getDocs(collection(db,`users/${curUser}/quotes`));
    snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
    });
}

async function displayQuotes(){
    let str =
        "<tr><th>Song Title</th><th>Artist</th><th>Quote</th></tr>"
    let list = document.getElementById("quoteList");
    list.style.display = "block";
    const snapshot = await getDocs(collection(db,`users/${curUser}/quotes`));
    snapshot.forEach((doc) => {
        const data = doc.data();
        str+="<tr>"
        str+=`<td>${data.title}</td>`
        str+=`<td>${data.artist}</td>`
        str+=`<td>${data.quote}</td>`
        str+="</tr></table>"
    })
    list.innerHTML = str;

}