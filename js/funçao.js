document.addEventListener('DOMContentLoaded', function() {
    mostrarOcultarOpcoes();
    const botao = document.getElementById('submitBtn');
    botao.addEventListener('click', function() {
        this.style.backgroundColor = 'gray'; // Nova cor após o clique
        this.style.cursor = 'pointer'; // Cursor padrão

        // Voltar à cor padrão após 1 segundo (1000 milissegundos)
        setTimeout(() => {
            this.style.backgroundColor = '#008CBA'; // Cor padrão
        }, 3000);
    });
});

function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarNomeItem(nome) {
    return nome
        .split(/(?=[A-Z])/)
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}

function calcularValor(tipoConstrucao, metros, itensSelecionados) {
    const precos = {
        casa: {
            estrutural: 15,
            eletrico: 6,
            hidrossanitario: 5,
            arCondicionado: 4,
            cabeamento: 3,
        },
        predio: {
            estrutural: 17,
            eletrico: 6,
            hidrossanitario: 5,
            arCondicionado: 4,
            cabeamento: 2.5,
            spda: 2,
            gas: 2.5,
            incendio: 4.5
        },
        comercio: {
            estrutural: 30,
            eletrico: 18,
            hidrossanitario: 13,
            arCondicionado: 12,
            cabeamento: 10,
            spda: 9,
            gas: 7,
            incendio: 13
        }
    };

    let valorTotal = 0;
    const valoresIndividuais = [];

    for (const item of itensSelecionados) {
        const valorItem = precos[tipoConstrucao][item] * metros;
        valorTotal += valorItem;
        valoresIndividuais.push({ item, valor: valorItem });
    }

    return { valorTotal, valoresIndividuais };
}

function obterValoresFormulario() {
    // Limpar mensagens de erro anteriores e remover o botão do WhatsApp, caso exista
    limparMensagensErro();
    removerBotaoWhatsApp();

    const tipoConstrucao = document.getElementById("tipoConstrucao").value;
    const metros = parseFloat(document.getElementById("metros").value);
    const itensSelecionados = Array.from(document.querySelectorAll('input[name="item"]:checked')).map(el => el.value);

    let formularioValido = true;

    // Validação: Tipo de construção deve ser selecionado
    if (!tipoConstrucao) {
        mostrarMensagemErro("tipoConstrucao", "Por favor, selecione o tipo de construção.");
        formularioValido = false;
    }

    // Validação: Pelo menos um item deve ser selecionado
    if (itensSelecionados.length === 0) {
        mostrarMensagemErro("opcoesItens", "Por favor, selecione ao menos uma opção.");
        formularioValido = false;
    }

    // Validação: O campo "metros" deve ser preenchido
    if (isNaN(metros) || metros <= 0) {
        mostrarMensagemErro("metros", "Por favor, insira um valor válido para os metros quadrados.");
        formularioValido = false;
    }

    // Se o formulário não for válido, interrompe a execução
    if (!formularioValido) {
        return;
    }

    // Cálculo do orçamento
    const { valorTotal, valoresIndividuais } = calcularValor(tipoConstrucao, metros, itensSelecionados);
    let resultadoHTML = '';

    if (valorTotal < 1200) {
        resultadoHTML = `
            <div class="alerta">
                <p>O valor mínimo do projeto não pode ser menor que <span class="valor-minimo">R$ 1.200,00</span>.</p>
            </div>`;
    } else {
        resultadoHTML = `
            <div class="quadro-resultado">
                <h3>Orçamento Detalhado</h3>
                <table>
                    <tr>
                        <th>Item</th>
                        <th>Valor</th>
                    </tr>`;
        for (const item of valoresIndividuais) {
            resultadoHTML += `
                    <tr>
                        <td>${formatarNomeItem(item.item)}</td>
                        <td>${formatarValor(item.valor)}</td>
                    </tr>`;
        }
        resultadoHTML += `
                    <tr>
                        <th>Total</th>
                        <th>${formatarValor(valorTotal)}</th>
                    </tr>
                </table>
            </div>`;
    }

    document.getElementById("resultado").innerHTML = resultadoHTML;

    // Adicionar botão de WhatsApp
    adicionarBotaoWhatsApp(tipoConstrucao, metros, itensSelecionados, valorTotal);
}

