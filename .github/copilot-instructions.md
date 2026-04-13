# Instruções de Customização - Notificador de Períodos

Este projeto é um aplicativo web Next.js que toca notificações de áudio em horários específicos do dia.

## Visão Geral Técnica

- **Stack**: Next.js 15 + TypeScript + Tailwind CSS
- **Armazenamento**: localStorage para persistência
- **Audio**: Web Audio API para tocar sons
- **Estado**: React Hooks (useState, useEffect, useRef)

## Arquitetura

### Componentes Principais

1. **PeriodManager** - Componente raiz que gerencia tabs e estado
2. **PeriodDisplay** - Mostra período atual, horário e controles
3. **PeriodList** - Lista editável de períodos

### Hooks

- **usePeriodNotification** - Hook completo que gerencia:
  - Carregamento/salvamento no localStorage
  - Monitoramento de mudanças de período
  - Toque de áudio automático
  - Funções para add/edit/delete períodos

### Utilidades

- **audioUtils.ts** - Funções para:
  - Reprodução de áudio
  - Cálculo de horários
  - Verificação de períodos ativos

## Fluxo de Dados

1. Usuário configura períodos na interface
2. Hook salva em localStorage
3. Cada segundo, sistema verifica se período mudou
4. Se mudou, toca som e atualiza UI
5. Informações persistem entre sessões

## Adições Futuras

- Upload de áudio customizado
- Sincronização em nuvem
- Notificações do navegador
- Temas claro/escuro
- Configurações por dia da semana

## Regras de Desenvolvimento

- Use componentes funcionais e hooks
- Sempre salve em localStorage após mudanças
- Verifique localStorage.getItem() antes de usar dados
- Use TypeScript para toda nova funcionalidade
