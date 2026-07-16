document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // Captura os valores dos inputs
    const inputs = event.target.querySelectorAll('input');
    const identifier = inputs[0].value; // Agora o front-end envia como 'identifier'
    const password = inputs[1].value; 

    try {
        // 1. Faz o login na API NestJS
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }) // Corrigido para 'identifier'
        });

        if (!response.ok) {
            throw new Error('Usuário ou senha incorretos.'); 
        }

        // 2. Converte a resposta em JSON para acessar o access_token
        const result = await response.json();
        
        // 3. Armazena o Token JWT no localStorage
        localStorage.setItem('grisha_token', result.access_token);
        
        // 4. Define as preferências de música
        localStorage.setItem('musicPlaying', 'true'); 
        localStorage.setItem('musicTime', '0'); 
        
        // 5. Feedback e redirecionamento
        alert('Bem-vindo de volta, Grisha!'); 
        window.location.href = 'index.html'; 

    } catch (error) {
        alert(error.message); 
    }
});