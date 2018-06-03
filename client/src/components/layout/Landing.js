import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { loginGUser } from "../../actions/authActions";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/wall");
    }
  }
  onClickGoogle() {
    this.props.loginGUser();
  }
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Message Wall</h1>
                <p className="lead"> Browse, add, comment on posts</p>
                <p className="lead">Sign in with...</p>
                <hr />
                <div className="btn-toolbar-lg">
                  <Link
                    to=""
                    className="btn"
                    onClick={this.onClickGoogle.bind(this)}
                  >
                    <img
                      className="btn-social"
                      src={require("../../img/facebook.png")}
                      alt="facebook"
                    />
                  </Link>
                  <Link to="/twitter" className="btn">
                    <img
                      className="btn-social"
                      src={require("../../img/twitter.png")}
                      alt="twitter"
                    />
                  </Link>
                  <Link to="/google" className="btn">
                    <img
                      className="btn-social"
                      src={require("../../img/google-plus.png")}
                      alt="google-plus"
                    />
                  </Link>
                  {/* <Link to="/login" className="btn btn-lg btn-light">
                    Login
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Landing.propTypes = {
  loginGUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateProps = state => ({
  auth: state.auth
});
export default connect(mapStateProps, { loginGUser })(Landing);
