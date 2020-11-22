import React from "react";
import Loader from "./loader";
import StockList from "./stockList";
import * as bulma from "reactbulma";


const stocksUrl = "ws://stocks.mnet.website/";

class Container extends React.Component {
  state = {
    stocks: {},
    market_trend: undefined, // 'up' or 'down'
    connectionError: false
  };

  componentDidMount = () => {
    this.connection = new WebSocket(stocksUrl);
    this.connection.onmessage = this.saveNewStockValues;
    this.connection.onclose = () => {
      this.setState({ connectionError: true });
    };
  };

  saveNewStockValues = (event) => {
    this.props.hideSpinner();
    let result = JSON.parse(event.data);
    let [up_values_count, down_values_count] = [0, 0];

    let current_time = Date.now();
    let new_stocks = this.state.stocks;
    result.map((stock) => {
      if (this.state.stocks[stock[0]]) {
        new_stocks[stock[0]].current_value > Number(stock[1])
          ? up_values_count++
          : down_values_count++;
        new_stocks[stock[0]].current_value = Number(stock[1]);
        new_stocks[stock[0]].history.push({
          time: current_time,
          value: Number(stock[1])
        });
      } else {
        new_stocks[stock[0]] = {
          current_value: stock[1],
          history: [{ time: Date.now(), value: Number(stock[1]) }],
          is_selected: false
        };
      }
    });
    this.setState({
      stocks: new_stocks,
      market_trend: this.checkMarketTrend(up_values_count, down_values_count)
    });
  };

  checkMarketTrend = (up_count, down_count) => {
    if (up_count === down_count) return undefined;
    return up_count > down_count ? "up" : "down";
  };

  toggleStockSelection = (stock_name) => {
    let new_stocks = this.state.stocks;
    new_stocks[stock_name].is_selected = !new_stocks[stock_name].is_selected;
    this.setState({ stocks: new_stocks });
  };

  resetData = () => {
    let new_stocks = this.state.stocks;
    Object.keys(this.state.stocks).map((stock_name, index) => {
      new_stocks[stock_name].history = [new_stocks[stock_name].history.pop()];
    });
    this.setState({ stocks: new_stocks });
  };

  areStocksLoaded = () => {
    return Object.keys(this.state.stocks).length > 0;
  };

  render() {
    return (
      <div className="container">
        <StockList
          stocks={this.state.stocks}
          toggleStockSelection={this.toggleStockSelection}
          resetData={this.resetData}
          market_trend={this.market_trend}
          areStocksLoaded={this.areStocksLoaded}
        />
        <div className={this.props.showSpinner ? "modal is-active" : "modal"}>
          <div className="modal-background">
            <div className="modal-content">
              <Loader connectionError={this.state.connectionError} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
