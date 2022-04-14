import React from "react";
import Card from "@material-tailwind/react/Card";
import CardRow from "@material-tailwind/react/CardRow";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardStatus from "@material-tailwind/react/CardStatus";
import CardStatusFooter from "@material-tailwind/react/CardStatusFooter";
import Icon from "@material-tailwind/react/Icon";
import GraphTest from "./GraphTest";
import { CardBody } from "@material-tailwind/react";

export default function CardGraph() {
    return (
        <Card>
            <CardRow>
                <CardHeader color="lightBlue" size="sm" iconOnly>
                    <Icon name="air" size="4xl" color="white" />
                    {/* <h4>Tekanan Udara</h4> */}
                </CardHeader>
                <CardBody>
                    <GraphTest />
                </CardBody>
                <CardStatus title="Tekanan Udara (kPa)" />
            </CardRow>

            <CardRow>
                <CardHeader color="lightBlue" size="sm" iconOnly>
                    <Icon name="water_drop" size="4xl" color="white" />
                </CardHeader>
                <CardBody>
                    <GraphTest />
                </CardBody>
                <CardStatus title="Kelembaban (%)" />
            </CardRow>

            <CardRow>
                <CardHeader color="lightBlue" size="sm" iconOnly>
                    <Icon name="thermostat" size="4xl" color="white" />
                </CardHeader>
                <CardBody>
                    <GraphTest />
                </CardBody>
                <CardStatus title="Suhu (°C)" />
            </CardRow>
        </Card>
    );
}