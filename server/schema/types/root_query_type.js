const graphql = require('graphql');
const axios = require('axios');
const API_CONFIG = require('../../../client/config/api-config.js');
const { API_KEY } = API_CONFIG;

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = graphql;

const MovieType = require('./movie_type');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    findMovie: {
      type: MovieType,
      args: { movieId: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { movieId }, req) {
        return axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
          .then(({ data }) => data);
      }
    },
    searchMovies: {
      type: new GraphQLList(MovieType),
      args: {
        movieTitle: { type: new GraphQLNonNull(GraphQLString) },
        page: { type: GraphQLInt }
      },
      resolve(parentValue, { movieTitle, page }, req) {
        return axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${movieTitle}&page=${page}&include_adult=false`)
          .then(({ data: { results } }) => results);
      }
    },
    popularMovies: {
      type: new GraphQLList(MovieType),
      args: { page: { type: GraphQLInt } },
      resolve(parentValue, { page }, req) {
        return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)
          .then(({ data: { results } }) => results);
      }
    }
  })
});

module.exports = RootQueryType;
