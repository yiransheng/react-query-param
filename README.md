# `react-query-param`

A `react-router@v4` inspired url query parameter library.

## Example

See: `examples/WithHistory` for a from-scratch integration with `redux` and `history`. 

More examples with `react-router` coming soon.

## Overview

This library exports two components:

* `UrlQuery`
* `QueryParam`

You should include `UrlQuery` somewhere high up in the component tree, like `Provider` from `react-redux`. For example:

```javascript
ReactDOM.render((
  <Provider store={store}>
    <UrlQuery onChange={upToYou}>
      <App />
    </UrlQuery>
  </Provider>
), document.getElementById('root'));

```

Of course, this is not a requirement, you can use `UrlQuery` for the part of component tree where query parameter actually matters.

`QueryParam` takes two props: `name` and `values`, and renders nothing but its children - and passes its props up to `UrlQuery` through the use of `React` context. `values` can be either a string of array of parameter values. For exampe:

```javascript
<UrlQuery onChange={query => console.log(query)}>
  <QueryParam name="q" values="search term" />
  <QueryParam name="page" values={1} />
</UrlQuery>
```

The above code by itself does not actually modify page url. It only logs changes whenever the component mounts or updates. Mounting the above for the first time will log:

```
{
  q : "search term",
  page : "1"
}
```

`QueryParam` can be nested:

```
<QueryParam name="topKey" values={["cannot", "be", "overridden"]}>
  <div>
     <App />
     <SideBar />
     <QueryParam name="topKey" values={["by", "children"]} />
  </div>
</QueryParam>
```

This will fire `onChange` at root `UrlQuery` with the following:

```
{
  topKey : ["cannot", "be", "overridden"]
}
```

## Recommended Use Case

This library is designed to work with `redux`, it is recommended to `connect` your components, and pass data for query parameter to `QueryParam` from any parts of your store. Unlike integrating `react-router` with `redux` (through `react-router-redux`), no restriction is placed on how you organize your store. `react-router-redux` forces a root store `router` and `url ` is stored on `location.pathname` as a string. `react-url-param` encourages you to use any data type suitable for the you app, and maps your data to query parameters inside `React` components. 

Consider the following store layout:

```javascript
// store shape:
const state = {
  currentSearch : {
    query : "",
    limit : 50
  },
  currentProject : "slug-1",
  entities : {
    projects : {
      "slug-1" : {
        createdAt,
        name,
        permissions
      },
      "slug-2" : {
        createdAt,
        name,
        permissions
      }
    },
    items : {
      "1" : {
        id : 1,
        project : "slug-1",
        data
      },
      "2" : {
        id : 2,
        project : "slug-2",
        data
      }
    }
  }
}
```

 In your components, declaratively specify query parameters.

```
@connect((state) => {
  return {
    project : state.currentProject,
    searchQuery : state.currentSearch.query,
    searchLimit : state.currentSearch.limit,
    items : filterByProjectAndSearch(
      state.currentProject,
      state.currentSearch.query,
      state.currentSearch.limit,
      state.entities.items
    )
  };
})
class App extends Component {
  render() {
    const {searchQuery, project, items} = this.props;
    return (
      <div>
        <input value={searchQuery} onChange={..} />
        <Item items={items} />
        <QueryParam name="q" values={searchQuery} />
        <QueryParam name="project" values={project} />
      </div>
    );    
  }
}
```

`<QueryParam />` will trigger side effects, unlike normal react components. However, it's is up to you to implement `onChange` at `<UrlQuery />` root level, so side effects are centralized and maintained in on place. One example for `onChange`:

```javascript
import {stringify} from 'query-string';

const handleQueryChange = (query) => {
  // the query payload is compatible with `query-string` libaray
  window.location.search = stringify(query);
}

// -- some component
render() {
  <UrlQuery onChange={handleQueryChange}>
    {/* app components */}
  </UrlQuery>
}

```

With this change, any time you data in redux store changes, url is automatically updated to reflect it - making url bar just another render target of `React`. However, this only takes care of one way data sync, if the user updates the url via back button (or upon initial page load), we do not have a mechanism to notify `redux` `store` about the changes. Unfortunately this part is very app specific, and a managed solution can be difficult to achieve. To do this mannualy (using `history` library):

```javascript
import createBrowserHistory from 'history/createBrowserHistory';
import {parse} from 'query-string';

const history = createBrowserHistory();

const locationToActions = location => {
  const query = parse(location.search);
  const actions = [];
  if (query.project) {
    actions.push({ 
      type : UPDATE_CURRENT_PROJECT,
      payload : query.project
    });
  }
  if (query.q) {
    actions.push({
      type : UPDATE_CURRENT_SEARCH,
      payload : query.q
    })
  }
  // ... this function can be composed by a lot of smaller funcitons
  return actions;
}

const unlisten = history.listen(location => {
  locationToActions(location).forEach(store.dispatch);
});

const initialState =
      locationToActions(history.location).reduce(rootReducer, preloadedState);

const store = createStore(rootReducer, initialState);
```

