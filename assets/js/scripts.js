// Conteúdo inicial de exemplo
const initialContent = `# Bem-vindo ao Editor Markdown!

Este é um exemplo de documento Markdown com várias funcionalidades.

## Formatação de Texto

Você pode usar **negrito** e *itálico* facilmente.

## Listas

Lista de tarefas:
- [x] Criar editor Markdown
- [ ] Adicionar mais funcionalidades
- [ ] Testar em diferentes navegadores

## Blocos de Código

Exemplo de código JavaScript:

\`\`\`javascript
// Função de saudação
function saudacao(nome) {
    return \`Olá, \${nome}!\`;
}

console.log(saudacao('Mundo'));
\`\`\`

Exemplo de código HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Exemplo</title>
</head>
<body>
    <h1>Olá Mundo!</h1>
</body>
</html>
\`\`\`

## Imagens e Links

Aqui está uma imagem:

![Logo Markdown](https://markdown-here.com/img/icon256.png)

E um link para o [site oficial do Markdown](https://daringfireball.net/projects/markdown/).

## Citações

> "Qualquer tecnologia suficientemente avançada é indistinguível de magia." 
> - Arthur C. Clarke

## Tabelas

| Linguagem | Popularidade | Dificuldade |
|-----------|--------------|-------------|
| JavaScript | Alta         | Média       |
| Python    | Alta         | Baixa       |
| C++       | Média        | Alta        |
`;

// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const editor = document.getElementById('markdown-editor');
    const previewContent = document.getElementById('preview-content');
    const themeSelector = document.getElementById('theme-selector');
    const prismTheme = document.getElementById('prism-theme');
    
    // Botões de formatação
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const listBtn = document.getElementById('list-btn');
    const codeBtn = document.getElementById('code-btn');
    const imageBtn = document.getElementById('image-btn');
    const linkBtn = document.getElementById('link-btn');
    const saveBtn = document.getElementById('save-btn');
    const printBtn = document.getElementById('print-btn');
    
    // Configurar o editor com conteúdo inicial
    editor.value = initialContent;
    updatePreview();
    
    // Configurar o marked.js
    marked.setOptions({
        breaks: true,
        highlight: function(code, lang) {
            if (Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
            } else {
                return code;
            }
        }
    });
    
    // Atualizar o preview quando o conteúdo mudar
    editor.addEventListener('input', updatePreview);
    
    // Função para atualizar o preview
    function updatePreview() {
        const markdownText = editor.value;
        const htmlContent = marked.parse(markdownText);
        previewContent.innerHTML = htmlContent;
        
        // Disparar o realce de sintaxe do Prism.js
        Prism.highlightAll();
    }
    
    // Trocar tema do Prism.js
    themeSelector.addEventListener('change', function() {
        const theme = this.value;
        prismTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${theme}`;
    });
    
    // Funções para inserir texto no cursor
    function insertTextAtCursor(text) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        
        editor.value = editor.value.substring(0, start) + 
                       text + 
                       editor.value.substring(end);
        
        // Reposicionar o cursor
        const newCursorPos = start + text.length;
        editor.selectionStart = newCursorPos;
        editor.selectionEnd = newCursorPos;
        editor.focus();
    }
    
    function wrapSelectionWith(prefix, suffix, placeholder = 'texto') {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        const textToInsert = selectedText || placeholder;
        
        editor.value = editor.value.substring(0, start) + 
                       prefix + textToInsert + suffix + 
                       editor.value.substring(end);
        
        // Reposicionar o cursor
        if (selectedText) {
            editor.selectionStart = start + prefix.length + selectedText.length + suffix.length;
            editor.selectionEnd = editor.selectionStart;
        } else {
            const cursorPos = start + prefix.length + placeholder.length;
            editor.selectionStart = cursorPos;
            editor.selectionEnd = cursorPos;
        }
        
        editor.focus();
        updatePreview();
    }
    
    // Eventos dos botões de formatação
    boldBtn.addEventListener('click', () => wrapSelectionWith('**', '**', 'texto em negrito'));
    italicBtn.addEventListener('click', () => wrapSelectionWith('*', '*', 'texto em itálico'));
    
    listBtn.addEventListener('click', () => {
        insertTextAtCursor('- Item da lista\n');
        updatePreview();
    });
    
    codeBtn.addEventListener('click', () => {
        const lang = prompt('Digite a linguagem (ex: js, html, css):', 'javascript');
        if (lang !== null) {
            wrapSelectionWith(`\`\`\`${lang}\n`, '\n```', '// seu código aqui');
        }
    });
    
    imageBtn.addEventListener('click', () => {
        const url = prompt('URL da imagem:');
        if (url === null) return;
        
        const altText = prompt('Texto alternativo (alt):', 'Descrição da imagem');
        if (altText === null) return;
        
        insertTextAtCursor(`![${altText}](${url})`);
    });
    
    linkBtn.addEventListener('click', () => {
        const url = prompt('URL do link:');
        if (url === null) return;
        
        const text = prompt('Texto do link:', 'Texto do link');
        if (text === null) return;
        
        insertTextAtCursor(`[${text}](${url})`);
    });
    
    // Salvar como HTML
    saveBtn.addEventListener('click', () => {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Documento Markdown Exportado</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    pre {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        overflow: auto;
                    }
                    code {
                        font-family: 'Fira Code', 'Consolas', monospace;
                    }
                    img {
                        max-width: 100%;
                    }
                    blockquote {
                        border-left: 4px solid #6c5ce7;
                        padding-left: 15px;
                        color: #495057;
                        margin: 15px 0;
                    }
                </style>
                <link id="prism-theme" href="${prismTheme.href}" rel="stylesheet">
            </head>
            <body>
                <div id="content">${marked.parse(editor.value)}</div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"><\/script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"><\/script>
            </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento-markdown.html';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    });
    
    // Imprimir o preview
    printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Impressão de Documento Markdown</title>
                <meta charset="UTF-8">
                <link id="prism-theme" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #000;
                        background-color: #fff;
                        padding: 30px;
                    }
                    pre {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        overflow: auto;
                        page-break-inside: avoid;
                    }
                    code {
                        font-family: 'Fira Code', 'Consolas', monospace;
                    }
                    img {
                        max-width: 100%;
                        page-break-inside: avoid;
                    }
                    blockquote {
                        border-left: 4px solid #6c5ce7;
                        padding-left: 15px;
                        margin: 15px 0;
                        page-break-inside: avoid;
                    }
                    h1, h2, h3, h4 {
                        page-break-after: avoid;
                    }
                </style>
            </head>
            <body>
                ${previewContent.innerHTML}
                <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"><\/script>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });
    
    // Inicializar Prism.js
    Prism.highlightAll();
});