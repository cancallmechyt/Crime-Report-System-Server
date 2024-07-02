const { connection } = require("../database");
const LINE_BOT_API = "https://api.line.me/v2/bot";
const axios = require("axios");

const { getAllUID } = require("../modules/members");

require("dotenv").config();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// Retrieves Rich Menu ID from environment variables.
const RICH_MENU_USER = process.env.RICH_MENU_USER;
const RICH_MENU_POLICE = process.env.RICH_MENU_POLICE;
const RICH_MENU_DEFAULT2 = process.env.RICH_MENU_DEFAULT2;

// Authorization headers for LINE OA API requests.
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
};

// Send Welcome to new user & user login
exports.SendWelcome = async (req, res) => {
  try {
    const { lineid } = req.body;
    const { fname } = req.body;

    const body = {
      to: lineid,
      messages: [
        {
          type: "text",
          text:
            "ยินดีต้อนรับ คุณ " +
            `${fname}` +
            " \nขอบคุณสำหรับการสมัครสมาชิก\nRSU POLICE ยินดีให้บริการครับ",
        },
      ],
    };

    const response = await axios.post(`${LINE_BOT_API}/message/push`, body, {
      headers,
    });

    console.log("response", response.data);
    res.json({
      message: "Send message success",
      responseData: response.data,
    });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Set Rich Menu [user]
exports.SetRichMenuUser = async (req, res) => {
  try {
    const { lineid } = req.body;
    const response = await axios.post(
      `${LINE_BOT_API}/user/${lineid}/richmenu/${RICH_MENU_USER}`,
      {},
      { headers }
    );

    console.log("response", response.data);
    res.json({
      message: "Update Richmenu Success",
      responseData: response.data,
    });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Set Rich Menu [police]
exports.SetRichMenuPolice = async (req, res) => {
  try {
    const { lineid } = req.body;
    const response = await axios.post(
      `${LINE_BOT_API}/user/${lineid}/richmenu/${RICH_MENU_POLICE}`,
      {},
      { headers }
    );

    console.log("response", response.data);
    res.json({
      message: "Update Richmenu Success",
      responseData: response.data,
    });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Set Rich Menu [default]
exports.SetRichMenuDefault = async (req, res) => {
  try {
    const { lineid } = req.body;
    const response = await axios.post(
      `${LINE_BOT_API}/user/${lineid}/richmenu/${RICH_MENU_DEFAULT2}`,
      {},
      { headers }
    );

    console.log("response", response.data);
    res.json({
      message: "Update Richmenu Success",
      responseData: response.data,
    });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Send Message to user before Edit Incidence Post
exports.Sendmessage = async (req, res) => {
  try {
    const { lineid } = req.params;
    const body = {
      to: lineid,
      messages: [
        {
          type: "text",
          text: "รายการแจ้งเหตุของคุณแก้ไขเรียบร้อย  ",
        },
      ],
    };

    const response = await axios.post(`${LINE_BOT_API}/message/push`, body, {
      headers,
    });

    console.log("response", response.data);
    res.json({
      message: "Send message success",
      responseData: response.data,
    });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Send Message Emergency to user
exports.SendFlexEmergency = async (req, res) => {
  try {
    const users = await getAllUID(req, res);
    const { pid, category, title, detail, image, location } = req.body;

    await Promise.all(
      users.map(async (user) => {
        const flexMessage = {
          to: user,
          messages: [
            {
              type: "flex",
              altText: "แจ้งเตือน" + `${category}`,
              contents: {
                type: "bubble",
                hero: {
                  type: "image",
                  url: `${image}`,
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    label: "Line",
                    uri: `https://liff.line.me/2003845535-ZB3wNLYm/post/${pid}`, // before set LineOA change lifflink new!! (lifflink./post/${pid})
                  },
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: `${title}`,
                      weight: "bold",
                      size: "xl",
                      align: "center",
                      gravity: "center",
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      spacing: "sm",
                      margin: "lg",
                      contents: [
                        {
                          type: "text",
                          text: `${detail}`,
                          size: "sm",
                          color: "#000000FF",
                          flex: 5,
                          align: "center",
                          wrap: true,
                        },
                        {
                          type: "text",
                          text: "สถานที่ : " + `${location}`,
                          size: "sm",
                          color: "#000000FF",
                          flex: 5,
                          align: "center",
                          gravity: "center",
                          wrap: true,
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  spacing: "sm",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "รายละเอียดเพิ่มเติม",
                        uri: `https://liff.line.me/2003845535-ZB3wNLYm/post/${pid}`, // before set LineOA change lifflink new!! (lifflink./post/${pid})
                      },
                      height: "sm",
                      style: "link",
                    },
                    {
                      type: "spacer",
                    },
                  ],
                },
              },
            },
          ],
        };

        await axios.post(`${LINE_BOT_API}/message/push`, flexMessage, {
          headers,
        });
      })
    );
    res.json({ message: "Send message to all users success" });
  } catch (error) {
    console.log("error", error.response);
    res.status(500).json({ message: "Error sending message" });
  }
};
