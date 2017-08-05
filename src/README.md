SocketCluster Redux Saga Integration
====================================

Create and receive messages from [SocketCluster](https://socketcluster.io) sockets via [Redux](https://redux.js.org) actions.

This project internally uses [Redux Saga](https://redux-saga.js.org) channels to send updates to Redux State.

Status
------

This project is still under development and should not be used in production environments

Example
-------

Check the example project to check how to use this library. `connect`, `disconnect`, `emit`, `subscribe` and `unsubscribe` are already exported as `actionCreators`


Contribute
----------

Fell free to make a pull request. Just check `.editorconfig` and `eslintrc.json` files.

TODOs
-----

- [ ] Write some tests!
- [ ] Test `auth` integration

License
-------

MIT
