// login.js

function loginWithEmail() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      var user = userCredential.user;
      console.log('Usuário autenticado:', user.uid);
      window.location.replace('docs.html'); // Redirecionar para a página principal
    })
    .catch(error => {
      console.error('Erro na autenticação:', error.message);
    });
}

function loginWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Usuário logado com sucesso
      var user = result.user;

      // Verifique se o usuário já existe na Realtime Database
      var usersRef = firebase.database().ref('users/' + user.uid);
      usersRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
          // Se o usuário não existe, salve os dados na Realtime Database
          saveUserData(user.uid, user.displayName, parseInt(idPerfil, 10));
        }

        // Redirecionar para a página principal ou realizar outras ações necessárias
        window.location.href = 'docs.html';
        // window.location.replace('docs.html'); // Redirecionar para a página principal
      }).catch(error => {
        console.error('Erro ao verificar usuário na Realtime Database:', error);
      });
    })
    .catch((error) => {
      console.error('Erro ao realizar login com o Google:', error);
    });
}

