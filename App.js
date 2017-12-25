import React, {Component} from 'react';

import _ from 'lodash';

import {View, Text, Platform, StyleSheet} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {login} from './auth/githubLogin';

import {ApolloClient} from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import Repository from './components/Repository';
import Issue from './components/Issue';
import NewScreen from './components/NewScreen';
import IssueTracker from './components/IssueTracker';
import Loading from './components/Loading';

import {username, password} from './auth/config';
import {StackNavigator, TabNavigator} from "react-navigation";
import {Constants} from 'expo';

let TOKEN = null;

/*
const networkInterface = createNetworkInterface({uri: 'https://api.github.com/graphql'});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}; // Create the header object if needed.
      }
      // Send the login token in the Authorization header
      req.options.headers.authorization = `Bearer ${TOKEN}`;
      next();
    }
  }
]);
*/

const httpLink = createHttpLink({ uri: 'https://api.github.com/graphql' });

const middlewareLink = setContext(() => ({
  headers: { 
    authorization: `Bearer ${TOKEN}`
  }
}));

// use with apollo-client
const link = middlewareLink.concat(httpLink);

const client = new ApolloClient({link: link, cache: new InMemoryCache()});

export default class App extends Component {
  state = {
    login: false
  };

  componentDidMount() {
    if (username === 'xxx') {
      throw new Error('Please create a config.js your username and password.');
    }
    login(username, password, (req, res) => {
      if (req) {
        console.log("req:", req);
      } else {
        console.log("res:", res);
      }
    }).then((token) => {
      TOKEN = token;
      this.setState({login: true});
    });
  }

  render() {
    return this.state.login
      ? (
        <ApolloProvider client={client}>
          <TabNav/>
        </ApolloProvider>
      )
      : <Loading/>;
  }
}

const StackNav = StackNavigator({
  Home: {
    screen: IssueTracker
  },
  Repository: {
    screen: (Repository),
    navigationOptions: ({navigation}) => {
      title : `test1${navigation.state.params.title}`;
    }
  },
  Issue: {
    screen: (Issue),
    navigationOptions: ({navigation}) => {
      title : `test1${navigation.state.params.title}`;
    }
  }
});

const TabNav = TabNavigator({
  Home: {
    screen: StackNav
  },
  Notifications: {
    screen: NewScreen
  }
}, {
  tabBarPosition: Platform.OS === "ios"
    ? 'bottom'
    : 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
    style: {
      paddingTop: Platform.OS === 'ios'
        ? 0
        : Constants.statusBarHeight
    }
  }
});

function ApolloWrapper(CMP) {
  return class extends Component {
    render() {
      return (
        <ApolloProvider client={client}>
          <CMP {...this.props}/>
        </ApolloProvider>
      );
    }
  };
}

const styles = StyleSheet.create({
  app: {
    paddingTop: Platform.OS === 'ios'
      ? 0
      : Constants.statusBarHeight
  }
})