// Função para exibir mensagens de erro abaixo do campo correspondente
function mostrarMensagemErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    const mensagemErro = document.createElement("div");
    mensagemErro.className = "mensagem-erro";
    mensagemErro.textContent = mensagem;

    // Adiciona a mensagem de erro após o campo correspondente
    campo.parentNode.appendChild(mensagemErro);
}

// Função para limpar todas as mensagens de erro
function limparMensagensErro() {
    const mensagensErro = document.querySelectorAll(".mensagem-erro");
    mensagensErro.forEach(mensagem => mensagem.remove());
}

// Função para adicionar o botão de WhatsApp
function adicionarBotaoWhatsApp(tipoConstrucao, metros, itensSelecionados, valorTotal) {
    const botaoWhatsApp = document.createElement("button");
    botaoWhatsApp.id = "botaoWhatsApp";
    botaoWhatsApp.textContent = "Fale conosco no WhatsApp";
    botaoWhatsApp.style.marginTop = "20px";
    botaoWhatsApp.style.padding = "10px";
    botaoWhatsApp.style.backgroundColor = "#25D366";
    botaoWhatsApp.style.color = "#fff";
    botaoWhatsApp.style.border = "none";
    botaoWhatsApp.style.borderRadius = "5px";
    botaoWhatsApp.style.cursor = "pointer";

    // Centralização do botão
    botaoWhatsApp.style.display = "block";
    botaoWhatsApp.style.marginLeft = "auto";
    botaoWhatsApp.style.marginRight = "auto";

    // Gerar link com os detalhes do orçamento para o WhatsApp
    const numeroTelefone = "5531123456789"; // Substitua pelo número da empresa no formato internacional
    const mensagemWhatsApp =
        `Olá! Gostaria de saber mais sobre meu orçamento:\n` +
        `- Tipo de Construção: ${formatarNomeItem(tipoConstrucao)}\n` +
        `- Metros Quadrados: ${metros}\n` +
        `- Itens Selecionados: ${itensSelecionados.map(formatarNomeItem).join(", ")}\n` +
        `- Valor Total Estimado: ${formatarValor(valorTotal)}`;
    
    const linkWhatsApp = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagemWhatsApp)}`;

    // Redirecionar para o WhatsApp ao clicar no botão
    botaoWhatsApp.addEventListener("click", () => {
        window.open(linkWhatsApp, "_blank");
    });

    // Adicionar o botão ao DOM abaixo do resultado
    document.getElementById("resultado").appendChild(botaoWhatsApp);
}

// Função para remover o botão de WhatsApp (se já existir)
function removerBotaoWhatsApp() {
    const botaoExistente = document.getElementById("botaoWhatsApp");
    if (botaoExistente) {
        botaoExistente.remove();
    }
}

function mostrarOcultarOpcoes() {
    const tipoConstrucao = document.getElementById('tipoConstrucao').value;
    const opcaoSPDA = document.getElementById('opcaoSPDA');
    const opcaoGas = document.getElementById('opcaoGas');
    const opcaoIncendio = document.getElementById('opcaoIncendio');
    
    if (tipoConstrucao === 'casa') {
        opcaoSPDA.style.display = 'none';
        opcaoSPDA.querySelector('input').checked = false;
        opcaoGas.style.display = 'none';
        opcaoGas.querySelector('input').checked = false;
        opcaoIncendio.style.display = 'none';
        opcaoIncendio.querySelector('input').checked = false;
    } else {
        opcaoSPDA.style.display = 'block';
        opcaoGas.style.display = 'block';
        opcaoIncendio.style.display = 'block';
    }
}