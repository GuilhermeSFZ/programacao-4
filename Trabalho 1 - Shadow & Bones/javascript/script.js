function toggleLivro(id) {
    const todos = document.querySelectorAll('.livro-conteudo');

    todos.forEach(el => {
        if (el.id !== 'livro-' + id) {
            el.classList.remove('ativo');
        }
    });

    const atual = document.getElementById('livro-' + id);
    atual.classList.toggle('ativo');
}


function invocarAmplificador(arquivo, corLuz, tipo, corExplosao) {
            const container = document.getElementById('espaco-magico');
            container.innerHTML = '';

            // 1. Criar Luz de Fundo (A explosão branca/colorida atrás)
            const luz = document.createElement('div');
            luz.className = 'luz-fundo';
            luz.style.background = `radial-gradient(circle, white 0%, ${corExplosao} 30%, rgba(255,255,255,0) 70%)`;
            luz.style.animation = "explosaoLuz 6s ease-out forwards";
            
            // 2. Criar o Animal
            const bicho = document.createElement('div');
            bicho.className = 'bicho-espiritual';
            
            if (tipo === 'detalhe') {
                // Cervo: Mantém linhas pretas e tinge de ouro
                bicho.style.backgroundImage = `url('${arquivo}')`;
                bicho.style.filter = `sepia(1) saturate(20) hue-rotate(10deg) brightness(1.2) drop-shadow(0 0 20px ${corLuz})`;
            } 
            else if (tipo === 'solido') {
                // Cobra: Cor sólida usando máscara
                bicho.style.maskImage = `url('${arquivo}')`;
                bicho.style.maskImage = `url('${arquivo}')`;
                bicho.style.backgroundColor = corLuz;
                bicho.style.filter = `drop-shadow(0 0 25px ${corLuz})`;
            }
            else {
                // Fênix: Inversão total para visual branco brilhante
                bicho.style.backgroundImage = `url('${arquivo}')`;
                bicho.style.filter = `invert(1) brightness(1.5) drop-shadow(0 0 20px ${corLuz})`;
            }

            bicho.style.animation = "animacaoPatrono 6s ease-in-out forwards";

            container.appendChild(luz);
            container.appendChild(bicho);

            setTimeout(() => { container.innerHTML = ''; }, 6500);
        }