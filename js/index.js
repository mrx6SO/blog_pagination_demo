// Exibe as postagens ao carregar a página
//window.onload = displayPosts;
document.addEventListener("DOMContentLoaded", function() {
  displayPosts();
});

// Define o número de postagens por página
const POSTS_PER_PAGE = 5;

// Variável para manter o número da página atual
let currentPage = 1;

// Função para adicionar uma nova postagem ao blog
function addPost(title, content) {
  // Cria um objeto com as informações da nova postagem
  const post = {
    //id: post_id,
    title: title,
    content: content
  };

  // Adiciona o objeto ao array de postagens
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift(post);

  // Armazena o array atualizado no localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Atualiza a lista de postagens na página
  displayPosts();
}

// Função para exibir as postagens na página
function displayPosts() {
  // Obtém o elemento HTML onde as postagens serão exibidas
  const postList = document.getElementById("postList");

  // Obtém as postagens armazenadas no localStorage
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Calcula o índice da primeira e última postagem na página atual
  const firstPostIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const lastPostIndex = firstPostIndex + POSTS_PER_PAGE - 1;

  // Cria o HTML para as postagens da página atual e adiciona ao elemento na página
  // Cria o HTML para as postagens da página atual e adiciona ao elemento na página
  let postHTML = "";
  for (let i = firstPostIndex; i <= lastPostIndex && i < posts.length; i++) {
    const post = posts[i];
    postHTML += `<article>
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <button class="btn btn-primary" id="edit_post_${i}" onclick="editPost(${i}, '${post.title}', '${post.content}')">Editar</button>
      <button class="btn btn-primary" id="delete_post_${i}" onclick="deletePost(${i})">Excluir</button>
    </article>`;
}

postList.innerHTML = postHTML;


  // Cria os botões de páginação
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button onclick="goToPage(${i})">${i}</button>`;
  }

  paginationHTML += `<button id="prevButton" disabled>Anterior</button>`;
  paginationHTML += `<button id="nextButton" ${totalPages > 1 ? '' : 'disabled'}>Próxima</button>`;

  pagination.innerHTML = paginationHTML;


}

//função para limpar os campos de entrada
/*
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}
*/
const form = document.querySelector("#blogForm");
form.addEventListener("submit", function(event) {
event.preventDefault();
const title = document.getElementById("title").value;
const content = document.getElementById("content").value;
addPost(title, content);
form.reset();
});

/*document.getElementById("blogForm").addEventListener("submit", function(event) {
  event.preventDefault(); // previne o comportamento padrão do formulário de recarregar a página

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const post = {
    id: generatePostId(), // gera um novo ID de postagem automaticamente
    title: title,
    content: content
  };

  // adiciona a nova postagem ao localStorage
  addPost(post);

  // limpa os campos do formulário
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";

  // atualiza a exibição das postagens na página
  displayPosts();
});
*/
// Função para ir para uma página específica
function goToPage(pageNumber) {
currentPage = pageNumber;
displayPosts();
}

// Adiciona listeners para os botões de páginação
const prevButton = document.getElementById("prevButton");
if (prevButton) {
  prevButton.addEventListener("click", function() {
    if (currentPage > 1) {
      currentPage--;
      displayPosts();
    }
  });
}


const nextButton = document.getElementById("nextButton");
if (nextButton) {
  nextButton.addEventListener("click", function() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        displayPosts();
        }
      });
  }
 // Desabilita o botão "Página anterior" se estiver na primeira página
if (prevButton) {
  prevButton.disabled = currentPage === 1;
}

// Desabilita o botão "Próxima página" se estiver na última página
if (nextButton) {
  nextButton.disabled = currentPage === totalPages;
}

function generatePostId() {
  // Gera um número aleatório de 1 a 1000000
  const randomId = Math.floor(Math.random() * 1000000) + 1;

  // Verifica se o número já foi utilizado como ID
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const usedIds = posts.map(post => post.id);
  if (usedIds.includes(randomId)) {
    // Se o número já foi utilizado, gera um novo ID
    return generatePostId();
  } else {
    // Se o número não foi utilizado, retorna o ID
    return randomId;
  }
}

// Função para editar uma postagem existente
/*function editPost(index, title, content) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  if (index >= 0 && index < posts.length) {
    const post = posts[index];
    post.title = title;
    post.content = content;
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}*/

function editPost(index) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts[index];
  const titleElement = document.querySelector(`#edit_post_${index} , h2`);
  const contentElement = document.querySelector(`#edit_post_${index} , p`);
  
  // torna os elementos editáveis
  titleElement.contentEditable = true;
  contentElement.contentEditable = true;
  
  // adiciona classe para indicar que o post está sendo editado
  titleElement.classList.add('editing');
  contentElement.classList.add('editing');

  // adiciona evento blur para salvar as alterações
  titleElement.addEventListener('blur', function() {
    post.title = titleElement.textContent;
    savePosts();
    titleElement.classList.remove('editing');
  });

  contentElement.addEventListener('blur', function() {
    post.content = contentElement.textContent;
    savePosts();
    contentElement.classList.remove('editing');
  });
}


function savePosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Função para excluir uma postagem existente
function deletePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  if (index >= 0 && index < posts.length) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}
