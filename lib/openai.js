const axios = require("axios");

async function generate(text) {
  try {
    const { data } = await axios(
      `https://onlinegpt.org/wp-json/mwai-ui/v1/chats/submit`,
      {
        method: "post",
        data: {
          botId: "default",
          newMessage: text,
          stream: false,
        },
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err.response.data);
    return err.response.data.message;
  }
}

module.exports = { generate };
