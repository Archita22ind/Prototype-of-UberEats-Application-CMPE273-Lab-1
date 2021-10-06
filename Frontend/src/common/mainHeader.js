import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import * as Icon from "react-bootstrap-icons";
import CustomerNavbar from "../customer/customerNavbar.js";
import RestaurantNavbar from "../restaurant/restaurantNavbar.js";

import { Link } from "react-router-dom";
import useCartCheckoutModal from "./useCartCheckoutModal";
import RestaurantSearch from "../customer/restaurantSearch";
import RestaurantDetails from "../restaurant/restaurantDetails";
import { useHistory } from "react-router-dom";
import Favorites from "../customer/favorites.js";
import Checkout from "../customer/checkout.js";
import ProfileInfo from "../customer/profileInfo.js";
import Orders from "../customer/orders.js";
import { getSessionCookie } from "../common/session";
import RestaurantOrders from "../restaurant/restaurantOrders";

const MainHeader = (props) => {
  let locationName = "San Jose";
  let showTabs = props.tab;
  const [modalShow, setModalShow] = useState(false);
  const [typeaheadOutput, setTypeaheadOutput] = useState([]);
  const [valueSelected, setValueSelected] = useState([{}]);
  const [foodFilter, setFoodFilter] = useState({});
  const [restaurantList, setRestaurantList] = useState([]);

  const session = getSessionCookie();

  let onHide = () => setModalShow(false);

  // Used custom hook
  const { cartModal, getCartDetails } = useCartCheckoutModal(modalShow, onHide);

  const history = useHistory();

  const inputChangeHandler = (input, event) => {
    event.preventDefault();

    optionDislayHandler(input);
  };

  const onChangeHandler = (selected) => {
    setValueSelected(selected);
    if (selected[0].isRestaurant) {
      window.sessionStorage.setItem("restaurantId", selected[0].id);
      history.push("/restaurantDetails");
    } else {
      if (!showTabs) history.push("/restaurantSearch");
    }
  };

  const optionDislayHandler = async (typeaheadInput) => {
    try {
      const response = await fetch("http://10.0.0.8:8080/getTypeaheadList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: typeaheadInput,
        }),
      });

      let data = await response.json();

      setTypeaheadOutput(() => {
        return data;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderPages = (tab) => {
    if (tab === "restaurantDetails") return <RestaurantDetails />;
    else if (tab === "restaurantSearch")
      return (
        <RestaurantSearch
          foodFilter={foodFilter}
          setFoodFilter={setFoodFilter}
          restaurantList={restaurantList}
          setRestaurantList={setRestaurantList}
          typeaheadValue={valueSelected}
        />
      );
    else if (tab === "favorites")
      return (
        <Favorites
          restaurantList={restaurantList}
          setRestaurantList={setRestaurantList}
        />
      );
    else if (tab === "checkout") return <Checkout />;
    else if (tab === "profile") return <ProfileInfo />;
    else if (tab === "orders") return <Orders />;
    else if (tab === "restaurantOrders") return <RestaurantOrders />;
  };

  return (
    <>
      <Container fluid className="my-3">
        <Row>
          <Col xs={3} md={1}>
            {session.restaurantFlag ? <RestaurantNavbar /> : <CustomerNavbar />}
          </Col>
          <Col className="mt-3" xs={4} md={2}>
            {session.restaurantFlag ? (
              <Link
                to="/restaurantDetails"
                style={{ textDecoration: "none", color: "black" }}
              >
                {" "}
                <h3>Uber Eats</h3>{" "}
              </Link>
            ) : (
              <Link
                to="/restaurantSearch"
                style={{ textDecoration: "none", color: "black" }}
              >
                {" "}
                <h3>Uber Eats</h3>{" "}
              </Link>
            )}
          </Col>
          {session.restaurantFlag ? (
            <Col />
          ) : (
            <>
              <Col className="mt-3" xs={4} md={2}>
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  defaultValue={1}
                  // value={value} onChange={handleChange}
                >
                  <ToggleButton
                    variant="outline-dark"
                    id="tbg-radio-1"
                    value={1}
                  >
                    <font size="2"> Delivery</font>
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-dark"
                    id="tbg-radio-2"
                    value={2}
                  >
                    <font size="2"> Pickup</font>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Col>
              <Col className="mt-3" xs={4} md={2}>
                <Button variant="outline-dark">
                  <Icon.GeoAltFill /> <font size="2"> {locationName}</font>
                </Button>
              </Col>
              <Col className="mt-3" xs={12} md={3}>
                <Typeahead
                  id="id123"
                  labelKey={(option) => `${option.name}`}
                  // labelKey="label"
                  maxResults={8}
                  paginate={false}
                  placeholder="What are you craving for?"
                  onChange={onChangeHandler}
                  onInputChange={inputChangeHandler}
                  options={typeaheadOutput}
                  selected={valueSelected.name}
                />
              </Col>
              <Col className="mt-3" xs={4} md={2}>
                <Button
                  variant="dark"
                  onClick={() => {
                    getCartDetails();
                    setModalShow(true);
                  }}
                >
                  <Icon.CartPlus />
                  <font size="2"> Cart</font>
                </Button>

                {cartModal()}
              </Col>
            </>
          )}
        </Row>
      </Container>
      {renderPages(showTabs)}
    </>
  );
};

export default MainHeader;
