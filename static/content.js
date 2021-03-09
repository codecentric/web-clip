import ReactDOM from "react-dom";
import React from "react";

import "./content.css";
import {PageContent} from "../app/PageContent";

const root = document.createElement("div")
root.id = "webtrack";
document.body.appendChild(root);

ReactDOM.render(<PageContent />, document.querySelector("#webtrack"));
