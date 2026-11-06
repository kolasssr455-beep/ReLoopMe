import { useState, useRef, useEffect } from 'react';

// Types
interface Message {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: Date;
  color: string;
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
  isBot?: boolean;
}

// Initial Data
const currentUser: Member = {
  id: 'user-1',
  name: 'Ты',
  avatar: '🧑',
  status: 'online',
  role: 'Участник',
  color: '#5865f2',
};

const initialServers: Server[] = [
  {
    id: 'server-1',
    name: 'Общий чат',
    icon: '💬',
    color: '#5865f2',
    channels: [
      {
        id: 'ch-1',
        name: 'общий',
        type: 'text',
        messages: [
          { id: 'm1', content: 'Привет всем! 👋', author: 'Алексей', avatar: '👨', timestamp: new Date(Date.now() - 3600000), color: '#e74c3c' },
          { id: 'm2', content: 'Привет! Как дела?', author: 'Мария', avatar: '👩', timestamp: new Date(Date.now() - 3000000), color: '#e91e63' },
          { id: 'm3', content: 'Всё отлично, работаю над новым проектом', author: 'Алексей', avatar: '👨', timestamp: new Date(Date.now() - 2400000), color: '#e74c3c' },
          { id: 'm4', content: 'Круто! Расскажи подробнее', author: 'Дмитрий', avatar: '🧔', timestamp: new Date(Date.now() - 1800000), color: '#2ecc71' },
          { id: 'm5', content: 'Делаю Discord-клон 😄', author: 'Алексей', avatar: '👨', timestamp: new Date(Date.now() - 1200000), color: '#e74c3c' },
        ],
      },
      {
        id: 'ch-2',
        name: 'мемы',
        type: 'text',
        messages: [
          { id: 'm6', content: 'Кто-нибудь видел новый мем? 😂', author: 'Олег', avatar: '🤓', timestamp: new Date(Date.now() - 7200000), color: '#f39c12' },
          { id: 'm7', content: 'Скинь сюда!', author: 'Мария', avatar: '👩', timestamp: new Date(Date.now() - 6800000), color: '#e91e63' },
        ],
      },
      {
        id: 'ch-3',
        name: 'музыка',
        type: 'text',
        messages: [
          { id: 'm8', content: 'Послушайте новый трек!', author: 'Дмитрий', avatar: '🧔', timestamp: new Date(Date.now() - 5400000), color: '#2ecc71' },
        ],
      },
      {
        id: 'ch-4',
        name: 'Голосовой',
        type: 'voice',
        messages: [],
      },
    ],
    members: [
      { id: 'u1', name: 'Алексей', avatar: '👨', status: 'online', role: 'Админ', color: '#e74c3c' },
      { id: 'u2', name: 'Мария', avatar: '👩', status: 'online', role: 'Модератор', color: '#e91e63' },
      { id: 'u3', name: 'Дмитрий', avatar: '🧔', status: 'idle', role: 'Участник', color: '#2ecc71' },
      { id: 'u4', name: 'Олег', avatar: '🤓', status: 'dnd', role: 'Участник', color: '#f39c12' },
      { id: 'u5', name: 'Бот', avatar: '🤖', status: 'online', role: 'Бот', color: '#5865f2', isBot: true },
      { id: 'u6', name: 'Анна', avatar: '👧', status: 'offline', role: 'Участник', color: '#9b59b6' },
    ],
  },
  {
    id: 'server-2',
    name: 'Геймеры',
    icon: '🎮',
    color: '#57f287',
    channels: [
      {
        id: 'ch-5',
        name: 'lfg',
        type: 'text',
        messages: [
          { id: 'm9', content: 'Кто в доту? 🎮', author: 'Игорь', avatar: '🎯', timestamp: new Date(Date.now() - 900000), color: '#57f287' },
          { id: 'm10', content: 'Я в деле!', author: 'Сергей', avatar: '🕹️', timestamp: new Date(Date.now() - 600000), color: '#00bcd4' },
          { id: 'm11', content: '+1, заходите в голосовой', author: 'Игорь', avatar: '🎯', timestamp: new Date(Date.now() - 300000), color: '#57f287' },
        ],
      },
      {
        id: 'ch-6',
        name: 'скриншоты',
        type: 'text',
        messages: [
          { id: 'm12', content: 'Смотрите какой закат в игре! 🌅', author: 'Сергей', avatar: '🕹️', timestamp: new Date(Date.now() - 10800000), color: '#00bcd4' },
        ],
      },
      {
        id: 'ch-7',
        name: 'Игровая',
        type: 'voice',
        messages: [],
      },
    ],
    members: [
      { id: 'u7', name: 'Игорь', avatar: '🎯', status: 'online', role: 'Админ', color: '#57f287' },
      { id: 'u8', name: 'Сергей', avatar: '🕹️', status: 'online', role: 'Участник', color: '#00bcd4' },
      { id: 'u9', name: 'Виктор', avatar: '🎲', status: 'idle', role: 'Участник', color: '#ff9800' },
      { id: 'u10', name: 'Настя', avatar: '🎀', status: 'offline', role: 'Участник', color: '#ff69b4' },
    ],
  },
  {
    id: 'server-3',
    name: 'Код и разработка',
    icon: '💻',
    color: '#fee75c',
    channels: [
      {
        id: 'ch-8',
        name: 'javascript',
        type: 'text',
        messages: [
          { id: 'm13', content: 'Кто-нибудь работал с React 19?', author: 'Павел', avatar: '👨‍💻', timestamp: new Date(Date.now() - 14400000), color: '#fee75c' },
          { id: 'm14', content: 'Да, там много нового! Server Components стали лучше', author: 'Елена', avatar: '👩‍💻', timestamp: new Date(Date.now() - 14000000), color: '#eb459e' },
        ],
      },
      {
        id: 'ch-9',
        name: 'python',
        type: 'text',
        messages: [
          { id: 'm15', content: 'Python 3.13 вышел! 🐍', author: 'Елена', avatar: '👩‍💻', timestamp: new Date(Date.now() - 28800000), color: '#eb459e' },
        ],
      },
      {
        id: 'ch-10',
        name: 'помощь',
        type: 'text',
        messages: [
          { id: 'm16', content: 'Помогите с TypeScript, не могу разобраться с дженериками', author: 'Новичок', avatar: '🐣', timestamp: new Date(Date.now() - 43200000), color: '#95a5a6' },
          { id: 'm17', content: 'Скинь код, разберёмся', author: 'Павел', avatar: '👨‍💻', timestamp: new Date(Date.now() - 42000000), color: '#fee75c' },
        ],
      },
    ],
    members: [
      { id: 'u11', name: 'Павел', avatar: '👨‍💻', status: 'online', role: 'Админ', color: '#fee75c' },
      { id: 'u12', name: 'Елена', avatar: '👩‍💻', status: 'online', role: 'Модератор', color: '#eb459e' },
      { id: 'u13', name: 'Новичок', avatar: '🐣', status: 'online', role: 'Участник', color: '#95a5a6' },
      { id: 'u14', name: 'CodeBot', avatar: '🤖', status: 'online', role: 'Бот', color: '#5865f2', isBot: true },
    ],
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
  return Math.random().toString(36).substr(2, 9);
}

// Components
function ServerSidebar({ servers, activeServerId, onServerClick, onAddServer }: {
  servers: Server[];
  activeServerId: string | null;
  onServerClick: (id: string) => void;
  onAddServer: () => void;
}) {
  return (
    <div className="w-[72px] min-w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto">
      {/* Home / DMs button */}
      <div className="server-icon-wrapper relative">
        <button
          className={`w-12 h-12 rounded-[24px] flex items-center justify-center text-xl transition-all duration-200 hover:rounded-[16px] ${
            !activeServerId ? 'bg-[#5865f2] rounded-[16px]' : 'bg-[#313338] hover:bg-[#5865f2]'
          }`}
        >
          <svg width="28" height="20" viewBox="0 0 28 20" fill="white">
            <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0292 1.4184C10.8251 0.934541 10.5765 0.461742 10.3416 0C8.49019 0.321376 6.68494 0.884686 4.97508 1.68421C0.715228 7.99634 -0.43838 14.1528 0.138381 20.2204C2.18643 21.7262 4.54551 22.7999 7.04762 23.3864C7.57498 22.6768 8.04762 21.9249 8.45603 21.1378C7.69642 20.8584 6.96394 20.5101 6.26762 20.0974C6.4512 19.9638 6.63122 19.8264 6.80508 19.6856C12.0601 22.0738 17.9399 22.0738 23.1949 19.6856C23.3714 19.8289 23.5514 19.9663 23.7324 20.0974C23.0335 20.5126 22.2985 20.8634 21.5364 21.1453C21.9474 21.9324 22.4175 22.6818 22.945 23.3939C25.4497 22.81 27.8111 21.7363 29.8616 20.2279C30.5341 13.1599 28.8512 7.06358 24.5914 1.67671H23.0212Z"/>
          </svg>
        </button>
        <span className="discord-tooltip">Личные сообщения</span>
      </div>

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1"></div>

      {/* Server icons */}
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
          {/* Active indicator */}
          {activeServerId === server.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[4px] w-2 h-10 bg-white rounded-r-full"></div>
          )}
          <span className="discord-tooltip">{server.name}</span>
        </div>
      ))}

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1"></div>

      {/* Add server button */}
      <div className="server-icon-wrapper relative">
        <button
          onClick={onAddServer}
          className="w-12 h-12 rounded-[24px] bg-[#313338] flex items-center justify-center text-[#23a559] text-2xl transition-all duration-200 hover:rounded-[16px] hover:bg-[#23a559] hover:text-white"
        >
          +
        </button>
        <span className="discord-tooltip">Добавить сервер</span>
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
      {/* Server header */}
      <div className="h-12 px-4 flex items-center border-b border-[#1f2023] shadow-sm cursor-pointer hover:bg-[#35373c] transition-colors">
        <h2 className="text-white font-semibold text-[15px] truncate">{server.name}</h2>
        <svg className="ml-auto w-4 h-4 text-[#b5bac1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Channels list */}
      <div className="flex-1 overflow-y-auto pt-4 px-2">
        {/* Text channels */}
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
              <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4 text-[#b5bac1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Voice channels */}
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
      </div>

      {/* User panel */}
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
      {/* Channel header */}
      <div className="h-12 min-h-[48px] px-4 flex items-center border-b border-[#1f2023] shadow-sm">
        <div className="flex items-center">
          <span className="text-[#949ba4] text-xl mr-2">#</span>
          <span className="text-white font-semibold">{channel.name}</span>
        </div>
        <div className="ml-4 pl-4 border-l border-[#3f4147] flex-1">
          <span className="text-[#949ba4] text-sm truncate">Добро пожаловать в #{channel.name}!</span>
        </div>
        <div className="flex items-center gap-3 text-[#b5bac1]">
          <svg className="w-5 h-5 cursor-pointer hover:text-[#dbdee1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <svg className="w-5 h-5 cursor-pointer hover:text-[#dbdee1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              className="w-36 h-6 bg-[#1e1f22] rounded-md px-2 text-sm text-[#dbdee1] placeholder-[#949ba4] outline-none focus:w-56 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Welcome message */}
        <div className="mb-6 pb-4 border-b border-[#3f4147]">
          <div className="w-[68px] h-[68px] rounded-full bg-[#41434a] flex items-center justify-center text-3xl mb-2">
            #
          </div>
          <h3 className="text-[32px] font-bold text-white mb-2">Добро пожаловать в #{channel.name}!</h3>
          <p className="text-[#949ba4]">Это начало канала #{channel.name}.</p>
        </div>

        {/* Message list */}
        {channel.messages.map((msg, index) => {
          const showHeader = index === 0 || 
            channel.messages[index - 1].author !== msg.author ||
            msg.timestamp.getTime() - channel.messages[index - 1].timestamp.getTime() > 300000;

          return (
            <div key={msg.id} className={`group hover:bg-[#2e3035] px-2 py-0.5 rounded-md ${showHeader ? 'mt-4 pt-1' : ''}`}>
              {showHeader ? (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 mt-0.5 shrink-0"
                    style={{ backgroundColor: msg.color + '30' }}>
                    {msg.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm hover:underline cursor-pointer" style={{ color: msg.color }}>
                        {msg.author}
                      </span>
                      <span className="text-[11px] text-[#949ba4]">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-[#dbdee1] text-[15px] leading-[1.375rem]">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start pl-14">
                  <p className="text-[#dbdee1] text-[15px] leading-[1.375rem]">{msg.content}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2">
        <div className="bg-[#383a40] rounded-lg flex items-center px-4">
          <button type="button" className="text-[#b5bac1] hover:text-[#dbdee1] mr-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input
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
            <button type="submit" className="hover:text-[#dbdee1]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
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
        }`} style={{ backgroundColor: member.color + '30' }}>
          {member.avatar}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#2b2d31] ${
          member.status === 'online' ? 'bg-[#23a559]' :
          member.status === 'idle' ? 'bg-[#f0b232]' :
          member.status === 'dnd' ? 'bg-[#f23f43]' :
          'bg-[#80848e]'
        }`}></div>
      </div>
      <div className="flex items-center min-w-0">
        <span className={`text-sm truncate ${
          member.status === 'offline' ? 'text-[#949ba4]' : 'text-[#949ba4] group-hover:text-[#dbdee1]'
        }`} style={{ color: member.status !== 'offline' ? member.color : undefined }}>
          {member.name}
        </span>
        {member.isBot && (
          <span className="ml-1.5 px-1 py-0.5 bg-[#5865f2] text-white text-[10px] rounded font-medium">БОТ</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-60 min-w-[240px] bg-[#2b2d31] overflow-y-auto hidden xl:block">
      <div className="pt-6 px-2">
        {/* Online members */}
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide px-2 mb-1">
              В сети — {onlineMembers.length}
            </h3>
            {onlineMembers.map(renderMember)}
          </div>
        )}

        {/* Offline members */}
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
  const [icon, setIcon] = useState('🌟');
  const icons = ['🌟', '🎮', '🎵', '📚', '💻', '🎨', '🏆', '🚀', '⚡', '🌈', '🔥', '💎', '🎯', '🎪', '🌍'];

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

// Main App
export default function App() {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [activeServerId, setActiveServerId] = useState<string | null>('server-1');
  const [activeChannelIds, setActiveChannelIds] = useState<Record<string, string>>({
    'server-1': 'ch-1',
    'server-2': 'ch-5',
    'server-3': 'ch-8',
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

  const handleSendMessage = (content: string) => {
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
  };

  const handleCreateServer = (name: string, icon: string) => {
    const colors = ['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245', '#f47b67', '#e78284'];
    const newServer: Server = {
      id: 'server-' + generateId(),
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
              content: `Сервер "${name}" создан! 🎉`,
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
      members: [
        currentUser,
        { id: 'u-' + generateId(), name: 'Бот', avatar: '🤖', status: 'online', role: 'Бот', color: '#5865f2', isBot: true },
      ],
    };

    setServers(prev => [...prev, newServer]);
    setActiveChannelIds(prev => ({ ...prev, [newServer.id]: newServer.channels[0].id }));
    setActiveServerId(newServer.id);
    setShowCreateModal(false);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#313338]">
      {/* Server sidebar */}
      <ServerSidebar
        servers={servers}
        activeServerId={activeServerId}
        onServerClick={handleServerClick}
        onAddServer={() => setShowCreateModal(true)}
      />

      {/* Channel sidebar */}
      {activeServer && (
        <ChannelSidebar
          server={activeServer}
          activeChannelId={activeChannelId || ''}
          onChannelClick={handleChannelClick}
        />
      )}

      {/* Chat area */}
      {activeChannel ? (
        <ChatArea
          channel={activeChannel}
          server={activeServer!}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#313338]">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-white mb-2">Выбери канал</h2>
            <p className="text-[#949ba4]">Выбери сервер и канал, чтобы начать общение</p>
          </div>
        </div>
      )}

      {/* Members sidebar */}
      {activeServer && (
        <MembersSidebar members={activeServer.members} />
      )}

      {/* Create server modal */}
      {showCreateModal && (
        <CreateServerModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateServer}
        />
      )}
    </div>
  );
}
