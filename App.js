import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  NavigatorIOS,
  ToastAndroid,
  PlatformOSType
} from 'react-native';

import _ from 'lodash';

import {graphql, ApolloProvider} from 'react-apollo';
import {login} from './githubLogin';

import ApolloClient, {createNetworkInterface} from 'apollo-client';
import gql from 'graphql-tag';

import Repository from './repository';
import Issue from './issue';
import Home from './Home';
import NewScreen from './NewScreen';

import {username, password} from './config';
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

class IssueReader extends Component {
  state = {
    login: false
  };
  static navigationOptions = {
    title: `Repositories: fewhnhouse`
  };

  componentDidMount() {
    if (username === 'xxx') {
      throw new Error('Please create a config.js your username and password.');
    }
    login(username, password).then((token) => {
      TOKEN = token;
      this.setState({login: true});
    });
  }
  routeForRepository(login, name) {
    return {
      title: `${login}/${name}`,
      component: Repository,
      passProps: {
        login,
        name,
        goToIssue: (id, title) => {
          this
            .refs
            .nav
            .push(this.routeForIssue(id, title));
        }
      }
    }
  }
  
  render() {
    return this.state.login
      ? (
        <ApolloProvider client={client}>
          <View style={styles.container}>
            <Home
              goToRepo={(id, name, login) => {
              return this
                .props
                .navigation
                .navigate("Repository", {
                  id: id,
                  title: name,
                  login: login,
                  goToIssue: (id, title) => {
                    return this
                      .props
                      .navigation
                      .navigate("Issue", {
                        id: id,
                        title,
                      })
                  }
                })
            }}/>
          </View>
        </ApolloProvider>
      )
      : <Text>Logging in</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

const SimpleApp = StackNavigator({
  Home: {
    screen: IssueReader
  },
  Repository: {
    screen: ApolloWrapper(Repository),
    navigationOptions: ({navigation}) => {
      title : `test1${navigation.state.params.title}`;
    }
  },
  Issue: {
    screen: ApolloWrapper(Issue),
    navigationOptions: ({navigation}) => {
      title : `test1${navigation.state.params.title}`;
    }
  }
});


const MyApp = TabNavigator({
  Home: {
    screen: SimpleApp,
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

export default MyApp
