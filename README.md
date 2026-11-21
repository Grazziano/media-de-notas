# Média de Notas

Aplicação web para calcular médias escolares de forma simples e rápida. É possível adicionar avaliações, informar notas e pesos, escolher o método de cálculo e descobrir quanto é necessário tirar na próxima avaliação para atingir a média desejada.

## Funcionalidades

- **Cadastro dinâmico de avaliações:** adicione ou remova avaliações e personalize seus nomes.
- **Quatro métodos de cálculo:**
  - Média aritmética simples;
  - Média aritmética ponderada;
  - Média geométrica;
  - Média harmônica.
- **Média mínima configurável:** defina a nota necessária para atingir seu objetivo.
- **Simulação da próxima avaliação:** veja a nota necessária para alcançar a média mínima, considerando também o peso da próxima avaliação no cálculo ponderado.
- **Resultado em tempo real:** os cálculos são atualizados conforme os dados são preenchidos.
- **Validação dos dados:** notas devem estar entre 0 e 10; pesos devem ser maiores que zero quando o cálculo ponderado estiver selecionado.
- **Suporte a decimal com vírgula ou ponto** nos campos numéricos.

## Tecnologias

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [ESLint](https://eslint.org/)

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/)
- npm (incluído na instalação do Node.js)

## Como executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/Grazziano/media-de-notas.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd media-de-notas
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse no navegador o endereço local exibido pelo Vite no terminal (normalmente `http://localhost:5173`).

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Executa a verificação de tipos do TypeScript e gera a versão de produção em `dist/`. |
| `npm run lint` | Executa o ESLint para analisar o código. |
| `npm run preview` | Disponibiliza localmente a versão de produção para pré-visualização. |

## Métodos de cálculo

### Média aritmética simples

Soma todas as notas informadas e divide pela quantidade de avaliações:

`média = (nota₁ + nota₂ + ... + notaₙ) / n`

### Média aritmética ponderada

Multiplica cada nota pelo respectivo peso, soma os resultados e divide pela soma dos pesos:

`média = Σ(nota × peso) / Σ(pesos)`

### Média geométrica

Calcula a raiz de índice igual à quantidade de notas do produto das notas:

`média = ⁿ√(nota₁ × nota₂ × ... × notaₙ)`

Esse método exige notas maiores que zero.

### Média harmônica

Divide a quantidade de notas pela soma dos inversos dessas notas:

`média = n / Σ(1 / nota)`

Esse método também exige notas maiores que zero.

## Cálculo da próxima nota

A aplicação estima a nota necessária na próxima avaliação para alcançar a média mínima definida. No método ponderado, o cálculo considera o peso informado para essa próxima avaliação.

Se a nota necessária for maior que 10, a aplicação informa que a média mínima não poderá ser alcançada apenas com a próxima avaliação, respeitando o limite de notas de 0 a 10.

## Estrutura do projeto

```text
media-de-notas/
├── public/              # Arquivos públicos
├── src/
│   ├── App.tsx          # Interface e lógica de cálculo
│   ├── App.css          # Estilos da aplicação
│   ├── index.css        # Estilos globais
│   └── main.tsx         # Ponto de entrada da aplicação
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Build de produção

Para gerar os arquivos otimizados para publicação:

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`. Para conferir a build localmente:

```bash
npm run preview
```

## Contribuição

Contribuições são bem-vindas!

1. Faça um fork do projeto.
2. Crie uma branch para sua alteração: `git checkout -b minha-melhoria`.
3. Faça as alterações e crie um commit: `git commit -m "Adiciona minha melhoria"`.
4. Envie a branch: `git push origin minha-melhoria`.
5. Abra um Pull Request.

## Licença

Nenhuma licença foi identificada no repositório. Consulte o responsável pelo projeto antes de reutilizar ou distribuir o código.
