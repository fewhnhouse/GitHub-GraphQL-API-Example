import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  TouchableHighlight,
  WebView,
  FlatList,
} from 'react-native';

import _ from 'lodash';


GetRepositoriesQuery = gql`
query ($number_of_repos: Int!) {
    viewer {
      name
      repositories(last: $number_of_repos) {
        nodes {
          name
          id
          description
        }
      }
    }
  }
`;

const withRepositories = graphql(GetRepositoriesQuery, {
  options: {
    variables: {
      number_of_repos: 3
    }
  },
  props: ({ data }) => {
    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    console.log(data.viewer);

    return {
      // We don't want our UI component to be aware of the special shape of
      // GraphQL connections, so we transform the props into a simple array
      // directly in the container. We also reverse the list since we want to
      // start from the most recent issue and scroll down
      repositories: data.viewer.repositories.nodes
    };
  },
});

class Home extends React.Component{
  constructor(props) {
    super();
    this.state = {
      dataSource: props.repositories
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) { return; }
    this.setState({
      dataSource: newProps.repositories
    })
  }

  _renderItem = ({item}) => (
      <TouchableHighlight>
      <Text style={styles.welcome} key={item.id}>
        {item.name}
      </Text>
    </TouchableHighlight>
  );

  render() {

    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.dataSource} renderItem={this._renderItem}/>
      </View>
    );
  }
}

const RepositoriesWithData = withRepositories(Home);

export default RepositoriesWithData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
