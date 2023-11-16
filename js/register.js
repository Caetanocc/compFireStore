// Função para cadastrar um novo usuário
function registerUser() {
    var displayName = document.getElementById('displayName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var idPerfil = document.getElementById('idPerfil').value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Usuário cadastrado com sucesso
        var user = userCredential.user;
  
        // Atualizar o nome do usuário
        user.updateProfile({
          displayName: displayName
        }).then(() => {
          // Salvar dados adicionais na Realtime Database
          saveUserData(user.uid, displayName, parseInt(idPerfil, 10));
  
          // Redirecionar para a página principal ou realizar outras ações necessárias
          window.location.href = 'index.html';
        }).catch((error) => {
          console.error('Erro ao atualizar nome do usuário:', error);
        });
      })
      .catch((error) => {
        console.error('Erro ao cadastrar usuário:', error);
      });
  }
  
  // Função para salvar dados adicionais na Realtime Database
  function saveUserData(userId, displayName, idPerfil) {
    var usersRef = firebase.database().ref('users/' + userId);
    usersRef.set({
      name: displayName,
      id_perfil: idPerfil
    }).then(() => {
      console.log('Dados do usuário salvos com sucesso.');
    }).catch((error) => {
      console.error('Erro ao salvar dados do usuário:', error);
    });
  }
  
  