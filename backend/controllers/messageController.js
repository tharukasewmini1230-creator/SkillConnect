const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a new message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email university')
      .populate('receiver', 'name email university');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between logged-in user and another user
// @route   GET /api/messages/conversation/:userId
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    })
      .populate('sender', 'name email university')
      .populate('receiver', 'name email university')
      .sort({ createdAt: 1 });

    // Mark messages as read (messages sent to me from this user)
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations (chat list) for logged-in user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    // Get all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name email university')
      .populate('receiver', 'name email university')
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const partnerId =
        msg.sender._id.toString() === req.user.id
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();

      const partner = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner: {
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            university: partner.university
          },
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          lastMessageSender: msg.sender._id.toString() === req.user.id ? 'me' : 'them',
          unreadCount: 0
        });
      }
    });

    // Count unread messages for each conversation
    for (const [partnerId, conv] of conversationsMap) {
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        receiver: req.user.id,
        read: false
      });
      conv.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount
};