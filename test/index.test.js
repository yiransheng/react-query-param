import test from "tape";
import React from "react";
import { mount } from "enzyme";

import { UrlQuery, QueryParam } from "../src";

import jsdom from "jsdom";
const doc = jsdom.jsdom("<!doctype html><html><body></body></html>");
global.document = doc;
global.window = doc.defaultView;

test("mount", t => {
  t.plan(2);

  const queries = [];
  const callback = query => {
    queries.push(query);
  };

  const app = (
    <UrlQuery onChange={callback}>
      <QueryParam name="key" values={[1, 2, 3]} />
      <QueryParam name="key" values={[4, 5, 6]} />
    </UrlQuery>
  );
  mount(app);

  Promise.resolve().then(() => {
    t.equal(queries.length, 1);
    t.deepEqual(queries[0], { key: ["1", "2", "3", "4", "5", "6"] });
  });
});

test("update", t => {
  t.plan(2);

  const queries = [];
  const callback = query => {
    queries.push(query);
  };

  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        key: "a",
        value: "123",
        children: [
          { key: "b", value: [] },
          { key: "c", value: null },
          { key: "b", value: 4 },
          { key: "a", value: "456" }
        ]
      };
    }

    update() {
      return new Promise(resolve => {
        this.setState(
          {
            key: "a",
            value: "123",
            children: [{ key: "b", value: [4] }, { key: "d", value: null }]
          },
          resolve
        );
      });
    }

    render() {
      return (
        <UrlQuery onChange={callback}>
          <QueryParam name={this.state.key} values={this.state.value}>
            {this.state.children.map(({ key, value }, i) => {
              return (
                <QueryParam name={key} key={`${key}-${i}`} values={value} />
              );
            })}
          </QueryParam>
        </UrlQuery>
      );
    }
  }

  const wrapper = mount(<App />);

  Promise.resolve()
    .then(() => {
      t.deepEqual(queries[0], { a: "456", b: "4" });
      return wrapper.instance().update();
    })
    .then(() => {
      t.deepEqual(queries[1], { a: "123", b: "4" });
    });
});
