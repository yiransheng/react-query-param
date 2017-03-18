import React from "react";
import { connect } from "react-redux";
import { getUser, getFilteredMessages } from "./ducks";

const Message = connect((state, ownProps) => {
  const fromUser = getUser(state, { userId: ownProps.fromUser });
  return {
    fromUser
  };
})(({ id, title, fromUser }) => {
  return (
    <li key={id}>
      <h3>{title}</h3>
      <div><span>From: </span><span>{fromUser.name}</span></div>
    </li>
  );
});

const Messages = connect(state => {
  return { messages: getFilteredMessages(state) };
})(({ messages }) => {
  return (
    <ul>
      {messages.map(msg => <Message {...msg} key={msg.id} />)}
    </ul>
  );
});

Messages.Message = Message;

export default Messages;
