import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Messages = () => {
  const { user } = useAuth();
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

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle navigation from other pages (e.g., from Profile "Send Message" button)
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
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await API.get('/messages/conversations');
      setConversations(response.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setToast({ message: 'Failed to load conversations', type: 'error' });
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    setLoadingMessages(true);
    try {
      const response = await API.get(`/messages/conversation/${partnerId}`);
      setMessages(response.data);
      // Refresh conversations to update unread counts
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

      setMessages([...messages, response.data]);
      setNewMessage('');
      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setToast({ message: 'Failed to send message', type: 'error' });
    } finally {
      setSending(false);
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

          {/* Header */}
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

            {/* Search */}
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

          {/* Conversations List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConversations ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div className="spinner"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px'
              }}>
                <div style={{ fontSize: '56px', marginBottom: '15px' }}>💬</div>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--dark)',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  No messages yet
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray)',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
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
                    {/* Avatar */}
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
                    </div>

                    {/* Info */}
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
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--gray)',
                          flexShrink: 0
                        }}>
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
            // Empty State
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
                Or find new matches to message.
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
                  flexShrink: 0
                }}>
                  {selectedPartner.name?.charAt(0).toUpperCase()}
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
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--gray)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {selectedPartner.university || 'Student'}
                  </p>
                </div>
                <Link
                  to={`/book/${selectedPartner._id}`}
                  style={{ textDecoration: 'none' }}
                >
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

              {/* Messages */}
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
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    margin: 'auto'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--gray)'
                    }}>
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
                  onChange={(e) => setNewMessage(e.target.value)}
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