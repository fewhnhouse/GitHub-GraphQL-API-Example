import React, {Component} from 'react';

import _ from 'lodash';

import {Text, PlatformOSType, StyleSheet} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {login} from './auth/githubLogin';

import ApolloClient, {createNetworkInterface} from 'apollo-client';

import Repository from './components/Repository';
import Issue from './components/Issue';
import NewScreen from './components/NewScreen';
import IssueTracker from './components/IssueTracker';
import Loading from './components/Loading';

import {username, password} from './auth/config';
import {StackNavigator, TabNavigator} from "react-navigation";

let TOKEN = null;

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

const client = new ApolloClient({networkInterface});

export default class App extends Component {
  state = {
    login: false
  };

  componentDidMount() {
    if (username === 'xxx') {
      throw new Error('Please create a config.js your username and password.');
    }
    login(username, password, (req, res) => {
      if(req) {
        console.log("req:",req);
      } else {
        console.log("res:",res);
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
    screen: StackNav,
  },
  Notifications: {
    screen: NewScreen,
  },
}, {
  tabBarPosition: PlatformOSType === "ios"? 'bottom' : 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
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

