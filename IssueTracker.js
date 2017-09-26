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

import Home from './Home';

export default class IssueTracker extends Component {
  
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
      return (
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
        )
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
  
