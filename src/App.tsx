import { useState, useRef, useEffect, useCallback } from 'react';

// Types
interface Message {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: Date;
  color: string;
  edited?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  messages: Message[];
}

interface Server {
  id: string;
  name: string;
  icon: string;
  color: string;
  channels: Channel[];
  members: Member[];
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  role: string;
  color: string;
  activity?: string;
}

// Текущий пользователь
const currentUser: Member = {
  id: 'user-me',
  name: 'Ты',
  avatar: '😎',
  status: 'online',
  role: 'Владелец',
  color: '#5865f2',
};

// Друзья (реальные люди, без ботов)
const friends: Member[] = [
  { id: 'f1', name: 'Дима', avatar: '🧔', status: 'online', role: 'Админ', color: '#e74c3c', activity: 'Играет в CS2' },
  { id: 'f2', name: 'Катя', avatar: '👩', status: 'online', role: 'Модератор', color: '#e91e63' },
  { id: 'f3', name: 'Макс', avatar: '🧑', status: 'idle', role: 'Друг', color: '#2ecc71', activity: 'Слушает Spotify' },
  { id: 'f4', name: 'Аня', avatar: '👧', status: 'dnd', role: 'Друг', color: '#f39c12', activity: 'Не беспокоить' },
  { id: 'f5', name: 'Влад', avatar: '👨', status: 'online', role: 'Друг', color: '#9b59b6' },
  { id: 'f6', name: 'Лера', avatar: '💁‍♀️', status: 'offline', role: 'Друг', color: '#1abc9c' },
  { id: 'f7', name: 'Саша', avatar: '🧑‍🦱', status: 'offline', role: 'Друг', color: '#e67e22' },
];

