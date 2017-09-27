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
  TouchableOpacity,
  WebView,
  FlatList,
  ActivityIndicator
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
          owner {
            id
            login
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
  props: ({ data }) => {
    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }
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
    console.log("Received props: ",this.state.dataSource);
  }

  componentWillUpdate() {
    console.log(this.state.dataSource);
  }

  _renderItem = ({item}) => (
      <TouchableOpacity onPress={() => this.props.goToRepo(item.id, item.name, item.owner.login)}>
      <View elevation={5} style={styles.card}>
      <Text style={styles.cardTitle} key={item.id}>
        {item.name}
      </Text>
      <Text style={styles.cardBody}>
        cardBody
      </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    console.log(this.state.dataSource);
    return this.state.dataSource
    ?
      (
      <View style={{flex: 1}}>
        <FlatList data={this.state.dataSource} renderItem={this._renderItem}/>
      </View>
    ) : (
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
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    shadowRadius: 1,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'grey',
    margin: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0

},
cardTitle: {
    textAlign: 'center'
},
cardBody: {
    borderTopWidth: 1,
    borderColor: 'grey',
    padding: 5
},
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
