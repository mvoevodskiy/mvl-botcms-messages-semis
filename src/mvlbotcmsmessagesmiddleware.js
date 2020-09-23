class mvlBotCMSMessagesMiddleware {
  DB = null
  config = {
    drivers: [],
    bridges: [],
    users: [],
    chats: []
  }

  constructor (BotCMS) {
    this.BotCMS = BotCMS
    // console.log('mvlBotCMSMessagesMiddleware raise up')
  }

  successDB = (target) => {
    return next => () => {
      this.DB = target.DB
      this.Model = this.DB.models.mvlBotCMSMessage
      this.config = this.BotCMS.config.mvlBotCMSMessages
      // console.log('mvlBotCMSMessagesMiddleware DB SUCCESS')
      return next()
    }
  }

  failDB = (target) => {
    return next => error => {
      console.error('BOTCMS MESSAGES. DB FAIL. FATAL')
      console.error(error)
      process.exit(-1)
    }
  }

  handleUpdate = (target) => {
    return next => async ctx => {
      // console.log('BOTCMS MESSAGES. HANDLE UPDATE. MESSAGE: ', ctx.Message);
      if (this.srcAllowed(ctx)) {
        let messages = []

        switch (ctx.Message.event) {
          case ctx.Message.EVENTS.MESSAGE_NEW:
          case ctx.Message.EVENTS.CHAT_MESSAGE_NEW:
            messages.push({
              where: {
                messageId: ctx.Message.id,
                userId: ctx.Message.sender.id,
                chatId: ctx.Message.chat.id,
                bridge: ctx.Bridge.name,
              },
              fields: {
                replyMessageId: target.T.empty(ctx.Message.reply.id) ? '' : ctx.Message.reply.id,
                text: ctx.msg,
                attachments: JSON.stringify(ctx.Message.attachments),
                driver: ctx.Bridge.driverName,
                event: ctx.Message.event,
              },
              defaults: {}
            })
            break

          case ctx.Message.EVENTS.MESSAGE_REMOVE:
          case ctx.Message.EVENTS.CHAT_MESSAGE_REMOVE:
            if (ctx.Message.ids.length === 0) {
              ctx.Message.ids = [ctx.Message.id]
            }
            for (let id of ctx.Message.ids) {
              messages.push({
                where: {
                  messageId: id,
                  // userId: ctx.Message.sender.id,
                  chatId: ctx.Message.chat.id,
                  bridge: ctx.Bridge.name
                },
                fields: {
                  deleted: true,
                  replyMessageId: '',
                  driver: ctx.Bridge.driverName,
                  event: ctx.Message.event
                },
                defaults: {
                  text: '',
                  attachments: '{}'
                }
              })
            }
            break
        }
        for (let values of messages) {
          let msg = await this.Model.findOne({ where: values.where })
          if (msg === null) {
            msg = await this.Model.build(target.MT.merge(values.where, values.defaults))
          }
          msg.set(values.fields)
          await msg.save()
        }
      }
      // console.log('BOTCMS MESSAGES. HANDLE UPDATE ENDED');
      return next(ctx);
      // process.exit(-1);
    }
  }

  srcAllowed = (ctx) => {
    // console.log('BOTCMS MESSAGES MW. SRC ALLOWED. CONFIG', this.config, 'FROM CTX:', ctx.Message.sender.id, ctx.Message.chat.id, ctx.Bridge.name, ctx.Bridge.driverName)
    let users = this.config.users.length === 0 || this.config.users.indexOf(ctx.Message.sender.id) !== -1
    let chats = this.config.chats.length === 0 || this.config.chats.indexOf(ctx.Message.chat.id) !== -1
    let bridges = this.config.bridges.length === 0 || this.config.bridges.indexOf(ctx.Bridge.name) !== -1
    let drivers = this.config.drivers.length === 0 || this.config.drivers.indexOf(ctx.Bridge.driverName) !== -1
    return users && chats && bridges && drivers
  }

}

module.exports = mvlBotCMSMessagesMiddleware;