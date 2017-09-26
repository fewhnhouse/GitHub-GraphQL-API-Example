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
  FlatList
} from 'react-native';

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
          .map(({node}) => node)
      ].reverse(),
      hasNextPage: data.repositoryOwner.repository.issues.pageInfo.hasPreviousPage
    };
  }
});

class Repository extends React.Component {
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

  _renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
      this
        .props
        .navigation
        .state
        .params
        .goToIssue(item.id, item.title)
    }}>
      <Text style={styles.welcome} key={item.id}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  render() {
    const {issues, goToIssue, hasNextPage, fetchNextPage} = this.props;
    console.log("nav: ", this.props.navigation);
    return (
      <ApolloProvider client={this.props.navigation.state.params.client}>
      <View style={{
        flex: 1
      }}>
        <FlatList data={this.state.dataSource} renderItem={this._renderItem}/>
      </View>
      </ApolloProvider>
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
