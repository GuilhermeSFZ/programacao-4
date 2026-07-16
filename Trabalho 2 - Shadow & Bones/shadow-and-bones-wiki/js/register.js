document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('user-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-senha').value;
    const confirmPassword = document.getElementById('reg-confirma').value;

    // Validação básica de senha no front
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar conta.');
        }

        alert('Conta criada com sucesso! Solicitação de acesso aceita.');
        window.location.href = 'login.html';

    } catch (error) {
        alert(error.message);
    }
});