import React, { Component } from "react";
import date from "date-fns";

class App extends Component {
  state = { messages: [], username: "Guest" };
  componentDidMount() {
    this.ws = new WebSocket("ws://159.89.121.193:8080");

    console.log(this.ws);

    this.ws.onmessage = event => {
      console.log(event);

      let data = JSON.parse(event.data);

      let messages = [...this.state.messages, data];

      this.setState({ messages });
    };
  }
  render() {
    return (
      <div className="App">
        <h1>our cool socket app</h1>

        <label>username</label>
        <input
          value={this.state.username}
          onChange={e => this.setState({ username: e.target.value })}
        />

        <label>message</label>
        <input
          onChange={event => {
            let data = {
              type: "message",
              username: this.state.username,
              text: event.target.value,
              time: +new Date(),
            };

            this.ws.send(JSON.stringify(data));
          }}
        />
        <hr />

        {this.state.messages.map(msg => {
          return (
            <div key={msg.time}>
              <span>
                {msg.username}: <b>{msg.text}</b>
              </span>
              <div>{date.distanceInWords(new Date(msg.time), new Date())}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
