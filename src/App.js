import React from "react";
import "./styles.css";
import Container from "./components/container";
import ErrorMsg from "./components/errorMsg";

class App extends React.Component {
  state = {
    hasError: false,
    showSpinner: true
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("some error has occured");
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  hideSpinner = () => {
    this.setState({ showSpinner: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorMsg />;
    }
    return (
      <div className="App">
        <Container
          hideSpinner={this.hideSpinner}
          showSpinner={this.state.showSpinner}
        />
      </div>
    );
  }
}

export default App;
