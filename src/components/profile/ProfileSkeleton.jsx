import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Skeleton, Box } from "@mui/material";

function ProfileSkeleton() {
  return (
    <Container
      className="pt-4 pb-3 w-100"
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "15px",
        color: "#ffffff",
      }}
    >
      <Row className="mb-4 align-items-center ms-5">
        {/* Left: Avatar Skeleton */}
        <Col xs="auto ms-5 d-flex justify-content-center">
          <Skeleton
            variant="circular"
            width={155}
            height={155}
            animation="wave"
            style={{ backgroundColor: "#333" }}
          />
        </Col>
        {/* Right: Name and Stats */}
        <Col className="ms-5">
          <Skeleton
            variant="text"
            width="300px"
            height={70}
            animation="wave"
            className="mb-0"
            style={{ backgroundColor: "#333" }}
          />
          <Skeleton
            variant="text"
            width="200px"
            height={40}
            animation="wave"
            className="mb-3"
            style={{ backgroundColor: "#333" }}
          />
          <Row className="mt-3">
            <Col className="text-center">
              <Skeleton
                variant="text"
                width="100px"
                height={50}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
              <Skeleton
                variant="text"
                width="100px"
                height={20}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
            </Col>
            <Col className="text-center">
              <Skeleton
                variant="text"
                width="100px"
                height={50}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
              <Skeleton
                variant="text"
                width="100px"
                height={20}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
            </Col>
            <Col className="text-center">
              <Skeleton
                variant="text"
                width="100px"
                height={50}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
              <Skeleton
                variant="text"
                width="100px"
                height={20}
                animation="wave"
                style={{ backgroundColor: "#333" }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Buttons Skeleton */}
      <Box className="d-flex justify-content-center mt-5">
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          animation="wave"
          className="me-2"
          style={{
            borderRadius: "20px",
            backgroundColor: "#333",
          }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          animation="wave"
          style={{
            borderRadius: "20px",
            backgroundColor: "#333",
          }}
        />
      </Box>
    </Container>
  );
}

export default ProfileSkeleton;
