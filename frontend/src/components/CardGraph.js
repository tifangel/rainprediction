import React from "react";
import GraphTest from "./GraphTest";
import { Grid, Paper, Typography } from "@material-ui/core";

export default function CardGraph() {
    return (
        <Paper className="p-6">
            <Grid container spacing={5}>

                <Grid item xs={12}>
                    <Typography variant="overline" display="block">
                        Tekanan Udara (kPa)
                    </Typography>
                    <GraphTest />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="overline" display="block">
                        Kelembaban (%)
                    </Typography>
                    <GraphTest />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="overline" display="block">
                        Suhu (°C)
                    </Typography>
                    <GraphTest />
                </Grid>
            </Grid>
        </Paper>
    )
}