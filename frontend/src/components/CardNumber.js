import React from "react";
import { Paper, Typography } from "@material-ui/core";

export default function CardNumber(props) {
    var { label, value } = props;

    return (
        <Paper className="flex flex-col justify-center align-center px-4 py-2">
            <div className="-mb-2">
                <Typography variant="overline" align="center" display="block">
                    {label}
                </Typography>
            </div>
            <Typography variant="h5" align="center">
                {value}
            </Typography>
        </Paper>
    );
}