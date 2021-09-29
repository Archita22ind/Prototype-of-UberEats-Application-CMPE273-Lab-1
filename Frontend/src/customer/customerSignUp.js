import { useState, useEffect } from "react";
import { Button, Row, Col, Form, Container, Alert } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Background from "../images/restaurantSignUp.jpeg";
import countryList from "react-select-country-list";
import { Link } from "react-router-dom";
import { setSessionCookie } from "../common/session";
import { useHistory } from "react-router-dom";

const CustomerSignUp = (props) => {
  let countryArray = ["..."];
  countryArray.push(...countryList().getLabels());

  const options = countryArray.map((item) => {
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  const [customerDetails, setCustomerDetails] = useState({});
  const history = useHistory();

  const onChangeHandler = (event) => {
    event.preventDefault();

    setCustomerDetails((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://10.0.0.8:8080/customerSignUpInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...customerDetails,
        }),
      });

      const data = await response.json();
      setSessionCookie(
        JSON.stringify({
          primaryID: data.customerId,
          restaurantFlag: false,
        })
      );
      history.push("/restaurantSearch");

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      style={{
        backgroundColor: "lightgrey",
      }}
    >
      <Row className="m-3" style={{ backgroundColor: "grey" }}>
        <h1>Uber Eats for Customers</h1>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <Image src={Background} height="75%" width="92%" />
        </Col>
        <Col xs={12} md={6}>
          <Form onSubmit={onSubmitHandler}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  required
                  name="firstName"
                  placeholder="Enter first name"
                  onChange={onChangeHandler}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  required
                  name="lastName"
                  placeholder="Enter last name"
                  onChange={onChangeHandler}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name="emailId"
                  type="email"
                  placeholder="Enter email"
                  onChange={onChangeHandler}
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Valid format : user@xxxx.com
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={onChangeHandler}
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Password must be 8-20 characters long and not contain
                  spaces/special characters
                </Form.Text>
              </Form.Group>
            </Row>

            <Row className="mb-4">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control required name="city" onChange={onChangeHandler} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control name="state" onChange={onChangeHandler} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control name="zipCode" onChange={onChangeHandler} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  required
                  name="country"
                  as="select"
                  onChange={onChangeHandler}
                  custome
                >
                  ...
                  {options}
                </Form.Control>
              </Form.Group>
              <Form.Group
                as={Col}
                className="mb-2"
                controlId="formGridContactNumber"
              >
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  required
                  name="contactNumber"
                  placeholder="+1 ()"
                  onChange={onChangeHandler}
                />
              </Form.Group>
            </Row>
            {/* <Link to="/restaurantSearch"> */}
            <Button variant="dark" type="submit">
              Sign Up
            </Button>
            {/* </Link> */}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerSignUp;
