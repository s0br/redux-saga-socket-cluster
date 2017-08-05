import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  connect as socketConnect,
  disconnect,
  emit,
  publish,
  subscribe,
  unsubscribe,
} from 'redux-saga-socket-cluster';
import SocketHandler from './SocketHandler';

const mapStateToProps = state => ({
  sockets: state.socketcluster.sockets,
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    connect: socketConnect,
    disconnect,
    emit,
    publish,
    subscribe,
    unsubscribe,
  }, dispatch);

class SocketExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hostname: 'localhost',
      port: '8000',
      socketLabel: '',
    };
    this.connect = this.connect.bind(this);
  }

  connect(event) {
    event.preventDefault();
    this.props.connect({
      hostname: this.state.hostname,
      port: this.state.port,
    }, this.state.socketLabel || undefined);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <form
              onSubmit={this.connect}
            >
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="hostname"
                  name="hostname"
                  value={this.state.hostname}
                  onChange={event => this.setState({ hostname: event.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="number"
                  placeholder="port"
                  name="port"
                  value={this.state.port}
                  onChange={event => this.setState({ port: event.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="socket label"
                  name="socketLabel"
                  value={this.state.socketLabel}
                  onChange={event => this.setState({ socketLabel: event.target.value })}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>

        {
          Object.keys(this.props.sockets).map(label => (
            <SocketHandler
              key={label}
              label={label}
              socket={this.props.sockets[label]}
              connect={() => this.props.connect(label)}
              disconnect={() => this.props.disconnect(label)}
              emit={(event, data) => this.props.emit(event, data, null, label)}
              subscribe={channel => this.props.subscribe(channel, undefined, label)}
              unsubscribe={channel => this.props.unsubscribe(channel)}
              publish={(channel, data) => this.props.publish(channel, data)}
            />
          ))
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketExample);
