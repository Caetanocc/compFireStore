
// Função para enviar arquivo para o Firebase Storage
function uploadFile() {
  var fileInput = document.getElementById('fileInput');

  let categoria = document.getElementsByName('categoria');

  categoria = 'cinema'

  console.log(categoria)

  var file = fileInput.files[0];

  if (file) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var storageRef = storage.ref('users/'+ categoria + '/' + user.uid + '/files/' + file.name);
        var task = storageRef.put(file);

        task.then(snapshot => {
          console.log('Arquivo enviado com sucesso!');
          fileInput.value = ''; // Limpar o input de arquivo
          updateFileCount(user.uid, +1) // atualizar qtde de arquivos.

          
          displayFiles(); // Atualizar a lista de arquivos
        }).catch(error => {
          console.error('Erro no envio do arquivo:', error);
        });
      } else {
        console.error('Usuário não autenticado.');
      }
    });
  } else {
    console.error('Nenhum arquivo selecionado.');
  }
}

// Função para atualizar o total de arquivos na Realtime Database
function updateFileCount(userId, operacao) {
  var userTotalsRef = firebase.database().ref('userTotals/' + userId);

  // Recupera o valor atual do total de arquivos
  userTotalsRef.once('value').then(snapshot => {
    var currentCount = snapshot.val() || 0;

    // Incrementa o total de arquivos
    var newCount = currentCount + operacao;

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


// Função para recuperar arquivos do Firebase Storage
function displayFiles1() {
  var fileList = document.getElementById('fileList');
  fileList.innerHTML = ''; // Limpar a lista de arquivos

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var filesRef = storage.ref('users/' + user.uid + '/files');
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

              // Adicione o nome do arquivo abaixo da miniatura ou link
              var fileNameElement = document.createElement('p');
              fileNameElement.textContent = metadata.name;
              fileContainer.appendChild(fileNameElement);

              fileList.appendChild(fileContainer);
            });
          }).catch(error => {
            console.error('Erro ao recuperar metadados:', error);
          });
        });
      }).catch(error => {
        console.error('Erro ao recuperar arquivos:', error);
      });
    } else {
      console.error('Usuário não autenticado.');
    }
  });
}


// Função para recuperar arquivos do Firebase Storage
function displayFiles() {
  var fileList = document.getElementById('fileList');

  fileList.innerHTML = ''; // Limpar a lista de arquivos

  categ = ['games', 'cinema', 'musica']

  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      categ.forEach(item => {
        displayFiles1User(user, item)
      })
      
      
    } else {
      console.error('Usuário não autenticado.');
    }
  });
}


function displayFiles1User(user, categoria){
  var filesRef = storage.ref('users/' +categoria +'/' + user.uid + '/files');
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
          removeButton.textContent = 'Remover';
          removeButton.addEventListener('click', function() {
            removeFile(user.uid, item.name);
          });
          fileContainer.appendChild(removeButton);

          // Adicione o nome do arquivo abaixo da miniatura ou link
          var fileNameElement = document.createElement('p');
          fileNameElement.textContent = metadata.name;
          fileContainer.appendChild(fileNameElement);

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
function removeFile(userId, fileName) {
  var fileRef = storage.ref('users/' + userId + '/files/' + fileName);

  fileRef.delete().then(() => {
    updateFileCount(userId, -1) // atualizar qtde de arquivos.

    console.log('Arquivo removido com sucesso.');
    displayFiles(); // Atualizar a exibição após a remoção
  }).catch(error => {
    console.error('Erro ao remover arquivo:', error);
  });
}

// Chamar a função de exibição ao carregar a página
document.addEventListener('DOMContentLoaded', displayFiles);

