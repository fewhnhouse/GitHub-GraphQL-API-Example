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
import {SearchBar} from 'react-native-elements';

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
      repositories: data
        .viewer
        .repositories
        .nodes
        .map((val) => {
          let obj = {
            id: val.id,
            description: val.description,
            issues: val.issues.totalCount,
            stargazers: val.stargazers.totalCount,
            watchers: val.watchers.totalCount,
            forks: val.forks.totalCount,
            name: val.name,
            owner: val.owner.login
          }
          return obj;
        })
        .reverse()
    };
  }
});

class Home extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: props.repositories,
      filteredDataSource: props.repositories
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) {
      return;
    }
    this.setState({dataSource: newProps.repositories, filteredDataSource: newProps.repositories})
  }

  _renderItem = ({item}) => (<RepoCard item={item} goToRepo={this.props.goToRepo}/>);

  _keyExtractor = (item, index) => (item.id);
  _onChangeText = (text) => {
    let filteredRepos = this
      .state
      .dataSource
      .filter((val) => {
        return val
          .name
          .toLowerCase()
          .indexOf(text.toLowerCase()) !== -1;
      })
    this.setState({filteredDataSource: filteredRepos})
  };
  render() {
    return this.state.dataSource
      ? (
        <View style={{
          flex: 1
        }}>
          <SearchBar
            ref={search => this.search = search}
            lightTheme
            onChangeText={this._onChangeText}
            placeholder='Type Here...'/>
          <FlatList
            data={this.state.filteredDataSource}
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
