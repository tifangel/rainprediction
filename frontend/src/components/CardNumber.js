import React from "react";
import Card from "@material-tailwind/react/Card";
import CardRow from "@material-tailwind/react/CardRow";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardStatus from "@material-tailwind/react/CardStatus";
import CardStatusFooter from "@material-tailwind/react/CardStatusFooter";
import Icon from "@material-tailwind/react/Icon";

export default function CardNumber() {
    return (
        <div>
            <Card>
                <CardRow>
                    <CardHeader color="lightBlue" size="sm" iconOnly>
                        <Icon name="groups" size="4xl" color="white" />
                    </CardHeader>

                    <CardStatus title="Min" amount="30" />
                </CardRow>
            </Card>

            {/* <Card>
                <CardRow>
                    <CardStatus title="Max" amount="50" />
                </CardRow>
            </Card>

            <Card>
                <CardRow>
                    <CardStatus title="Avg" amount="75" />
                </CardRow>
            </Card>         */}
        </div>
    );
}