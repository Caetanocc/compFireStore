let fileList = document.getElementById('allFilesList');


// Função para recuperar arquivos de todos os usuários do Firebase Storage
function displayAllFiles() {
  fileList.innerHTML = ''; // Limpar a lista de arquivos

  let userTotalsRef = firebase.database().ref('userTotals');

  userTotalsRef.once('value').then(snapshot => {
    snapshot.forEach(userSnapshot => {
      var userId = userSnapshot.key;
      var totalFiles = userSnapshot.val();

      var userHeader = document.createElement('div');
      userHeader.textContent = "usuário:" + userId  + " arquivos: " + totalFiles
      fileList.appendChild(userHeader);

      displayFiles1User(userId)

      var lineHr = document.createElement('hr');
      fileList.appendChild(lineHr);


    });
  }).catch(error => {
    console.error('Erro ao recuperar totais de arquivos:', error);
  });
}

function displayFiles1User(userId){
  var filesRef = storage.ref('users/' + userId + '/files');
  filesRef.listAll().then(result => {
    result.items.forEach(item => {
      item.getDownloadURL().then(url => {
        item.getMetadata().then(metadata => {
          var fileContainer = document.createElement('div');
          fileContainer.classList.add('file-container'); // Adicionar a classe

          if ( item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg') 
            || item.name.toLowerCase().endsWith('.png') || item.name.toLowerCase().endsWith('.gif')) {
            // Se for uma imagem, exibir miniatura
            var img = document.createElement('img');
            img.src = url; // Usar a variável url diretamente
            img.alt = metadata.name; // Adicione o nome do arquivo como texto alternativo
            img.classList.add('file-image'); // Adicionar a classe
            fileContainer.appendChild(img);
          } else {
            // Se for outro tipo de arquivo, exibir um link direto para o download
            var link = document.createElement('a');
            link.href = url; // Usar a variável url diretamente
            link.innerHTML = metadata.name; // Use metadata.name para exibir o nome do arquivo
            fileContainer.appendChild(link);
          }

          // Adicione o botão de remoção
          var removeButton = document.createElement('button');
          removeButton.textContent = 'Curtir';
          removeButton.addEventListener('click', function() {
            curtirFile(userId, metadata.uid);
          });
          fileContainer.appendChild(removeButton);
          
          var curtida = firebase.database().ref('userFiles/' + userId + '/' + metadata.uid);
          let totcurts = 0

          curtida.once('value').then(snapshot => {
            snapshot.forEach(userSnapshot => {
              totcurts = snapshot.val() || 0; })
            })



          // Adicione o nome do arquivo abaixo da miniatura ou link
          var fileNameElement = document.createElement('p');
          fileNameElement.textContent = metadata.name + ' ' + totcurts;

          console.log(totcurts)

          fileList.appendChild(fileContainer);
        });
      }).catch(error => {
        console.error('Erro ao recuperar metadados:', error);
      });
    });
  }).catch(error => {
    console.error('Erro ao recuperar arquivos:', error);
  });
}


// Função para remover um arquivo do Firebase Storage
function curtirFile(userId, fileName) {

  var userTotalsRef = firebase.database().ref('userFiles/' + userId + '/' + fileName);

  // Recupera o valor atual do total de arquivos
  userTotalsRef.once('value').then(snapshot => {
    var currentCount = snapshot.val() || 0;

    // Incrementa o total de arquivos
    var newCount = currentCount + 1;

    // Atualiza o valor na Realtime Database
    userTotalsRef.set(newCount).then(() => {
      console.log('Total de arquivos atualizado com sucesso.');
    }).catch(error => {
      console.error('Erro ao atualizar total de arquivos:', error);
    });
  }).catch(error => {
    console.error('Erro ao recuperar total de arquivos:', error);
  });
}


// Chamar a função de exibição ao carregar a página
document.addEventListener('DOMContentLoaded', displayAllFiles);
