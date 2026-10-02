import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Messages = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUser, setTypingUser] = useState(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle navigation from other pages (e.g., from Matches "Send Message" button)
  useEffect(() => {
    const state = location.state;
    if (state && state.partner) {
      setSelectedPartner(state.partner);
      fetchMessages(state.partner._id);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Real-time: Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    console.log('🎧 Setting up socket listeners');

    const handleReceiveMessage = (message) => {
      console.log('📩 Received message:', message);
      console.log('📩 Current selectedPartner:', selectedPartner?._id);

      // Always add message if it belongs to current conversation
      const messagePartnerId =
        message.sender._id === user?._id
          ? message.receiver._id
          : message.sender._id;

      // Use functional update to avoid stale closure
      setMessages((prevMessages) => {
        // Check if message already exists (avoid duplicates)
        const exists = prevMessages.some((m) => m._id === message._id);
        if (exists) {
          console.log('⚠️ Message already exists, skipping');
          return prevMessages;
        }

        // If the message is for the currently selected partner, add it
        if (selectedPartner && messagePartnerId === selectedPartner._id) {
          console.log('✅ Adding message to current conversation');
          return [...prevMessages, message];
        }

        console.log('⚠️ Message is for a different conversation');
        return prevMessages;
      });

      // Always refresh conversations list
      fetchConversations();
    };

    const handleUserTyping = ({ senderName }) => {
      setTypingUser(senderName);
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      console.log('🎧 Removing socket listeners');
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [socket, selectedPartner?._id]);

  const fetchConversations = async () => {
    try {
      const response = await API.get('/messages/conversations');
      setConversations(response.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    setLoadingMessages(true);
    try {
      const response = await API.get(`/messages/conversation/${partnerId}`);
      setMessages(response.data);
      fetchConversations();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setToast({ message: 'Failed to load messages', type: 'error' });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedPartner(conv.partner);
    setTypingUser(null);
    fetchMessages(conv.partner._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedPartner) return;

    setSending(true);

    try {
      const response = await API.post('/messages', {
        receiverId: selectedPartner._id,
        content: newMessage.trim()
      });

      // Add to messages list (using functional update)
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === response.data._id);
        if (exists) return prev;
        return [...prev, response.data];
      });

      setNewMessage('');

      // Send via socket for real-time delivery to receiver
      if (socket) {
        socket.emit('send_message', {
          receiverId: selectedPartner._id,
          message: response.data
        });

        // Stop typing indicator
        socket.emit('stop_typing', {
          receiverId: selectedPartner._id
        });
      }

      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setToast({ message: 'Failed to send message', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && selectedPartner) {
      if (e.target.value.length > 0) {
        socket.emit('typing', {
          receiverId: selectedPartner._id,
          senderName: user?.name
        });
      } else {
        socket.emit('stop_typing', {
          receiverId: selectedPartner._id
        });
      }
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const formatMessageTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPartnerOnline = selectedPartner && onlineUsers.includes(selectedPartner._id);

  return (
    <DashboardLayout>
      <div style={{
        height: 'calc(100vh - 68px)',
        display: 'flex',
        background: 'var(--background)',
        overflow: 'hidden'
      }}>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* ============================================
            LEFT: CONVERSATIONS LIST
            ============================================ */}
        <div style={{
          width: '340px',
          minWidth: '340px',
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>

          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--border)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--dark)',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💬 Messages
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--light-gray)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--gray)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  color: 'var(--dark)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConversations ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div className="spinner"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '56px', marginBottom: '15px' }}>💬</div>
                <p style={{ fontSize: '15px', color: 'var(--dark)', fontWeight: '600', marginBottom: '8px' }}>
                  No messages yet
                </p>
                <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Start a conversation with someone from your matches!
                </p>
                <Link to="/matches" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    Find Matches →
                  </button>
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedPartner?._id === conv.partner._id;
                const partnerOnline = onlineUsers.includes(conv.partner._id);

                return (
                  <div
                    key={conv.partner._id}
                    onClick={() => handleSelectConversation(conv)}
                    style={{
                      padding: '15px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #3B82F6' : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '18px',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      {conv.partner.name?.charAt(0).toUpperCase()}
                      {partnerOnline && (
                        <span style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '13px',
                          height: '13px',
                          borderRadius: '50%',
                          background: '#10B981',
                          border: '2px solid var(--white)'
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                        gap: '10px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--dark)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.partner.name}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--gray)', flexShrink: 0 }}>
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--gray)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.lastMessageSender === 'me' && (
                            <span style={{ color: '#3B82F6', fontWeight: '600' }}>You: </span>
                          )}
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            background: '#3B82F6',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 7px',
                            borderRadius: '10px',
                            flexShrink: 0,
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================
            RIGHT: CHAT WINDOW
            ============================================ */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--background)',
          overflow: 'hidden'
        }}>
          {!selectedPartner ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>💬</div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: 'var(--dark)',
                marginBottom: '10px'
              }}>
                Select a conversation
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--gray)',
                maxWidth: '400px',
                lineHeight: '1.6'
              }}>
                Choose a conversation from the list on the left to start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '15px 25px',
                background: 'var(--white)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flexShrink: 0
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '18px',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  {selectedPartner.name?.charAt(0).toUpperCase()}
                  {isPartnerOnline && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#10B981',
                      border: '2px solid var(--white)'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'var(--dark)',
                    marginBottom: '2px'
                  }}>
                    {selectedPartner.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--gray)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {selectedPartner.university || 'Student'}
                    </p>
                    {isPartnerOnline && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#10B981',
                        fontWeight: '600'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#10B981'
                        }} />
                        Online
                      </span>
                    )}
                  </div>
                </div>
                <Link to={`/book/${selectedPartner._id}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'var(--primary-light)',
                    color: '#3B82F6',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    📅 Book Session
                  </button>
                </Link>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', margin: 'auto' }}>
                    <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
                      No messages yet. Say hi! 👋
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: 'flex',
                          justifyContent: isMine ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-end',
                          gap: '8px'
                        }}
                      >
                        {!isMine && (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '13px',
                            flexShrink: 0
                          }}>
                            {msg.sender.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ maxWidth: '65%' }}>
                          <div style={{
                            padding: '10px 16px',
                            borderRadius: isMine
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            background: isMine
                              ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                              : 'var(--white)',
                            color: isMine ? '#fff' : 'var(--dark)',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            wordWrap: 'break-word',
                            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                            border: isMine ? 'none' : '1px solid var(--border)'
                          }}>
                            {msg.content}
                          </div>
                          <p style={{
                            fontSize: '10px',
                            color: 'var(--gray)',
                            marginTop: '4px',
                            textAlign: isMine ? 'right' : 'left',
                            paddingLeft: isMine ? '0' : '4px',
                            paddingRight: isMine ? '4px' : '0'
                          }}>
                            {formatMessageTime(msg.createdAt)}
                            {isMine && msg.read && ' • Read'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {typingUser && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: 'var(--white)',
                    borderRadius: '16px 16px 16px 4px',
                    width: 'fit-content',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                    color: 'var(--gray)',
                    fontStyle: 'italic'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3B82F6',
                      animation: 'pulse 1s infinite'
                    }} />
                    {typingUser} is typing...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '15px 25px',
                  background: 'var(--white)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: '10px',
                  flexShrink: 0
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    border: '1px solid var(--border)',
                    borderRadius: '30px',
                    fontSize: '14px',
                    background: 'var(--light-gray)',
                    color: 'var(--dark)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: sending || !newMessage.trim()
                      ? 'var(--gray)'
                      : 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: sending || !newMessage.trim()
                      ? 'none'
                      : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    flexShrink: 0
                  }}
                >
                  {sending ? '⏳' : '➤'}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Messages;