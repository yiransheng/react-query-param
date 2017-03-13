import React, { Component } from "react";
import { connect } from "react-redux";
import { match } from "single-key";
import { navigate } from "./actions";
import { Home, About, Topics, Topic, NotFound, Link } from "./Components";

import { QueryParam } from "react-url-param";

const App = connect(
  state => {
    const { view } = state;
    return {
      view
    };
  },
  {
    navigate
  }
)(
  class extends Component {
    render() {
      const { view, navigate } = this.props;
      return (
        <div>
          <ul>
            <Link onClick={navigate} link={{ route: "home" }}>Home</Link>
            <Link onClick={navigate} link={{ route: "about" }}>About</Link>
            <Link onClick={navigate} link={{ route: "topics" }}>Topics</Link>
          </ul>

          {match(
            view,
            {
              home: () => <Home />,
              about: () => <About />,
              topics: () => <Topics onClick={navigate} />,
              topic: id => <Topic id={id} />
            },
            () => <NotFound />
          )}
          {match(
            view,
            {
              home: () => <QueryParam key="view" name="view" values="home" />,
              about: () => <QueryParam key="view" name="view" values="about" />,
              topics: () => (
                <QueryParam key="view" name="view" values="topic" />
              ),
              topic: id => (
                <QueryParam key="view" name="view" values="topic">
                  <QueryParam key="topic" name="topic" values={id} />
                </QueryParam>
              )
            },
            () => null
          )}
        </div>
      );
    }
  }
);

export default App;
