import { useEffect, useRef } from "react";
import { Avatar, Tooltip } from "@mui/material";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col overflow-y-auto max-h-96 p-3 space-y-2">
      {messages &&
        messages.map((m, i) => {
          const isSender = m.sender._id === user._id;

          return (
            <div
              className={`flex items-end ${
                isSender ? "justify-end" : "justify-start"
              }`}
              key={m._id}
            >
              {!isSender &&
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                    <Avatar
                      alt={m.sender.name}
                      src={m.sender.pic}
                      sx={{
                        width: 30,
                        height: 30,
                        marginRight: "6px",
                        marginTop: "auto",
                      }}
                    />
                  </Tooltip>
                )}

              <span
                className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm break-words ${
                  isSender
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
                }`}
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ScrollableChat;
