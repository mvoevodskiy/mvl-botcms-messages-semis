const {MVLoaderBase} = require('mvloader');

class mvlBotCMSMessages extends MVLoaderBase{
    static exportConfig = {
        ext: {
            configs: {
                handlers: {
                    BotHandler: {
                        botcms: {
                            middlewares: [
                                require('./mvlbotcmsmessagesmiddleware')
                            ],
                            mvlBotCMSMessages: {
                                drivers: [],
                                bridges: [],
                                users: [],
                                chats: []
                            }
                        },
                    },
                    DBHandler: {
                        models: {
                            mvlBotCMSMessage: require('./models/mvlbotcmsmessage')
                        }
                    }
                }
            },
        }
    };

    constructor (App, ...config) {
        let localDefaults = {

        };
        super(localDefaults, ...config);
        this.App = App;
    }

    async init() {
        return super.init();
    }

    async initFinish() {
        super.initFinish();
    }

}

module.exports = {mvlBotCMSMessages};