import React, { useState } from "react";
import { Container, Row, Form, Col, Modal, Button } from "react-bootstrap";

const OrderModal = (props) => {
  const [cartDetail, setCartDetail] = useState({});
  const [buttonDisabled, setbuttonDisabled] = useState(true);

  let modalHide = props.onHide;

  let quantityList = Array.from(Array(100).keys());

  const showOptions = () => {
    let options = quantityList.map((item) => {
      return (
        <option key={item} value={item}>
          {item}
        </option>
      );
    });
    return options;
  };

  const onChangeHandler = (event) => {
    event.preventDefault();

    setCartDetail((prevState) => {
      return {
        ...prevState,
        foodId: props.dishItem.foodId,
        customerId: props.customerId,
        restaurantId: props.dishItem.restaurantId,
        foodName: props.dishItem.dishName,
        quantity: event.target.value,
        dishPrice: props.dishItem.price,
      };
    });
    buttonDisplay();
  };

  const viewImageHandler = () => {
    if (props.dishItem.image) {
      return (
        <Form.Control
          name="imagePreview"
          type="image"
          src={props.dishItem.imagePreview}
        />
      );
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://10.0.0.8:8080/addOrdertoCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartDetail),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const buttonDisplay = () => {
    if (cartDetail === 0) setbuttonDisabled(true);
    else setbuttonDisabled(false);
  };

  return (
    <Modal
      show={props.dishItem.show}
      onHide={modalHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <font size="6">{props.dishItem.dishName}</font>
      </Modal.Header>

      <Modal.Body className="show-grid">
        <Container>
          <Row>{viewImageHandler()}</Row>
        </Container>
        <font size="2">
          <Row className="mb-3">{props.dishItem.description}</Row>
        </font>

        <Row className="mb-3">Price : ${props.dishItem.price}</Row>
      </Modal.Body>
      <Modal.Footer>
        <Form onSubmit={onSubmitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group required as={Col} controlId="formGridQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  name="quantity"
                  as="select"
                  defaultValue={0}
                  htmlSize={1}
                  size="sm"
                  custom
                  type="number"
                  onChange={onChangeHandler}
                >
                  {showOptions()}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Button
                type="submit"
                variant="dark"
                onClick={props.onHide}
                disabled={buttonDisabled}
              >
                Add to Order
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;