import { messageHandler } from "./messages";

const main = async () => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type in messageHandler) {
      const handler =
        messageHandler[message.type as keyof typeof messageHandler];
      void handler(message.payload).then((result) => {
        sendResponse(result);
      });
    }

    return true;
  });
};

main();
