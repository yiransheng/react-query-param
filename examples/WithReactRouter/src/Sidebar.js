import React from "react";
import { connect } from "react-redux";
import { styled } from "styletron-react";

import { getMessages } from "./ducks";
import { Message } from "./Messages";

const ListContainer = styled("ul", () => ({
  width: "500px",
  borderTop: "1px solid #ccc",
  padding: 0
}));

const Messages = connect(state => {
  return { messages: getMessages(state) };
})(({ messages }) => {
  return (
    <ListContainer>
      {messages.map(msg => <Message {...msg} key={msg.id} />)}
    </ListContainer>
  );
});

export default function Sidebar() {
  return <Messages />;
}
