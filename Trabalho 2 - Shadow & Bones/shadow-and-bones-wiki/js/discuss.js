// js/discuss.js

const apiBase = 'http://localhost:3000'; 

// Auxiliar de requisições centralizado com token JWT
async function request(path, options = {}) {
  const url = apiBase + '/' + path.replace(/^\//, '');
  
  const token = localStorage.getItem('grisha_token');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
  return res.json();
}

export async function list() {
  return request('discussions', { method: 'GET' });
}

export async function create(title, content) {
  return request('discussions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      title: title, 
      content: content,
      order: 0 
    }),
  });
}

// Envia a curtida para o backend
export async function like(id) {
  return request(`discussions/${id}/like`, { method: 'POST' });
}

// Envia o comentário para o backend
export async function addComment(id, content) {
  return request(`discussions/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
}

export function init(selector) {
  const root = document.querySelector(selector || '.forum-feed');
  if (!root) return;

  list().then((items) => {
    if (items.length === 0) {
      root.innerHTML = `<p class="discuss-subtitle">Nenhuma teoria publicada ainda. Seja o primeiro!</p>`;
      return;
    }

    root.innerHTML = items
      .map(
        (it) => {
          // Renderiza a lista de comentários caso existam no JSON
          const commentsList = it.comments && it.comments.length > 0
            ? it.comments.map(c => `
                <div class="comment-item">
                  <strong>@${escapeHtml(c.username || 'Grisha')}</strong>: 
                  <span>${escapeHtml(c.content)}</span>
                </div>
              `).join('')
            : '<p class="no-comments">Nenhum comentário ainda.</p>';

          return `
          <div class="forum-post" data-id="${it.id}">
              <div class="post-header">
                  <span class="post-author">@${escapeHtml(it.authorName || 'Grisha Anonimo')}</span>
                  <span class="post-date">Postado em ${new Date(it.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 class="post-title">${escapeHtml(it.title || '')}</h3>
              <p class="post-content">${escapeHtml(it.content || '')}</p>
              
              <div class="post-actions">
                  <!-- Botão de Curtir com ID do post -->
                  <button class="action-btn like-btn" data-id="${it.id}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                      <span>${it.likes || 0} Curtidas</span>
                  </button>
              </div>

              <!-- Seção de comentários integrada -->
              <div class="post-comments-section">
                  <h4>Comentários</h4>
                  <div class="comments-list">
                      ${commentsList}
                  </div>
                  <form class="comment-form" data-id="${it.id}">
                      <input type="text" placeholder="Escreva um comentário..." required>
                      <button type="submit">Enviar</button>
                  </form>
              </div>
          </div>`;
        }
      )
      .join('');
  }).catch((e) => {
    root.innerHTML = `<div class="error" style="color: red; text-align:center;">Erro ao carregar discussões do Grishaverse.</div>`;
    console.error(e);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}