// Начальные серверы
const initialServers: Server[] = [
  {
    id: 'server-1',
    name: 'LIpoMett',
    icon: '🔥',
    color: '#5865f2',
    channels: [
      {
        id: 'ch-1',
        name: 'общий',
        type: 'text',
        messages: [
          { id: 'm1', content: 'Йоу, кто как? 🤙', author: 'Дима', avatar: '🧔', timestamp: new Date(Date.now() - 7200000), color: '#e74c3c' },
          { id: 'm2', content: 'Привет! Нормально, работаю', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 6800000), color: '#e91e63' },
          { id: 'm3', content: 'Кто сегодня в доту вечером?', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 5400000), color: '#2ecc71' },
          { id: 'm4', content: 'Я за! Часов в 8 норм?', author: 'Влад', avatar: '👨', timestamp: new Date(Date.now() - 4800000), color: '#9b59b6' },
          { id: 'm5', content: '+1, я тоже зайду', author: 'Дима', avatar: '🧔', timestamp: new Date(Date.now() - 4200000), color: '#e74c3c' },
          { id: 'm6', content: 'Окей, тогда в 8 все в голосовой 👍', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 3600000), color: '#2ecc71' },
          { id: 'm7', content: 'Аня, ты с нами?', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 3000000), color: '#e91e63' },
          { id: 'm8', content: 'Не сегодня, занята 😔', author: 'Аня', avatar: '👧', timestamp: new Date(Date.now() - 2400000), color: '#f39c12' },
          { id: 'm9', content: 'Ладно, в следующий раз!', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 1800000), color: '#2ecc71' },
        ],
      },
      {
        id: 'ch-2',
        name: 'мемы-и-приколы',
        type: 'text',
        messages: [
          { id: 'm10', content: 'Смотрите что нашёл 😂😂😂', author: 'Влад', avatar: '👨', timestamp: new Date(Date.now() - 10800000), color: '#9b59b6' },
          { id: 'm11', content: 'ААААА я умираю 🤣🤣', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 10200000), color: '#e91e63' },
          { id: 'm12', content: 'Скинь ещё!', author: 'Дима', avatar: '🧔', timestamp: new Date(Date.now() - 9600000), color: '#e74c3c' },
        ],
      },
      {
        id: 'ch-3',
        name: 'музыка',
        type: 'text',
        messages: [
          { id: 'm13', content: 'Послушайте новый альбом, огонь 🔥🔥🔥', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 14400000), color: '#2ecc71' },
          { id: 'm14', content: 'Да, качает!', author: 'Влад', avatar: '👨', timestamp: new Date(Date.now() - 13800000), color: '#9b59b6' },
        ],
      },
      {
        id: 'ch-4',
        name: 'важное',
        type: 'text',
        messages: [
          { id: 'm15', content: '📢 Напоминаю: в субботу встречаемся в 15:00!', author: 'Дима', avatar: '🧔', timestamp: new Date(Date.now() - 86400000), color: '#e74c3c' },
        ],
      },
      {
        id: 'ch-5',
        name: 'Игровая',
        type: 'voice',
        messages: [],
      },
      {
        id: 'ch-6',
        name: 'Общение',
        type: 'voice',
        messages: [],
      },
    ],
    members: [currentUser, ...friends],
  },
  {
    id: 'server-2',
    name: 'Геймеры',
    icon: '🎮',
    color: '#57f287',
    channels: [
      {
        id: 'ch-7',
        name: 'поиск-тиммейтов',
        type: 'text',
        messages: [
          { id: 'm16', content: 'Кто в CS катку?', author: 'Дима', avatar: '🧔', timestamp: new Date(Date.now() - 1800000), color: '#e74c3c' },
          { id: 'm17', content: 'Го!', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 1200000), color: '#2ecc71' },
          { id: 'm18', content: 'Я тоже, заходите в лобби', author: 'Влад', avatar: '👨', timestamp: new Date(Date.now() - 600000), color: '#9b59b6' },
        ],
      },
      {
        id: 'ch-8',
        name: 'скриншоты',
        type: 'text',
        messages: [
          { id: 'm19', content: 'Какой клатч был! 🏆', author: 'Макс', avatar: '🧑', timestamp: new Date(Date.now() - 28800000), color: '#2ecc71' },
        ],
      },
      {
        id: 'ch-9',
        name: 'Геймерская',
        type: 'voice',
        messages: [],
      },
    ],
    members: [currentUser, friends[0], friends[2], friends[4]],
  },
  {
    id: 'server-3',
    name: 'Учёба',
    icon: '📚',
    color: '#fee75c',
    channels: [
      {
        id: 'ch-10',
        name: 'домашка',
        type: 'text',
        messages: [
          { id: 'm20', content: 'Кто сделал задание по матану?', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 43200000), color: '#e91e63' },
          { id: 'm21', content: 'Да, скину решение через час', author: 'Аня', avatar: '👧', timestamp: new Date(Date.now() - 42000000), color: '#f39c12' },
          { id: 'm22', content: 'Спасибо!! 🙏', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 41000000), color: '#e91e63' },
        ],
      },
      {
        id: 'ch-11',
        name: 'экзамены',
        type: 'text',
        messages: [
          { id: 'm23', content: 'Расписание экзаменов выложили 😱', author: 'Аня', avatar: '👧', timestamp: new Date(Date.now() - 172800000), color: '#f39c12' },
          { id: 'm24', content: 'Когда?', author: 'Катя', avatar: '👩', timestamp: new Date(Date.now() - 172000000), color: '#e91e63' },
          { id: 'm25', content: 'Через 2 недели... надо готовиться', author: 'Аня', avatar: '👧', timestamp: new Date(Date.now() - 171000000), color: '#f39c12' },
        ],
      },
    ],
    members: [currentUser, friends[1], friends[3]],
  },
];

