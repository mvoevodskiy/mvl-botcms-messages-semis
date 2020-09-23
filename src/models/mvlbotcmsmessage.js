module.exports = (Sequelize) => {
  return [
    {
      messageId: Sequelize.STRING,
      replyMessageId: Sequelize.STRING,
      userId: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      chatId: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      bridge: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      driver: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      edited: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      editedBy: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deletedBy: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      event: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      fwdMessageId: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      fwdUserId: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      fwdChatId: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      text: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      attachments: {
        type: Sequelize.TEXT,
        defaultValue: '{}'
      }

    },
    // Model options
    {
      indexes: [
        {
          fields: ['userId', 'chatId', 'messageId', 'bridge'],
          unique: true
        },
        {
          fields: ['fwdUserId', 'fwdChatId', 'fwdMessageId'],
        },
        {
          fields: ['edited', 'deleted']
        },
        {
          fields: ['replyMessageId']
        },
        {
          fields: ['driver']
        }
      ]
    },
    // Model associations
    {
      // belongsToMany: [
      //   {
      //     model: 'mvlBotCMSChat',
      //     as: 'Chat',
      //   }
      // ],
    }
  ]
}