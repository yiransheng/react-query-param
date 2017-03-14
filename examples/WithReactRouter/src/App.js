import React from "react";
import createBrowserHistory from "history/createBrowserHistory";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { UrlQuery, QueryParam } from "react-url-param";
import { isEmpty, memoize } from "lodash";
import { parse, stringify } from "query-string";
import compose from "recompose/compose";
import withState from "recompose/withState";
import withProps from "recompose/withProps";
import withHandlers from "recompose/withHandlers";

const history = createBrowserHistory();

const PEEPS = [
  { id: 0, name: "Michelle", friends: [1, 2, 3] },
  { id: 1, name: "Sean", friends: [0, 3] },
  { id: 2, name: "Kim", friends: [0, 1, 3] },
  { id: 3, name: "David", friends: [1, 2] }
];

const find = id => PEEPS.find(p => p.id == id);

const enhancer = compose(
  withState("search", "updateSearch", ""),
  withHandlers({
    onChange: props => e => props.updateSearch(e.target.value)
  })
);

const updateQuery = location => query => {
  let search = "";
  if (query && !isEmpty(query) && query.q[0]) {
    search = stringify(query);
  }
  const newLocation = {
    ...location,
    search
  };
  history.push(newLocation);
};

const toPredicate = memoize(search => {
  search = search ? search.replace(/[^\w]/g, "").toLowerCase() : "";
  if (search) {
    const regEx = new RegExp(search, "ig");
    return ({ name }) => regEx.test(name);
  } else {
    return () => true;
  }
});

const RecursiveExample = enhancer(props => (
  <Router history={history}>
    <UrlQuery onChange={updateQuery(props.location)}>
      <QueryParam name="q" values={props.search} />
      <input value={props.search} onChange={props.onChange} />
      <Person match={{ params: { id: 0 }, url: "" }} search={props.search} />
    </UrlQuery>
  </Router>
));

const Person = ({ match, search = "" }) => {
  const person = find(match.params.id);
  const test = toPredicate(search);
  if (!person || !test(person)) {
    return null;
  }

  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <ul>
        {person.friends.map(find).filter(test).map(friend => (
          <li key={friend.id}>
            <Link to={`${match.url}/${friend.id}?q=${search}`}>
              {friend.name}
            </Link>
          </li>
        ))}
      </ul>
      <Route
        path={`${match.url}/:id`}
        component={withProps(() => ({ search }))(Person)}
      />
    </div>
  );
};

export default RecursiveExample;
