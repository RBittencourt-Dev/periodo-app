# Notificador de Períodos 🔔

Um aplicativo web desenvolvido com Next.js que toca notificações de áudio em horários específicos do dia, ideal para escolas, academias e outras instituições que funcionam com períodos determinados.

## Recursos

✅ **Gerenciamento de Períodos** - Crie, edite ou delete períodos
✅ **Notificações de Áudio** - Toque automático ao mudar de período  
✅ **Controle de Volume** - Ajuste o volume das notificações
✅ **Ativar/Desativar** - Ligue ou desligue as notificações quando desejar
✅ **Armazenamento Local** - Suas configurações são salvas automaticamente
✅ **Interface Responsiva** - Funciona em desktop e dispositivos móveis

## Instalação

### Pré-requisitos
- Node.js 18.0 ou superior
- npm ou yarn

### Passos

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Como Usar

### 1. Visualizar o Estado Atual
Na aba "Início", você vê:
- Horário atual
- Período ativo no momento (se houver)
- Controles de volume
- Botão para ativar/desativar notificações

### 2. Configurar Períodos
Na aba "Períodos":
- Clique em "Novo Período" para adicionar um novo período
- Preencha o nome, horário de início e fim
- Clique em "Adicionar Período"

Para editar ou deletar um período:
- Clique em "Editar" para fazer alterações
- Clique no ícone de lixeira para remover

### 3. Exemplo de Configuração
A aplicação vem com períodos pré-configurados como exemplo:
- **08:00 - 09:30** - Período 1
- **09:30 - 11:00** - Período 2
- **11:00 - 11:20** - Intervalo
- **11:20 - 13:00** - Período 3

Você pode editar esses períodos conforme suas necessidades.

## Funcionalidades

### Notificações de Áudio
- A aplicação verifica a hora a cada segundo
- Quando há uma mudança de período, um som é tocado automaticamente
- O volume pode ser ajustado de 0% a 100%
- As notificações podem ser desativadas completamente

### Armazenamento de Dados
- Todas as configurações são salvas em localStorage
- Seus períodos persist entre as sessões
- As configurações não são sincronizadas entre dispositivos

### Horários Noturnos
Se um período atravessar a meia-noite (ex: 23:00 - 01:00), o sistema funciona corretamente!

## Estrutura do Projeto

```
src/
├── app/              # App Router
│   ├── page.tsx      # Página principal
│   └── layout.tsx    # Layout raiz
├── components/       # Componentes React
│   ├── PeriodManager.tsx    # Gerenciador principal
│   ├── PeriodDisplay.tsx    # Exibição de período
│   └── PeriodList.tsx       # Lista de períodos
├── hooks/            # Custom hooks
│   └── usePeriodNotification.ts  # Hook principal
├── lib/              # Utilitários
│   └── audioUtils.ts         # Funções de áudio
└── types/            # Tipos TypeScript
    └── period.ts     # Tipos da aplicação
```

## Tecnologias Utilizadas

- **Next.js 15+** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Web Audio API** - Reprodução de som

## Desenvolvimento

### Comandos Disponíveis

```bash
# Inicia servidor de desenvolvimento
npm run dev

# Compila para produção
npm run build

# Inicia servidor de produção
npm start

# Executa linter
npm run lint
```

## Licença

Este projeto é de código aberto e disponível para uso pessoal e educacional.

## Sugestões de Melhoria

Algumas ideias para expandir o projeto:
- Integrar som customizado (upload de arquivo)
- Modo escuro/claro
- Múltiplos horários (segunda a sexta, sabado, etc)
- Exportar/importar configurações
- Integração com API externa
- Notificações do navegador além de áudio

---

Desenvolvido com ❤️
