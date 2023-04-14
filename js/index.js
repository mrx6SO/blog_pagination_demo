// Exibe as postagens ao carregar a página
window.onload = displayPosts;

// Define o número de postagens por página
const POSTS_PER_PAGE = 5;

// Variável para manter o número da página atual
let currentPage = 1;

// Função para adicionar uma nova postagem ao blog
function addPost(title, content) {
  // Cria um objeto com as informações da nova postagem
  const post = {
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
  let postHTML = "";
  for (let i = firstPostIndex; i <= lastPostIndex && i < posts.length; i++) {
    const post = posts[i];
    postHTML += `<article>
      <h2>${post.title}</h2>
      <p>${post.content}</p>
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
