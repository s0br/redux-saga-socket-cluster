import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class SocketHandler extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textInput: '',
      subscribedChannels: {},
    };
    this.emit = () => {
      const { textInput } = this.state;
      const eventName = prompt('Write an event name');
      if (eventName) {
        this.props.emit(eventName, textInput);
        this.setState({
          textInput: '',
        });
      }
    };

    this.subscribe = () => {
      const { textInput } = this.state;
      if (textInput) {
        this.props.subscribe(textInput);
      }
    };

    this.unsubscribe = (channel) => {
      this.props.unsubscribe(channel);
    };

    this.publish = (channel) => {
      const { textInput } = this.state;
      if (textInput) {
        this.props.publish(channel, textInput);
      }
    };
  }

  componentWillReceiveProps({ socket }) {
    const { channels } = socket;
    const subscribedChannels = {};
    Object.keys(channels).forEach((key) => {
      const channel = channels[key];
      if (channel.state === 'subscribed') {
        subscribedChannels[key] = channel;
      }
    });
    console.log('SUBSCRIBED CHANNELDS', subscribedChannels);
    this.setState({ subscribedChannels });
  }

  render() {
    const {
      label,
      socket,
      connect,
      disconnect,
    } = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">
            { label } <small>{ socket.state }</small>
          </h4>
        </div>
        {
          Object.keys(socket.receivedMessages).map(event => (
            <table key={event} className="table table-striped">
              <thead>
                <tr>
                  <th>
                    { event }
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  socket.receivedMessages[event].map((message, idx) => (
                    <tr key={`${event}-${idx}`}>
                      <td>{ JSON.stringify(message) }</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ))
        }
        {
          Object.keys(socket.channels).length > 0 ?
            <div className="panel-body">
              DATA FROM CHANNELS
            </div>
          : null
        }
        {
          Object.keys(socket.channels).map(channelName => (
            <table key={channelName} className="table table-striped table-bordered">
              <tbody>
                <tr key={channelName}>
                  <th rowSpan={Math.max(socket.channels[channelName].receivedMessages.length, 1) + 1}>
                    { channelName } <small>{ socket.channels[channelName].state }</small>
                  </th>
                  {
                    socket.channels[channelName].receivedMessages.length === 0 ?
                      <td className="info">
                        No messages yet
                      </td>
                    :
                    <th>
                      Messages
                    </th>
                  }
                </tr>
                {
                  socket.channels[channelName].receivedMessages.length > 0 ?
                    socket.channels[channelName].receivedMessages.map(message => (
                      <tr key={message}>
                        <td>
                          { JSON.stringify(message) }
                        </td>
                      </tr>
                    ))
                    :
                    null
                }
              </tbody>
            </table>
          ))
        }
        <div className="panel-footer">
          <div className="input-group">
            <input type="text" className="form-control" value={this.state.textInput} onChange={event => this.setState({ textInput: event.target.value })}/>
            <div className="input-group-btn">
              <button className="btn btn-primary" onClick={this.emit}>
                Emit
              </button>
              <DropdownButton
                bsStyle="primary"
                title="Publish to channel"
                id="publish-channel-dropdown"
                disabled={Object.keys(this.state.subscribedChannels).length === 0 ? true : null}
              >
                {
                  Object.keys(this.state.subscribedChannels).map(channel => (
                    <MenuItem key={channel} onClick={() => this.publish(channel)}>
                      { channel }
                    </MenuItem>
                  ))
                }
              </DropdownButton>
              <button className="btn btn-default" onClick={this.subscribe}>
                Subscribe
              </button>
              <DropdownButton
                bsStyle="default"
                title="Unsubscribe"
                id="unsubscribe-channel-dropdown"
                disabled={Object.keys(this.state.subscribedChannels).length === 0 ? true : null}
              >
                {
                  Object.keys(this.state.subscribedChannels).map(channel => (
                    <MenuItem key={channel} onClick={() => this.unsubscribe(channel)}>
                      { channel }
                    </MenuItem>
                  ))
                }
              </DropdownButton>
              <ToggleConnectionButton
                state={socket.state}
                connect={connect}
                disconnect={disconnect}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SocketHandler.propTypes = {
  label: PropTypes.string.isRequired,
  socket: PropTypes.shape({
    receivedMessages: PropTypes.object.isRequired,
    sentMessages: PropTypes.array.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
  emit: PropTypes.func.isRequired,
};

function ToggleConnectionButton({ state, disconnect, connect }) {
  switch (state) {
    case 'open':
      return (
        <button className="btn btn-danger" onClick={disconnect}>
          Disconnect
        </button>
      );
    case 'connecting':
      return (
        <button className="btn btn-danger" disabled>
          Connecting...
        </button>
      );
    default:
      return (
        <button className="btn btn-success" onClick={connect}>
          Reconnect
        </button>
      );
  }
}

ToggleConnectionButton.propTypes = {
  state: PropTypes.oneOf(['open', 'connecting', 'closed', 'error']).isRequired,
  disconnect: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired,
};

export default SocketHandler;
