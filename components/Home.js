import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
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
import {Octicons} from '@expo/vector-icons';
import RepoCard from './RepoCard';

import _ from 'lodash';

GetRepositoriesQuery = gql `
query ($number_of_repos: Int!) {
    viewer {
      name
      repositories(last: $number_of_repos) {
        nodes {
          name
          id
          description
          owner {
            id
            login
          }
          stargazers {
            totalCount
          }
          watchers {
            totalCount
          }
          forks {
            totalCount
          }
          issues {
            totalCount
          }
        }
      }
    }
  }
`;

const withRepositories = graphql(GetRepositoriesQuery, {
  options: {
    variables: {
      number_of_repos: 5
    }
  },
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
      repositories: data.viewer.repositories.nodes
    };
  }
});

class Home extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: props.repositories
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) {
      return;
    }
    this.setState({dataSource: newProps.repositories})
    console.log("Received props: ", this.state.dataSource);
  }

  componentWillUpdate() {
    console.log(this.state.dataSource);
  }

  _renderItem = ({item}) => (<RepoCard item={item} goToRepo={this.props.goToRepo}/>);

  _keyExtractor = (item, index) => (item.id);

  render() {
    console.log(this.state.dataSource);
    return this.state.dataSource
      ? (
        <View style={{
          flex: 1
        }}>
          <FlatList
            data={this.state.dataSource}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}/>
        </View>
      )
      : (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} size={'small'}/>
          <Text>Loading Repositories...</Text>
        </View>
      )
  }
}

const RepositoriesWithData = withRepositories(Home);

export default RepositoriesWithData;

const styles = StyleSheet.create({
  loading: {
    paddingTop: 10,
    alignItems: 'center'
  }
});
