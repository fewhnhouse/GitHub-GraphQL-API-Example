import gql from 'graphql-tag';
import {graphql, ApolloProvider} from 'react-apollo';
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  WebView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {Divider} from 'react-native-elements';

import IssueCard from './IssueCard';

import _ from 'lodash';

GetRepositoryIssuesQuery = gql `
  query GetRepositoryIssues($states: [IssueState!], $name: String!, $login: String!, $before: String) {
    repositoryOwner(login: $login) {
      repository(name: $name) {
        issues(last: 25, states: $states, before: $before) {
          edges {
            node {
              id
              title
              comments {totalCount}
              createdAt              
            }
          	cursor
          }
          pageInfo {
            hasPreviousPage
          }
        }
      }
    }
  }
`;

const withIssues = graphql(GetRepositoryIssuesQuery, {
  options: ({id, navigation}) => ({
    variables: {
      states: ['OPEN'],
      login: navigation.state.params.login,
      name: navigation.state.params.title,
      before: null
    }
  }),
  props: ({data}) => {
    if (data.loading) {
      return {
        loading: true,
        fetchNextPage: () => {}
      };
    }

    if (data.error) {
      console.log(data.error);
    }

    return {
      // We don't want our UI component to be aware of the special shape of GraphQL
      // connections, so we transform the props into a simple array directly in the
      // container. We also reverse the list since we want to start from the most
      // recent issue and scroll down
      issues: [
        ...data
          .repositoryOwner
          .repository
          .issues
          .edges
          .map(({node}) => {
            return {id: node.id, title: node.title, comments: node.comments.totalCount, createdAt: node.createdAt}
          })
      ].reverse(),
      hasNextPage: data.repositoryOwner.repository.issues.pageInfo.hasPreviousPage
    };
  }
});

class Repository extends React.Component {
  static navigationOptions = ({navigation}) => ({title: navigation.state.params.title});

  constructor(props) {
    super();
    this.state = {
      dataSource: props.issues
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) {
      return;
    }
    this.setState({dataSource: newProps.issues})
  }
  _keyExtractor = (item, index) => (item.id);

  _renderItem = ({item}) => (<IssueCard
    item={item}
    goToIssue={this.props.navigation.state.params.goToIssue}/>);

  render() {
    const {issues, goToIssue, hasNextPage, fetchNextPage} = this.props;
    return this.state.dataSource
      ? (
        <View style={{
          flex: 1
        }}>
          {(this.state.dataSource.length !== 0
            ? (<FlatList
              keyExtractor={this._keyExtractor}
              data={this.state.dataSource}
              renderItem={this._renderItem}/>)
            : (
              <Text>This repository has no issues.</Text>
            ))}
        </View>
      )
      : (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} size={'small'}/>
          <Text>Loading issues...</Text>
        </View>
      );
  }
}

const IssuesWithData = withIssues(Repository);

export default IssuesWithData;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  loading: {
    paddingTop: 10,
    alignItems: 'center'
  }
});