// Helper functions
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (diff < 86400000 && now.getDate() === date.getDate()) {
    return `Сегодня в ${hours}:${minutes}`;
  }
  if (diff < 172800000) {
    return `Вчера в ${hours}:${minutes}`;
  }
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${hours}:${minutes}`;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ==================== КОМПОНЕНТЫ ====================

function ServerSidebar({ servers, activeServerId, onServerClick, onAddServer }: {
  servers: Server[];
  activeServerId: string | null;
  onServerClick: (id: string) => void;
  onAddServer: () => void;
}) {
  return (
    <div className="w-[72px] min-w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto">
      {/* Home */}
      <div className="server-icon-wrapper relative">
        <button
          className={`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200 hover:rounded-[16px] ${
            !activeServerId ? 'bg-[#5865f2] rounded-[16px]' : 'bg-[#313338] hover:bg-[#5865f2]'
          }`}
        >
          <span className="text-white font-bold text-lg">L</span>
        </button>
        <span className="discord-tooltip">LIpoMett</span>
      </div>

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1"></div>

      {/* Серверы */}
      {servers.map(server => (
        <div key={server.id} className="server-icon-wrapper relative">
          <button
            onClick={() => onServerClick(server.id)}
            className={`w-12 h-12 rounded-[24px] flex items-center justify-center text-xl transition-all duration-200 hover:rounded-[16px] ${
              activeServerId === server.id ? 'rounded-[16px]' : ''
            }`}
            style={{
              backgroundColor: activeServerId === server.id ? server.color : '#313338',
            }}
          >
            {server.icon}
          </button>
          {activeServerId === server.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] w-2 h-10 bg-white rounded-r-full"></div>
          )}
          <span className="discord-tooltip">{server.name}</span>
        </div>
      ))}

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1"></div>

      {/* Добавить сервер */}
      <div className="server-icon-wrapper relative">
        <button
          onClick={onAddServer}
          className="w-12 h-12 rounded-[24px] bg-[#313338] flex items-center justify-center text-[#23a559] text-2xl transition-all duration-200 hover:rounded-[16px] hover:bg-[#23a559] hover:text-white"
        >
          +
        </button>
        <span className="discord-tooltip">Создать сервер</span>
      </div>
    </div>
  );
}

function ChannelSidebar({ server, activeChannelId, onChannelClick }: {
  server: Server;
  activeChannelId: string;
  onChannelClick: (id: string) => void;
}) {
  const textChannels = server.channels.filter(c => c.type === 'text');
  const voiceChannels = server.channels.filter(c => c.type === 'voice');

  return (
    <div className="w-60 min-w-[240px] bg-[#2b2d31] flex flex-col">
      {/* Заголовок сервера */}
      <div className="h-12 px-4 flex items-center border-b border-[#1f2023] shadow-sm cursor-pointer hover:bg-[#35373c] transition-colors">
        <h2 className="text-white font-semibold text-[15px] truncate">{server.name}</h2>
        <svg className="ml-auto w-4 h-4 text-[#b5bac1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Каналы */}
      <div className="flex-1 overflow-y-auto pt-4 px-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center px-1 mb-1">
              <svg className="w-3 h-3 text-[#949ba4] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide">Текстовые каналы</span>
            </div>
            {textChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onChannelClick(channel.id)}
                className={`w-full flex items-center px-2 py-[6px] rounded-md mb-[2px] group transition-colors ${
                  activeChannelId === channel.id
                    ? 'bg-[#404249] text-white'
                    : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                }`}
              >
                <span className="text-[#949ba4] mr-1.5 text-lg leading-none">#</span>
                <span className="text-sm truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        )}

        {voiceChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center px-1 mb-1">
              <svg className="w-3 h-3 text-[#949ba4] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide">Голосовые каналы</span>
            </div>
            {voiceChannels.map(channel => (
              <button
                key={channel.id}
                className="w-full flex items-center px-2 py-[6px] rounded-md mb-[2px] text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors"
              >
                <svg className="w-5 h-5 text-[#949ba4] mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8H6a1 1 0 00-1 1v6a1 1 0 001 1h.5l3.5 3.5V4.5L6.5 8z" />
                </svg>
                <span className="text-sm truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Панель пользователя */}
      <div className="h-[52px] bg-[#232428] px-2 flex items-center">
        <div className="flex items-center flex-1 rounded-md px-1 py-1 hover:bg-[#35373c] cursor-pointer">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-sm">
              {currentUser.avatar}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23a559] rounded-full border-[3px] border-[#232428]"></div>
          </div>
          <div className="ml-2 flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#949ba4] truncate">В сети</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#35373c] text-[#b5bac1]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#35373c] text-[#b5bac1]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatArea({ channel, server, onSendMessage }: {
  channel: Channel;
  server: Server;
  onSendMessage: (content: string) => void;
}) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages, channel.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
      {/* Шапка канала */}
      <div className="h-12 min-h-[48px] px-4 flex items-center border-b border-[#1f2023] shadow-sm">
        <div className="flex items-center">
          <span className="text-[#949ba4] text-xl mr-2">#</span>
          <span className="text-white font-semibold">{channel.name}</span>
        </div>
        <div className="ml-4 pl-4 border-l border-[#3f4147] flex-1 hidden md:block">
          <span className="text-[#949ba4] text-sm truncate">Общайся с друзьями в #{channel.name}</span>
        </div>
        <div className="flex items-center gap-3 text-[#b5bac1]">
          <svg className="w-5 h-5 cursor-pointer hover:text-[#dbdee1] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <svg className="w-5 h-5 cursor-pointer hover:text-[#dbdee1] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Поиск"
              className="w-36 h-6 bg-[#1e1f22] rounded-md px-2 text-sm text-[#dbdee1] placeholder-[#949ba4] outline-none focus:w-56 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-6 pb-4 border-b border-[#3f4147]">
          <div className="w-[68px] h-[68px] rounded-full bg-[#41434a] flex items-center justify-center text-3xl mb-2">
            #
          </div>
          <h3 className="text-[32px] font-bold text-white mb-2">Добро пожаловать в #{channel.name}!</h3>
          <p className="text-[#949ba4]">Это начало канала #{channel.name}. Общайся с друзьями!</p>
        </div>

        {channel.messages.map((msg, index) => {
          const prevMsg = index > 0 ? channel.messages[index - 1] : null;
          const showHeader = !prevMsg ||
            prevMsg.author !== msg.author ||
            msg.timestamp.getTime() - prevMsg.timestamp.getTime() > 300000;

          return (
            <div key={msg.id} className={`group hover:bg-[#2e3035] px-2 py-0.5 rounded-md ${showHeader ? 'mt-4 pt-1' : ''}`}>
              {showHeader ? (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 mt-0.5 shrink-0"
                    style={{ backgroundColor: msg.color + '25' }}>
                    {msg.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm hover:underline cursor-pointer" style={{ color: msg.color }}>
                        {msg.author}
                      </span>
                      <span className="text-[11px] text-[#949ba4]">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-[#dbdee1] text-[15px] leading-[1.375rem] break-words">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start pl-14">
                  <span className="text-[10px] text-[#949ba4] opacity-0 group-hover:opacity-100 w-10 text-right mr-4 mt-1 shrink-0">
                    {msg.timestamp.getHours().toString().padStart(2, '0')}:{msg.timestamp.getMinutes().toString().padStart(2, '0')}
                  </span>
                  <p className="text-[#dbdee1] text-[15px] leading-[1.375rem] break-words">{msg.content}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2">
        <div className="bg-[#383a40] rounded-lg flex items-center px-4">
          <button type="button" className="text-[#b5bac1] hover:text-[#dbdee1] mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Написать в #${channel.name}`}
            className="flex-1 bg-transparent py-3 text-[#dbdee1] placeholder-[#6d6f78] outline-none text-[15px]"
          />
          <div className="flex items-center gap-3 text-[#b5bac1]">
            <button type="button" className="hover:text-[#dbdee1]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {message.trim() && (
              <button type="submit" className="hover:text-[#5865f2] text-[#5865f2]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function MembersSidebar({ members }: { members: Member[] }) {
  const onlineMembers = members.filter(m => m.status !== 'offline');
  const offlineMembers = members.filter(m => m.status === 'offline');

  const renderMember = (member: Member) => (
    <div key={member.id} className="flex items-center px-2 py-1.5 mx-2 rounded-md hover:bg-[#35373c] cursor-pointer group">
      <div className="relative mr-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          member.status === 'offline' ? 'opacity-30' : ''
        }`} style={{ backgroundColor: member.color + '25' }}>
          {member.avatar}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#2b2d31] ${
          member.status === 'online' ? 'bg-[#23a559]' :
          member.status === 'idle' ? 'bg-[#f0b232]' :
          member.status === 'dnd' ? 'bg-[#f23f43]' :
          'bg-[#80848e]'
        }`}></div>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center">
          <span className={`text-sm truncate ${
            member.status === 'offline' ? 'text-[#949ba4]' : ''
          }`} style={{ color: member.status !== 'offline' ? member.color : undefined }}>
            {member.name}
          </span>
          {member.id === currentUser.id && (
            <span className="ml-1.5 px-1 py-0 text-[10px] text-[#949ba4]">ты</span>
          )}
        </div>
        {member.activity && member.status !== 'offline' && (
          <span className="text-[11px] text-[#949ba4] truncate">{member.activity}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-60 min-w-[240px] bg-[#2b2d31] overflow-y-auto hidden xl:block">
      <div className="pt-6 px-2">
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide px-2 mb-1">
              В сети — {onlineMembers.length}
            </h3>
            {onlineMembers.map(renderMember)}
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide px-2 mb-1">
              Не в сети — {offlineMembers.length}
            </h3>
            {offlineMembers.map(renderMember)}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateServerModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, icon: string) => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🔥');
  const icons = ['🔥', '🎮', '🎵', '📚', '💻', '🎨', '🏆', '🚀', '⚡', '🌈', '💎', '🎯', '🌍', '🎪', '🍕'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), icon);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#313338] rounded-lg w-[440px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-[22px] font-bold text-white text-center mb-2">Создай свой сервер</h2>
          <p className="text-[#b5bac1] text-center text-sm mb-6">
            Твой сервер — это место, где ты и твои друзья можете общаться.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">
                Иконка сервера
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      icon === i ? 'bg-[#5865f2] ring-2 ring-[#5865f2] ring-offset-2 ring-offset-[#313338]' : 'bg-[#1e1f22] hover:bg-[#35373c]'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">
                Название сервера
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мой крутой сервер"
                className="w-full bg-[#1e1f22] text-[#dbdee1] rounded-md px-3 py-2.5 outline-none border border-[#1e1f22] focus:border-[#5865f2] transition-colors text-sm"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#dbdee1] hover:underline text-sm font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-2 bg-[#5865f2] text-white rounded-md text-sm font-medium hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================

export default function App() {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [activeServerId, setActiveServerId] = useState<string | null>('server-1');
  const [activeChannelIds, setActiveChannelIds] = useState<Record<string, string>>({
    'server-1': 'ch-1',
    'server-2': 'ch-7',
    'server-3': 'ch-10',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeServer = servers.find(s => s.id === activeServerId) || null;
  const activeChannelId = activeServerId ? activeChannelIds[activeServerId] : null;
  const activeChannel = activeServer?.channels.find(c => c.id === activeChannelId) || null;

  const handleServerClick = (id: string) => {
    setActiveServerId(id);
  };

  const handleChannelClick = (channelId: string) => {
    if (activeServerId) {
      setActiveChannelIds(prev => ({ ...prev, [activeServerId]: channelId }));
    }
  };

  const handleSendMessage = useCallback((content: string) => {
    if (!activeServerId || !activeChannelId) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      author: currentUser.name,
      avatar: currentUser.avatar,
      timestamp: new Date(),
      color: currentUser.color,
    };

    setServers(prev => prev.map(server => {
      if (server.id !== activeServerId) return server;
      return {
        ...server,
        channels: server.channels.map(channel => {
          if (channel.id !== activeChannelId) return channel;
          return {
            ...channel,
            messages: [...channel.messages, newMessage],
          };
        }),
      };
    }));
  }, [activeServerId, activeChannelId]);

  const handleCreateServer = (name: string, icon: string) => {
    const colors = ['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245', '#f47b67', '#e78284'];
    const serverId = 'server-' + generateId();
    const newServer: Server = {
      id: serverId,
      name,
      icon,
      color: colors[Math.floor(Math.random() * colors.length)],
      channels: [
        {
          id: 'ch-' + generateId(),
          name: 'общий',
          type: 'text',
          messages: [
            {
              id: 'm-' + generateId(),
              content: `Сервер "${name}" создан! Добавляй друзей и общайся! 🎉`,
              author: 'Система',
              avatar: '⚙️',
              timestamp: new Date(),
              color: '#5865f2',
            },
          ],
        },
        {
          id: 'ch-' + generateId(),
          name: 'Голосовой',
          type: 'voice',
          messages: [],
        },
      ],
      members: [currentUser, ...friends.slice(0, 3)],
    };

    setServers(prev => [...prev, newServer]);
    setActiveChannelIds(prev => ({ ...prev, [serverId]: newServer.channels[0].id }));
    setActiveServerId(serverId);
    setShowCreateModal(false);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#313338]">
      {/* Серверы */}
      <ServerSidebar
        servers={servers}
        activeServerId={activeServerId}
        onServerClick={handleServerClick}
        onAddServer={() => setShowCreateModal(true)}
      />

      {/* Каналы */}
      {activeServer && (
        <ChannelSidebar
          server={activeServer}
          activeChannelId={activeChannelId || ''}
          onChannelClick={handleChannelClick}
        />
      )}

      {/* Чат */}
      {activeChannel ? (
        <ChatArea
          channel={activeChannel}
          server={activeServer!}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#313338]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold text-white mb-2">LIpoMett</h2>
            <p className="text-[#949ba4]">Выбери сервер и канал, чтобы начать общение с друзьями</p>
          </div>
        </div>
      )}

      {/* Участники */}
      {activeServer && (
        <MembersSidebar members={activeServer.members} />
      )}

      {/* Модалка создания сервера */}
      {showCreateModal && (
        <CreateServerModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateServer}
        />
      )}
    </div>
  );
}
