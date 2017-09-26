import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  NavigatorIOS,
  ToastAndroid,
  TouchableHighlight,
  WebView,
  ListView,
  FlatList
} from 'react-native';

import _ from 'lodash';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

const IssueCommentsQuery = gql`
  query GetRepositoryIssues($id: ID!, $after: String) {
    node(id: $id) {
      ... on Issue {
        comments(first: 10, after: $after) {
          edges {
            node {
              id
              body
              author {
                login
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  }
`;

const withIssueComments = graphql(IssueCommentsQuery, {
  options: ({id, navigation}) => {
    // ToastAndroid.show(JSON.stringify(navigation), ToastAndroid.LONG);
    return ({
      variables: {
        id: navigation.state.params.id,
        after: null,
      }
    });
  },
  props: ({ data, ownProps }) => {
    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    return {
      comments: data.node.comments.edges.map(({ node }) => node),
      hasNextPage: data.node.comments.pageInfo.hasNextPage,
    };
  }
});

class Issue extends React.Component {
  static navigationOptions = {
    title: "Issue"
  }
  constructor(props) {
    super();

    this.state = {
      dataSource: props.comments
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) { return; }

    this.setState({
      dataSource: newProps.comments
    })
  }
  _renderItem = ({item}) => (
    <View key={item.id}>
    <Text style={styles.commentAuthor}>
      {item.author.login}
    </Text>
    <Text style={styles.commentBody}>
      {item.body}
    </Text>
  </View>
  )

  render() {
    const { comments, hasNextPage, loading, fetchNextPage } = this.props;

    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.dataSource} renderItem={this._renderItem}/>
      </View>
    );
  }
}

export default withIssueComments(Issue);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  commentBody: {
    fontSize: 18,
    padding: 10,
    paddingBottom: 30,
  }
});
