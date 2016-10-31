import { GraphQLError } from 'graphql';

export class ApolloError extends Error {
  public message: string;
  public graphQLErrors: GraphQLError[];
  public networkError: Error;

  // An object that can be used to provide some additional information
  // about an error, e.g. specifying the type of error this is. Used
  // internally within Apollo Client.
  public extraInfo: any;

  // Constructs an instance of ApolloError given a GraphQLError
  // or a network error. Note that one of these has to be a valid
  // value or the constructed error will be meaningless.
  constructor({
    graphQLErrors,
    networkError,
    errorMessage,
    extraInfo,
  }: {
    graphQLErrors?: GraphQLError[],
    networkError?: Error,
    errorMessage?: string,
    extraInfo?: any,
  }) {
    super(errorMessage);
    this.graphQLErrors = graphQLErrors;
    this.networkError = networkError;

    // set up the stack trace
    this.stack = new Error().stack;

    if (!errorMessage) {
      this.message = ApolloError.generateErrorMessage(this.message, this.graphQLErrors, this.networkError);
    } else {
      this.message = errorMessage;
    }

    this.extraInfo = extraInfo;
  }

  // nadeesha:
  // generateErrorMessage function was converted to static.
  // why?
  // 1. needed to change the target of this from es5 to es2015 to remove es6-shim
  // 2. that made this file not have this.generateErrorMessage as a result of some babel compilation in react-native
  // 3. this made ApolloError threw anytime there was an error.

  // Sets the error message on this error according to the
  // the GraphQL and network errors that are present.
  // If the error message has already been set through the
  // constructor or otherwise, this function is a nop.
  static generateErrorMessage(msg:string, graphQLErrors:any[], networkError:any): string {
    if (typeof msg !== 'undefined' &&
       msg !== '') {
      return msg;
    }

    let message = '';
    // If we have GraphQL errors present, add that to the error message.
    if (Array.isArray(graphQLErrors) && graphQLErrors.length !== 0) {
      graphQLErrors.forEach((graphQLError) => {
        message += 'GraphQL error: ' + graphQLError.message + '\n';
      });
    }

    if (networkError) {
      message += 'Network error: ' + networkError.message + '\n';
    }

    // strip newline from the end of the message
    message = message.replace(/\n$/, '');
    return message;
  }
}
