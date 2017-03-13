import React from "react";
import { connect } from "react-redux";

export const Home = () => {
  return <h1>Home</h1>;
};
export const About = () => {
  return <h1>About</h1>;
};
export const NotFound = () => {
  return <h1>Not Found</h1>;
};
export const Link = props => {
  const { onClick, children: label, link } = props;
  const handleClick = e => {
    e.preventDefault();
    onClick(link);
  };
  return <li><a onClick={handleClick} href="#">{label}</a></li>;
};

export const Topic = connect((state, ownProps) => {
  const { id } = ownProps;
  return {
    id,
    topic: state.entities.topic[id]
  };
})(props => {
  const { id, topic } = props;
  return <li>{`${id}: ${topic}`}</li>;
});

export const Topics = connect(state => {
  const topics = state.entities.topic;
  const ids = Object.keys(topics);
  return {
    topics: ids
  };
})(props => {
  const { topics, onClick } = props;
  return (
    <ul>
      {topics.map(id => {
        return (
          <Link key={id} link={{ route: "topic", id }} onClick={onClick}>{id}</Link>
        );
      })}
    </ul>
  );
});
