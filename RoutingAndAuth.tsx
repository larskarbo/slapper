import netlifyIdentity from "netlify-identity-widget";
import React from "react";
window.netlifyIdentity = netlifyIdentity;
console.log("netlifyIdentity: ", netlifyIdentity);
// You must run this once before trying to interact with the widget
netlifyIdentity.init();

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  authenticate(callback) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      console.log("user: ", user);
      this.user = user;
      callback(user);
    });
  },
  signout(callback) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on("logout", () => {
      this.user = null;
      callback();
    });
  },
};

class Login extends React.Component {
  state = { redirectToReferrer: false };

  componentDidMount() {
    const user = netlifyIdentity.currentUser();
    console.log("user: ", user);
    this.generateHeaders().then((headers) => {
      console.log("headers: ", headers);

      fetch("/.netlify/functions/fauna", {
        headers,
      })
        .then((a) => a.json())
        .then((a) => {
          console.log("asdf", a);
        });
    });
  }

  generateHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity
        .currentUser()
        .jwt()
        .then((token) => {
          return { ...headers, Authorization: `Bearer ${token}` };
        });
    }
    return Promise.resolve(headers);
  }

  login = () => {
    netlifyAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    // let { from } = this.props.location.state || { from: { pathname: '/' } };
    // console.log('from: ', from);
    let { redirectToReferrer } = this.state;
    console.log("redirectToReferrer: ", redirectToReferrer);

    // if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        <p>You must log in to view the page at </p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}
export default Login;
