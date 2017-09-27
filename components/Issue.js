import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
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
  FlatList,
  ActivityIndicator
} from 'react-native';

import _ from 'lodash';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

const IssueCommentsQuery = gql `
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
        after: null
      }
    });
  },
  props: ({data, ownProps}) => {
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
      comments: data
        .node
        .comments
        .edges
        .map(({node}) => node),
      hasNextPage: data.node.comments.pageInfo.hasNextPage
    };
  }
});

class Issue extends React.Component {
  static navigationOptions = ({navigation}) => ({title: navigation.state.params.title});
  constructor(props) {
    super();

    this.state = {
      dataSource: props.comments
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) {
      return;
    }

    this.setState({dataSource: newProps.comments})
  }
  _keyExtractor = (item, index) => (item.id);

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
    const {comments, hasNextPage, loading, fetchNextPage} = this.props;

    return this.state.dataSource
      ? (
        <View style={{
          flex: 1
        }}>
          <FlatList
            keyExtractor={this._keyExtractor}
            data={this.state.dataSource}
            renderItem={this._renderItem}/>
        </View>
      )
      : (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} size={'small'}/>
          <Text>Loading issue...</Text>
        </View>
      );
  }
}

export default withIssueComments(Issue);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    paddingTop: 10,
    alignItems: 'center'
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
  },
  commentBody: {
    fontSize: 18,
    padding: 10,
    paddingBottom: 30
  }
});
