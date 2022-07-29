import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

import "./director-view.scss";

export class DirectorView extends React.Component {
    render() {

        const { director, onBackClick } = this.props;

        if (director?.Death === undefined) return (
            <Container className="director-view">
                return <Row>
                    <Col className="left-col">Director: </Col>
                    <Col className="right-col">{director?.Name + ' (born ' + director?.Birth + ')'}</Col>
                </Row>
                <Row className="mt-3">
                    <Col className="left-col">Bio: </Col>
                    <Col className="right-col">{director?.Bio}</Col>
                </Row>
                <Row className="mt-3">
                    <Col className="left-col"></Col>
                    <Col className="right-col">
                        <Button
                            className="d-block mt-3"
                            onClick={() => { onBackClick(null); }}
                        >Back
                        </Button>
                    </Col>
                </Row>
            </Container>
        )

        if (director.Death !== undefined) return (
            <Container className="director-view">
                return <Row>
                    <Col className="left-col">Director: </Col>
                    <Col className="right-col">{director?.Name + ' (' + director?.Birth + '-' + director?.Death + ')'}</Col>
                </Row>
                <Row className="mt-3">
                    <Col className="left-col">Bio: </Col>
                    <Col className="right-col">{director?.Bio}</Col>
                </Row>
                <Row className="mt-3">
                    <Col className="left-col"></Col>
                    <Col className="right-col">
                        <Button
                            className="d-block mt-3"
                            onClick={() => { onBackClick(null); }}
                        >Back
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}