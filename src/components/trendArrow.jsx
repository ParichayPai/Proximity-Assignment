import React from "react";

class TrendArrow extends React.Component {
  getArrow = () => {
    if (this.props.current_trend === "up") {
      return <span className="up-arrow">&#8679;</span>;
    } else if (this.props.current_trend === "down") {
      return <span className="down-arrow">&#8681;</span>;
    } else {
      return "-";
    }
  };

  render() {
    return (
      <span title="Market trend" className={"market-trend"}>
        {this.getArrow()}
      </span>
    );
  }
}

export default TrendArrow;
