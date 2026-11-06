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

// Друзья (без ботов)
const friends: Member[] = [
  { id: 'f1', name: 'Дима', avatar: '🧔', status: 'online', role: 'Админ', color: '#e74c3c' },
  { id: 'f2', name: 'Катя', avatar: '👩', status: 'online', role: 'Модератор', color: '#e91e63' },
  { id: 'f3', name: 'Макс', avatar: '🧑', status: 'idle', role: 'Друг', color: '#2ecc71' },
  { id: 'f4', name: 'Аня', avatar: '👧', status: 'dnd', role: 'Друг', color: '#f39c12' },
  { id: 'f5', name: 'Влад', avatar: '👨', status: 'online', role: 'Друг', color: '#9b59b6' },
];

// Пустые серверы без каналов
const initialServers: Server[] = [
  {
    id: 'server-1',
    name: 'LIpoMett',
    icon: '🔥',
    color: '#5865f2',
    channels: [],
    members: [currentUser, ...friends],
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

function ChannelSidebar({ server, activeChannelId, onChannelClick, onCreateChannel }: {
  server: Server;
  activeChannelId: string;
  onChannelClick: (id: string) => void;
  onCreateChannel: (name: string, type: 'text' | 'voice') => void;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
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
            <div className="flex items-center justify-between px-1 mb-1">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-[#949ba4] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide">Текстовые каналы</span>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[#949ba4] hover:text-[#dbdee1]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
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

        {server.channels.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-[#949ba4] text-sm mb-4">Пока нет каналов</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-4 py-2 bg-[#5865f2] text-white rounded-md text-sm font-medium hover:bg-[#4752c4] transition-colors"
            >
              Создать канал
            </button>
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
      </div>

      {/* Модалка создания канала */}
      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(name, type) => {
            onCreateChannel(name, type);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateChannelModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, type: 'text' | 'voice') => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'text' | 'voice'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim().toLowerCase().replace(/\s+/g, '-'), type);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#313338] rounded-lg w-[440px]" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-[22px] font-bold text-white mb-2">Создать канал</h2>
          <p className="text-[#b5bac1] text-sm mb-6">в LIpoMett</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">
                Тип канала
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 bg-[#1e1f22] rounded-md cursor-pointer hover:bg-[#2b2d31] transition-colors">
                  <input
                    type="radio"
                    value="text"
                    checked={type === 'text'}
                    onChange={(e) => setType(e.target.value as 'text' | 'voice')}
                    className="mr-3"
                  />
                  <span className="text-[#949ba4] mr-2">#</span>
                  <div>
                    <div className="text-[#dbdee1] text-sm font-medium">Текстовый</div>
                    <div className="text-[#949ba4] text-xs">Отправляй сообщения, картинки и мемы</div>
                  </div>
                </label>
                <label className="flex items-center p-3 bg-[#1e1f22] rounded-md cursor-pointer hover:bg-[#2b2d31] transition-colors">
                  <input
                    type="radio"
                    value="voice"
                    checked={type === 'voice'}
                    onChange={(e) => setType(e.target.value as 'text' | 'voice')}
                    className="mr-3"
                  />
                  <svg className="w-5 h-5 text-[#949ba4] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8H6a1 1 0 00-1 1v6a1 1 0 001 1h.5l3.5 3.5V4.5L6.5 8z" />
                  </svg>
                  <div>
                    <div className="text-[#dbdee1] text-sm font-medium">Голосовой</div>
                    <div className="text-[#949ba4] text-xs">Общайся голосом с друзьями</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#b5bac1] text-xs font-bold uppercase mb-2">
                Название канала
              </label>
              <div className="flex items-center bg-[#1e1f22] rounded-md px-3">
                {type === 'text' ? (
                  <span className="text-[#949ba4] mr-2">#</span>
                ) : (
                  <svg className="w-5 h-5 text-[#949ba4] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8H6a1 1 0 00-1 1v6a1 1 0 001 1h.5l3.5 3.5V4.5L6.5 8z" />
                  </svg>
                )}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="новый-канал"
                  className="flex-1 bg-transparent py-2.5 text-[#dbdee1] placeholder-[#6d6f78] outline-none text-sm"
                  autoFocus
                />
              </div>
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
                Создать канал
              </button>
            </div>
          </form>
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
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Написать в #${channel.name}`}
            className="flex-1 bg-transparent py-3 text-[#dbdee1] placeholder-[#6d6f78] outline-none text-[15px]"
          />
          {message.trim() && (
            <button type="submit" className="text-[#5865f2] hover:text-[#4752c4] ml-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
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
      <div className="bg-[#313338] rounded-lg w-[440px]" onClick={e => e.stopPropagation()}>
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
  const [activeChannelIds, setActiveChannelIds] = useState<Record<string, string>>({});
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

  const handleCreateChannel = (name: string, type: 'text' | 'voice') => {
    if (!activeServerId) return;

    const newChannel: Channel = {
      id: 'ch-' + generateId(),
      name,
      type,
      messages: [],
    };

    setServers(prev => prev.map(server => {
      if (server.id !== activeServerId) return server;
      return {
        ...server,
        channels: [...server.channels, newChannel],
      };
    }));

    setActiveChannelIds(prev => ({ ...prev, [activeServerId]: newChannel.id }));
  };

  const handleCreateServer = (name: string, icon: string) => {
    const colors = ['#5865f2', '#57f287', '#fee75c', '#eb459e', '#ed4245', '#f47b67', '#e78284'];
    const serverId = 'server-' + generateId();
    const newServer: Server = {
      id: serverId,
      name,
      icon,
      color: colors[Math.floor(Math.random() * colors.length)],
      channels: [],
      members: [currentUser, ...friends],
    };

    setServers(prev => [...prev, newServer]);
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
          onCreateChannel={handleCreateChannel}
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
            <p className="text-[#949ba4]">Создай канал и начни общаться с друзьями!</p>
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
