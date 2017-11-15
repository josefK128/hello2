// app.ts for hello2

console.log(`hello2:app running...`);
console.log(`blockstack is ${blockstack}`);


// following two methods in src/auth/README.md are undefined !!!
//console.log(`blockstack.requestSignIn is ${blockstack.requestSignIn}`);
//console.log(`blockstack.signUserIn is ${blockstack.signUserIn}`);


// the following four methods in src/auth/README.md are defined
//console.log(`blockstack.makeAuthRequest is ${blockstack.makeAuthRequest}`);
//console.log(`blockstack.verifyAuthRequest is ${blockstack.verifyAuthRequest}`);
//console.log(`blockstack.makeECPrivateKey is ${blockstack.makeECPrivateKey}`);
//console.log(`blockstack.verifyAuthResponse is ${blockstack.verifyAuthResponse}`);


// the following five methods are used in hello/hello2 app are all defined
//console.log(`blockstack.redirectToSignIn is ${blockstack.redirectToSignIn}`);
//console.log(`blockstack.isUserSignedIn is ${blockstack.isUserSignedIn}`);
//console.log(`blockstack.loadUserData is ${blockstack.loadUserData}`);
//console.log(`blockstack.isSignInPending is ${blockstack.isSignInPending}`);
//console.log(`blockstack.handlePendingSignIn is ${blockstack.handlePendingSignIn}`);


document.addEventListener("DOMContentLoaded", function(event) {
  console.log(`DOM loaded...`);

  // sign-in
  document.getElementById('signin-button').addEventListener('click', function(event) {
    event.preventDefault();
    
    // divergence from hello
    //blockstack.redirectToSignIn(); // original
    // new:
    //const authRequest = blockstack.makeAuthRequest(null, window.location.origin);
    const privateKey = blockstack.makeECPrivateKey();
    const authRequest = blockstack.makeAuthRequest(privateKey, window.location.origin);
    console.log(`authRequest = ${authRequest}`);
    blockstack.verifyAuthRequest(authRequest);
    blockstack.redirectToSignIn(authRequest);
    const profile = {'name':'Mark Rudolph'};
    showProfile(profile);

    const username = 'josefK128';
    const authResponse = blockstack.makeAuthResponse(privateKey, profile, username);
    console.log(`authResponse = ${authResponse}`);

//    const verified = blockstack.verifyAuthResponse(authResponse)
//      .then((verified) => {
//        console.log(`authResponse verified = ${verified}`);
//      });
  })

  // sign-out
  document.getElementById('signout-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.signUserOut(window.location.href)
  })

  // showProfile
  function showProfile(profile) {
    console.log(`showProfile profile = ${profile}`);

    var person = new blockstack.Person(profile)
    console.log(`person = ${person}`); 
    document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
    console.log(`person.avatarUrl() = ${person.avatarUrl()}`); 
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    }
    //document.getElementById('section-1').style.display = 'none'
    //document.getElementById('section-2').style.display = 'block'
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile
      showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      console.log(`userData = ${userData}`);
      //window.location = window.location.origin
    })
  }
})


// console output
// hello2:app running...
// app.ts:4 blockstack is [object Object]
// app.ts:9 DOM loaded...
// blockstack.js:327 blockstack.js: generating v1.1.0 auth request
// blockstack.js:42517 openUriWithTimeoutHack
// blockstack.js:95 protocol handler detected
