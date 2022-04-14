import React from "react";
import CardNumber from "./CardNumber";

export default function Numbers() {
    return (
        <div className="flex gap-4 mb-12">
            <CardNumber />
            <CardNumber />
            <CardNumber />
            <CardNumber />
        </div>
    );
}